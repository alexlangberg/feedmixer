import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent implements OnInit {
  @Output() searchChanged = new EventEmitter<string>();
  searchValue = '';

  constructor() { }

  ngOnInit() {
  }

}
