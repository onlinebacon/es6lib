const { PI, sin, cos, tan, asin, acos, atan } = Math;

class Trig {
	constructor(DEG = PI/180, RAD = 1, mul = 1, inv = 1) {
		this.DEG = DEG;
		this.RAD = RAD;
		this.mul = mul;
		this.inv = inv;
	}
	sin(val) { return sin(val*this.mul); }
	cos(val) { return cos(val*this.mul); }
	tan(val) { return tan(val*this.mul); }
	asin(val) { return asin(val)*this.inv; }
	acos(val) { return acos(val)*this.inv; }
	atan(val) { return atan(val)*this.inv; }
	deg(val) { return val*this.DEG; }
	rad(val) { return val*this.RAD; }
	radians() { return new Trig(PI/180, 1, 1, 1); }
	degrees() { return new Trig(1, 180/PI, PI/180, 180/PI); }
}

export default Trig;
