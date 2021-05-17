const mongoose = require('mongoose');
const Lighthouse = mongoose.model('lighthouse');
const { lighthouseController } = require('../controllers/lighthouseController');
require('../controllers/lighthouseController');

module.exports = (app) => {

    app.post(`/api/lighthouse/:url`, async (req, res, next) => {
        try {
            new lighthouseController(res, req, next)
            await workQueue.add();
            res.json({ id: job.id });
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