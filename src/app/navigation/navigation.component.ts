import { Component, OnInit, ViewChild } from '@angular/core';
import { FeedsService } from '../shared/services/feeds/feeds.service';
import { UIService } from '../shared/services/ui/ui.service';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  @ViewChild('sidenav') sidenav: MatSidenav;
  @ViewChild('sidenavEnd') sidenavEnd: MatSidenav;

  constructor(
    public uiService: UIService,
    public feedsService: FeedsService
  ) {}

  ngOnInit() {
    this.uiService.setSidenav(this.sidenav);
    this.uiService.setSidenavEnd(this.sidenavEnd);
  }
}
