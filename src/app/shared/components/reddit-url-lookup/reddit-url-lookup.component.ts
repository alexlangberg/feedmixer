import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ApiService } from '../../services/api/api.service';
import { JsonfeedItem } from '../../models/jsonfeed-item.model';
import { RedditPost } from '../../models/reddit-post.model';

@Component({
  selector: 'app-reddit-url-lookup',
  templateUrl: './reddit-url-lookup.component.html',
  styleUrls: ['./reddit-url-lookup.component.css']
})
export class RedditUrlLookupComponent implements OnInit, OnChanges {
  @Input() item: JsonfeedItem;
  posts: RedditPost[];

  constructor(private apiService: ApiService) { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.item && this.item.url) {
      this.apiService.getRedditPostsFromUrl(this.item.url).subscribe(posts => {
        this.posts = posts;
      });
    }
  }
}
