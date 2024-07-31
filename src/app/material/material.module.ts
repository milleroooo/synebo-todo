import {
	ModuleWithProviders,
	NgModule,
	Type,
} from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import {
	MatNativeDateModule,
	MatOptionModule,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';


export const MATERIAL_MODULES = [
	MatTableModule,
	MatDividerModule,
	MatFormFieldModule,
	MatIconModule,
	MatInputModule,
	MatDatepickerModule,
	MatNativeDateModule,
	MatButtonModule,
	MatCheckboxModule,
	MatPaginatorModule,
	MatSidenavModule,
	MatTabsModule,
	MatDialogModule,
	MatSelectModule,
	MatOptionModule,
	MatMenuModule,
	MatProgressSpinnerModule,
	MatSnackBarModule,
	MatAutocompleteModule,
	MatChipsModule,
	MatTooltipModule,
	MatRadioModule,
];

@NgModule({
	imports: MATERIAL_MODULES,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	exports: MATERIAL_MODULES as Array<any | Type<any> | ModuleWithProviders<any>>,
})
export class MaterialModule {}
