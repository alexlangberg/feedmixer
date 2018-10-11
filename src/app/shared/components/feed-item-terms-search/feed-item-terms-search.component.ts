import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { JsonfeedItem } from '../../models/jsonfeed-item.model';
import { TokenizerService } from '../../services/tokenizer/tokenizer.service';
import { Token } from '../../models/token.model';
import { SearchService } from '../../services/search/search.service';

@Component({
  selector: 'app-feed-item-terms-search',
  templateUrl: './feed-item-terms-search.component.html',
  styleUrls: ['./feed-item-terms-search.component.css']
})
export class FeedItemTermsSearchComponent implements OnInit, OnChanges {
  @Input() item: JsonfeedItem;
  @Output() search$ = new EventEmitter();
  tokens: Token[];

  constructor(
    private tokenizerService: TokenizerService,
    private search: SearchService
  ) {}

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.item) {
      this.tokens = this.tokenizerService
        .getRepeatTokens()
        .filter(token => {
          // TODO get real tokens from real title
          if (this.item.title) {
            if (this.item.title) {
              if (this.item.title.toLowerCase().includes((token.word))) {
                return true;
              }
            }

            if (this.item.summary) {
              if (this.item.summary.toLowerCase().includes((token.word))) {
                return true;
              }
            }

            return false;
          }
        });
    }
  }

  doSearch(text: string) {
    this.search.doSearch(text);
    this.search$.emit(text);
  }
}
