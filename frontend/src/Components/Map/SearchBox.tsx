import React, { useState } from "react";
import axios from "axios";
import {
	OutlinedInput,
	ListItemIcon,
	Button,
	List,
	ListItemText,
	Divider,
	ListItemButton,
} from "@mui/material";

import { PositionDetails, PositionDetailsOSM } from "../../Models/Location";

interface SearchBoxProps {
	selectPosition: PositionDetails | null;
	setSelectPosition: (position: PositionDetails | null) => void;
}

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";

const SearchBox: React.FC<SearchBoxProps> = ({
	selectPosition,
	setSelectPosition,
}) => {
	const [searchText, setSearchText] = useState<string>("");
	const [listPlace, setListPlace] = useState<PositionDetailsOSM[]>([]);

	// Handle search button click
	const handleSearch = () => {
		const params = {
			q: searchText,
			format: "jsonv2",
			addressdetails: "1",
			limit: "1",
		};
		const queryString = new URLSearchParams(params).toString();

		axios
			.get(`${NOMINATIM_BASE_URL}${queryString}`)
			.then((response) => {
				setListPlace(response.data);
			})
			.catch((err) => {
				console.error("Error:", err);
			});
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
					<Button variant="contained" color="primary" onClick={handleSearch}>
						Search
					</Button>
				</div>
			</div>
			<div>
				<List component="nav" aria-label="main mailbox folders">
					{listPlace.map((item) => (
						<div key={item.place_id}>
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
							>
								<ListItemIcon>
									<img
										src="/placeholder.png"
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
