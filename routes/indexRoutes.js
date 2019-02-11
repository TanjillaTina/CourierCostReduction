var express = require('express');
var router = express.Router();
const indexController=require('../controllers/index');
/* GET home page. */
router.get('/',indexController.indexPage);
router.get('/flatrate',indexController.flatrate);


///total cost  per company chart
router.post('/viewChart',indexController.viewChart);


///request per person chart
router.post('/viewChart2',indexController.viewChart2);
router.get('/dwnExem',indexController.downExcMonth);
router.post('/dwnExMY',indexController.dwnExMY);



///cost per person chart

router.post('/costPerPersonChart',indexController.costPerPersonChart);
router.get('/dwnCurentMonthCost',indexController.dwnCurentMonthCost);
router.post('/dwnAnyMonthCost',indexController.dwnAnyMonthCost);


/* GET users listing. */


module.exports = router;
