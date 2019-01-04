var express = require('express');
var router = express.Router();
const indexController=require('../controllers/index');
/* GET home page. */
router.get('/',indexController.indexPage);
router.post('/viewChart',indexController.viewChart);
router.post('/viewChart2',indexController.viewChart2);
router.get('/dwnExem',indexController.downExcMonth);
router.post('/dwnExMY',indexController.dwnExMY);
router.get('/flatrate',indexController.flatrate);
/* GET users listing. */


module.exports = router;
