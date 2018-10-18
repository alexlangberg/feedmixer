import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { JsonfeedItem } from '../../shared/models/jsonfeed-item.model';
import { Select, Store } from '@ngxs/store';
import { FeedsState } from '../../shared/state/feeds.state';
import { SetIsSidenavOpenStatus } from '../../shared/state/ui.actions';
import { UiState, UiStateModel } from '../../shared/state/ui.state';

@Component({
  selector: 'app-sidenav-end',
  templateUrl: './sidenav-end.component.html',
  styleUrls: ['./sidenav-end.component.css']
})
export class SidenavEndComponent implements OnInit {
  @Select(FeedsState.getSelectedFeedItem) item$: Observable<JsonfeedItem>;
  @Select(UiState.get) ui$: Observable<UiStateModel>;
  private uiSize: string;

  constructor(public store: Store) {}

  ngOnInit() {
    this.ui$.subscribe(change => {
      this.uiSize = change.size;
    });
  }

  toggleSidenavEnd() {
    if (['xs', 'sm', 'md'].includes(this.uiSize)) {
      this.store.dispatch(new SetIsSidenavOpenStatus({
        sidenav: 'end',
        isOpen: false
      }));
    }
  }
}
