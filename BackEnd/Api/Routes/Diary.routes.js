const express=require('express');
const DiaryController=require('../Controller/Diary.controller.js');
const {jwtAuthMiddleware}=require('../../Utils/jwt');
const router=express.Router();

router.post('/',jwtAuthMiddleware,DiaryController.addDiary);
router.get('/',jwtAuthMiddleware,DiaryController.getDiary);
router.put('/:id',jwtAuthMiddleware,DiaryController.updateDiary);
router.delete('/:id',jwtAuthMiddleware,DiaryController.deleteDiary);
router.patch('/:id',jwtAuthMiddleware,DiaryController.alterType);
module.exports=router;
