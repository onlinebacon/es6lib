import { calcSignedAngle } from './math.js';

const { sin, cos, asin } = Math;

export const coordToVec = ([ lat, lon ], dst = new Array(3)) => {
	const coslat = cos(lat);
	dst[0] = sin(lon)*coslat;
	dst[1] = sin(lat);
	dst[2] = cos(lon)*coslat;
	return dst;
};

export const vecToCoord = ([ x, y, z ], dst = new Array(2)) => {
	dst[0] = asin(y);
	dst[1] = calcSignedAngle(z, x);
	return dst;
};
