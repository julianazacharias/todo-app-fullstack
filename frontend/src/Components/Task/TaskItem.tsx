import React from "react";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa";
import { Task } from "../../Models/Task";
import { useAuth } from "../../Context/useAuth";
import { toggleDone } from "../../Services/TaskService";
import { toast } from "react-toastify";

interface TaskItemProps {
	task: Task;
	onEdit: (task?: Task) => void;
	onDelete: (task: Task) => void;
	onToggleDone: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
	task,
	onEdit,
	onDelete,
	onToggleDone,
}) => {
	const { user } = useAuth();

	const handleToggleDone = async () => {
		if (!user || user.id === undefined) {
			console.error("User ID is not available");
			toast.error("Please, login to continue");
			return;
		}

		try {
			await toggleDone(task);
			onToggleDone(); // Callback to notify parent component after saving
		} catch (error) {
			console.error("Error saving task:", error);
		}
	};

	return (
		<div className="flex justify-between items-center p-4 bg-gray-800 rounded-lg">
			<div className="flex space-x-4 items-center">
				<div className="text-2xl cursor-pointer" onClick={handleToggleDone}>
					{task.done ? (
						<FaCheckCircle className="text-green-500" />
					) : (
						<FaRegCircle className="text-gray-500" />
					)}
				</div>
				<div>
					<h3 className="font-bold text-lg">{task.title}</h3>
					<p className="text-sm py-1 text-gray-400">{task.description}</p>
				</div>
			</div>
			<div className="flex items-center space-x-3">
				<span
					className={`text-xs px-3 py-1 mx-2 rounded-full ${
						task.priority === "high"
							? "bg-red-600 text-white"
							: task.priority === "medium"
							? "bg-yellow-600 text-white"
							: "bg-green-600 text-white"
					}`}
				>
					{task.priority}
				</span>
				<button
					className="bg-cyan-500 text-white px-3 py-1 rounded-md hover:bg-cyan-600"
					onClick={() => onEdit(task)}
				>
					Edit
				</button>
				<button
					className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
					onClick={() => onDelete(task)}
				>
					Delete
				</button>
			</div>
		</div>
	);
};

export default TaskItem;
