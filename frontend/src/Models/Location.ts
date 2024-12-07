export interface PositionDetailsOSM {
	place_id: number;
	display_name: string;
	lat: string;
	lon: string;
	name: string;
}

export interface PositionDetails {
	place_id: number;
	display_name: string;
	lat: number;
	lon: number;
	name: string;
}

export interface PositionLatLon {
	lat: number;
	lon: number;
}
