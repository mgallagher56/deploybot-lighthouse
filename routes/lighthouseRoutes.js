const { lighthouseController } = require('../controllers/lighthouseController');
let Queue = require('bull');
let REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
let workQueue = new Queue('work', REDIS_URL);
require('../controllers/lighthouseController');

module.exports = (app) => {

    app.post(`/api/lighthouse/:url`, async (req, res, next) => {
        try {
            let data = {
                body: req.body,
                url: req.params.url,
                next: next
            }
        let job = await workQueue.add( data );
        res.json( job);
        } catch (err) {
            return next(err);
        }
    });

      app.get(`/`, async (req, res) => {
        return res.status(200).send(
            {
                lighthouseApp: 'App Running'
            })
      })

    //   workQueue.on('global:completed', (jobId, result) => {
    //     console.log(`Job completed with result ${result}`);
    //   });

    //   app.put(`/api/lighthouse/:id`, async (req, res) => {
    //     const {id} = req.params;

    //     let lighthouse = await Lighthouse.findByIdAndUpdate(id, req.body);

    //     return res.status(202).send({
    //       error: false,
    //       lighthouse
    //     })

    //   });

    //   app.delete(`/api/lighthouse/:id`, async (req, res) => {
    //     const {id} = req.params;

    //     let lighthouse = await Lighthouse.findByIdAndDelete(id);

    //     return res.status(202).send({
    //       error: false,
    //       lighthouse
    //     })

    //   })

}