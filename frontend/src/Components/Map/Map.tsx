import React, { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngTuple } from "leaflet";
import {
	PositionLatLon,
	TaskLocation,
	UserLocation,
} from "../../Models/Location";

const mapUrl = import.meta.env.VITE_MAP_URL;

const icon = L.icon({
	iconUrl: "/red_placeholder.png",
	iconSize: [52, 52],
});

const savedIcon = L.icon({
	iconUrl: "/purple_placeholder.png",
	iconSize: [52, 52],
});

const LiveIcon = L.icon({
	iconUrl: "/green_placeholder.png",
	iconSize: [52, 52],
});

const defaultPosition: LatLngTuple = [-25.441105, -49.276855]; // Curitiba
// const defaultPosition: LatLngTuple = [-23.5489, -46.6388]; //São Paulo

const ResetCenterView: React.FC<{ selectPosition: LatLngTuple }> = ({
	selectPosition,
}) => {
	const map = useMap();

	useEffect(() => {
		map.setView(selectPosition, map.getZoom(), { animate: true });
	}, [selectPosition, map]);

	return null;
};

const Map: React.FC<{
	selectPosition: PositionLatLon | null;
	currentSavedLocation: TaskLocation | null;
	currentSavedLiveLocation: UserLocation | null;
}> = ({ selectPosition, currentSavedLocation, currentSavedLiveLocation }) => {
	const locationSelection: LatLngTuple = selectPosition
		? [selectPosition.lat, selectPosition.lon]
		: defaultPosition;

	const savedLocationSelection: LatLngTuple = currentSavedLocation
		? [currentSavedLocation.lat, currentSavedLocation.lon]
		: defaultPosition;

	const savedLiveLocationSelection: LatLngTuple = currentSavedLiveLocation
		? [currentSavedLiveLocation.lat, currentSavedLiveLocation.lon]
		: defaultPosition;

	return (
		<MapContainer
			center={locationSelection}
			zoom={13}
			className="w-full h-full"
		>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url={mapUrl}
			/>
			{selectPosition && (
				<Marker position={locationSelection} icon={icon}>
					<Popup>
						Selected Location <br /> {selectPosition.lat}, {selectPosition.lon}
					</Popup>
				</Marker>
			)}

			{currentSavedLocation && (
				<Marker position={savedLocationSelection} icon={savedIcon}>
					<Popup>
						{currentSavedLocation.display_name} <br />
						Lat: {currentSavedLocation.lat}, Lon: {currentSavedLocation.lon}
					</Popup>
				</Marker>
			)}

			{currentSavedLiveLocation && (
				<Marker position={savedLiveLocationSelection} icon={LiveIcon}>
					<Popup>
						{currentSavedLiveLocation.display_name} <br />
						Lat: {currentSavedLiveLocation.lat}, Lon:
						{currentSavedLiveLocation.lon}
						{currentSavedLiveLocation.lon}
					</Popup>
				</Marker>
			)}

			<ResetCenterView selectPosition={savedLocationSelection} />
		</MapContainer>
	);
};

export default Map;
