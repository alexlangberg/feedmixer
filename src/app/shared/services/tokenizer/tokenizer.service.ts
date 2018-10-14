import { Injectable } from '@angular/core';
import * as stopword from 'stopword';
import { JsonfeedItem } from '../../models/jsonfeed-item.model';

@Injectable({
  providedIn: 'root'
})
export class TokenizerService {

  constructor() {}

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

  static getTags(text: string, language?: string): string[] {
    const sanitized = TokenizerService.removeSpecials(text);

    const words = sanitized
      .toLowerCase()
      .split(' ')
      .filter(word => word !== '');

    const stopWords = stopword[language || 'en'];

    return stopword.removeStopwords(words, stopWords);
  }

  static getTagsFromFeedItem(item: JsonfeedItem, language: string): string[] {
    const tags = TokenizerService
      .getTags(item.title || '', language)
      .concat(
        TokenizerService
          .getTags(item.summary || '', language)
      );

    return [...new Set(tags)]; // remove duplicates
  }
}
