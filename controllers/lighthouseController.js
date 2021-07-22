const fs = require('fs');
const ResultService = require('../services/resultService');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const DbService = require('../services/dbService');
const config = require('../lighthouse-config/custom-config');

class lighthouseController {
    constructor(data) {
        const t = this;

        lighthouseReturn = t.lighthouseStart(data).catch(error => { 
            console.log('caught', error.message); 
        });
    }

    addResultToDb = (data, doc) => {
        console.log('adding result to db');
        DbService.connectToDB(((db) => {
            try {
                ResultService.addResult(db, data.body.repository, doc, (result) => {
                    if (result) console.log({
                        status  : 'success',
                        message : 'added result to db',
                        result  : result
                    });
                })
            } catch (error) {
                console.log('caught', error.message); 
            }
        }))
    }

    lighthouseStart = async (data) => {
        console.log('starting lighthouse');
        const t = this;
        const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
        const options = { logLevel: 'info', output: 'html', port: chrome.port };
        const runnerResult = await lighthouse(data.url, {
            formFactor: 'desktop',
            screenEmulation: { disabled: true }
          });

        // `.report` is the HTML report as a string
        const reportHtml       = runnerResult.report;
        let body               = data.body;
        let performanceScore   = 'undefined' != typeof(runnerResult.lhr.categories.performance) ? runnerResult.lhr.categories.performance.score * 100 : 'Not run';
        let accessibilityScore = 'undefined' != typeof(runnerResult.lhr.categories.accessibility) ? runnerResult.lhr.categories.accessibility.score * 100 : 'Not run';
        let bestPracticesScore = 'undefined' != typeof(runnerResult.lhr.categories['best-practices']) ? runnerResult.lhr.categories['best-practices'].score * 100 : 'Not run';
        let seoScore           = 'undefined' != typeof(runnerResult.lhr.categories.seo) ? runnerResult.lhr.categories.seo.score * 100 : 'Not run';
        let pwaScore           = 'undefined' != typeof(runnerResult.lhr.categories.pwa) ? runnerResult.lhr.categories.pwa.score * 100 : 'Not run';

        // `.lhr` is the Lighthouse Result as a JS object
        console.log('Report is done for ', runnerResult.lhr.finalUrl);
        console.log('Performance score was: ', performanceScore);
        console.log('Accessibility score was: ', accessibilityScore);
        console.log('Best Practice score was: ', bestPracticesScore);
        console.log('SEO score was: ', seoScore);
        console.log('PWA score was: ', pwaScore);
        
        await chrome.kill();

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
    };
}

exports.lighthouseController = lighthouseController;

