import React from "react";

import { FaLocationDot } from "react-icons/fa6";
import { UserLocation } from "../../Models/Location";

interface FilterPanelProps {
	filterPriority: string;
	setFilterPriority: React.Dispatch<React.SetStateAction<string>>;
	filterDone: boolean | null;
	setFilterDone: React.Dispatch<React.SetStateAction<boolean | null>>;
	currentSavedLiveLocation: UserLocation | null;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
	filterPriority,
	setFilterPriority,
	filterDone,
	setFilterDone,
	currentSavedLiveLocation,
}) => {
	return (
		<div className="flex justify-between items-center p-6 bg-gray-800 rounded-lg">
			<div className="flex items-center space-x-4">
				<select
					className="bg-gray-700 text-white px-3 py-2 rounded"
					value={filterPriority}
					onChange={(e) => setFilterPriority(e.target.value)}
				>
					<option value="all">Priority</option>
					<option value="high">High</option>
					<option value="medium">Medium</option>
					<option value="low">Low</option>
				</select>
				<div className="flex space-x-2">
					<button
						className={`px-4 py-2 rounded ${
							filterDone === false
								? "bg-red-600"
								: "bg-gray-600 hover:bg-red-700"
						}`}
						onClick={() => setFilterDone(false)}
					>
						To do
					</button>
					<button
						className={`px-4 py-2 rounded ${
							filterDone === true
								? "bg-green-600"
								: "bg-gray-600 hover:bg-green-700"
						}`}
						onClick={() => setFilterDone(true)}
					>
						Done
					</button>
				</div>
				<div className="flex justify-center items-center space-x-3">
					{" "}
					<button>
						<FaLocationDot className="text-4xl text-orange-500 hover:text-orange-600 transition-transform duration-300 ease-in-out transform hover:scale-110" />
					</button>
					<div>
						<h3>
							Current Location: {currentSavedLiveLocation?.lat}{" "}
							{currentSavedLiveLocation?.lon}
						</h3>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FilterPanel;
