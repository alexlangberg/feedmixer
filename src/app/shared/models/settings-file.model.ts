import { SettingsFeed } from './settings-feed.model';

export class SettingsFile {
  constructor(
    public autoRefreshIntervalMinutes: number,
    public cacheFeedsSeconds: number,
    public feeds: SettingsFeed[]
  ) {}
}
