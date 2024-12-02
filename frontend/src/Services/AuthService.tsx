import axios from "axios";
import { UserProfileToken } from "../Models/User";
import { handleError } from "../Helpers/ErrorHandler";

const api = "http://localhost:8000/";

export const loginAPI = async (username: string, password: string) => {
	try {
		const response = await axios.post<UserProfileToken>(
			api + "auth/login",
			new URLSearchParams({
				username,
				password,
			}),
			{
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			}
		);
		return response;
	} catch (error) {
		handleError(error);
	}
};

export const registerAPI = async (
	email: string,
	username: string,
	password: string
) => {
	try {
		// Step 1: Register the user
		await axios.post<UserProfileToken>(api + "users", {
			email: email,
			username: username,
			password: password,
		});

		// Step 2: Login the user after successful registration
		const loginResponse = await axios.post<UserProfileToken>(
			api + "auth/login",
			new URLSearchParams({
				email: username,
				password: password,
			}),
			{
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			}
		);

		return loginResponse;
	} catch (error) {
		handleError(error);
	}
};
