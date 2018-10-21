import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchChipsComponent } from './search-chips.component';

describe('SearchChipsComponent', () => {
  let component: SearchChipsComponent;
  let fixture: ComponentFixture<SearchChipsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchChipsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
