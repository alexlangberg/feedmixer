import { SettingsFile } from '../models/settings-file.model';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { SetSettings } from '../actions/settings.actions';

export interface SettingsStateModel {
  settings: SettingsFile;
}

@State<SettingsStateModel>({
  name: 'settings'
})

export class SettingsState {

  @Selector()
  static getSettings(state: SettingsStateModel) {
    return state.settings;
  }

  @Action(SetSettings)
  setSettings(ctx: StateContext<SettingsStateModel>, action: SetSettings) {
    ctx.setState({settings: action.payload});
  }
}
