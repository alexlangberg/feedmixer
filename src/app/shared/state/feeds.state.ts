import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Jsonfeed } from '../models/jsonfeed.model';
import { SetFeed, SetSelectedFeedItem, UpdateFeed } from '../actions/feeds.actions';
import { JsonfeedItem } from '../models/jsonfeed-item.model';
import { SettingsState, SettingsStateModel } from './settings.state';

export interface FeedsStateModel {
  feeds: Map<string, Jsonfeed>;
  selectedFeedItem: JsonfeedItem | undefined;
}

@State<FeedsStateModel>({
  name: 'feeds',
  defaults: {
    feeds: new Map,
    selectedFeedItem: undefined
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

    allItems = allItems.sort((a, b) => {
      return new Date(b.date_published || 0).getTime()
        - new Date(a.date_published || 0).getTime();
    });

    return allItems;
  }

  @Selector()
  static getActiveFeeds(state: FeedsStateModel) {
    return FeedsState.getFeeds(state);
  }

  @Selector()
  static getSelectedFeedItem(state: FeedsStateModel) {
    return state.selectedFeedItem;
  }

  @Action(SetFeed)
  setFeed(ctx: StateContext<FeedsStateModel>, action: SetFeed) {
    ctx.patchState({
      feeds: ctx.getState().feeds.set(action.payload.url, action.payload.feed)
    });
  }

  @Action(SetSelectedFeedItem)
  setSelectedFeedItem(ctx: StateContext<FeedsStateModel>, action: SetSelectedFeedItem) {
    ctx.patchState({
      selectedFeedItem: action.payload.feedItem
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
