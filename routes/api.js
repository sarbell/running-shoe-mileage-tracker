const express = require('express');
const User = require('../models/user');
const Shoe = require('../models/shoe')
const router = express.Router();
const passport = require('passport')
const jwt = require('jsonwebtoken');
const { isValidObjectId } = require('mongoose');
const APP_SECRET = "my_secret_for_this_app_which_needs_to_change_later"


function isLoggedIn(req){
    try{
      jwt.verify(req.cookies.token, APP_SECRET)
      return true
    }catch(err){
      return false
    }
}
function requireLogIn(req, res, next){
    if(isLoggedIn(req)){
      next()
    }else{
      res.status(401)
      res.end()
    }
  }

function getCurrentUser(req){
    if(req.cookies.token){
      return jwt.decode(req.cookies.token, APP_SECRET) 
    }else {
      return null
    }
  }




router.get("/api", (req, res) => {
    res.json({ message: "Hello from server! This is a test" });

  });

// ------------ USERS ------------

// register a new user
router.post('/api/register',  (req, res) => {
    let newUser = new User  
    newUser.name = req.body.name
    newUser.email = req.body.email
    newUser.username = req.body.username
    newUser.setPassword(req.body.password)
    newUser.added_at = Date.now()
    newUser.updated_at = Date.now()

    newUser.save(err => {
        if(err){
            res.join({success: false, message: "Unable to register User"})
            res.end()
        }else{
            res.end()
        }
    })

})

// get all users
router.get('/api/users', (req, res) => {
    try{
        const users =  User.find({})
        return res.json({
            users
        })
    } catch(error){
        return res.status(500).json({
            message: 'Internal server error'
        })
    }
})

// Get one user
router.get('/api/users/:id', (req, res) => {
    try{
        User.find({_id: req.params.id}).select().exec((error, user) => {
            res.write(JSON.stringify(user))
            res.end()
        })
    } catch(error){
        res.json({
            success: false, 
            message: "Couldn't fetch user"
        })
        res.end()
    }
})

// Login in user
router.post('/api/login', (req, res, next) => {
    passport.authenticate('local',  (err, user, info) => {
        if(err){
            res.status(404).json(err)
            res.end()
        }else{
            if(user){
                let token = user.generateJWT()
                res.cookie("token", token, {maxAge: 1000 * 60  * 3  * 60 *24 })
                res.end()
            }else{
                res.status(401).json(err)
                res.end()
            }
        }
    })(req, res, next)
})


// ------------ SHOES ------------
// Get all shoes for a user
router.get('/api/shoe', (req, res) => {
    try{
        user = getCurrentUser(req)
        id = user._id
        Shoe.find({owner: id}).select().exec((err, shoes) => {
            if(err){
                res.json({success: false, message: "Query Failed"})
                res.end()
            }else{
                res.write(JSON.stringify(shoes))
                res.end()
            }
        })
    } catch (error){
        res.json({message: "Need to login to fetch shoes."})
        res.end()
    }
})


// Get one shoe
router.get('/api/shoe/:id', (req, res) => {
        try{
            Shoe.find({_id: req.params.id}).select().exec((err, shoe) => {
                res.write(JSON.stringify(shoe))
                res.end()
            })
        } catch(error){
            res.json({
                success: false, 
                message: "Couldn't fetch shoe"
            })
            res.end()
        }
})


// add a shoe
router.post('/api/shoe/add',  (req, res) => {
    let shoe = new Shoe(req.body) 
    shoe.added_at = new Date()
    shoe.updated_at = new Date()
    shoe.owner = new User(getCurrentUser(req))   
    shoe.save(err => {
        if(err){
            res.json({success: false, message: `Adding shoe failed: ${err}`})
            res.end()
        }else{
            res.end()
        }
    })
})

// Update a shoe
router.put('/api/shoe/update/:id',  (req, res) => {
    Shoe.findOne({_id: req.params.id}).select().exec((err, shoe) => {
        if(err){
            console.log(err)
            res.json({success: false, message: `Unable to update.${err}`})
            res.end()
        }else{
            Object.assign(shoe, req.body)
            shoe.updated_at = new Date()
            shoe.save(err => {
                if(err){
                    res.json({success: false, message: `Unable to update shoe ${err}`})
                    res.end()
                }else{
                    res.end()
                }
            })
        }
    })
})

// Add miles
// api/shoe/addmiles/
router.put('/api/shoe/addmiles/:id',  (req, res) => {
    Shoe.findOne({_id: req.params.id}).select().exec((err, shoe) => {
        if(err){
            console.log(err)
            res.json({success: false, message: `Unable to update.${err}`})
            res.end()
        }else{
            Object.assign(shoe, req.body)
            shoe.updated_at = new Date()
            shoe.save(err => {
                if(err){
                    res.json({success: false, message: `Unable to update shoe ${err}`})
                    res.end()
                }else{
                    res.end()
                }
            })
        }
    })
})

// Delete a shoe
router.delete('/api/shoe/delete/:id',  (req, res) => {
    Shoe.findOne({_id: req.params.id}).select().exec((err, shoe) => {
        if(err){
            res.json({success: false, message: "Undable to delete."})
            res.end()
        }else{
            Shoe.findByIdAndDelete(req.params.id, err => {
                if(err){
                    res.json({success: false, message: "Unable to delete shoe"})
                    res.end()
                }else{
                    res.end()
                }
            })
        }
    })
})

module.exports = router;
