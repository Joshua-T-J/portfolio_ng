import { Component, inject, Inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
export enum AlertTypes {
  SUCCESS,
  ERROR,
}

export interface SnackbarData {
  Type: AlertTypes;
  Message: string;
}

@Component({
  selector: 'app-alert',
  imports: [MatIconModule],
  templateUrl: './alert.html',
  styleUrl: './alert.scss',
})
export class Alert {
  alertTypes = AlertTypes;
  snackBarRef = inject(MatSnackBarRef);

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: SnackbarData) {}
}
