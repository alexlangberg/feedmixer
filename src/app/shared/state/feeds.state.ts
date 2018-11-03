import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Jsonfeed } from '../models/jsonfeed.model';
import {
  SetFeed,
  SetSelectedFeedItem,
  UpdateFeed,
  UpdateFeeds,
  UpdateTags
} from './feeds.actions';
import { JsonfeedItem } from '../models/jsonfeed-item.model';
import { SettingsState, SettingsStateModel } from './settings.state';

export interface FeedsStateModel {
  feeds: Map<string, Jsonfeed>;
  selectedFeedItem: JsonfeedItem | undefined;
  tags: Map<string, number>;
}

@State<FeedsStateModel>({
  name: 'feeds',
  defaults: {
    feeds: new Map,
    selectedFeedItem: undefined,
    tags: new Map
  }
})

export class FeedsState {

  constructor(private store: Store) {}

  @Selector()
  static getFeeds(state: FeedsStateModel) {
    return state.feeds;
  }

  @Selector([SettingsState])
  static getActiveFeedsItems(
    state: FeedsStateModel,
    settingsState: SettingsStateModel
  ) {
    const feeds = FeedsState.getActiveFeeds(state, settingsState);

    if (feeds.length) {
      return feeds
        .map(feed => feed.items)
        .reduce((total, item) => total.concat(item))
        .sort((a, b) => {
          return new Date(b.date_published || 0).getTime()
            - new Date(a.date_published || 0).getTime();
        });
    } else {
      return [];
    }
  }

  @Selector([SettingsState])
  static getActiveFeeds(
    state: FeedsStateModel,
    settingsState: SettingsStateModel
  ) {
    const activatedFeeds: string[] = settingsState.feeds
      .filter(item => item.active)
      .map(item => item.url);

    let activeFeeds: Jsonfeed[] = [];

    state.feeds.forEach(feed => {
      if (activatedFeeds.includes(feed._feedmixer.url)) {
        activeFeeds = activeFeeds.concat(feed);
      }
    });

    return activeFeeds;
  }

  @Selector()
  static getSelectedFeedItem(state: FeedsStateModel) {
    return state.selectedFeedItem;
  }

  @Selector()
  static getFeedsItemCounts(state: FeedsStateModel) {
    const counts: { url: string, count: number}[] = [];

    state.feeds.forEach((feed: Jsonfeed) => {
      counts.push({ url: feed._feedmixer.url, count: feed.items.length});
    });

    return counts;
  }

  @Selector()
  static getTags(state: FeedsStateModel): Map<string, number> {
    return state.tags;
  }

  @Selector()
  static getRepeatTags(state: FeedsStateModel) {
    const tags = FeedsState.getTags(state);

    return new Map([...tags.entries()].filter(tag => tag[1] > 1));
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
        feed: existing
      }));
    } else {
      this.setFeed(ctx, new SetFeed({
        url: action.payload.url,
        feed: action.payload.feed
      }));
    }
  }

  @Action(UpdateFeeds)
  updateFeeds(ctx: StateContext<FeedsStateModel>, action: UpdateFeeds) {
    const state = ctx.getState();
    const oldFeeds = state.feeds;

    if (action.payload.feeds) {
      action.payload.feeds.forEach((feed: Jsonfeed) => {
        const url = feed._feedmixer.url;
        const existing = oldFeeds.get(url);

        if (existing) {
          feed.items.forEach(newItem => {
            const oldItem = existing.items.find(
              item => item.guid === newItem.guid
            );

            if (! oldItem) {
              existing.items.push(newItem);
            }
          });

          oldFeeds.set(url, existing);
        } else {
          oldFeeds.set(url, feed);
        }
      });

      ctx.patchState({
        feeds: oldFeeds
      });
    }
  }

  @Action(UpdateTags)
  updateTags(ctx: StateContext<FeedsStateModel>) {
    const activeFeeds = this.store.selectSnapshot(FeedsState.getActiveFeeds);
    let result = new Map;

    activeFeeds.forEach(feed => {
      feed.items.forEach(item => {
        item._feedmixer.tags.forEach(tag => {
          result.has(tag)
            ? result.set(tag, (result.get(tag) || 0) + 1)
            : result.set(tag, 1);
        });
      });
    });

    result = new Map([...result.entries()].sort((a, b) => {
      return b[1] - a[1];
    }));

    ctx.patchState({
      tags: result
    });
  }
}
