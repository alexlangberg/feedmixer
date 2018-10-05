import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-top-terms',
  templateUrl: './top-terms.component.html',
  styleUrls: ['./top-terms.component.css']
})
export class TopTermsComponent implements OnInit {
  @Output() searchChanged = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  doSearch(searchValue: string) {
    this.searchChanged.emit(searchValue);
  }
}
