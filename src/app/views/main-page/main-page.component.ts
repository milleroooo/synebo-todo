import { Component, HostListener, Renderer2 } from '@angular/core';
import { TodoListComponent } from '../todo-list/todo-list.component';
import { DarkmodeService } from '@services/darkmode/darkmode.service';
import { SharedModule } from '@shared/shared.module';

@Component({
	standalone: true,
	imports: [SharedModule, TodoListComponent],
	selector: 'app-main-page',
	templateUrl: './main-page.component.html',
	styleUrls: ['./main-page.component.less'],
})
export class MainPageComponent {
	isMobile: boolean = false;
	isDarkMode: boolean = false;

	private readonly THEME_LIGHT: string = 'assets/images/bg-desktop-light.jpg';
	private readonly MOBILE_THEME_LIGHT: string = 'assets/images/bg-mobile-light.jpg';
	private readonly THEME_DARK: string = 'assets/images/bg-desktop-dark.jpg';
	private readonly MOBILE_THEME_DARK: string = 'assets/images/bg-mobile-dark.jpg';
	private readonly LIGHT_MODE_ICON: string = 'assets/icons/icon-sun.svg';
	private readonly DARK_MODE_ICON: string = 'assets/icons/icon-moon.svg';
	private readonly MOBILE_BREAKPOINT: number = 768;

	constructor(private readonly _ds: DarkmodeService, private readonly _r2: Renderer2) {}

	ngOnInit(): void {
		this._checkMobileVersion();
		this._applyTheme();
	}

	@HostListener('window:resize', ['$event'])
	onResize(): void {
		this._checkMobileVersion();
	}

	getProperImage(): string {
		if (this.isDarkMode) {
			return this.isMobile ? this.MOBILE_THEME_DARK : this.THEME_DARK;
		} else {
			return this.isMobile ? this.MOBILE_THEME_LIGHT : this.THEME_LIGHT;
		}
	}

	getProperIcon(): string {
		return this.isDarkMode ? this.LIGHT_MODE_ICON : this.DARK_MODE_ICON;
	}

	toggleDarkMode(): void {
		this.isDarkMode = !this.isDarkMode;
		this._ds.setDarkMode(this.isDarkMode);
		this._applyTheme();
	}

	private _checkMobileVersion(): void {
		this.isMobile = window.innerWidth < this.MOBILE_BREAKPOINT;
	}

	private _applyTheme(): void {
		this.isDarkMode = this._ds.isDarkMode();

		if (this.isDarkMode) {
			this._r2.addClass(document.body, 'darkmode');
		} else {
			this._r2.removeClass(document.body, 'darkmode');
		}
	}
}
