import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedditUrlLookupComponent } from './reddit-url-lookup.component';

describe('RedditUrlLookupComponent', () => {
  let component: RedditUrlLookupComponent;
  let fixture: ComponentFixture<RedditUrlLookupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedditUrlLookupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedditUrlLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
