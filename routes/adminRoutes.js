var express = require('express');
var router = express.Router();
const adminController=require('../controllers/admincontroller');
/* GET home page. */
router.get('/',adminController.authCheck,adminController.adminPage);

/* GET users listing. */


module.exports = router;
