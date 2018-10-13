import { SettingsStateModel } from '../state/settings.state';

export class UpdateSettingsFromFile {
  static readonly type = '[SETTINGS] Update from file';
  constructor(public payload: SettingsStateModel) {}
}

export class SetAllFeedsEnabled {
  static readonly type = '[SETTINGS] Enable all feeds';
  constructor() {}
}

export class SetAllFeedsDisabled {
  static readonly type = '[SETTINGS] Disable all feeds';
  constructor() {}
}

export class SetFeedEnabled {
  static readonly type = '[SETTINGS] Enable feed';
  constructor(public payload: string) {}
}

export class SetFeedDisabled {
  static readonly type = '[SETTINGS] Disable feed';
  constructor(public payload: string) {}
}
