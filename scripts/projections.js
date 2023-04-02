import { calcSignedAngle } from './math.js';

const { PI, sqrt, sin, cos } = Math;
const deg90 = PI/2;
const deg180 = PI;
const deg360 = PI*2;

const calcNormalDef = ([ lat, lon ]) => [ NaN, NaN ];
const calcCoordDef = ([ nx, ny ]) => [ NaN, NaN ];
const calcNorthDef = ([ lat, lon ]) => NaN;

class Projection {
	constructor({
		name,
		ratio = 1,
		calcNormal = calcNormalDef,
		calcCoord = calcCoordDef,
		calcNorth = calcNorthDef,
	}) {
		this.name = name;
		this.ratio = ratio;
		this.calcNormal = calcNormal;
		this.calcCoord = calcCoord;
		this.calcNorth = calcNorth;
	}
}

export const azimuthalEquidistant = new Projection({
	name: 'Azimuthal equidistant',
	ratio: 1,
	calcNormal: ([ lat, lon ]) => {
		const rad = 0.5 - lat/deg180;
		const nx = sin(lon)*rad;
		const ny = -cos(lon)*rad;
		return [ nx, ny ];
	},
	calcCoord: ([ nx, ny ]) => {
		const rad = sqrt(nx*nx + ny*ny);
		if (rad === 0) return [ deg90, 0 ];
		const lat = deg90 - rad*deg180;
		const lon = calcSignedAngle(-ny, nx);
		return [ lat, lon ];
	},
	calcNorth: ([ _, lon ]) => {
		return (deg360 - lon)%deg360;
	},
});

export const equirectangular = new Projection({
	name: 'Equirectangular',
	ratio: 2,
	calcNormal: ([ lat, lon ]) => [ lon/deg180, lat/deg90 ],
	calcCoord: ([ nx, ny ]) => [ ny*deg90, nx*deg180 ],
	calcNorth: ([ _lat, _lon ]) => 0,
});
