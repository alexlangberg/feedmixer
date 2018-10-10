import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FeedsService } from '../shared/services/feeds/feeds.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private feedsSelectorService: FeedsService
  ) {}

  onRefresh() {
    this.feedsSelectorService.refreshAllFeeds();
  }

  onAutoRefreshToggle($event: boolean) {
    this.feedsSelectorService.toggleAutoRefresher($event);
  }
}
