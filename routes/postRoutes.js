const express=require('express');
const postController=require('../controllers/postController');

const router=express.Router();

router.get('/all',postController.getAllPosts);
router.get('/:id',postController.getPostById);
router.post('/create/:userID',postController.createPost);
router.patch('/update/:id',postController.updatePost)
router.delete('/delete/:id',postController.deletePost);

module.exports=router