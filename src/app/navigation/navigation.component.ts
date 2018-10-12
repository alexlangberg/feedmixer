import { Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(
    public uiService: UIService,
    private breakpointObserver: BreakpointObserver,
    private feedsSelectorService: FeedsService
  ) {}

  ngOnInit() {
    this.uiService.setSidenav(this.sidenav);
    this.uiService.setSidenavEnd(this.sidenavEnd);
  }

  onRefresh() {
    this.feedsSelectorService.refreshAllFeeds();
  }
}
