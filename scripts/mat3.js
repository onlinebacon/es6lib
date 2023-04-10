class Mat3 extends Array {
	constructor([ ix, iy, iz, jx, jy, jz, kx, ky, kz ] = [ 1, 0, 0, 0, 1, 0, 0, 0, 1 ]) {
		super([
			ix ?? 0, iy ?? 0, iz ?? 0,
			jx ?? 0, jy ?? 0, jz ?? 0,
			kx ?? 0, ky ?? 0, kz ?? 0,
		]);
	}
	sinCosRotX(sin, cos, dst = this) {
		const [ ix, iy, iz, jx, jy, jz, kx, ky, kz ] = this;
		dst[0] = ix;
		dst[1] = iy*cos + iz*sin;
		dst[2] = iz*cos - iy*sin;
		dst[3] = jx;
		dst[4] = jy*cos + jz*sin;
		dst[5] = jz*cos - jy*sin;
		dst[6] = kx;
		dst[7] = ky*cos + kz*sin;
		dst[8] = kz*cos - ky*sin;
		return dst;
	}
	rotX(angle, dst = this) {
		return this.sinCosRotX(Math.sin(angle), Math.cos(angle), dst);
	}
	sinCosRotY(sin, cos, dst = this) {
		const [ ix, iy, iz, jx, jy, jz, kx, ky, kz ] = this;
		dst[0] = ix*cos + iz*sin;
		dst[1] = iy;
		dst[2] = iz*cos - ix*sin;
		dst[3] = jx*cos + jz*sin;
		dst[4] = jy;
		dst[5] = jz*cos - jx*sin;
		dst[6] = kx*cos + kz*sin;
		dst[7] = ky;
		dst[8] = kz*cos - kx*sin;
		return dst;
	}
	rotY(angle, dst = this) {
		return this.sinCosRotX(Math.sin(angle), Math.cos(angle), dst);
	}
	sinCosRotZ(sin, cos, dst = this) {
		const [ ix, iy, iz, jx, jy, jz, kx, ky, kz ] = this;
		dst[0] = ix*cos + iy*sin;
		dst[1] = iy*cos - ix*sin;
		dst[2] = iz;
		dst[3] = jx*cos + jy*sin;
		dst[4] = jy*cos - jx*sin;
		dst[5] = jz;
		dst[6] = kx*cos + ky*sin;
		dst[7] = ky*cos - kx*sin;
		dst[8] = kz;
		return dst;
	}
	rotZ(angle, dst = this) {
		return this.sinCosRotX(Math.sin(angle), Math.cos(angle), dst);
	}
	id() {
		this[0] = 1;
		this[1] = 0;
		this[2] = 0;
		this[3] = 0;
		this[4] = 1;
		this[5] = 0;
		this[6] = 0;
		this[7] = 0;
		this[8] = 1;
		return this;
	}
}
