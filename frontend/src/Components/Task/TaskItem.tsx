import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { Task } from "../../Models/Task";
import { useAuth } from "../../Context/useAuth";
import { toggleDone } from "../../Services/TaskService";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { readTaskLocation } from "../../Services/LocationService"; // Import readTaskLocation

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
	const { user, isLoggedIn } = useAuth();
	const [locationName, setLocationName] = useState<string | null>(null);

	useEffect(() => {
		if (!isLoggedIn) {
			toast.error("Session expired, please login again to continue");
		}
		const fetchLocationName = async () => {
			try {
				const location = await readTaskLocation(task.id);
				setLocationName(location?.name || "No location set");
			} catch (error) {
				console.error("Error fetching location:", error);
				setLocationName("Error loading location");
			}
		};

		if (task.id) {
			fetchLocationName();
		}
	}, [task.id]);

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
				<div className="flex items-center space-x-3 px-4">
					<Link to={`/tasks/map/${task.id}`}>
						<FaLocationDot className="text-3xl text-orange-500 hover:text-orange-600 transition-transform duration-300 ease-in-out transform hover:scale-110" />
					</Link>
					<p className="text-sm text-gray-400 italic">
						{locationName || "Loading..."}
					</p>
				</div>

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
