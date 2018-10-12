import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { HttpClientModule } from '@angular/common/http';
import { Feed } from 'feed';

describe('ApiService', () => {
  let service: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [ApiService]
    });
    service = TestBed.get(ApiService);
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
