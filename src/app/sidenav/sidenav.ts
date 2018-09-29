import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class Sidenav implements OnInit {
  @Output() searchChanged = new EventEmitter<string>();
  searchValue = '';

  constructor() { }

  ngOnInit() {
  }

}
