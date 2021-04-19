const fs = require('fs');
const ResultService = require('../services/resultService');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const DbService = require('../services/dbService');
const { BADQUERY } = require('dns');

class lighthouseController {
    constructor(res, req, next) {
        const t = this;
            t.lighthouseStart(req, res).catch(next);
    }

    addResultToDb = (req, res, doc) => {
        DbService.connectToDB(((db) => {

            ResultService.addResult(db, req.body.repository, doc, (result) => {
                if (result) {
                    // res.json({
                    //     success: true,
                    //     msg: 'Added new report to db.',
                    //     data: 'report'
                    // })
                }
            });
        }))
    }

    lighthouseStart = async (req, res) => {
        const t = this;
        const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
        const options = { logLevel: 'info', output: 'html', port: chrome.port, onlyCategories: ['performance'] };
        const runnerResult = await lighthouse(req.params.url, options);

        // `.report` is the HTML report as a string
        const reportHtml = runnerResult.report;
        let body = req.body;
        t.addResultToDb(req, res,
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
                url: req.params.url,
                lhrHTML: reportHtml
            }
        );
        
        // fs.writeFileSync('lighthouseController.json', JSON.stringify(runnerResult));


        // `.lhr` is the Lighthouse Result as a JS object
        // console.log('Report is done for', runnerResult.lhr.finalUrl);
        // console.log('Performance score was', runnerResult.lhr.categories.performance.score * 100);
        // console.log('Accessibility score was', runnerResult.lhr.categories.accessibility.score * 100);
        // console.log('Best Practice score was', runnerResult.lhr.categories['best-practices'].score * 100);
        // console.log('SEO score was', runnerResult.lhr.categories.seo.score * 100);
        // console.log('PWA score was', runnerResult.lhr.categories.pwa.score * 100);

        await chrome.kill();
    };
}

exports.lighthouseController = lighthouseController;

