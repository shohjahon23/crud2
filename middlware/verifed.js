const md = (req , res , next) => {
    if(req.isAuthenticated()){
        next()
    }else{
        req.flash('danger' , "Please Register")
        res.redirect('/register/login')
    }
}

module.exports = md