import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
	providedIn: 'root',
})
export class SnackbarService {
	private readonly DURATION: number = 3000;

	constructor(private readonly _sb: MatSnackBar) {}

	openSnackBar(message: string, action: string,) {
		this._sb.open(message, action, {
			duration: this.DURATION,
		});
	}

	openSuccess(message: string) {
		this.openSnackBar(message, '');
	}

	openError(message: string) {
		this.openSnackBar(message, '');
	}
}
