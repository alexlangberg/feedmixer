import { TestBed } from '@angular/core/testing';
import { Feed2jsonService } from './feed2json.service';
import { HttpClientModule } from '@angular/common/http';
import { Feed } from 'feed';

describe('Feed2jsonService', () => {
  let service: Feed2jsonService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [Feed2jsonService]
    });
    service = TestBed.get(Feed2jsonService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  // it('should be able to get feed', () => {
  //   service.fetch('http://feeds.bbci.co.uk/news/rss.xml')
  //     .subscribe(
  //       (response) => {
  //         const result = <Feed>response;
  //
  //         expect(result.items).toBeDefined();
  //       });
  // });
});
