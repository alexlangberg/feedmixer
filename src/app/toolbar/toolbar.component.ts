import { Component, Input, OnInit } from '@angular/core';
import { FeedsService } from '../shared/services/feeds/feeds.service';
import { LayoutService } from '../shared/services/layout/layout.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  @Input() isSidenavCloseDisabled: boolean;

  constructor(
    private feedsSelectorService: FeedsService,
    public layoutService: LayoutService
  ) {}

  ngOnInit() {
  }

  onToggleSidenav() {
    this.layoutService.doToggleSidenav();
  }

  onRefresh() {
    this.feedsSelectorService.refreshFeeds();
  }

  onAutoRefreshToggle($event: boolean) {
    this.feedsSelectorService.toggleAutoRefresher($event);
  }
}
