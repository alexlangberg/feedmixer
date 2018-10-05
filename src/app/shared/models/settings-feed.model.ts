export class SettingsFeed {
  constructor(
    public name: string,
    public url: string,
    public language: string,
    public active?: boolean
  ) {}
}
