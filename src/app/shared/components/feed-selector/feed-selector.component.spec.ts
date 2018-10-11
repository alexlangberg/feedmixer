import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedSelectorComponent } from './feed-selector.component';

describe('FeedSelectorComponent', () => {
  let component: FeedSelectorComponent;
  let fixture: ComponentFixture<FeedSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
