import axios from "axios";
import { TaskLocation, UserLocation } from "../Models/Location";

const apiUrl = import.meta.env.VITE_API;

export const saveUserLocation = async (
	location: UserLocation | null,
	place_id: number,
	display_name: string,
	lat: number,
	lon: number,
	name: string,
	user_id: number
): Promise<void> => {
	try {
		const requestData = {
			place_id,
			display_name,
			lat,
			lon,
			name,
			user_id,
		};
		if (location) {
			await axios.put<UserLocation>(
				apiUrl + `locations/user/${user_id}`,
				requestData
			);
		} else {
			await axios.post<UserLocation>(apiUrl + "locations/user", requestData);
		}
	} catch (error) {
		console.error("Error saving user location:", error);
		throw new Error("Error saving user location");
	}
};

export const saveTaskLocation = async (
	location: TaskLocation | null,
	place_id: number,
	display_name: string,
	lat: number,
	lon: number,
	name: string,
	task_id: number
): Promise<void> => {
	try {
		const requestData = {
			place_id,
			display_name,
			lat,
			lon,
			name,
		};

		if (location) {
			await axios.put<TaskLocation>(
				`${apiUrl}locations/task/${task_id}`,
				requestData
			);
		} else {
			await axios.post<TaskLocation>(
				`${apiUrl}locations/task?task_id=${task_id}`,
				requestData
			);
		}
	} catch (error) {
		console.error("Error saving task location:", error);
		throw new Error("Error saving task location");
	}
};

export const readUserLocation = async (
	user_id: number
): Promise<UserLocation | null> => {
	try {
		const response = await axios.get<UserLocation>(
			apiUrl + `locations/user/${user_id}`
		);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response?.status === 404) {
			return null;
		}
		console.error("Error getting user location:", error);
		throw new Error("Error getting user location");
	}
};

export const readTaskLocation = async (
	task_id: number
): Promise<TaskLocation | null> => {
	try {
		const response = await axios.get<TaskLocation>(
			apiUrl + `locations/task/${task_id}`
		);

		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response?.status === 404) {
			return null;
		}
		console.error("Error getting task location:", error);
		throw new Error("Error getting task location");
	}
};

export const deleteUserLocation = async (
	userLocation: UserLocation
): Promise<void> => {
	try {
		if (userLocation) {
			await axios.delete(apiUrl + `locations/user/${userLocation.user_id}`);
		}
	} catch (error) {
		console.error("Error deleting user location:", error);
		throw new Error("Error deleting user location");
	}
};

export const deleteTaskLocation = async (
	taskLocation: TaskLocation
): Promise<void> => {
	try {
		if (taskLocation) {
			await axios.delete(apiUrl + `locations/task/${taskLocation.task_id}`);
		}
	} catch (error) {
		console.error("Error deleting task location:", error);
		throw new Error("Error deleting task location");
	}
};
