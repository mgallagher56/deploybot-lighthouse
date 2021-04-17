const mongoose = require('mongoose');
const Lighthouse = mongoose.model('lighthouse');
const { lighthouseController } = require('../controllers/lighthouseController');
require('../controllers/lighthouseController');

module.exports = (app) => {

    app.post(`/api/lighthouse/:url`, async (req, res, next) => {
        try {
            await new lighthouseController(res, req)
        } catch (err) {
            next(err);
        }
    });

      app.get(`/`, async (req, res) => {
        return res.status(200).send(
            {
                lighthouseApp: 'Running'
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