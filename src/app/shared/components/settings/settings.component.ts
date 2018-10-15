import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { SetSettingsAutoRefresh } from '../../state/settings.actions';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(private store: Store) { }

  ngOnInit() {
  }

  onAutoRefreshToggle($event: boolean) {
    console.log($event);
    this.store.dispatch(new SetSettingsAutoRefresh($event));
  }
}
