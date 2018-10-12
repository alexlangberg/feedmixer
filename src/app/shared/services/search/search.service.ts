import { Injectable, OnDestroy } from '@angular/core';
import { TokenizerService } from '../tokenizer/tokenizer.service';
import { Subject } from 'rxjs';
import { Token } from '../../models/token.model';

// TODO change to use pills and be able to save searches?
@Injectable({
  providedIn: 'root'
})
export class SearchService implements OnDestroy {
  autocompleteTokensChanged$: Subject<Token[]>;
  searchChanged$ = new Subject<string>();

  constructor(private tokenizer: TokenizerService) {
    this.autocompleteTokensChanged$ = this.tokenizer.tokensChanged$;
  }

  doSearch(text: string) {
    this.searchChanged$.next(text);
  }

  ngOnDestroy() {
    if (this.autocompleteTokensChanged$) {
      this.autocompleteTokensChanged$.unsubscribe();
    }

    if (this.searchChanged$) {
      this.searchChanged$.unsubscribe();
    }
  }
}
