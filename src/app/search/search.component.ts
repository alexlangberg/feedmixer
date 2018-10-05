import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  @Output() searchChanged = new EventEmitter<string>();
  value = '';

  constructor() { }

  ngOnInit() {
  }

  doSearch(searchValue: string) {
    this.value = searchValue;
    this.searchChanged.emit(searchValue);
  }
}
