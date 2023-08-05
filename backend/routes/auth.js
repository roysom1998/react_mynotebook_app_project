const express=require('express');
const router=express.Router();
const User=require('../models/user');
const { validationResult, body } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt= require('jsonwebtoken');
var fetchUsers= require('../middleware/fetchUsers');
const JWT_SECRET='ThisIsASecret';

//ROUTE:1 - create a user using: POST "/api/auth/createUser". Nologin required.
router.post('/createUser',[
body('name',"Enter valid name").isLength({min:3}),
body('email',"Enter valid email").isEmail(),
body('password',"Enter valid password").isLength({min:5})
],async (req, res) => {
    // console.log(req.body);
    // // it is used for creating a new user
    // const user=User(req.body);
    // user.save()

    //If there are errors then return the error and the bad request.
    const result = validationResult(req);
    if (!result.isEmpty()) {
       return res.status(400).json({ errors: result.array() });
    }
    //check wether the email already exists.
    try{
        let user=await User.findOne({email:req.body.email});
        if(user){
            return res.status(400).json({error:"Sorry and user with this email already exists."})
        }
        // salth returns a promise ... await (wait untill the promise is resolve)
        const salt=await bcrypt.genSalt(10);
        
        //hashing the password
        secPassword=await bcrypt.hash(req.body.password,salt);
        //creating a user
        user= await User.create({
            name:req.body.name,
            email:req.body.email,
            password:secPassword
        });
        const data={
            user:{
                id:user.id
            }
        }
        const jwttoken= jwt.sign(data,JWT_SECRET);
        // res.json(user);
        res.json({jwttoken});
    }catch(error){
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
   
    
    // .then(user=>res.json(user))
    // .catch(err=>{console.log(err)
    // res.json({error:'please enter unique value for email'})});
    
    // res.send(req.body);
    
})

//ROUTE:2 - authenticate a user using login: POST "/api/auth/login". No login required.
router.post('/login',[
    body('email',"Enter valid email").isEmail(),
    body('password',"Password cannot be blank").exists()
    ],async (req, res) => {
        //If there are errors then return the error and the bad request.
    const result = validationResult(req);
    if (!result.isEmpty()) {
       return res.status(400).json({ errors: result.array() });
    }
    const {email,password} = req.body;
    try {
        let user=await User.findOne({email});
        if(!user){
            return res.status(400).json({error:"Wrong credentials!"});
        }
        const passwordCompare=await bcrypt.compare(password,user.password);
        if(!passwordCompare){
            return res.status(400).json({error:"Wrong credentials!"});
        }
        const data={
            user:{
                id:user.id
            }
        }
        const authtoken= jwt.sign(data,JWT_SECRET);
        // res.json(user);
        res.json({authtoken});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
    })

//ROUTE:3 - Get loggedin user details using: POST "/api/auth/getUser".login required.
router.post('/getUser',fetchUsers,async (req, res) => {
try { 
    let userId=req.user.id;
    const user=await User.findById(userId).select("-password");
    res.send(user);
} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
}
})
module.exports=router