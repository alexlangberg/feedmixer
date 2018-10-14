import { Component } from '@angular/core';
import { UIService } from '../../shared/services/ui/ui.service';
import { Observable } from 'rxjs';
import { JsonfeedItem } from '../../shared/models/jsonfeed-item.model';
import { Select } from '@ngxs/store';
import { FeedsState } from '../../shared/state/feeds.state';

@Component({
  selector: 'app-sidenav-end',
  templateUrl: './sidenav-end.component.html',
  styleUrls: ['./sidenav-end.component.css']
})
export class SidenavEndComponent {
  @Select(FeedsState.getSelectedFeedItem) item$: Observable<JsonfeedItem>;

  constructor(public uiService: UIService) { }
}
