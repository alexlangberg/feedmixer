import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { Jsonfeed } from '../../models/jsonfeed.model';
import { concatAll, map } from 'rxjs/operators';
import { RedditPost } from '../../models/reddit-post.model';
import { TokenizerService } from '../tokenizer/tokenizer.service';
import * as he from 'he';
import { RedditListing } from '../../models/reddit-listing.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
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
      'http://localhost:4201/convert?url=' + rss_url
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
        'https://www.reddit.com/api/info.json?url=' + getUrl
      );
    });

    // TODO: this should probably just concat results and return them
    const fork = forkJoin(requests)
      .pipe(
        concatAll()
      );

    return fork.pipe(map(response => {
      return response.data.children.map((post: any) => {
        return new RedditPost(
          post.data.title,
          post.data.subreddit,
          post.data.permalink,
          new Date(post.data.created_utc * 1000),
          post.data.num_comments
        );
      }).sort((a, b) => b.num_comments - a.num_comments);
    }));
  }
}
