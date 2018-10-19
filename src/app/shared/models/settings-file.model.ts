import { SettingsFeed } from './settings-feed.model';

export class SettingsFile {
  constructor(
    public debug: boolean,
    public isAutoRefreshEnabled: boolean,
    public autoRefreshIntervalSeconds: number,
    public cacheFeedsSeconds: number,
    public feeds: SettingsFeed[]
  ) {}
}
