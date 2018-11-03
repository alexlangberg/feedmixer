import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { SearchState } from '../../state/search.state';
import { Observable } from 'rxjs';
import { AdvancedSearchItem } from '../../models/advanced-search-item.model';
import { DisableAdvancedSearch, SetCurrentAdvancedSearchItem } from '../../state/search.actions';

@Component({
  selector: 'app-search-advanced-display',
  templateUrl: './search-advanced-display.component.html',
  styleUrls: ['./search-advanced-display.component.css']
})
export class SearchAdvancedDisplayComponent implements OnInit {
  @Select(SearchState.getCurrentAdvancedSearch) current$: Observable<AdvancedSearchItem>;
  @Select(SearchState.getSavedAdvancedSearches) saved$: Observable<AdvancedSearchItem[]>;
  public readonly OR_LABEL = 'Match any word';
  public readonly AND_LABEL = 'Match all words';

  constructor(private store: Store) { }

  ngOnInit() {
  }

  selectSearch(name: string) {
    this.store.dispatch(new SetCurrentAdvancedSearchItem(name));
  }

  selectNone() {
    this.store.dispatch(new DisableAdvancedSearch());
  }
}
