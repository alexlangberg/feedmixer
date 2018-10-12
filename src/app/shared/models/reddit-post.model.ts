export class RedditPost {
  constructor(
    public title: string,
    public subreddit: string,
    public permalink: string,
    public created_at_utc: Date,
    public num_comments: number
  ) {}
}
