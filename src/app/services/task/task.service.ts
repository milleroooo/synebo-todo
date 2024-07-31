import { Injectable } from '@angular/core';
import { AngularFirestore, QuerySnapshot } from '@angular/fire/compat/firestore';
import { TaskDto } from '@models/task-dto';
import { from, map, Observable, of } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class TaskService {
	constructor(private readonly _afs: AngularFirestore) {}

	getTasks(): Observable<TaskDto[]> {
		return this._afs
			.collection<TaskDto>('/tasks', (ref) => ref.orderBy('order'))
			.get()
			.pipe(
				map((data: QuerySnapshot<TaskDto>) => {
					return data.docs.map((doc) => {
						const data = doc.data();

						return { ...data, id: doc.id };
					});
				})
			);
	}

	addTask(task: TaskDto): Observable<void> {
		return from(
			this._afs
				.collection('/tasks')
				.add(task)
				.then(() => {})
		);
	}

	updateTask(task: TaskDto): Observable<void> {
		return from(this._afs.collection('/tasks').doc(task.id).update(task));
	}

	deleteTask(taskId: string): Observable<void> {
		return from(this._afs.collection('/tasks').doc(taskId).delete());
	}

	updateTaskOrder(tasks: TaskDto[]): Observable<void> {
		const batch = this._afs.firestore.batch();

		for (const task of tasks) {
			if (!task.id) {
				return of();
			}

			const taskRef = this._afs.collection('/tasks').doc(task.id).ref;

			batch.update(taskRef, { order: task.order });
		}

		return from(batch.commit());
	}
}
