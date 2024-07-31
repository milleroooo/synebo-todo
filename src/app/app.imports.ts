import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material/material.module';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export const appImports = [
	CommonModule,
	BrowserModule,
	HttpClientModule,
	MaterialModule,
	BrowserAnimationsModule,
];

export const testImports = [...appImports];
