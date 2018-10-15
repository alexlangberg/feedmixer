import { SettingsFeed } from './settings-feed.model';

export class SettingsFile {
  constructor(
    public autoRefreshIntervalSeconds: number,
    public cacheFeedsSeconds: number,
    public feeds: SettingsFeed[]
  ) {}
}
