import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopTermsComponent } from './top-terms.component';

describe('TopTermsComponent', () => {
  let component: TopTermsComponent;
  let fixture: ComponentFixture<TopTermsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopTermsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
