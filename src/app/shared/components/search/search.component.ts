import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { Select, Store } from '@ngxs/store';
import { SearchState } from '../../state/search.state';
import { FeedsState } from '../../state/feeds.state';
import { SetCurrentSearch } from '../../state/search.actions';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  @Select(SearchState.getCurrentSearch) current$: Observable<string>;
  @Select(FeedsState.getTags) tags$: Observable<Map<string, number>>;
  searchControl = new FormControl();
  filteredTags: Observable<Map<string, number>>;
  private current: string;

  constructor(private store: Store) {}

  ngOnInit() {
    this.current$.subscribe(text => {
      this.current = text;
      this.searchControl.setValue(text);
    });

    this.searchControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(500),
        startWith('')
      )
      .subscribe(text => {
        if (text !== this.current) {
          this.store.dispatch(new SetCurrentSearch(text));
        }
      });

    this.tags$.subscribe(tags => {
      this.filteredTags = this.searchControl.valueChanges
        .pipe(
          startWith(''),
          map(value => {
            return this._filter(tags, value);
          })
        );
    });
  }

  private _filter(tags: Map<string, number>, value: string): Map<string, number> {
    const filteredTags = new Map;

    tags.forEach((count, word) => {
      if (word.includes(value.trim().toLowerCase())) {
        filteredTags.set(word, count);
      }
    });

    return filteredTags;
  }

  doReset() {
    this.searchControl.setValue('');
  }
}
