import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedItemInfoComponent } from './feed-item-info.component';

describe('FeedItemInfoComponent', () => {
  let component: FeedItemInfoComponent;
  let fixture: ComponentFixture<FeedItemInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedItemInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedItemInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
