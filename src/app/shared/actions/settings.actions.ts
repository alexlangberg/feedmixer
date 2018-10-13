import { SettingsFile } from '../models/settings-file.model';

export class SetSettings {
  static readonly type = '[SETTINGS] Set';
  constructor(public payload: SettingsFile) {}
}
