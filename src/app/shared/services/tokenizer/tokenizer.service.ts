import { Injectable, OnDestroy } from '@angular/core';
import * as stopword from 'stopword';
import { FeedsService } from '../feeds/feeds.service';
import { Subject, Subscription } from 'rxjs';
import { Jsonfeed } from '../../models/jsonfeed.model';
import { Token } from '../../models/token.model';
import { JsonfeedItem } from '../../models/jsonfeed-item.model';

@Injectable({
  providedIn: 'root'
})
export class TokenizerService implements OnDestroy {
  private feedsTokenMaps: Map<string, Map<string, number>> = new Map;
  private readonly feedChanged$: Subscription;
  private readonly feedsSettingsChanged$: Subscription;
  tokensChanged$ = new Subject<Token[]>();

  constructor(private feedService: FeedsService) {
    this.feedChanged$ = feedService.feedChanged$.subscribe(feed => {
      this.mapFeed(feed);
      this.emitNewTokens();
    });

    this.feedsSettingsChanged$ = feedService.feedsSettingsChanged$.subscribe(() => {
      this.emitNewTokens();
    });
  }

  /**
   * Remove special characters
   * Courtesy of Seagull: http://stackoverflow.com/a/26482650
   */
  static removeSpecials(text: string) {
    const whitelist = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-', ' '];
    const spacelist = ['-'];
    const lower = text.toLowerCase();
    const upper = text.toUpperCase();
    let result = '';

    for (let i = 0; i < lower.length; ++i) {
      if (lower[i] !== upper[i] || whitelist.indexOf(lower[i]) > -1) {
        result += (spacelist.indexOf(lower[i]) > -1 ? ' ' : text[i]);
      }
    }

    return result;
  }

  static tokenize(text: string, language?: string): string[] {
    const sanitized = TokenizerService.removeSpecials(text.toLowerCase());

    const words = sanitized.split(' ');

    const stopWords = stopword[language || 'en'];

    return stopword.removeStopwords(words, stopWords);
  }

  static tokenizeFeedItem(item: JsonfeedItem, language: string): string[] {
    return TokenizerService
      .tokenize(item.title || '', language)
      .concat(
        TokenizerService
          .tokenize(item.summary || '', language)
      );
  }

  getRepeatTokens() {
    return this.getAllTokens().filter(token => token.count > 1);
  }

  getAllTokens() {
    const activeFeeds = this.feedService.getActiveFeeds();
    const totalMap = new Map;

    activeFeeds.forEach(feed => {
      const map = this.feedsTokenMaps.get(feed.url);

      if (map) {
        map.forEach((count: number, token: string) => {
          totalMap.has(token)
            ? totalMap.set(token, (totalMap.get(token) || 0) + count)
            : totalMap.set(token, count);
        });
      }
    });

    const tokens = [];

    for (const item of totalMap.entries()) {
      tokens.push(new Token(item[0], item[1]));
    }

    tokens.sort((a, b) => b.count - a.count);

    return tokens;
  }

  emitNewTokens() {
    this.tokensChanged$.next(this.getAllTokens().slice(0, 1000));
  }

  ngOnDestroy() {
    if (this.feedChanged$) {
      this.feedChanged$.unsubscribe();
    }

    if (this.feedsSettingsChanged$) {
      this.feedsSettingsChanged$.unsubscribe();
    }

    if (this.tokensChanged$) {
      this.tokensChanged$.unsubscribe();
    }
  }

  mapFeed(feed: Jsonfeed) {
    const language = feed._feedmixer.language || 'en';

    const tokensList = feed.items.map(item => {
        const tokens = TokenizerService.tokenizeFeedItem(item, language);

        return [...new Set(tokens)]; // return only unique
      })
      .reduce((total, item) => total.concat(item))
      .filter((item: string) => item !== '' && item.length > 3)
      .reduce((map: Map<string, number>, word: string) => {

        // create a map with each word as keys
        map.has(word)
          ? map.set(word, (map.get(word) || 0) + 1)
          : map.set(word, 1);

        return map;
      }, new Map);

    this.feedsTokenMaps.set(feed._feedmixer.url, tokensList);
  }
}
