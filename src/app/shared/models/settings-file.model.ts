import { SettingsFeed } from './settings-feed.model';

export class SettingsFile {
  constructor(
    public feed2jsonApiBaseUrl: string,
    public isAutoRefreshEnabled: boolean,
    public autoRefreshIntervalSeconds: number,
    public feeds: SettingsFeed[]
  ) {}
}
