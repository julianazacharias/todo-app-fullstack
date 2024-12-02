export type TaskPriority = "low" | "medium" | "high";

export interface Task {
	id: number;
	title: string;
	description: string;
	done: boolean;
	priority: TaskPriority;
	user_id: number;
}

export interface TaskList {
	tasks: Task[];
}
