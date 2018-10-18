import { MatSidenav } from '@angular/material';

export class SetSidenavs {
  static readonly type = '[UI] Set sidenav';
  constructor(public payload: { sidenav: MatSidenav, sidenavEnd: MatSidenav}) {}
}

export class SetIsSidenavOpenStatus {
  static readonly type = '[UI] Set sidenav open status';
  constructor(public payload: {
    sidenav: 'start' | 'end',
    isOpen: boolean
  }) {}
}

export class SetScreenSize {
  static readonly type = '[UI] Set screen size';
  constructor(public payload: {
    size: string
  }) {}
}
