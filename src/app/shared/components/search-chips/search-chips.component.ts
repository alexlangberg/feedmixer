import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { FeedsState } from '../../state/feeds.state';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { KeyValue } from '@angular/common';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';

@Component({
  selector: 'app-search-chips',
  templateUrl: './search-chips.component.html',
  styleUrls: ['./search-chips.component.css']
})
export class SearchChipsComponent implements OnInit {
  @Select(FeedsState.getTags) tags$: Observable<Map<string, number>>;
  @ViewChild('wordInput') wordInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  nameControl = new FormControl();
  searchControl = new FormControl();
  searchModeControl = new FormControl();
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredTags: Observable<Map<string, number>>;
  words: string[] = [];

  constructor(private store: Store) {}

  ngOnInit() {
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

  add(event: MatChipInputEvent): void {
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      if ((value || '').trim()) {
        this.words.push(value.trim());
      }

      if (input) {
        input.value = '';
      }

      this.searchControl.setValue('');
    }
  }

  remove(word: string): void {
    const index = this.words.indexOf(word);

    if (index >= 0) {
      this.words.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.words.push(event.option.value);
    this.wordInput.nativeElement.value = '';
    this.searchControl.setValue('');
  }
}
