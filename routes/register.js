const express = require('express')
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator')
const userDb = require('../model/User');
const passport = require('passport');
const router = express.Router()


router.get('/', (req, res) => {
    res.render('register', {
        title: "Sign Up",
    })
})

router.post("/", [
    check("names", "Your Name").notEmpty(),
    check("surname", "Your Last Name").notEmpty(),
    check("login", "Your Login").notEmpty(),
    check("password", "Password").notEmpty(),
],
    async (req, res) => {
        if (req.body.password) {
            await check("password2", "Enter Pasword Again")
                .equals(req.body.password)
                .notEmpty()
                .run(req)
        }
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.render('register', {
                title: "Registration Error",
                errors: errors.array()
            })
        } else {
            try {
                const db = await new userDb({
                    names: req.body.names,
                    password: req.body.password,
                    phone: req.body.phone,
                    login: req.body.login,
                    surname: req.body.surname,
                })
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(db.password, salt, function (err, hash) {
                        if (err) {
                            console.log(err);
                        } else {
                            db.password = hash
                            db.save((err) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    req.flash('success', "Success")
                                    res.redirect('/')
                                }
                            })
                        }
                    });
                });
            } catch (error) {
                console.log(error);
            }
        }
    })

    router.get('/login' , async (req , res) => {
        res.render("login" , {
            title: "Login"
        })
    })

    router.post('/login' , async (req , res , next) => {
        passport.authenticate('local' , {
            successRedirect: '/',
            failureRedirect: '/register/login',
            failureFlash : "Login or password error",
            successFlash: "Succes" 
        })(req , res , next)
    })
    
module.exports = router