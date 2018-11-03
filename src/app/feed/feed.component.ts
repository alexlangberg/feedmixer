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
import { AdvancedSearchItem } from '../shared/models/advanced-search-item.model';
import { DisableAdvancedSearch, SetCurrentSimpleSearch } from '../shared/state/search.actions';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit, AfterViewInit {
  @Select(FeedsState.getActiveFeedsItems) feeds$: Observable<JsonfeedItem[]>;
  @Select(SearchState.getCurrentSimpleSearch) search$: Observable<string>;
  @Select(SearchState.getCurrentAdvancedSearch) advancedSearch$: Observable<AdvancedSearchItem>;
  @Select(UiState.get) ui$: Observable<UiStateModel>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<JsonfeedItem> = new MatTableDataSource<JsonfeedItem>();
  private items: JsonfeedItem[] = [];
  private advancedSearch = false;

  constructor(
    private media$: ObservableMedia,
    public feedService: FeedsService,
    private store: Store
  ) {}

  ngOnInit() {
    this.feeds$.subscribe(items => {
      this.items = items;

      if (! this.advancedSearch) {
        this.dataSource.data = this.items;
      }
    });

    this.search$.subscribe((text: string) => {
      if (text && text !== '') {
        this.advancedSearch = false;
        this.store.dispatch(new DisableAdvancedSearch());
      }

      this.doFilter(text);
    });

    this.advancedSearch$.subscribe((search: AdvancedSearchItem) => {
      if (search) {
        this.advancedSearch = true;
        this.store.dispatch(new SetCurrentSimpleSearch(''));
        this.dataSource.data = search.hits;
      } else {
        this.dataSource.data = this.items;
      }
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
