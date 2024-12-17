import React, { useState, useEffect } from "react";
import axios from "axios";
import {
	OutlinedInput,
	ListItemIcon,
	List,
	ListItemText,
	Divider,
	ListItemButton,
} from "@mui/material";
import {
	PositionDetails,
	PositionDetailsOSM,
	PositionLatLon,
	TaskLocation,
	UserLocation,
} from "../../Models/Location";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
	readTaskLocation,
	saveTaskLocation,
	deleteTaskLocation,
	saveUserLocation,
	readUserLocation,
} from "../../Services/LocationService";
import { toast } from "react-toastify";
import { useAuth } from "../../Context/useAuth";

const nominatimUrl = import.meta.env.VITE_NOMINATIM_BASE_URL;

interface SearchBoxProps {
	selectPosition: PositionDetails | null;
	setSelectPosition: (position: PositionDetails | null) => void;
	setSavedLocation: (location: TaskLocation | null) => void;
	setSavedLiveLocation: (location: UserLocation | null) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({
	selectPosition,
	setSelectPosition,
	setSavedLocation,
	setSavedLiveLocation,
}) => {
	const [searchText, setSearchText] = useState<string>("");
	const [listPlace, setListPlace] = useState<PositionDetailsOSM[]>([]);
	const [existingLocationData, setExistingLocationData] =
		useState<TaskLocation | null>(null);
	const { taskId } = useParams<{ taskId: string }>();
	const [liveLocationLatLon, setLiveLocationLatLon] =
		useState<PositionLatLon | null>(null);
	const { user, isLoggedIn } = useAuth();
	const navigate = useNavigate();

	// Fetch the user's live location using Geolocation API

	useEffect(() => {
		if (!("geolocation" in navigator)) {
			toast.error("Geolocation is not supported by your browser.");
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(position) => {
				const { latitude, longitude } = position.coords;

				setLiveLocationLatLon({
					lat: latitude,
					lon: longitude,
				});
			},
			(error) => {
				console.error("Geolocation error:", error);
				toast.error("Failed to fetch live location.");
			}
		);
	}, []);

	useEffect(() => {
		if (!liveLocationLatLon || !user?.id) return;

		if (!isLoggedIn) {
			toast.error("Session expired, please login again to continue");
		}

		const fetchAndSaveLocation = async () => {
			try {
				const existingLocation = await readUserLocation(user.id);

				if (existingLocation) {
					setSavedLiveLocation(existingLocation);
				}

				await saveUserLocation(
					existingLocation,
					0,
					`Latitude: ${liveLocationLatLon.lat}, Longitude: ${liveLocationLatLon.lon}`,
					liveLocationLatLon.lat,
					liveLocationLatLon.lon,
					"Live Location",
					user.id
				);

				const updatedLocation = await readUserLocation(user.id);
				setSavedLiveLocation(updatedLocation);
				toast.success("Live location saved successfully!");
			} catch (error) {
				console.error("Failed to save or fetch location:", error);
				toast.error("Failed to save location.");
			}
		};

		fetchAndSaveLocation();
	}, [liveLocationLatLon, user?.id]);

	useEffect(() => {
		if (!isLoggedIn) {
			toast.error("Session expired, please login again to continue");
		}
		const fetchExistingLocation = async () => {
			const taskIdNumber = parseInt(taskId || "0", 10);
			if (isNaN(taskIdNumber)) {
				console.error("Invalid task ID");
				return;
			}

			try {
				const location = await readTaskLocation(taskIdNumber);
				setExistingLocationData(location);
				setSavedLocation(location);
			} catch (error) {
				console.error("Failed to fetch task location:", error);
				toast.error("Failed to fetch task location");
			}
		};

		fetchExistingLocation();
	}, [taskId, setSavedLocation]);

	const handleSearch = () => {
		const params = {
			q: searchText,
			format: "jsonv2",
			addressdetails: "addressdetails",
		};
		const queryString = new URLSearchParams(params).toString();

		axios
			.get(`${nominatimUrl}${queryString}`)
			.then((response) => {
				setListPlace(response.data);
			})
			.catch((err) => {
				console.error("Error:", err);
			});
	};

	const handleSaveTaskLocation = async () => {
		if (!selectPosition) {
			console.error("No position selected");
			toast.error("Please, select a location");
			return;
		}

		const taskIdNumber = parseInt(taskId || "0", 10);
		if (isNaN(taskIdNumber)) {
			console.error("Invalid task ID");
			toast.error("Invalid task ID");
			return;
		}

		try {
			await saveTaskLocation(
				existingLocationData,
				selectPosition.place_id,
				selectPosition.display_name,
				selectPosition.lat,
				selectPosition.lon,
				selectPosition.name,
				taskIdNumber
			);

			const updatedLocation = await readTaskLocation(taskIdNumber);
			setExistingLocationData(updatedLocation);
			setSavedLocation(updatedLocation);
			toast.success("Location saved successfully!");
		} catch (error) {
			console.error("Failed to save location:", error);
			toast.error("Failed to save location");
		}
	};

	const handleRemoveTaskLocation = async () => {
		if (!existingLocationData) {
			console.error("No existing location to remove");
			return;
		}
		try {
			await deleteTaskLocation(existingLocationData);
			console.log("Location deleted successfully");
			setExistingLocationData(null);
			setSavedLocation(null);
			navigate("/tasks");
			toast.success("Location removed successfully!");
		} catch (error) {
			console.error("Failed to remove location:", error);
			toast.error("Failed to remove location");
		}
	};

	return (
		<div className="flex flex-col">
			<div className="flex">
				<div className="flex-1 p-4">
					<OutlinedInput
						className="w-full"
						value={searchText}
						onChange={(event) => {
							setSearchText(event.target.value);
						}}
					/>
				</div>
				<div className="flex items-center px-4">
					<button
						className="bg-violet-500 text-white px-5 py-2 rounded-md hover:bg-violet-600"
						onClick={handleSearch}
					>
						Search
					</button>
				</div>
			</div>

			{liveLocationLatLon && (
				<div className="p-4 m-4 border border-gray-500 rounded-md bg-gray-700">
					<div className="flex items-center space-x-3 mb-3">
						<img
							src="/green_placeholder.png"
							alt="Placeholder"
							className="w-7 h-7"
						/>
						<h3 className="text-lg font-bold">Your live location</h3>
					</div>
					<p>
						<strong>Latitude:</strong> {liveLocationLatLon?.lat}
					</p>
					<p>
						<strong>Longitude:</strong> {liveLocationLatLon?.lon}
					</p>
				</div>
			)}

			{/* Display Existing Location */}
			{existingLocationData && (
				<div className="p-4 m-4 border border-gray-500 rounded-md bg-gray-700">
					<div className="flex items-center space-x-3 mb-3">
						<img
							src="/purple_placeholder.png"
							alt="Placeholder"
							className="w-7 h-7"
						/>
						<h3 className="text-lg font-bold">Task location</h3>
					</div>

					<p>
						<strong>Name:</strong> {existingLocationData.name}
					</p>
					<p>
						<strong>Address:</strong> {existingLocationData.display_name}
					</p>
					<p>
						<strong>Latitude:</strong> {existingLocationData.lat}
					</p>
					<p>
						<strong>Longitude:</strong> {existingLocationData.lon}
					</p>
				</div>
			)}

			<div className="flex flex-wrap justify-center md:justify-end space-x-0 space-y-4 md:space-x-4 md:space-y-0 m-4">
				<div>
					<Link
						className="bg-yellow-500 text-white px-4 py-2 md:px-5 md:py-2 rounded-md text-sm md:text-base hover:bg-yellow-600 flex justify-center items-center w-full md:w-auto"
						to="/tasks"
					>
						Back to Tasks
					</Link>
				</div>
				<div>
					<button
						className="bg-slate-500 text-white px-4 py-2 md:px-5 md:py-2 rounded-md text-sm md:text-base hover:bg-slate-600 flex justify-center items-center w-full md:w-auto"
						onClick={() => {
							setSelectPosition(null);
							setListPlace([]);
							setSearchText("");
						}}
					>
						Clear Search
					</button>
				</div>
				<div>
					<button
						className="bg-red-600 text-white px-4 py-2 md:px-5 md:py-2 rounded-md text-sm md:text-base hover:bg-red-700 flex justify-center items-center w-full md:w-auto"
						onClick={handleRemoveTaskLocation}
					>
						Remove Location
					</button>
				</div>
				<div>
					<button
						className="bg-blue-500 text-white px-4 py-2 md:px-5 md:py-2 rounded-md text-sm md:text-base hover:bg-blue-600 flex justify-center items-center w-full md:w-auto"
						onClick={handleSaveTaskLocation}
					>
						Save Location
					</button>
				</div>
			</div>
			<div>
				<List component="nav" aria-label="main mailbox folders">
					{listPlace.map((item) => (
						<div key={item.place_id}>
							<Divider />
							<ListItemButton
								onClick={() => {
									const selectedPosition = {
										place_id: item.place_id,
										name: item.name,
										display_name: item.display_name,
										lat: parseFloat(item.lat),
										lon: parseFloat(item.lon),
									};
									setSelectPosition(selectedPosition);
								}}
								style={{
									backgroundColor:
										selectPosition?.place_id === item.place_id
											? "#8b5cf6"
											: "transparent",
									color:
										selectPosition?.place_id === item.place_id
											? "#ffffff"
											: "inherit",
								}}
							>
								<ListItemIcon>
									<img
										src="/red_placeholder.png"
										alt="Placeholder"
										className="w-9 h-9"
									/>
								</ListItemIcon>
								<ListItemText primary={item.display_name} />
							</ListItemButton>
							<Divider />
						</div>
					))}
				</List>
			</div>
		</div>
	);
};

export default SearchBox;
