import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavEndComponent } from './sidenav-end.component';

describe('SidenavEndComponent', () => {
  let component: SidenavEndComponent;
  let fixture: ComponentFixture<SidenavEndComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidenavEndComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavEndComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
