import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FeedsService } from '../shared/services/feeds/feeds.service';
import { JsonfeedItem } from '../shared/models/jsonfeed-item.model';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { SearchService } from '../shared/services/search/search.service';
import { Observable, ReplaySubject, Subscription } from 'rxjs';
import { UIService } from '../shared/services/ui/ui.service';
import { Select } from '@ngxs/store';
import { FeedsState } from '../shared/state/feeds.state';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit, OnDestroy, AfterViewInit {
  @Select(FeedsState.getFeedsItems) feeds$: Observable<JsonfeedItem[]>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  private searchChanged$: Subscription;
  private screenSizeChanged$: Subscription;
  dataSource: MatTableDataSource<JsonfeedItem> = new MatTableDataSource<JsonfeedItem>();
  columnsChanged$ = new ReplaySubject<string[]>(1);

  constructor(
    public uiService: UIService,
    public feedService: FeedsService,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    this.feeds$.subscribe(items => {
      this.dataSource.data = items;
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
