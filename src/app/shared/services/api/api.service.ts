import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { Jsonfeed } from '../../models/jsonfeed.model';
import { map } from 'rxjs/operators';
import { RedditPost } from '../../models/reddit-post.model';
import { TokenizerService } from '../tokenizer/tokenizer.service';
import * as he from 'he';
import { RedditListing } from '../../models/reddit-listing.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public static readonly RSS2JSON_API_URL = 'http://localhost:4201/convert?url=';
  public static readonly REDDIT_API_URL = 'https://www.reddit.com/api/info.json?url=';

  constructor(private http: HttpClient) {}

  private static sanitizeText(text: string) {
    const result = text
      .replace(/<(.|\n)*?>/g, ''); // remove xml/html

    return he.decode(result) // decode HTML chars if necessary
      .replace(/\n\s*\n/g, '\n') // remove double newlines
      .replace(/\xA0/g, ' '); // replace nbsp with space
  }

  getFeedFromUrl(rss_url: string, language: string): Observable<Jsonfeed> {
    const request = <Observable<Jsonfeed>>this.http.get(
      ApiService.RSS2JSON_API_URL + rss_url
    );

    return request.pipe(map(item => {
      item._feedmixer = { url: rss_url };

      item.items = item.items.map(post => {
        if (!post.hasOwnProperty('id') && post.guid) { post.id = post.guid; }

        post.title = post.title
          ? ApiService.sanitizeText(post.title)
          : '';

        post.summary = post.summary
          ? ApiService.sanitizeText(post.summary)
          : '';

        post._feedmixer = {
          tags: TokenizerService.getTagsFromFeedItem(post, language)
        };

        return post;
      });

      return item;
    }));
  }

  getRedditPostsFromUrl(url: string) {
    const otherUrl = url.includes('https')
      ? url.replace('https', 'http')
      : url.replace('http', 'https');

    const requests = [url, otherUrl].map(getUrl => {
      return this.http.get<RedditListing>(
        ApiService.REDDIT_API_URL + getUrl
      );
    });

    return forkJoin(requests)
      .pipe(
        map(responses => {
          return responses
            .map(this.getPostsFromRedditListing)
            .reduce((result, item) => result.concat(item));
        })
      );
  }

  private getPostsFromRedditListing(listing: RedditListing) {
    return listing.data.children.map((post: any) => {
      return new RedditPost(
        post.data.title,
        post.data.subreddit,
        post.data.permalink,
        new Date(post.data.created_utc * 1000),
        post.data.num_comments
      );
    }).sort((a, b) => b.num_comments - a.num_comments);
  }
}
