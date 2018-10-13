import { SettingsStateModel } from '../state/settings.state';
import { SettingsFeed } from '../models/settings-feed.model';

export class UpdateSettingsFromFile {
  static readonly type = '[SETTINGS] Update from file';
  constructor(public payload: SettingsStateModel) {}
}

export class SetAllSettingsFeedsStatus {
  static readonly type = '[SETTINGS] Set all settings feeds status';
  constructor(public payload: boolean) {}
}

export class SetSettingsFeedStatus {
  static readonly type = '[SETTINGS] Set settings feed status';
  constructor(public payload: { url: string, active: boolean }) {}
}

export class SetSettingsFeedsUpdatedAt {
  static readonly type = '[SETTINGS] Set settings feeds updated at timestamp';
  constructor(public payload: { feeds: SettingsFeed[], updatedAt: Date }) {}
}
