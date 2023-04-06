class DegreesConverter {
	parse(string) {
		string = string.trim();
		const prefix = string.match(/^[-+]/)?.[0];
		if (prefix) {
			string = string.substring(1).trim();
		}
		let sum = 0;
		let unit = 1;
		while (string !== '') {
			const strnum = string.match(/^\d+(\.\d+)?/)?.[0];
			if (strnum === undefined) {
				break;
			}
			const val = Number(strnum);
			string = string.substring(strnum.length);
			const sep = string.match(/^(\s|\s*[°'"]\s*)/)?.[0];
			if (sep !== undefined) {
				string = string.substring(sep.length);
				switch (sep.trim()) {
					case '°': unit = 1; break;
					case "'": unit = 1/60; break;
					case '"': unit = 1/3600; break;
				}
			}
			sum += val*unit;
			if (sep === undefined) {
				break;
			}
			unit /= 60;
		}
		if (string !== '') {
			return NaN;
		}
		if (prefix === '-') {
			return - sum;
		}
		return sum;
	}
	stringify(value) {
		return value + '°';
	}
}

const Degrees = new DegreesConverter();
export default Degrees;
