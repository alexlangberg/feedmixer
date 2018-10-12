import { Component, OnDestroy, OnInit } from '@angular/core';
import { UIService } from '../../shared/services/ui/ui.service';
import { Subscription } from 'rxjs';
import { FeedsService } from '../../shared/services/feeds/feeds.service';
import { JsonfeedItem } from '../../shared/models/jsonfeed-item.model';

@Component({
  selector: 'app-sidenav-end',
  templateUrl: './sidenav-end.component.html',
  styleUrls: ['./sidenav-end.component.css']
})
export class SidenavEndComponent implements OnInit, OnDestroy {
  private showItemInfo$: Subscription;
  item: JsonfeedItem | undefined;

  constructor(
    private uiService: UIService,
    private feedService: FeedsService
  ) { }

  ngOnInit() {
    this.showItemInfo$ = this.uiService.showItemInfo$.subscribe(url => {
      this.item = this.feedService.getFeedItem(url);
    });
  }

  ngOnDestroy() {
    if (this.showItemInfo$) {
      this.showItemInfo$.unsubscribe();
    }
  }

  doCloseSidenavEnd() {
    if (!this.uiService.large) {
      this.uiService.doToggleSidenavEnd();
    }
  }
}
