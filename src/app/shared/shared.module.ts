import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@material/material.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AngularFireModule, FIREBASE_OPTIONS } from '@angular/fire/compat';
import { environment } from '@env/environment';
import { TaskService } from '@services/task/task.service';

const SHARED_MODULES = [
	CommonModule,
	MaterialModule,
	RouterModule,
	ReactiveFormsModule,
	FormsModule,
	DragDropModule,
	AngularFireModule.initializeApp(environment.firebase),
];

@NgModule({
	imports: SHARED_MODULES,
	exports: [SHARED_MODULES],
	providers: [TaskService, { provide: FIREBASE_OPTIONS, useValue: environment.firebase }],
})
export class SharedModule {}
