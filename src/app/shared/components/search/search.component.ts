import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { Select, Store } from '@ngxs/store';
import { SearchState } from '../../state/search.state';
import { FeedsState } from '../../state/feeds.state';
import { SetCurrentSimpleSearch } from '../../state/search.actions';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  @Select(SearchState.getCurrentSimpleSearch) current$: Observable<string>;
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
        debounceTime(250),
        startWith('')
      )
      .subscribe(text => {
        if (text !== this.current) {
          this.store.dispatch(new SetCurrentSimpleSearch(text));
        }
      });

    this.tags$.subscribe(tags => {
      this.filteredTags = this.searchControl.valueChanges
        .pipe(
          startWith(''),
          map(value => {
            return this.filter(tags, value);
          })
        );
    });
  }

  private filter(tags: Map<string, number>, value: string): Map<string, number> {
    const filteredTags = new Map;

    tags.forEach((count, word) => {
      if (word.length > 3 && word.includes(value.trim().toLowerCase())) {
        filteredTags.set(word, count);
      }
    });

    return filteredTags;
  }

  tagComparator(a: KeyValue<string, number>, b: KeyValue<string, number>) {
    return b.value - a.value;
  }

  doReset() {
    this.searchControl.setValue('');
  }
}
