import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appImports } from './app/app.imports';

bootstrapApplication(AppComponent, {
	providers: [
		importProvidersFrom(appImports),
	],
});
