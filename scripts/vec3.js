import { rotXVec3, rotYVec3, rotZVec3 } from './matrix-math.js';

class Vec3 extends Array {
	constructor([ x = 0, y = 0, z = 0 ] = []) {
		super([ x, y, z ]);
	}
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
	get x() { return this[0]; }
	get y() { return this[1]; }
	get z() { return this[2]; }
	set x(val) { this[0] = val; }
	set y(val) { this[1] = val; }
	set z(val) { this[2] = val; }
}

export default Vec3;
