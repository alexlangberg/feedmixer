import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { TokenizerService } from '../shared/services/tokenizer/tokenizer.service';
import { Subscription } from 'rxjs';
import { Token } from '../shared/models/token.model';

@Component({
  selector: 'app-top-terms',
  templateUrl: './top-terms.component.html',
  styleUrls: ['./top-terms.component.css']
})
export class TopTermsComponent implements OnInit, OnDestroy {
  @Output() searchChanged = new EventEmitter<string>();
  private tokensChanged$: Subscription;
  tokens: Token[] = [];

  constructor(private tokenizer: TokenizerService) { }

  ngOnInit() {
    this.tokensChanged$ = this.tokenizer.tokensChanged$.subscribe(tokens => {
      this.tokens = tokens;
    });
  }

  ngOnDestroy() {
    if (this.tokensChanged$) {
      this.tokensChanged$.unsubscribe();
    }
  }

  doSearch(searchValue: string) {
    this.searchChanged.emit(searchValue);
  }
}
