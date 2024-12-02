import React, { useState, useEffect } from "react";
import { Task, TaskPriority } from "../../Models/Task";
import { saveTask } from "../../Services/TaskService";
import { useAuth } from "../../Context/useAuth";
import { toast } from "react-toastify";

interface ModalProps {
	task: Task | null;
	onClose: () => void;
	onSave: () => void;
}

const TaskModal: React.FC<ModalProps> = ({ task, onClose, onSave }) => {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [priority, setPriority] = useState<TaskPriority>("medium");
	const [done, setDone] = useState(false);

	const { user } = useAuth();

	useEffect(() => {
		if (task) {
			setTitle(task.title);
			setDescription(task.description);
			setPriority(task.priority);
			setDone(task.done);
		}
	}, [task]);

	const handleSave = async () => {
		if (!user || user.id === undefined) {
			console.error("User ID is not available");
			toast.error("User ID is not available");
			return;
		}

		try {
			await saveTask(task, title, description, priority, done, user?.id);
			onSave(); // Callback to notify parent component after saving
		} catch (error) {
			console.error("Error saving task:", error);
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
			<div className="bg-gray-800 p-6 rounded-lg w-96 space-y-4">
				<h2 className="text-2xl font-bold text-white">
					{task ? "Edit Task" : "New Task"}
				</h2>

				<div className="space-y-2">
					<label htmlFor="title" className="text-sm text-gray-300">
						Title
					</label>
					<input
						type="text"
						id="title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className="w-full p-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Enter task title"
					/>
				</div>

				<div className="space-y-2">
					<label htmlFor="description" className="text-sm text-gray-300">
						Description
					</label>
					<textarea
						id="description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						className="w-full p-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Enter task description"
					/>
				</div>

				<div className="space-y-2">
					<label htmlFor="priority" className="text-sm text-gray-300">
						Priority
					</label>
					<select
						id="priority"
						value={priority}
						onChange={(e) => setPriority(e.target.value as TaskPriority)}
						className="w-full p-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="low">Low</option>
						<option value="medium">Medium</option>
						<option value="high">High</option>
					</select>
				</div>

				<div className="flex items-center space-x-5 py-2">
					<label htmlFor="done" className="text-sm text-gray-300">
						Status
					</label>
					<button
						onClick={() => setDone(!done)}
						className={`px-4 py-2 rounded-md ${
							done ? "bg-green-600" : "bg-red-600"
						} text-white`}
					>
						{done ? "Done" : "To do"}
					</button>
				</div>

				<div className="flex justify-end space-x-4 mt-4">
					<button
						onClick={onClose}
						className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
					>
						Cancel
					</button>
					<button
						onClick={handleSave}
						className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
					>
						Save
					</button>
				</div>
			</div>
		</div>
	);
};

export default TaskModal;
