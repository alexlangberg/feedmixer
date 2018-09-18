import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedItemsListComponent } from './feed-items-list.component';
import { Feed2jsonService } from '../shared/services/feed2json/feed2json.service';
import { HttpClientModule } from '@angular/common/http';

describe('FeedItemsListComponent', () => {
  let component: FeedItemsListComponent;
  let fixture: ComponentFixture<FeedItemsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedItemsListComponent ],
      imports: [HttpClientModule],
      providers: [ Feed2jsonService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedItemsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
