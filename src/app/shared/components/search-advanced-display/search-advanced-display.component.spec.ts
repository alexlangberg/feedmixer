import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAdvancedDisplayComponent } from './search-advanced-display.component';

describe('SearchAdvancedDisplayComponent', () => {
  let component: SearchAdvancedDisplayComponent;
  let fixture: ComponentFixture<SearchAdvancedDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchAdvancedDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchAdvancedDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
