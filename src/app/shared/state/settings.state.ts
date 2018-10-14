import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
  SetAllSettingsFeedsStatus,
  SetSettingsFeedStatus,
  SetSettingsFeedsUpdatedAt,
  UpdateSettingsFromFile
} from './settings.actions';
import { SettingsFeed } from '../models/settings-feed.model';

export interface SettingsStateModel {
  autoRefreshIntervalMinutes: number;
  cacheFeedsSeconds: number;
  feeds: SettingsFeed[];
}

@State<SettingsStateModel>({
  name: 'settings',
  defaults: {
    autoRefreshIntervalMinutes: 5,
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

  @Action(SetSettingsFeedsUpdatedAt)
  setFeedsUpdatedAt(ctx: StateContext<SettingsStateModel>, action: SetSettingsFeedsUpdatedAt) {
    ctx.patchState({
      feeds: ctx.getState().feeds.map(item => {
        if (action.payload.feeds.find(feed => feed.url === item.url)) {
          item.updatedAt = action.payload.updatedAt;
        }

        return item;
      })
    });
  }
}
