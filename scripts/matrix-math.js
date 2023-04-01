export const sinCosRotXVec3 = ([ x, y, z ], sin, cos, dst) => {
	dst[0] = x;
	dst[1] = y*cos + z*sin;
	dst[2] = z*cos - y*sin;
};

export const rotXVec3 = (vec3, angle, dst) => {
	sinCosRotXVec3(vec3, Math.sin(angle), Math.cos(angle), dst);
};
