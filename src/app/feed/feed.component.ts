import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FeedsService } from '../shared/services/feeds/feeds.service';
import { JsonfeedItem } from '../shared/models/jsonfeed-item.model';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { FeedsState } from '../shared/state/feeds.state';
import { SearchState } from '../shared/state/search.state';
import { ObservableMedia } from '@angular/flex-layout';
import { SetIsSidenavOpenStatus } from '../shared/state/ui.actions';
import { UiState, UiStateModel } from '../shared/state/ui.state';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit, AfterViewInit {
  @Select(FeedsState.getActiveFeedsItems) feeds$: Observable<JsonfeedItem[]>;
  @Select(SearchState.getCurrentSimpleSearch) search$: Observable<string>;
  @Select(UiState.get) ui$: Observable<UiStateModel>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<JsonfeedItem> = new MatTableDataSource<JsonfeedItem>();

  constructor(
    private media$: ObservableMedia,
    public feedService: FeedsService,
    private store: Store
  ) {}

  ngOnInit() {
    this.feeds$.subscribe(items => {
      this.dataSource.data = items;
    });

    this.search$.subscribe((text: string) => {
      this.doFilter(text);
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  doFilter(filterValue: string) {
    if (filterValue || filterValue === '') {
      this.dataSource.filter = filterValue.trim().toLowerCase();
      this.paginator.firstPage();
    }
  }

  setSelectedItem(item: JsonfeedItem) {
    this.feedService.setSelectedFeedItem(item);

    this.store.dispatch(new SetIsSidenavOpenStatus({
      sidenav: 'end',
      isOpen: true
    }));
  }
}
