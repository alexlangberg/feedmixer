import { SettingsFeed } from './settings-feed.model';

export class SettingsFile {
  constructor(
    public feeds: SettingsFeed[]
  ) {}
}
