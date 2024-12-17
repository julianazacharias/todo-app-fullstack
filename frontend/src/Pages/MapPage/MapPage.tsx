import React, { useState } from "react";
import Map from "../../Components/Map/Map";
import SearchBox from "../../Components/Map/SearchBox";
import {
	PositionDetails,
	TaskLocation,
	UserLocation,
} from "../../Models/Location";

const MapPage: React.FC = () => {
	const [selectPosition, setSelectPosition] = useState<PositionDetails | null>(
		null
	);
	const [savedLocation, setSavedLocation] = useState<TaskLocation | null>(null);
	const [savedLiveLocation, setSavedLiveLocation] =
		useState<UserLocation | null>(null);

	return (
		<section className="bg-gray-50 dark:bg-gray-800 text-white">
			<div className="flex w-full h-screen">
				<div className="w-1/2 h-full">
					<Map
						selectPosition={selectPosition}
						currentSavedLocation={savedLocation}
						currentSavedLiveLocation={savedLiveLocation}
					/>
				</div>
				<div className="w-1/2 text-white">
					<SearchBox
						selectPosition={selectPosition}
						setSelectPosition={setSelectPosition}
						setSavedLocation={setSavedLocation}
						setSavedLiveLocation={setSavedLiveLocation}
					/>
				</div>
			</div>
		</section>
	);
};

export default MapPage;
