import { Component } from '@angular/core';
import { ApiService } from '../../services/api/api.service';
import { JsonfeedItem } from '../../models/jsonfeed-item.model';
import { RedditPost } from '../../models/reddit-post.model';
import { Select } from '@ngxs/store';
import { FeedsState } from '../../state/feeds.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-reddit-url-lookup',
  templateUrl: './reddit-url-lookup.component.html',
  styleUrls: ['./reddit-url-lookup.component.css']
})
export class RedditUrlLookupComponent {
  @Select(FeedsState.getSelectedFeedItem) item$: Observable<JsonfeedItem>;
  item: JsonfeedItem;
  posts: RedditPost[];
  isLoading: boolean;

  constructor(private apiService: ApiService) {
    this.item$.subscribe(item => {
      this.item = item;

      if (item.url) {
        this.isLoading = true;

        this.apiService.getRedditPostsFromUrl(item.url).subscribe(posts => {
          this.posts = posts;

          this.isLoading = false;
        });
      }
    });
  }
}
