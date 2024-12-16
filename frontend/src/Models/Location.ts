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

export interface PositionNameAdress {
	display_name: string;
}

export interface TaskLocation {
	id: number;
	place_id: number;
	display_name: string;
	name: string;
	lat: number;
	lon: number;
	geom: {};
	task_id: number;
}

export interface UserLocation {
	id: number;
	place_id: number;
	display_name: string;
	name: string;
	lat: number;
	lon: number;
	geom: {};
	user_id: number;
}
