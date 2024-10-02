const express=require('express');
const userController=require('../controllers/userController')

const router=express.Router();

router.get("/all",userController.getAllUsers);
router.get("/:id",userController.getUserById);
router.post("/create", userController.createUser);
router.patch("/update/:id",userController.updateUser);
router.delete("/delete/:id",userController.deleteUser);


module.exports=router