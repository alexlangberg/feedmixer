import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FeedsService } from '../shared/services/feeds/feeds.service';
import { JsonfeedItem } from '../shared/models/jsonfeed-item.model';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { SearchService } from '../shared/services/search/search.service';
import { ReplaySubject, Subscription } from 'rxjs';
import { UIService } from '../shared/services/ui/ui.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<JsonfeedItem> = new MatTableDataSource<JsonfeedItem>();
  displayedColumns: string[] = ['date_published', 'title', 'options'];
  private feedMixChanged$: Subscription;
  private searchChanged$: Subscription;
  private screenSizeChanged$: Subscription;
  columnsChanged$ = new ReplaySubject<string[]>(1);

  constructor(
    public uiService: UIService,
    private feedService: FeedsService,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    this.feedMixChanged$ = this.feedService.feedMixChanged$
      .subscribe((newFeed: JsonfeedItem[]) => {
        this.dataSource.data = newFeed;
      });

    this.searchChanged$ = this.searchService.searchChanged$
      .subscribe(text => {
        this.doFilter(text);
      });

    this.screenSizeChanged$ = this.uiService.screenSizeChanged$
      .subscribe(screenSize => {
        if (screenSize === 'small') {
          this.columnsChanged$.next(['title', 'options']);
        } else {
          this.columnsChanged$.next(['date_published', 'title', 'options']);
        }
      });
  }

  ngOnDestroy() {
    if (this.feedMixChanged$) {
      this.feedMixChanged$.unsubscribe();
    }

    if (this.searchChanged$) {
      this.searchChanged$.unsubscribe();
    }

    if (this.screenSizeChanged$) {
      this.screenSizeChanged$.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
