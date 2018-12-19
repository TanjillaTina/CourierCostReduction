var express = require('express');
var router = express.Router();


//const TodoModel=require('../models/todo');
const UserModel=require('../models/user-model');
const ProfileController=require('../controllers/profile');


router.get('/',ProfileController.authCheck,ProfileController.profilePage);
// router.get('/inBound',ProfileController.authCheck,ProfileController.inBound);
// router.get('/outBound',ProfileController.authCheck,ProfileController.outBound);
router.post('/addreq',ProfileController.authCheck,ProfileController.addRequest);


//router.post('/todos/delete',ProfileController.DeleteTask);

/* GET users listing. */


module.exports = router;
