import React, { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngTuple } from "leaflet";
import { PositionLatLon } from "../../Models/Location";

interface MapProps {
	selectPosition: PositionLatLon | null;
}

// Create the custom icon
const icon = L.icon({
	iconUrl: "/placeholder.png",
	iconSize: [38, 38],
});

const defaultPosition: LatLngTuple = [51.505, -0.09];

const ResetCenterView: React.FC<{ selectPosition: PositionLatLon | null }> = ({
	selectPosition,
}) => {
	const map = useMap();

	useEffect(() => {
		if (selectPosition) {
			map.setView(
				L.latLng(selectPosition.lat, selectPosition.lon),
				map.getZoom(),
				{
					animate: true,
				}
			);
		}
	}, [selectPosition, map]);

	return null;
};

// Main Map component
const Map: React.FC<MapProps> = ({ selectPosition }) => {
	const locationSelection: LatLngTuple = selectPosition
		? [selectPosition.lat, selectPosition.lon]
		: defaultPosition;

	return (
		<MapContainer center={defaultPosition} zoom={13} className="w-full h-full">
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=yCYvdMB2eYnNBRgsoCrG"
			/>
			{selectPosition && (
				<Marker position={locationSelection} icon={icon}>
					<Popup>
						A pretty CSS3 popup. <br /> Easily customizable. Trazer nome,
						endereço, [Lat + Lon]
					</Popup>
				</Marker>
			)}
			<ResetCenterView selectPosition={selectPosition} />
		</MapContainer>
	);
};

export default Map;
