/**
 * Represents a hospital with various properties.
 */
export interface Hospital {
	id: number;
	name: string;
	code: string;
	district: string;
	type: string;
	lvl: string;
	address: string;
	zipCode: string;
	introduction: string;
	lng: number;
	lat: number;
}
