const express = require('express');
const User = require('../models/user');
const Shoe = require('../models/shoe')
const Miles = require('../models/miles')
const router = express.Router();
const passport = require('passport')
const jwt = require('jsonwebtoken');
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
router.get('/api/shoe', requireLogIn, (req, res) => {
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
router.get('/api/shoe/:id', requireLogIn, (req, res) => {
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
router.post('/api/shoe/add', requireLogIn,  (req, res) => {
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
router.put('/api/shoe/update/:id', requireLogIn,  (req, res) => {
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
router.post('/api/shoe/addmiles/:id', requireLogIn, (req, res) => {
    let updateMiles = new Miles(req.body) 
    updateMiles.shoe_ran_in = req.params.id
    updateMiles.save(err => {
        if(err){
            res.json({success: false, message: `Adding miles failed: ${err}`})
            res.end()
        }else{
            res.end()
        }
    })
})

// Add new miles to shoe object
// /api/shoe/updateMiles/${shoe.id}
router.put('/api/shoe/updateMiles/:id', requireLogIn, (req, res) => {
    Shoe.findOne({_id: req.params.id}).select().exec((err, shoe) => {
        if(err){
            console.log(err)
            res.json({success: false, message: `Unable to update.${err}`})
            res.end()
        }else{
            Object.assign(shoe, req.body)
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

// get mileEntries
router.get('/api/mileEntries/:id', requireLogIn, (req, res) => {
    try{
        id = req.params.id
        Miles.find({shoe_ran_in: id}).select().exec((err, miles) => {
            if(err){
                res.json({success: false, message: "Failed to get logs."})
            }else{
                res.write(JSON.stringify(miles))
                res.end()
            }
        })
    } catch (error){
        res.json({message: "Need to login to fetch shoe logs."})
        res.end()
    }
})


// Delete a shoe
router.delete('/api/shoe/delete/:id', requireLogIn, (req, res) => {
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
