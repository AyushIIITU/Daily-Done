const express=require('express');
const GroupController=require('../Controller/Group.controller.js');
const {jwtAuthMiddleware}=require('../../Utils/jwt');
const router=express.Router();

router.post('/create',jwtAuthMiddleware,GroupController.createGroup);
router.post('/join',jwtAuthMiddleware,GroupController.joinGroup);
router.get('/get/:id',jwtAuthMiddleware,GroupController.getGroup);
router.get('/public',jwtAuthMiddleware,GroupController.getPublicGroup);
router.put('/remove/:id',jwtAuthMiddleware,GroupController.removeMember);
router.delete('/delete/:id',jwtAuthMiddleware,GroupController.deleteGroup);
// router.patch('/:id',jwtAuthMiddleware,GroupController.alterType);
module.exports=router;
