import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TaskDto } from '@models/task-dto';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SharedModule } from '@shared/shared.module';
import { TaskService } from '@services/task/task.service';
import { Option } from '@utils/type-util';
import { SnackbarService } from '@services/snackbar/snackbar.service';
import {
	NO_COMPLETED_TASKS,
	TASK_COMPLETED_FAILED_DELETE,
	TASK_COMPLETED_SUCCESS_DELETE,
	TASK_FAILED_ADD,
	TASK_FAILED_DELETE,
	TASK_FAILED_EDIT,
	TASK_SUCCESS_ADD,
	TASK_SUCCESS_DELETE,
	TASK_SUCCESS_EDIT,
	TASK_SUCCESS_EDIT_UNMARK,
} from '@consts/messages.const';
import { FilterType } from '@enums/filter-type.enum';
import { forkJoin } from 'rxjs';

@Component({
	standalone: true,
	imports: [SharedModule],
	selector: 'app-todo-list',
	templateUrl: './todo-list.component.html',
	styleUrls: ['./todo-list.component.less'],
})
export class TodoListComponent {
	@Input() darkMode: boolean = false;
	@Input() mobileView: boolean = false;

	isLoading: boolean = false;
	currentFilter: Option<string> = null;
	tasks: TaskDto[] = [];
	allTasks: TaskDto[] = [];
	formGroup: FormGroup = new FormGroup({});

	filterType: typeof FilterType = FilterType;

	readonly CHECK_ICON: string = 'assets/icons/icon-check.svg';

	private readonly FILTER_KEY: string = 'current-filter';
	private readonly LIGHT_MODE_ICON: string = 'assets/icons/icon-cross-light.svg';
	private readonly DARK_MODE_ICON: string = 'assets/icons/icon-cross-dark.svg';

	constructor(
		private readonly _fb: FormBuilder,
		private readonly _ts: TaskService,
		private readonly _ss: SnackbarService
	) {}

	ngOnInit(): void {
		this._loadTasks();
		this._initForm();
	}

	getProperCloseIcon(): string {
		return this.darkMode ? this.LIGHT_MODE_ICON : this.DARK_MODE_ICON;
	}

	showCloseIcon(task: TaskDto, show: boolean): void {
		task.showCloseIcon = show
	}

	onAddTask(): void {
		if (!this.formGroup) {
			return;
		}

		const taskName = this.formGroup.get('name')?.value;

		if (!taskName) {
			return;
		}

		const newTask: TaskDto = {
			id: Date.now().toString(),
			order: this._generateNextOrder(),
			name: taskName,
			completed: false,
		};

		this._ts.addTask(newTask).subscribe({
			next: () => {
				this.isLoading = true;
				this._loadTasks();
				this._ss.openSuccess(TASK_SUCCESS_ADD);
				this.formGroup.reset();
			},
			error: () => {
				this._ss.openSuccess(TASK_FAILED_ADD);
			},
		});
	}

	onUpdateTask(task: TaskDto): void {
		task.completed = !task.completed;

		this._ts.updateTask(task).subscribe({
			next: () => {
				this._loadTasks();
				this._ts.updateTaskOrder(this.tasks);
				this._ss.openSuccess(task.completed ? TASK_SUCCESS_EDIT : TASK_SUCCESS_EDIT_UNMARK);
			},
			error: () => {
				this._ss.openSuccess(TASK_FAILED_EDIT);
			},
		});
	}

	onDeleteTask(task: TaskDto): void {
		this._ts.deleteTask(task.id).subscribe({
			next: () => {
				this._loadTasks();
				this._ss.openSuccess(TASK_SUCCESS_DELETE);
			},
			error: () => {
				this._ss.openError(TASK_FAILED_DELETE);
			},
		});
	}

	onDropTask(event: CdkDragDrop<TaskDto[]>): void {
		moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);

		for (let index = 0; index < this.tasks.length; index++) {
			this.tasks[index].order = index;
		}

		this._ts.updateTaskOrder(this.tasks);
	}

	showAll(): void {
		this.applyFilter(FilterType.All);
	}

	showActive(): void {
		this.applyFilter(FilterType.Active);
	}

	showCompleted(): void {
		this.applyFilter(FilterType.Completed);
	}

	applyFilter(filter: FilterType | string): void {
		switch (filter) {
			case FilterType.All:
				this.tasks = this.allTasks;
				break;
			case FilterType.Active:
				this.tasks = this.allTasks.filter((task) => !task.completed);
				break;
			case FilterType.Completed:
				this.tasks = this.allTasks.filter((task) => task.completed);
				break;
		}

		this.currentFilter = filter;
		this._saveFilterInStorage(this.currentFilter);
	}

	remainingTasks(): number {
		return this.tasks.length;
	}

	clearCompleted(): void {
		const completedTasks = this.allTasks.filter((task) => task.completed);

		if (!completedTasks.length) {
			this._ss.openSuccess(NO_COMPLETED_TASKS);

			return;
		}

		const deleteObservables = completedTasks.map((task) => this._ts.deleteTask(task.id));

		forkJoin(deleteObservables).subscribe({
			next: () => {
				this.allTasks = this.allTasks.filter((task) => !task.completed);
				this._loadTasks();
				this._ss.openSuccess(TASK_COMPLETED_SUCCESS_DELETE);
			},
			error: () => {
				this._ss.openError(TASK_COMPLETED_FAILED_DELETE);
			},
		});
	}

	private _initForm(): void {
		this.formGroup = this._fb.group({
			name: [''],
		});
	}

	private _loadTasks(): void {
		this.isLoading = true;
		this._ts.getTasks().subscribe((tasks: TaskDto[]) => {
			this.allTasks = tasks;
			this.tasks = tasks;
			this.isLoading = false;

			this._loadFilterFromStorage();
			this._setCloseState();
		});
	}

	private _setCloseState(): void {
		for (const task of this.tasks) {
			task.showCloseIcon = false;
		}
	}

	private _saveFilterInStorage(filter: string): void {
		localStorage.setItem(this.FILTER_KEY, JSON.stringify(filter));
	}

	private _loadFilterFromStorage(): void {
		const storedFilter = localStorage.getItem(this.FILTER_KEY);

		if (storedFilter) {
			this.currentFilter = JSON.parse(storedFilter);

			if (!this.currentFilter) {
				return;
			}

			this.applyFilter(this.currentFilter);
		} else {
			this.currentFilter = FilterType.All;
			this.applyFilter(this.currentFilter);
		}
	}

	private _generateNextOrder(): number {
		return this.tasks.length > 0 ? Math.max(...this.tasks.map((t) => t.order)) + 1 : 0;
	}

	get isAllFilter(): boolean {
		return this.currentFilter === FilterType.All;
	}

	get isActiveFilter(): boolean {
		return this.currentFilter === FilterType.Active;
	}

	get isCompletedFilter(): boolean {
		return this.currentFilter === FilterType.Completed;
	}
}
