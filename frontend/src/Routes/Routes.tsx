import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import LoginPage from "../Pages/LoginPage/LoginPage";
import RegisterPage from "../Pages/RegisterPage/RegisterPage";
import ProtectedRoute from "./ProtectedRoute";
import HomePage from "../Pages/HomePage/HomePage";
import TaskPage from "../Pages/TaskPage/TaskPage";
import MapPage from "../Pages/MapPage/MapPage";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{ path: "", element: <HomePage /> },
			{ path: "/register", element: <RegisterPage /> },
			{ path: "/login", element: <LoginPage /> },
			{
				path: "/tasks",
				element: (
					<ProtectedRoute>
						<TaskPage />
					</ProtectedRoute>
				),
			},
			{
				path: "/tasks/map/:taskId",
				element: (
					<ProtectedRoute>
						<MapPage />
					</ProtectedRoute>
				),
			},
		],
	},
]);
