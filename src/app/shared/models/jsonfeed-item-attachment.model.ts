export class JsonfeedItemAttachment {
  constructor(
    public url: string,
    public mime_type: string,
    public title?: string,
    public size_in_bytes?: number,
    public duration_in_seconds?: number,
  ) {}
}
