import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedsSelectorComponent } from './feeds-selector.component';

describe('FeedsSelectorComponent', () => {
  let component: FeedsSelectorComponent;
  let fixture: ComponentFixture<FeedsSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedsSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedsSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
