const mongoose = require('mongoose');
const Lighthouse = mongoose.model('lighthouse');
const { LightHouseController } = require('../controllers/LighthouseController');
require('../controllers/LighthouseController');

module.exports = (app) => {

    app.post(`/api/lighthouse/:url`, async (req, res) => {
        new LightHouseController(res, req)
    });

    //   app.post(`/api/dbTest`, async (req, res) => {
    //     let lighthouse = await Lighthouse.create(req.body);
    //     return res.status(201).send({
    //       error: false,
    //       lighthouse
    //     })
    //   })

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