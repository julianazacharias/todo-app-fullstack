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
	TaskLocation,
} from "../../Models/Location";
import { Link, useParams } from "react-router-dom";
import {
	readTaskLocation,
	saveTaskLocation,
	deleteTaskLocation,
} from "../../Services/LocationService";
import { toast } from "react-toastify";

const nominatimUrl = import.meta.env.VITE_NOMINATIM_BASE_URL;

interface SearchBoxProps {
	selectPosition: PositionDetails | null;
	setSelectPosition: (position: PositionDetails | null) => void;
	setSavedLocation: (location: TaskLocation | null) => void; // Added setter for savedLocation
}

const SearchBox: React.FC<SearchBoxProps> = ({
	selectPosition,
	setSelectPosition,
	setSavedLocation,
}) => {
	const [searchText, setSearchText] = useState<string>("");
	const [listPlace, setListPlace] = useState<PositionDetailsOSM[]>([]);
	const [existingLocationData, setExistingLocationData] =
		useState<TaskLocation | null>(null);
	const { taskId } = useParams<{ taskId: string }>();

	// Fetch the existing location for the task on component mount or when taskId changes
	useEffect(() => {
		const fetchExistingLocation = async () => {
			const taskIdNumber = parseInt(taskId || "0", 10);
			if (isNaN(taskIdNumber)) {
				console.error("Invalid task ID");
				return;
			}

			try {
				const location = await readTaskLocation(taskIdNumber);
				setExistingLocationData(location);
				setSavedLocation(location); // Set the saved location for the map
			} catch (error) {
				console.error("Failed to fetch existing location:", error);
			}
		};

		fetchExistingLocation();
	}, [taskId, setSavedLocation]);

	// Handle search input and fetch places from Nominatim API
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

	// Handle saving the selected location
	const handleSaveLocation = async () => {
		if (!selectPosition) {
			console.error("No position selected");
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
			setSavedLocation(updatedLocation); // Update map with new saved location
			toast.success("Location saved successfully!");
		} catch (error) {
			console.error("Failed to save location:", error);
			toast.error("Failed to save location");
		}
	};

	const handleRemoveLocation = async () => {
		if (!existingLocationData) {
			console.error("No existing location to remove");
			return;
		}
		try {
			await deleteTaskLocation(existingLocationData);
			console.log("Location deleted successfully");
			setExistingLocationData(null);
			setSavedLocation(null); // Remove saved location from map
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

			{/* Display Existing Location */}
			{existingLocationData && (
				<div className="p-4 m-4 border border-gray-300 rounded-md bg-gray-100">
					<h3 className="text-lg font-bold mb-2">
						Saved location in this task
					</h3>
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
						onClick={() => setSelectPosition(null)}
					>
						Cancel
					</button>
				</div>
				<div>
					<button
						className="bg-red-600 text-white px-4 py-2 md:px-5 md:py-2 rounded-md text-sm md:text-base hover:bg-red-700 flex justify-center items-center w-full md:w-auto"
						onClick={handleRemoveLocation}
					>
						Remove Location
					</button>
				</div>
				<div>
					<button
						className="bg-blue-500 text-white px-4 py-2 md:px-5 md:py-2 rounded-md text-sm md:text-base hover:bg-blue-600 flex justify-center items-center w-full md:w-auto"
						onClick={handleSaveLocation}
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
