import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
  SetAllSettingsFeedsStatus,
  SetSettingsFeedStatus,
  SetSettingsFeedsFetchedAt,
  UpdateSettingsFromFile, SetSettingsAutoRefresh
} from './settings.actions';
import { SettingsFeed } from '../models/settings-feed.model';

export interface SettingsStateModel {
  debug: boolean;
  isAutoRefreshEnabled: boolean;
  autoRefreshIntervalSeconds: number;
  cacheFeedsSeconds: number;
  feeds: SettingsFeed[];
}

@State<SettingsStateModel>({
  name: 'settings',
  defaults: {
    debug: false,
    isAutoRefreshEnabled: false,
    autoRefreshIntervalSeconds: 5,
    cacheFeedsSeconds: 60,
    feeds: []
  }
})

export class SettingsState {

  @Selector()
  static getSettings(state: SettingsStateModel) {
    return state;
  }

  @Selector()
  static getSettingsFeeds(state: SettingsStateModel) {
    return SettingsState
      .getSettings(state)
      .feeds;
  }

  @Selector()
  static getActiveSettingsFeeds(state: SettingsStateModel) {
    return SettingsState
      .getSettingsFeeds(state)
      .filter(feed => feed.active);
  }

  @Selector()
  static getActiveFeedsUrls(state: SettingsStateModel) {
    return SettingsState
      .getActiveSettingsFeeds(state)
      .map(feed => feed.url);
  }

  @Action(UpdateSettingsFromFile)
  updateSettings(ctx: StateContext<SettingsStateModel>, action: UpdateSettingsFromFile) {
    ctx.patchState(action.payload);
  }

  @Action(SetAllSettingsFeedsStatus)
  setAllFeedsStatus(ctx: StateContext<SettingsStateModel>, action: SetAllSettingsFeedsStatus) {
    ctx.patchState({
      feeds: ctx.getState().feeds.map(feed => {
        feed.active = action.payload;

        return feed;
      })
    });
  }

  @Action(SetSettingsFeedStatus)
  setFeedStatus(ctx: StateContext<SettingsStateModel>, action: SetSettingsFeedStatus) {
    ctx.patchState({
      feeds: ctx.getState().feeds.map(item => {
        if (item.url === action.payload.url) {
          item.active = action.payload.active;
        }

        return item;
      })
    });
  }

  @Action(SetSettingsFeedsFetchedAt)
  setFeedsFetchedAt(ctx: StateContext<SettingsStateModel>, action: SetSettingsFeedsFetchedAt) {
    ctx.patchState({
      feeds: ctx.getState().feeds.map(item => {
        if (action.payload.feeds.find(feed => feed.url === item.url)) {
          item.fetchedAt = action.payload.fetchedAt;
        }

        return item;
      })
    });
  }

  @Action(SetSettingsAutoRefresh)
  setAutoRefresh(ctx: StateContext<SettingsStateModel>, action: SetSettingsAutoRefresh) {
    ctx.patchState({
      isAutoRefreshEnabled: action.payload
    });
  }
}
