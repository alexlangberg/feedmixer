import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
  SetAllFeedsStatus,
  SetFeedStatus,
  UpdateSettingsFromFile
} from '../actions/settings.actions';
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
  static getFeeds(state: SettingsStateModel) {
    return SettingsState
      .getSettings(state)
      .feeds;
  }

  @Selector()
  static getActiveFeeds(state: SettingsStateModel) {
    return SettingsState
      .getFeeds(state)
      .filter(feed => feed.active);
  }

  @Selector()
  static getActiveFeedsUrls(state: SettingsStateModel) {
    return SettingsState
      .getActiveFeeds(state)
      .map(feed => feed.url);
  }

  @Action(UpdateSettingsFromFile)
  updateSettings(ctx: StateContext<SettingsStateModel>, action: UpdateSettingsFromFile) {
    ctx.patchState(action.payload);
  }

  @Action(SetAllFeedsStatus)
  setAllFeedsStatus(ctx: StateContext<SettingsStateModel>, action: SetAllFeedsStatus) {
    ctx.patchState({
      feeds: ctx.getState().feeds.map(feed => {
        feed.active = action.payload;

        return feed;
      })
    });
  }

  @Action(SetFeedStatus)
  setFeedStatus(ctx: StateContext<SettingsStateModel>, action: SetFeedStatus) {
    ctx.patchState({
      feeds: ctx.getState().feeds.map(item => {
        if (item.url === action.payload.url) {
          item.active = action.payload.active;
        }

        return item;
      })
    });
  }
}
