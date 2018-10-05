import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  @Output() searchChanged = new EventEmitter<string>();
  @Output() refreshFeed = new EventEmitter<void>();
  @Output() autoRefreshFeed = new EventEmitter<boolean>();
  searchExpanded: boolean;

  constructor() { }

  ngOnInit() {
  }

  doSearch(searchValue: string) {
    this.searchChanged.emit(searchValue);

    if (! this.searchExpanded) {
      this.searchExpanded = true;
    }
  }
}
