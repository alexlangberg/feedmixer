import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Jsonfeed } from '../models/jsonfeed.model';
import { SetFeed, UpdateFeed } from '../actions/feeds.actions';
import { JsonfeedItem } from '../models/jsonfeed-item.model';
import { SettingsState, SettingsStateModel } from './settings.state';

export interface FeedsStateModel {
  feeds: Map<string, Jsonfeed>;
}

@State<FeedsStateModel>({
  name: 'feeds',
  defaults: {
    feeds: new Map
  }
})

export class FeedsState {

  @Selector()
  static getFeeds(state: FeedsStateModel) {
    return state.feeds;
  }

  @Selector([SettingsState])
  static getFeedsItems(state: FeedsStateModel, settingsState: SettingsStateModel) {
    const activatedFeeds: string[] = settingsState.feeds
      .filter(item => item.active)
      .map(item => item.url);

    let allItems: JsonfeedItem[] = [];

    state.feeds.forEach(feed => {
      if (activatedFeeds.includes(feed._feedmixer.url)) {
        allItems = allItems.concat(feed.items);
      }
    });

    return allItems;
  }

  @Selector()
  static getActiveFeeds(state: FeedsStateModel) {
    return FeedsState.getFeeds(state);
  }

  @Action(SetFeed)
  setFeed(ctx: StateContext<FeedsStateModel>, action: SetFeed) {
    ctx.patchState({
      feeds: ctx.getState().feeds.set(action.payload.url, action.payload.feed)
    });
  }

  @Action(UpdateFeed)
  updateFeed(ctx: StateContext<FeedsStateModel>, action: UpdateFeed) {
    const state = ctx.getState();
    const existing = state.feeds.get(action.payload.url);

    if (existing) {
      action.payload.feed.items.forEach(newItem => {
        const oldItem = existing.items.find(
          item => item.guid === newItem.guid
        );

        if (! oldItem) {
          existing.items.push(newItem);
        }
      });

      this.setFeed(ctx, new SetFeed({
        url: action.payload.url,
        feed: existing})
      );
    } else {
      this.setFeed(ctx, new SetFeed({
        url: action.payload.url,
        feed: action.payload.feed})
      );
    }
  }
}
