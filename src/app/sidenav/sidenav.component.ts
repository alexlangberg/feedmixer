import { Component, OnInit } from '@angular/core';
import { FeedsService } from '../shared/services/feeds/feeds.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  constructor(private feedsSelectorService: FeedsService) { }

  ngOnInit() {
  }

  onAutoRefreshToggle($event: boolean) {
    this.feedsSelectorService.toggleAutoRefresher($event);
  }
}
