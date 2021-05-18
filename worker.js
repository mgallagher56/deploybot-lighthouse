let throng = require('throng');
let Queue = require("bull");
const { lighthouseController } = require('./controllers/lighthouseController');

// Connect to a local redis instance locally, and the Heroku-provided URL in production
let REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

// Spin up multiple processes to handle jobs to take advantage of more CPU cores
// See: https://devcenter.heroku.com/articles/node-concurrency for more info
let workers = process.env.WEB_CONCURRENCY || 2;

// The maximum number of jobs each worker should process at once. This will need
// to be tuned for your application. If each job is mostly waiting on network 
// responses it can be much higher. If each job is CPU-intensive, it might need
// to be much lower.
let maxJobsPerWorker = 50;


function start() {
    console.log('starting worker');
    // Connect to the named work queue
    let workQueue = new Queue('work', REDIS_URL);

    try {
        workQueue.process(maxJobsPerWorker, async (job) => {
            console.log('starting queue');
            // This is an example job that just slowly reports on progress
            // while doing no work. Replace this with your own job logic.
            new lighthouseController(job.data);
    
            // A job can return values that will be stored in Redis as JSON
            // This return value is unused in this demo application.
            return { worker: "Returned from worker" };
      });
    } catch (error) {
        console.log(err);
    }
}

// Initialize the clustered worker process
// See: https://devcenter.heroku.com/articles/node-concurrency for more info
throng({ workers, start });
