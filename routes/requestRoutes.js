var express = require('express');
var router = express.Router();



const RequestController=require('../controllers/requestcontroller');


router.get('/',RequestController.authCheck,RequestController.requestPage);
router.get('/SetCourrierName',RequestController.authCheck,RequestController.SetCourrierName);
router.post('/DownloadExcell',RequestController.authCheck,RequestController.DownloadExcell,RequestController.requestPage);
router.post('/DownloadExcell2',RequestController.authCheck,RequestController.DownloadExcell2);
router.post('/InsertCourrierName',RequestController.authCheck,RequestController.InsertCourrierName);


module.exports = router;