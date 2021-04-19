const mongoose = require('mongoose');
const Lighthouse = mongoose.model('lighthouse');
const { lighthouseController } = require('../controllers/lighthouseController');
let Queue = require('bull');
require('../controllers/lighthouseController');
let REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
let workQueue = new Queue('work', REDIS_URL);


module.exports = (app) => {

    app.post(`/api/lighthouse/:url`, async (req, res, next) => {
        try {
            new lighthouseController(res, req, next)
            await workQueue.add();
            // res.json({ id: job.id });
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