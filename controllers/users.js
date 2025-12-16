const User=require('../models/user');

module.exports.renderSignupForm=(req, res)=>{
    res.render("users/signup");
}

module.exports.signup=async(req, res)=>{
    try{
        let {username, email, password}=req.body;
        const newUser=new User({username, email});
        const registeredUser=await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust");
            return res.redirect("/listings");
        })
        
    }catch(e){
        req.flash("error", e.message);
        return res.redirect("/signup");
    }
}

module.exports.renderLoginForm=(req, res)=>{
    return res.render("users/login");
}

module.exports.login=async (req, res)=>{
        const redirectURL=res.locals.redirectUrl || "/listings";
        console.log(redirectURL);
        req.flash("success", "Welcome back to Wanderlust");
        return res.redirect(redirectURL);
}

module.exports.logout=(req, res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "You are logged out now");
        return res.redirect("/listings");
    })
}

