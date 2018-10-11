import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedItemTermsSearchComponent } from './feed-item-terms-search.component';

describe('FeedItemTermsSearchComponent', () => {
  let component: FeedItemTermsSearchComponent;
  let fixture: ComponentFixture<FeedItemTermsSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedItemTermsSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedItemTermsSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
