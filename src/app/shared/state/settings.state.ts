import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
  SetAllFeedsDisabled,
  SetAllFeedsEnabled, SetFeedDisabled, SetFeedEnabled,
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
    return state.feeds;
  }

  @Selector()
  static getActiveFeeds(state: SettingsStateModel) {
    return state.feeds
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

  @Action(SetAllFeedsEnabled)
  setAllFeedsEnabled(ctx: StateContext<SettingsStateModel>) {
    ctx.patchState({
      feeds: ctx.getState().feeds.map(feed => {
        feed.active = true;
        return feed;
      })
    });
  }

  @Action(SetAllFeedsDisabled)
  setAllFeedsDisabled(ctx: StateContext<SettingsStateModel>) {
    ctx.patchState({
      feeds: ctx.getState().feeds.map(feed => {
        feed.active = false;
        return feed;
      })
    });
  }

  @Action(SetFeedEnabled)
  setFeedEnabled(ctx: StateContext<SettingsStateModel>, action: SetFeedEnabled) {
    ctx.patchState({
      feeds: ctx.getState().feeds.map(item => {
        if (item.url === action.payload) {
          item.active = true;
        }

        return item;
      })
    });
  }

  @Action(SetFeedDisabled)
  setFeedDisabled(ctx: StateContext<SettingsStateModel>, action: SetFeedDisabled) {
    console.log(action);
    ctx.patchState({
      feeds: ctx.getState().feeds.map(item => {
        if (item.url === action.payload) {
          item.active = false;
        }

        return item;
      })
    });
  }
}