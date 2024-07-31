import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class DarkmodeService {
	private readonly DARK_MODE_KEY = 'darkmode';

	setDarkMode(isDarkMode: boolean): void {
		localStorage.setItem(this.DARK_MODE_KEY, JSON.stringify(isDarkMode));
	}

	isDarkMode(): boolean {
		const storedValue = localStorage.getItem(this.DARK_MODE_KEY);

		return storedValue ? JSON.parse(storedValue) : false;
	}
}
