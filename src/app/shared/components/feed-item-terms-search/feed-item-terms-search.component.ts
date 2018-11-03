import { Component, EventEmitter, Output } from '@angular/core';
import { JsonfeedItem } from '../../models/jsonfeed-item.model';
import { TokenizerService } from '../../services/tokenizer/tokenizer.service';
import { Select, Store } from '@ngxs/store';
import { FeedsState } from '../../state/feeds.state';
import { Observable } from 'rxjs';
import { AddAdvancedSearchChips, SetCurrentSimpleSearch } from '../../state/search.actions';

@Component({
  selector: 'app-feed-item-terms-search',
  templateUrl: './feed-item-terms-search.component.html',
  styleUrls: ['./feed-item-terms-search.component.css']
})
export class FeedItemTermsSearchComponent {
  @Output() search$ = new EventEmitter();
  @Select(FeedsState.getRepeatTags) tags$: Observable<Map<string, number>>;
  @Select(FeedsState.getSelectedFeedItem) item$: Observable<JsonfeedItem>;
  private tags: Map<string, number> = new Map;
  chips: { word: string, count: number }[];

  constructor(
    private tokenizerService: TokenizerService,
    private store: Store
  ) {
    this.tags$.subscribe(tags => {
      this.tags = tags;
    });

    this.item$.subscribe(item => {
      this.chips = item._feedmixer.tags.filter(tag => {
        return this.tags.has(tag) && tag.length > 3;
      }).map(tag => {
        return { word: tag, count: this.tags.get(tag) || 0 };
      }).sort((a, b) => b.count - a.count);
    });
  }

  doSearch(text: string) {
    this.store.dispatch(new SetCurrentSimpleSearch(text));
    this.search$.emit(text);
  }

  addChipsToAdvancedSearch() {
    const chips = this.chips.map(chip => chip.word);

    this.store.dispatch(new AddAdvancedSearchChips(chips));
  }
}
