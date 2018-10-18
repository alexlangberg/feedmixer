import { Component, OnInit, ViewChild } from '@angular/core';
import { FeedsService } from '../shared/services/feeds/feeds.service';
import { MatSidenav } from '@angular/material';
import { ObservableMedia } from '@angular/flex-layout';
import { Select, Store } from '@ngxs/store';
import { SetIsSidenavOpenStatus, SetSidenavs } from '../shared/state/ui.actions';
import { Observable } from 'rxjs';
import { UiState, UiStateModel } from '../shared/state/ui.state';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  @Select(UiState.get) ui$: Observable<UiStateModel>;
  @ViewChild('sidenav') sidenav: MatSidenav;
  @ViewChild('sidenavEnd') sidenavEnd: MatSidenav;

  constructor(
    public media$: ObservableMedia,
    public feedsService: FeedsService,
    private store: Store
  ) {}

  ngOnInit() {
    this.store.dispatch(new SetSidenavs({
      sidenav: this.sidenav,
      sidenavEnd: this.sidenavEnd
    }));
  }

  toggleSidenav(sidenav: 'start' | 'end', isOpen: boolean) {
    this.store.dispatch(new SetIsSidenavOpenStatus({
      sidenav: sidenav,
      isOpen: isOpen
    }));
  }
}
