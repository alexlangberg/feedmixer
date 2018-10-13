import { Action, Selector, State, StateContext } from '@ngxs/store';
import { UpdateSettingsFromFile } from '../actions/settings.actions';
import { SettingsFeed } from '../models/settings-feed.model';

export interface SettingsStateModel {
  autoRefreshIntervalMinutes: number;
  cacheFeedsSeconds: number;
  feeds: SettingsFeed[];
}

@State<SettingsStateModel>({
  name: 'settings',
  defaults: {
    autoRefreshIntervalMinutes: 5,
    cacheFeedsSeconds: 60,
    feeds: []
  }
})

export class SettingsState {

  @Selector()
  static getSettings(state: SettingsStateModel) {
    return state;
  }

  @Action(UpdateSettingsFromFile)
  updateSettings(ctx: StateContext<SettingsStateModel>, action: UpdateSettingsFromFile) {
    ctx.patchState(action.payload);
  }
}
