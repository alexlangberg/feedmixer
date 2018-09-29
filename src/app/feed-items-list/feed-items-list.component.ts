import { AfterViewInit, Component, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { FeedItemsListService } from './feed-items-list.service';
import { Jsonfeed } from '../shared/models/jsonfeed.model';
import { JsonfeedItem } from '../shared/models/jsonfeed-item.model';
import { MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-feed-items-list',
  templateUrl: './feed-items-list.component.html',
  styleUrls: ['./feed-items-list.component.css']
})
export class FeedItemsListComponent implements OnInit, AfterViewInit {
  @Input() isSidenavAlwaysOpen: boolean;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<JsonfeedItem> = new MatTableDataSource<JsonfeedItem>();
  displayedColumns: string[] = ['title', 'date_published'];

  constructor(private feedItemsListService: FeedItemsListService) {}

  ngOnInit() {
    this.feedItemsListService.feedChanged.subscribe((newFeed: Jsonfeed) => {
      this.dataSource.data = newFeed.items;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  doFilter(filterValue: any) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
