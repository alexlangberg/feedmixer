import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FeedService } from './feed.service';
import { JsonfeedItem } from '../shared/models/jsonfeed-item.model';
import { MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit, AfterViewInit {
  @Input() isSidenavAlwaysOpen: boolean;
  @Input() refresh: void;
  @Input() autoRefresh = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<JsonfeedItem> = new MatTableDataSource<JsonfeedItem>();
  displayedColumns: string[] = ['title', 'date_published'];

  constructor(private feedService: FeedService) {}

  ngOnInit() {
    this.feedService.feedChanged.subscribe((newFeed: JsonfeedItem[]) => {
      this.dataSource.data = newFeed;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  doRefresh() {
    this.feedService.updateAllFeeds();
  }

  toggleAutoRefresher(state: boolean) {
    this.feedService.toggleAutoRefresher(state);
  }
}
