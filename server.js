
const express = require("express");
const fetch = require("node-fetch");
const cheerio = require("cheerio");

const app = express();

app.listen(5200, () => console.log("Tuned In and Turned On to port 5200"));


let whichSuggestions = [];
let allPs = [];
let theSentence = "";
let whichOne1 = "";
let whichOne2 = "";

const createPromises = (theGroup) => {
	theGroup.forEach((suggest) => {
		let startP = new Promise((resolve, reject) => {
			fetch("http://www.dmollert.com")
			.then(response => {
				return response.text();
			})
			.then(reply => {
				const $ = cheerio.load(reply);
				theSentence = $('.listSentence').eq(suggest).text();
				resolve(theSentence);
			});		
		})
		allPs.push(startP);
	})
	return allPs;
}

const convertNumber = (digit) => {
	switch (digit) {
		case 0:
			return "first";
			break;
		case 1:
			return "second";
			break;
		case 2:
			return "third";
			break;
		case 3:
			return "fourth";
			break;
		case 4:
			return "fifth";
			break;
		default:
			break;
	}
}

app.get("/", (req, res) => {

	whichSuggestions = [0, 3];

	whichOne1 = convertNumber(whichSuggestions[0]);
	whichOne2 = convertNumber(whichSuggestions[1]);	

	const letsResolve = (pGroup) => {
		Promise.all(pGroup).then(result => {

			res.write('<html>');
			res.write('<body>');
			res.write('<div style="font-size: 1.2rem; font-weight: bold;">');			
			res.write('<div style="padding: 1rem 0 0 0;">The ' + whichOne1 + ' suggestion read:</div>' + result[0]);
			res.write('<div style="padding: 1rem 0 0 0;">The ' + whichOne2 + ' suggestion read:</div>' + result[1]);		
			res.write('</div>');
			res.write('</body>');
			res.write('</html>');		
			res.end();
		})
	}

	letsResolve(createPromises(whichSuggestions));
});


