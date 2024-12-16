import { useState, useEffect } from "react";
import axios from "axios";
import { Task, TaskList, TaskPriority } from "../Models/Task";

const apiUrl = import.meta.env.VITE_API;

const useFetchTasks = (
	filterPriority: string,
	filterDone: boolean | null,
	refetchFlag: boolean
) => {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const fetchTasks = async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await axios.get<TaskList>(apiUrl + "tasks/", {
				params: {
					priority: filterPriority !== "all" ? filterPriority : undefined,
					done: filterDone !== null ? filterDone : undefined,
				},
			});
			setTasks(response.data.tasks);
		} catch (error) {
			console.error("Error fetching tasks:", error);
			setError("Error fetching tasks");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchTasks();
	}, [filterPriority, filterDone, refetchFlag]);

	return { tasks, loading, error };
};

export default useFetchTasks;

export const saveTask = async (
	task: Task | null,
	title: string,
	description: string,
	priority: TaskPriority,
	done: boolean,
	user_id: number
): Promise<void> => {
	try {
		const requestData = {
			title,
			description,
			priority,
			done,
			user_id,
		};
		if (task) {
			// Update a task
			await axios.patch<Task>(apiUrl + `tasks/${task.id}`, requestData);
		} else {
			// Create a new task
			await axios.post<Task>(apiUrl + "tasks/", requestData);
		}
	} catch (error) {
		console.error("Error saving task:", error);
		throw new Error("Error saving task");
	}
};

export const toggleDone = async (task: Task): Promise<void> => {
	try {
		if (task) {
			// Mark as done/not done
			await axios.patch<Task>(apiUrl + `tasks/done/${task.id}`);
		}
	} catch (error) {
		console.error("Error saving task:", error);
		throw new Error("Error saving task");
	}
};

export const deleteTask = async (task: Task): Promise<void> => {
	try {
		if (task) {
			// Deactivate a task
			await axios.patch<Task>(apiUrl + `tasks/deactivate/${task.id}`);
		}
	} catch (error) {
		console.error("Error deleting task:", error);
		throw new Error("Error deleting task");
	}
};
