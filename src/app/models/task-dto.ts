export interface TaskDto {
	id: string;
	order: number;
	name: string;
	completed: boolean;
	showCloseIcon?: boolean;
}
