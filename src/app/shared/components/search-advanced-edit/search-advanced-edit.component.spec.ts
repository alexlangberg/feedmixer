import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAdvancedEditComponent } from './search-advanced-edit.component';

describe('SearchAdvancedEditComponent', () => {
  let component: SearchAdvancedEditComponent;
  let fixture: ComponentFixture<SearchAdvancedEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchAdvancedEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchAdvancedEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
