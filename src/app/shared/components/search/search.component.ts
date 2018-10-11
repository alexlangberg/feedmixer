import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Token } from '../../models/token.model';
import { FormControl } from '@angular/forms';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { SearchService } from '../../services/search/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput') searchInput: ElementRef;
  private searchChanged$: Subscription;
  private tokensChanged$: Subscription;
  searchControl = new FormControl();
  tokens: Token[] = [];
  filteredTokens: Observable<Token[]>;

  constructor(private search: SearchService) { }

  ngOnInit() {
    this.searchChanged$ = this.search.searchChanged$.subscribe(text => {
      this.searchControl.setValue(text);
    });

    this.tokensChanged$ = this.search.autocompleteTokensChanged$
      .subscribe(tokens => {
        this.tokens = tokens;
        this.filteredTokens = this.searchControl.valueChanges
          .pipe(
            startWith(''),
            map(value => {
              return this._filter(value);
            })
          );
      });

    this.searchControl.valueChanges
      .pipe(
        debounceTime(500),
        startWith('')
      )
      .subscribe(text => this.search.doSearch(text));
  }

  ngOnDestroy() {
    if (this.tokensChanged$) {
      this.tokensChanged$.unsubscribe();
    }

    if (this.searchChanged$) {
      this.searchChanged$.unsubscribe();
    }
  }

  private _filter(value: string): Token[] {
    const filterValue = value.toLowerCase();

    return this.tokens.filter(token => {
      return token.word.toLowerCase().includes(filterValue);
    });
  }

  doReset() {
    this.searchControl.setValue('');
  }
}
