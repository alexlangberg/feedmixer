import { JsonfeedItemAttachment } from './jsonfeed-item-attachment.model';

export class JsonfeedItem {
  constructor(
    public _feedmixer: { tags: string[] },
    public id: string,
    public guid?: string,
    public url?: string,
    public external_url?: string,
    public title?: string,
    public content_html?: string,
    public content_text?: string,
    public summary?: string,
    public image?: string,
    public banner_image?: string,
    public date_published?: string,
    public date_modified?: string,
    public author?: string,
    public tags?: string[],
    public attachments?: JsonfeedItemAttachment[]
  ) {}
}
