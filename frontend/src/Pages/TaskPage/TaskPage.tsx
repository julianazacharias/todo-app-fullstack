import React, { useState, useCallback } from "react";
import { Loader, CircleX } from "lucide-react";
import FilterPanel from "../../Components/Task/FilterPanel";
import TaskModal from "../../Components/Task/TaskModal";
import TaskItem from "../../Components/Task/TaskItem";
import { Task } from "../../Models/Task";
import useFetchTasks from "../../Services/TaskService";
import TaskModalDelete from "../../Components/Task/TaskModalDelete";

const TaskPage: React.FC = () => {
	const [filterPriority, setFilterPriority] = useState<string>("all");
	const [filterDone, setFilterDone] = useState<boolean | null>(false);
	const [showModal, setShowModal] = useState<boolean>(false);
	const [editTask, setEditTask] = useState<Task | null>(null);
	const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
	const [deleteTask, setDeleteTask] = useState<Task | undefined>(undefined);
	const [tasksRefetched, setTasksRefetched] = useState<boolean>(false);

	const { tasks, loading, error } = useFetchTasks(
		filterPriority,
		filterDone,
		tasksRefetched
	);

	const handleOpenModal = (task?: Task) => {
		setEditTask(task || null);
		setShowModal(true);
	};

	const handleOpenDeleteModal = (task: Task) => {
		setDeleteTask(task);
		setShowDeleteModal(true);
	};

	const handleSaveTask = useCallback(() => {
		setTasksRefetched((prev) => !prev);
		setShowModal(false);
		setShowDeleteModal(false);
	}, []);

	return (
		<section className="bg-gray-50 dark:bg-gray-900 text-white">
			<div className="pt-3">
				<FilterPanel
					filterPriority={filterPriority}
					setFilterPriority={setFilterPriority}
					filterDone={filterDone}
					setFilterDone={setFilterDone}
				/>
				<div className="flex justify-between items-center px-6 pb-6 bg-gray-800 rounded-lg">
					<button
						className="bg-blue-600 px-4 py-2 rounded-md text-white hover:bg-blue-700"
						onClick={() => handleOpenModal()}
					>
						New Task
					</button>
				</div>
			</div>
			<div className="h-screen lg:py-0">
				{loading ? (
					<div className="mt-20 w-full flex justify-center">
						<div className="flex flex-col items-center gap-2">
							<Loader className="w-10 h-10 animate-spin text-primary" />
							<h1 className="text-xl font-bold">Loading Tasks...</h1>
							<p>Please wait...</p>
						</div>
					</div>
				) : tasks && tasks.length > 0 ? (
					<div>
						<div className="space-y-0">
							<ul>
								{tasks.map((task) => (
									<li key={task.id}>
										<div className="my-3">
											<TaskItem
												task={task}
												onEdit={handleOpenModal}
												onDelete={handleOpenDeleteModal}
												onToggleDone={handleSaveTask}
											/>
										</div>
									</li>
								))}
							</ul>
						</div>
						{showModal && (
							<TaskModal
								task={editTask}
								onClose={() => setShowModal(false)}
								onSave={handleSaveTask}
							/>
						)}
						{showDeleteModal && deleteTask && (
							<TaskModalDelete
								task={deleteTask}
								onClose={() => setShowDeleteModal(false)}
								onDelete={handleSaveTask}
							/>
						)}
					</div>
				) : tasks && tasks.length == 0 ? (
					<div className="mt-20 w-full flex justify-center">
						<div className="flex flex-col items-center gap-2">
							<h1 className="text-xl font-bold">No Tasks in this filter</h1>
						</div>
					</div>
				) : error ? (
					<div className="mt-20 w-full flex justify-center">
						<div className="flex flex-col items-center gap-2">
							<CircleX className="w-10 h-10 text-primary" />
							<h1 className="text-xl font-bold">Error</h1>
							<p>Something happened, please login again or try later</p>
						</div>
					</div>
				) : (
					<div className="mt-20 w-full flex justify-center">
						<div className="flex flex-col items-center gap-2">
							<h1 className="text-xl font-bold">Please Login again</h1>
						</div>
					</div>
				)}
			</div>
		</section>
	);
};

export default TaskPage;
