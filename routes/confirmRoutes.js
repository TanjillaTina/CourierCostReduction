var express = require('express');
var router = express.Router();



const ConfirmController=require('../controllers/confirmcontroller');


router.get('/',ConfirmController.authCheck,ConfirmController.confirmPage);
router.post('/SetForInbound',ConfirmController.authCheck,ConfirmController.SetForInbound);
router.post('/SetForOutbound',ConfirmController.authCheck,ConfirmController.SetForOutbound);
/* GET users listing. */


module.exports = router;