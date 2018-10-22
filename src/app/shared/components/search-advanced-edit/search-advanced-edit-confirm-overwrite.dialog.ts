import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-search-advanced-edit-confirm-overwrite',
  template: `
    <h1 mat-dialog-title>Overwrite "{{ data.name }}"?</h1>
    <mat-dialog-content>
      <p>An existing search with the name "{{ data.name }}" already exists.</p>
      <p>Are you sure that you want to overwrite it?</p>
    </mat-dialog-content>
    <mat-dialog-actions fxLayout="row" fxLayoutAlign="end">
      <button
        fxFlexAlign="end"
        mat-button
        color="accent"
        [mat-dialog-close]="false">
        Cancel
      </button>
      <button
        fxFlexAlign="end"
        mat-button
        color="accent"
        [mat-dialog-close]="true">
        Confirm
      </button>
    </mat-dialog-actions>
  `
})
export class SearchAdvancedEditConfirmOverwriteDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
}
