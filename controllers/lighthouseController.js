const fs = require('fs');
const ResultService = require('../services/resultService');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const DbService = require('../services/dbService');
const config = require('../conf/lighthouseConfig');

class lighthouseController {
    constructor(data) {
        const t = this;

        lighthouseReturn = t.lighthouseStart(data).catch(data.next);
    }

    addResultToDb = (data, doc) => {
        console.log('adding result to db');
        DbService.connectToDB(((db) => {
            ResultService.addResult(db, data.body.repository, doc, (result) => {
                if (result) return true;
            });
        }))
    }

    lighthouseStart = async (data) => {
        console.log('starting lighthouse');
        const t = this;
        const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
        const options = { logLevel: 'info', output: 'html', port: chrome.port, config };
        const runnerResult = await lighthouse(data.url, options);

        // `.report` is the HTML report as a string
        const reportHtml       = runnerResult.report;
        let body               = data.body;
        let performanceScore   = 'undefined' != typeof(runnerResult.lhr.categories.performance) ? runnerResult.lhr.categories.performance.score * 100 : 'Not run';
        let accessibilityScore = 'undefined' != typeof(runnerResult.lhr.categories.accessibility) ? runnerResult.lhr.categories.accessibility.score * 100 : 'Not run';
        let bestPracticesScore = 'undefined' != typeof(runnerResult.lhr.categories['best-practices']) ? runnerResult.lhr.categories['best-practices'].score * 100 : 'Not run';
        let seoScore           = 'undefined' != typeof(runnerResult.lhr.categories.seo) ? runnerResult.lhr.categories.seo.score * 100 : 'Not run';
        let pwaScore           = 'undefined' != typeof(runnerResult.lhr.categories.pwa) ? runnerResult.lhr.categories.pwa.score * 100 : 'Not run';

        t.addResultToDb(data,
            {
                name: body.repository + ' - ' + body.environment,
                repo: body.repository,
                commit: body.revision,
                commitMsg: body.comment,
                author: body.author_name,
                deployTime: body.deployed_at,
                timestamp: + new Date(),
                server: body.server,
                environment: body.environment,
                url: data.url,
                lhrHTML: reportHtml,
                scores: {
                    performance: performanceScore,
                    accessibility: accessibilityScore,
                    bestPractices: bestPracticesScore,
                    seo: seoScore,
                    pwa: pwaScore
                }
            }
        );
        
        // fs.writeFileSync('lighthouseController.json', JSON.stringify(runnerResult));


        // `.lhr` is the Lighthouse Result as a JS object
        console.log('Report is done for ', runnerResult.lhr.finalUrl);
        console.log('Performance score was: ', performanceScore);
        console.log('Accessibility score was: ', accessibilityScore);
        console.log('Best Practice score was: ', bestPracticesScore);
        console.log('SEO score was: ', seoScore);
        console.log('PWA score was: ', pwaScore);

        await chrome.kill();
    };
}

exports.lighthouseController = lighthouseController;

