import React from "react";

interface FilterPanelProps {
	filterPriority: string;
	setFilterPriority: React.Dispatch<React.SetStateAction<string>>;
	filterDone: boolean | null;
	setFilterDone: React.Dispatch<React.SetStateAction<boolean | null>>;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
	filterPriority,
	setFilterPriority,
	filterDone,
	setFilterDone,
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
			</div>
		</div>
	);
};

export default FilterPanel;
