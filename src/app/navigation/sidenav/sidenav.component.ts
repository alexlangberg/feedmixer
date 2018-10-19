import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { SettingsState, SettingsStateModel } from '../../shared/state/settings.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent {
  @Select(SettingsState.getSettings) settings$: Observable<SettingsStateModel>;
}
