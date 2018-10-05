import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  @Output() searchChanged = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  doSearch(searchValue: string) {
    this.searchChanged.emit(searchValue);
  }
}
