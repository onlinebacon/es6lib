import http from 'http';
import fs from 'fs';
const fetch = (hip, unixtime) => new Promise((done, fail) => {
	const req = http.request(`http://127.0.0.1:25601/time/${unixtime}/hip/${hip}`, {
		method: 'GET',
	}, res => {
		const chunks = [];
		res.on('error', fail);
		res.on('data', chunk => chunks.push(chunk));
		res.on('end', () => {
			try {
				const buffer = Buffer.concat(chunks);
				const json = buffer.toString('utf-8');
				const data = JSON.parse(json);
				done(data);
			} catch(err) {
				fail(err);
			}
		});
	});
	req.on('error', fail);
	req.end();
});
const starMap = {
	677: [ 'Alpheratz', /^alpheratz$/i ],
	2081: [ 'Ankaa', /^ankaa$/i ],
	3179: [ 'Schedar', /^sc?hed[ai]r$/i ],
	3419: [ 'Diphda', /^diphda$/i ],
	7588: [ 'Achernar', /^achernar$/i ],
	9884: [ 'Hamal', /^hamal$/i ],
	11767: [ 'Polaris', /^polaris$/i ],
	13847: [ 'Acamar', /^acamar$/i ],
	14135: [ 'Menkar', /^menkar$/i ],
	15863: [ 'Mirfak', /^mirfak$/i ],
	21421: [ 'Aldebaran', /^aldebaran$/i ],
	24436: [ 'Rigel', /^rigel$/i ],
	24608: [ 'Capella', /^capella$/i ],
	25336: [ 'Bellatrix', /^bellatrix$/i ],
	25428: [ 'Elnath', /^elnath$/i ],
	26311: [ 'Alnilam', /^alnilam$/i ],
	27989: [ 'Betelgeuse', /^betelgeuse$/i ],
	30438: [ 'Canopus', /^canopus$/i ],
	32349: [ 'Sirius', /^sirius$/i ],
	33579: [ 'Adhara', /^adhara$/i ],
	37279: [ 'Procyon', /^procyon$/i ],
	37826: [ 'Pollux', /^pollux$/i ],
	41037: [ 'Avior', /^avior$/i ],
	44816: [ 'Suhail', /^suhail$/i ],
	45238: [ 'Miaplacidus', /^miaplacidus$/i ],
	46390: [ 'Alphard', /^alphard$/i ],
	49669: [ 'Regulus', /^regulus$/i ],
	54061: [ 'Dubhe', /^dubhe$/i ],
	57632: [ 'Denebola', /^denebola$/i ],
	59803: [ 'Gienah', /^gienah$/i ],
	60718: [ 'Acrux', /^acrux$/i ],
	61084: [ 'Gacrux', /^gacrux$/i ],
	62956: [ 'Alioth', /^alioth$/i ],
	65474: [ 'Spica', /^spica$/i ],
	67301: [ 'Alkaid', /^alkaid$/i ],
	68702: [ 'Hadar', /^hadar$/i ],
	68933: [ 'Menkent', /^menkent$/i ],
	69673: [ 'Arcturus', /^arcturus$/i ],
	71683: [ 'Rigil Kentaurus', /^rig[ie]l\s+kent(\.|aurus)?$/i ],
	72607: [ 'Kochab', /^koch?ab$/i ],
	72622: [ 'Zuben\'ubi', /^zuben('?\s*)(elgen)?ubi$/i ],
	76267: [ 'Alphecca', /^alphecca$/i ],
	80763: [ 'Antares', /^antares$/i ],
	82273: [ 'Atria', /^atria$/i ],
	84012: [ 'Sabik', /^sabik$/i ],
	85927: [ 'Shaula', /^shaula$/i ],
	86032: [ 'Rasalhague', /^rasalhague$/i ],
	87833: [ 'Eltanin', /^eltanin$/i ],
	90185: [ 'Kaus Australis', /^kaus\s+aust(\.|ralis)?$/i ],
	91262: [ 'Vega', /^vega$/i ],
	92855: [ 'Nunki', /^nunki$/i ],
	97649: [ 'Altair', /^altair$/i ],
	100751: [ 'Peacock', /^peacock$/i ],
	102098: [ 'Deneb', /^deneb$/i ],
	107315: [ 'Enif', /^enif$/i ],
	109268: [ 'Al Na\'ir', /^al\s*na'?ir$/i ],
	113368: [ 'Fomalhaut', /^fomalhaut$/i ],
	113881: [ 'Scheat', /^scheat$/i ],
	113963: [ 'Markab', /^markab$/i ],
};
let minYear = 2015;
let maxYear = 2025;
const round = (val) => Number(val.toFixed(5));
const timeList = [...new Array(maxYear - minYear + 1)].map((_, i) => {
	const iso = `${minYear + i}-01-01T00:00:00Z`;
	const date = new Date(iso);
	const unixtime = date/1000;
	return unixtime;
});
const loadStar = async (hip) => {
	const [ name, regex ] = starMap[hip];
	const shaList = [];
	const decList = [];
	for (let unixtime of timeList) {
		const { ra, dec } = await fetch(hip, unixtime);
		const sha = 360 - ra/24*360;
		shaList.push(round(sha));
		decList.push(round(dec));
	}
	return '\t\tname: ' + JSON.stringify(name) + ',\n'
		+ '\t\tregex: ' + regex + ',\n'
		+ '\t\tsha: [' + shaList + '],\n'
		+ '\t\tdec: [' + decList + '],\n';
}
const main = async () => {
	const hips = Object.keys(starMap);
	const stars = await Promise.all(hips.map(loadStar));
	let output = '';
	output += `import { interpolate } from './coord.js';\n`;
	output += 'const toDeg = (rad) => rad*(180/Math.PI);\n';
	output += 'const toRad = (deg) => deg*(Math.PI/180);\n';
	output += 'const shaDecToLatLon = ([ sha, dec ]) => [\n';
	output += '\ttoRad(dec),\n';
	output += '\ttoRad(sha < 180 ? -sha : 360 - sha),\n';
	output += '];\n';
	output += 'const latLonToShaDec = ([ lat, lon ]) => [\n';
	output += '\t(360 - toDeg(lon))%360,\n';
	output += '\ttoDeg(lat),\n';
	output += '];\n';
	output += 'const Almanac = {\n';
	output += '\ttimeList: [' + timeList + '],\n';
	output += '\tstars: [{\n';
	output += stars.join('\t}, {\n');
	output += '\t}],\n';
	output += '\tgetStar: function(name, unixtime) {\n';
	output += '\t\tconst { timeList, stars } = this;\n';
	output += '\t\tconst star = stars.find(star => star.regex.test(name));\n';
	output += '\t\tif (!star) {\n';
	output += '\t\t\treturn null;\n';
	output += '\t\t}\n';
	output += '\t\tlet a = 0;\n';
	output += '\t\tlet b = timeList.length - 1;\n';
	output += '\t\tif (unixtime < timeList[a] || unixtime > timeList[b]) {\n';
	output += '\t\t\treturn null;\n';
	output += '\t\t}\n';
	output += '\t\twhile (b - a > 1) {\n';
	output += '\t\t\tconst m = (b + a) >> 1;\n';
	output += '\t\t\tconst t = timeList[m];\n';
	output += '\t\t\tif (unixtime > t) {\n';
	output += '\t\t\t\ta = m;\n';
	output += '\t\t\t} else {\n';
	output += '\t\t\t\tb = m;\n';
	output += '\t\t\t}\n';
	output += '\t\t}\n';
	output += '\t\tconst range = timeList[b] - timeList[a];\n';
	output += '\t\tconst offset = unixtime - timeList[a];\n';
	output += '\t\tconst val = offset/range;\n';
	output += '\t\tconst shaDecA = [ star.sha[a], star.dec[a] ];\n';
	output += '\t\tconst shaDecB = [ star.sha[b], star.dec[b] ];\n';
	output += '\t\tconst latLonA = shaDecToLatLon(shaDecA);\n';
	output += '\t\tconst latLonB = shaDecToLatLon(shaDecB);\n';
	output += '\t\tconst latlon = interpolate(latLonA, latLonB, val);\n';
	output += '\t\tconst [ sha, dec ] = latLonToShaDec(latlon);\n';
	output += '\t\treturn { sha, dec };\n';
	output += '\t},\n';
	output += '};\n';
	output += 'export default Almanac;\n';
	const buffer = Buffer.from(output, 'utf-8');
	fs.writeFileSync('../scripts/almanac.js', buffer);
};
main().catch(console.error);
