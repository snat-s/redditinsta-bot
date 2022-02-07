const axios = require('axios');
const https = require('https');
const fs = require('fs');
const jimp = require('jimp');


async function axiospromise() {
	const dataPromise = await axios.get('https://www.reddit.com/r/dankmemes/hot/.json')
		.then((res) => {
			const { data } = res;
			const { children } = data.data;
			let places = [];
			for (let i = 0; i < children.length; i++) {
				places.push(children[i].data.url_overridden_by_dest);
			}
			return places;
		});
	return dataPromise;
}
async function downloadStuff(places) {
	for (let i = 1; i < places.length; i++) {
		const regex = new RegExp('[^.]+$');
		const extension = regex.exec(places[i]);
		console.log(extension[0]);
		if (extension[0] !== 'gif') {
			const file = fs.createWriteStream("./assets/pre-made/" + i + "." + extension[0]);
			const request = https.get(places[i], function(response) {
				response.pipe(file);
			});
		}

	}

}
async function rewriteImages(paths, extensions) {
	for (let i = 0; i < paths.length; i++) {
		if (extensions[i] !== 'jpg') {
			jimp.read(paths[i], function(err, image) {
				if (err) {
					console.log(err);
				}
				image.write("./assets/output/" + paths[i] + ".png");
			});
		} else {
			jimp.read(paths[i], function(err, image) {
				if (err) {
					console.log(err);
				}
				image.write("./assets/output/" + paths[i]);
			});
		}
	}

}

async function process() {
	let places = [];
	places = await axiospromise();
	paths = await downloadStuff(places);
        await rewriteImages(paths, extensions);
	console.log(places)
}

process();
