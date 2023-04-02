const https = require('https');
const fs = require('fs');
const getFile = (filename) => new Promise((done, fail) => {
	const url = `https://onlinebacon.github.io/es6lib/scripts/${filename}.js`;
	const req = https.request(url, {
		method: 'GET',
	}, res => {
		const chunks = [];
		res.on('error', fail);
		res.on('data', chunk => chunks.push(chunk));
		res.on('end', () => {
			const buffer = Buffer.concat(chunks);
			done(buffer);
		});
	});
	req.on('error', fail);
	req.end();
});
const isImportRegex = /^import\b/;
const getImports = (file) => {
	const lines = file.split(/\n/);
	const imports = lines.filter(line => isImportRegex.test(line));
	const files = imports.map(line => {
		const [ name ] = line.match(/(?<=\.\/)\w+(-\w+)*(?=\.js)/);
		return name;
	});
	return files;
};
const args = process.argv.slice(2);
const downloadFileList = async (files, map = {}) => {
	for (let i=0; i<files.length; ++i) {  
		const name = files[i];
		if (map[name]) {
			continue;
		}
		map[name] = true;
		console.log(`Downloading ${name}...`);
		const buff = await getFile(name);
		fs.writeFileSync(`./${name}.js`, buff);
		const src = buff.toString('utf-8');
		const imports = getImports(src);
		await downloadFileList(imports, map);
	}
};
const main = async () => {
	if (args[0] === 'download') {
		await downloadFileList(args.slice(1));
		return;
	}
};
main().catch(err => {
	console.error(err);
	process.exit(1);
});
