import { SettingsStateModel } from '../state/settings.state';

export class UpdateSettingsFromFile {
  static readonly type = '[SETTINGS] Update from file';
  constructor(public payload: SettingsStateModel) {}
}
