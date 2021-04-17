const mongoose = require('mongoose');
const { LightHouseController } = require('../controllers/LighthouseController');
const Product = mongoose.model('products');
require('../controllers/LighthouseController');

module.exports = (app) => {

    app.post(`/api/lighthouse/:url`, async (req, res) => {
        new LightHouseController(res, req)
    });

    //   app.post(`/api/dbTest`, async (req, res) => {
    //     let product = await Product.create(req.body);
    //     return res.status(201).send({
    //       error: false,
    //       product
    //     })
    //   })

    //   app.put(`/api/product/:id`, async (req, res) => {
    //     const {id} = req.params;

    //     let product = await Product.findByIdAndUpdate(id, req.body);

    //     return res.status(202).send({
    //       error: false,
    //       product
    //     })

    //   });

    //   app.delete(`/api/product/:id`, async (req, res) => {
    //     const {id} = req.params;

    //     let product = await Product.findByIdAndDelete(id);

    //     return res.status(202).send({
    //       error: false,
    //       product
    //     })

    //   })

}