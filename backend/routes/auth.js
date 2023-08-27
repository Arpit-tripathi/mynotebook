const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');


const JWT_SECRET = 'Arpitisagoodb$oy'; 

//Route 1 create a user using: POST "./api/auth/createuser". No login require
router.post('/createuser',[
   body('name','Enter a valid name').isLength({ min: 3 }),
   body('email','Enter a valid email').isEmail(),
   body('password', 'password may conatin alphabate, number, symbols').isLength({ min:5 }),
], async (req, res)=>{
   // if there are errors, return bad request and errors
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
     return res.status(400).json({errors: errors.array() });
   }
   // check whether the user with this email exits already 
   try{

   
   let user = await User.findOne({email: req.body.email});
   if(user){
      return res.status(400).json({error: "Sorry a user with this email already exits"})
   }

   const salt =  await bcrypt.genSalt(10);
   const secPass = await bcrypt.hash(req.body.password, salt);

   // create  a new user
   user = await User.create({
      name: req.body.name,
      password: secPass,
      email: req.body.email,
   })
   const data ={
      user:{
         id: user.id
      }
   }
   const authtoken = jwt.sign(data, JWT_SECRET);
  ;


      // res.json({user}   )
      res.json({authtoken})

  } catch (error){
   console.error(error.message);
   res.status(500).send("Internal server error");
  }   
  
}) 
  

// Route 2 Authenticate a user using Post "/api/auth/login". no login required

router.post('/login', [
   body('email', 'Enter a valid email').isEmail(),
   body('password', 'Password cannot be blank').exists(),
 ], async (req, res) => {
   let success = false;
   // If there are errors, return Bad request and the errors
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
     return res.status(400).json({ errors: errors.array() });
   }
 
   const { email, password } = req.body;
   try {
     let user = await User.findOne({ email });
     if (!user) {
       success = false
       return res.status(400).json({ error: "Please try to login with correct credentials" });
     }
 
     const passwordCompare = await bcrypt.compare(password, user.password);
     if (!passwordCompare) {
       success = false
       return res.status(400).json({ success, error: "Please try to login with correct credentials" });
     }
 
     const data = {
       user: {
         id: user.id
       }
     }
     const authtoken = jwt.sign(data, JWT_SECRET);
     success = true;
     res.json({ success, authtoken })
 
   } catch (error) {
     console.error(error.message);
     res.status(500).send("Internal Server Error");
   }

})

// Route 3: Get  loggedin user Details using: Post "/api/auth/getuser".  login required
router.post('/getuser', fetchuser,  async (req, res) => {
try {
   userId = req.user.id;
 const user = await User.findById(userId).select("-password")  
 res.send(user) 
} catch (error) {
   console.error(error.message);
   res.status(500).send("Internal Server Error");
 }
})
module.exports = router