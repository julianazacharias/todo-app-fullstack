import React, { useState } from "react";
import Map from "../../Components/Map/Map";
import SearchBox from "../../Components/Map/SearchBox";
import { PositionDetails } from "../../Models/Location";

const MapPage: React.FC = () => {
	const [selectPosition, setSelectPosition] = useState<PositionDetails | null>(
		null
	);

	return (
		<div className="flex w-full h-screen">
			<div className="w-1/2 h-full">
				<Map selectPosition={selectPosition} />
			</div>
			<div className="w-1/2">
				<SearchBox
					selectPosition={selectPosition}
					setSelectPosition={setSelectPosition}
				/>
			</div>
		</div>
	);
};

export default MapPage;
