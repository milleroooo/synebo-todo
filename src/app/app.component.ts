import { Component } from '@angular/core';
import { MainPageComponent } from './views/main-page/main-page.component';

@Component({
	standalone: true,
	imports: [MainPageComponent],
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.less'],
})
export class AppComponent {
	title = 'synebo-todo';
}
