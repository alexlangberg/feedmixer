import { RedditPost } from './reddit-post.model';

export class RedditListing {
  constructor(
    public data: {
      children: { data: RedditPost }[]
    }
  ) {}
}
