import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  @Input() isSidenavCloseDisabled: boolean;
  @Output() sidenavToggle = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<void>();
  @Output() autoRefresh = new EventEmitter<boolean>();
  public isAutoRefresh = false;

  constructor() { }

  ngOnInit() {
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  onRefresh() {
    this.refresh.emit();
  }

  onAutoRefreshToggle() {
    this.isAutoRefresh = !this.isAutoRefresh;

    this.autoRefresh.emit(this.isAutoRefresh);
  }
}
