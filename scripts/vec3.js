import { rotXVec3, rotYVec3, rotZVec3 } from './matrix-math.js';

class Vec3 extends Array {
	constructor([ x = 0, y = 0, z = 0 ] = []) {
		super([ x, y, z ]);
	}
	get x() { return this[0]; }
	get y() { return this[1]; }
	get z() { return this[2]; }
	set x(val) { this[0] = val; }
	set y(val) { this[1] = val; }
	set z(val) { this[2] = val; }
	rotateX(angle, dst = this) {
		rotXVec3(this, angle, dst);
		return dst;
	}
	rotateY(angle, dst = this) {
		rotYVec3(this, angle, dst);
		return dst;
	}
	rotateZ(angle, dst = this) {
		rotZVec3(this, angle, dst);
		return dst;
	}
	scale(value, dst = this) {
		const [ x, y, z ] = this;
		dst[0] = x*value;
		dst[1] = y*value;
		dst[2] = z*value;
		return dst;
	}
	add([ x, y, z ], dst = this) {
		const [ tx, ty, tz ] = this;
		dst[0] = tx + x;
		dst[1] = ty + y;
		dst[2] = tz + z;
		return dst;
	}
	sub([ x, y, z ], dst = this) {
		const [ tx, ty, tz ] = this;
		dst[0] = tx - x;
		dst[1] = ty - y;
		dst[2] = tz - z;
		return dst;
	}
	len() {
		const [ x, y, z ] = this;
		return Math.sqrt(x*x + y*y + z*z);
	}
	normalize(dst = this) {
		const [ x, y, z ] = this;
		const len = Math.sqrt(x*x + y*y + z*z);
		dst[0] = x/len;
		dst[1] = y/len;
		dst[2] = z/len;
		return dst;
	}
	apply(mat3, dst = this) {
		const [ x, y, z ] = this;
		const [ ix, iy, iz, jx, jy, jz, kx, ky, kz ] = mat3;
		dst[0] = x*ix + y*jx + z*kx;
		dst[1] = x*iy + y*jy + z*ky;
		dst[2] = x*iz + y*jz + z*kz;
		return dst;
	}
}

export default Vec3;
