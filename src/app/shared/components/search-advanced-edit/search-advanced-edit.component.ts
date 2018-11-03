import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { FeedsState } from '../../state/feeds.state';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { KeyValue } from '@angular/common';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent, MatDialog } from '@angular/material';
import { AdvancedSearchItem } from '../../models/advanced-search-item.model';
import {
  AddAdvancedSearchChips, RemoveAdvancedSearchChips,
  SetAdvancedSearchChips,
  SetAdvancedSearchItem,
  SetCurrentAdvancedSearchItem
} from '../../state/search.actions';
import { SearchState } from '../../state/search.state';
import { SearchAdvancedEditConfirmOverwriteDialogComponent } from './search-advanced-edit-confirm-overwrite.dialog';

@Component({
  selector: 'app-search-advanced-edit',
  templateUrl: './search-advanced-edit.component.html',
  styleUrls: ['./search-advanced-edit.component.css']
})
export class SearchAdvancedEditComponent implements OnInit {
  @Select(FeedsState.getTags) tags$: Observable<Map<string, number>>;
  @Select(SearchState.getCurrentAdvancedSearch) current$: Observable<AdvancedSearchItem>;
  @Select(SearchState.getSavedAdvancedSearches) saved$: Observable<AdvancedSearchItem[]>;
  @Select(SearchState.getAdvancedSearchChips) chips$: Observable<string[]>;
  @ViewChild('wordInput') wordInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  public readonly OR_LABEL = 'Match any word';
  public readonly AND_LABEL = 'Match all words';
  searchForm: FormGroup;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredTags: Observable<Map<string, number>>;
  chips: string[] = [];
  saved: AdvancedSearchItem[];

  constructor(
    private store: Store,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.searchForm = new FormGroup({
      search: new FormControl(),
      mode: new FormControl('or', Validators.required),
      name: new FormControl(undefined, Validators.required)
    });

    this.tags$.subscribe(tags => {
      this.filteredTags = this.searchForm.controls.search.valueChanges
        .pipe(
          startWith(''),
          map(value => {
            return this.filter(tags, value);
          })
        );
    });

    this.current$.subscribe(search => {
      if (search) {
        this.store.dispatch(new SetAdvancedSearchChips(search.words.slice()));
        this.searchForm.controls.mode.setValue(search.mode);
        this.searchForm.controls.name.setValue(search.name);
      } else {
        this.searchForm.controls.name.setValue('');
      }
    });

    this.saved$.subscribe(saved => {
      this.saved = saved;
    });

    this.chips$.subscribe(chips => {
      this.chips = chips;
    });
  }

  submit() {
    const name = this.searchForm.controls.name.value;

    if (this.saved.find(item => item.name === name)) {
      const dialogRef = this.dialog.open(
        SearchAdvancedEditConfirmOverwriteDialogComponent, {
          data: {
            name: name
          }
        }
      );

      dialogRef.afterClosed().subscribe(confirm => {
        if (confirm) {
          this.saveCurrentItem();
        }
      });
    } else {
      this.saveCurrentItem();
    }
  }

  private saveCurrentItem() {
    const name = this.searchForm.controls.name.value;

    const newItem = new AdvancedSearchItem(
      name,
      this.chips.slice(),
      this.searchForm.controls.mode.value,
      false,
      []
    );

    this.store.dispatch(new SetAdvancedSearchItem(newItem));
    this.store.dispatch(new SetCurrentAdvancedSearchItem(name));
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
        this.store.dispatch(new AddAdvancedSearchChips([value.trim()]));
      }

      if (input) {
        input.value = '';
      }

      this.searchForm.controls.search.setValue('');
    }
  }

  remove(word: string): void {
    this.store.dispatch(new RemoveAdvancedSearchChips([word]));
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.store.dispatch(new AddAdvancedSearchChips([event.option.value]));
    this.wordInput.nativeElement.value = '';
    this.searchForm.controls.search.setValue('');
  }
}
