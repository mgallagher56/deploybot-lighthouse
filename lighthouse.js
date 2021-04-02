const fs = require('fs');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

const lighthouseStart = async (url, flags, filePath) => {
	const chrome = await chromeLauncher.launch({ chromeFlags: flags });
	const options = { logLevel: 'info', output: 'html', port: chrome.port };
	const runnerResult = await lighthouse(url, options);

	// `.report` is the HTML report as a string
	const reportHtml = runnerResult.report;
	fs.writeFileSync(filePath, reportHtml);

	// `.lhr` is the Lighthouse Result as a JS object
	console.log('Report is done for', runnerResult.lhr.finalUrl);
	console.log('Performance score was', runnerResult.lhr.categories.performance.score * 100);

	await chrome.kill();
};

document.getElementById('run-lighthouse').addEventListener('click', function () {
	lighthouseStart('https://www.bbc.co.uk/', ['--headless'], 'bbcLighthouse.html');
})

