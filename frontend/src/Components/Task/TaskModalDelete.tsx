import React from "react";
import { Task } from "../../Models/Task";
import { deleteTask } from "../../Services/TaskService";
import { useAuth } from "../../Context/useAuth";
import { toast } from "react-toastify";

interface ModalDeleteProps {
	task: Task;
	onClose: () => void;
	onDelete: () => void;
}

const TaskModalDelete: React.FC<ModalDeleteProps> = ({
	task,
	onClose,
	onDelete,
}) => {
	const { user } = useAuth();

	const handleDelete = async () => {
		if (!user || user.id === undefined) {
			console.error("User ID is not available");
			toast.error("Please, login to continue");
			return;
		}

		try {
			await deleteTask(task);
			onDelete(); // Callback to notify parent component after saving
		} catch (error) {
			console.error("Error saving task:", error);
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
			<div className="bg-gray-800 p-6 rounded-lg w-96 space-y-4">
				<h2 className="text-2xl font-bold text-white">Delete Task</h2>

				<div className="flex items-center space-x-5 py-2">
					<h3>Are you sure you want to delete this task?</h3>
				</div>

				<div className="flex justify-end space-x-4 mt-4">
					<button
						onClick={onClose}
						className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
					>
						Cancel
					</button>
					<button
						onClick={handleDelete}
						className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	);
};

export default TaskModalDelete;
