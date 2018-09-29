import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
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
