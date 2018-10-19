import { SettingsFeed } from './settings-feed.model';

export class SettingsFile {
  constructor(
    public isAutoRefreshEnabled: boolean,
    public autoRefreshIntervalSeconds: number,
    public feeds: SettingsFeed[]
  ) {}
}
