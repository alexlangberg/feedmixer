import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Jsonfeed } from '../../models/jsonfeed.model';
import { map } from 'rxjs/operators';
import { RedditPost } from '../../models/reddit-post.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getFeedFromUrl(rss_url: string): Observable<Jsonfeed> {
    const request = <Observable<Jsonfeed>>this.http.get(
      'http://localhost:4201/convert?url=' + rss_url
    );

    return request.pipe(map(item => {
      item._feedmixer = { url: rss_url };

      item.items = item.items.map(post => {
        // post._feedmixer.tags = TokenizerService
        //   .getTagsFromFeedItem(post, item._feedmixer.language || 'en');

        if (!post.hasOwnProperty('id') && post.guid) { post.id = post.guid; }

        post.title = post.title
          ? post.title.replace(/<(.|\n)*?>/g, '')
          : '';

        post.summary = post.summary
          ? post.summary.replace(/<(.|\n)*?>/g, '')
          : '';

        return post;
      });

      return item;
    }));
  }

  getRedditPostsFromUrl(url: string) {
    const request = this.http.get<{ data: { children: [{ data: RedditPost }]}}>(
      'https://www.reddit.com/api/info.json?url=' + url
    );

    return request.pipe(map(response => {
      const result = response.data.children.map((post: any) => {
        return new RedditPost(
          post.data.title,
          post.data.subreddit,
          post.data.permalink,
          new Date(post.data.created_utc * 1000),
          post.data.num_comments
        );
      }).sort((a, b) => b.num_comments - a.num_comments);

      return result;
    }));
  }
}
