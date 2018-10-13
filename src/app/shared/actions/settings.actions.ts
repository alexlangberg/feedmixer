import { SettingsStateModel } from '../state/settings.state';

export class UpdateSettingsFromFile {
  static readonly type = '[SETTINGS] Update from file';
  constructor(public payload: SettingsStateModel) {}
}

export class SetAllFeedsStatus {
  static readonly type = '[SETTINGS] Set all feeds status';
  constructor(public payload: boolean) {}
}

export class SetFeedStatus {
  static readonly type = '[SETTINGS] Set feed status';
  constructor(public payload: { url: string, active: boolean }) {}
}
