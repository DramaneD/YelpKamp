var Campground = require("../models/campground");
var Comment = require("../models/comment");
// All middleware goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    // is user logged in?
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground) {
            if (err) {
                req.flash("error", "Campground not found");
                res.render("back");
            } else {
                // does user own the campground?
                if (foundCampground && foundCampground.author.id.equals(req.user._id) || req.user.isAdmin) {
                    next();
                } else {
                    // otherwise, redirect
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        // if no, redirect
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    // is user logged in?
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err) {
                res.render("back");
            } else {
                // does user own the comment?
                if (foundComment && foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
                    next();
                } else {
                    // otherwise, redirect
                    req.flash("success", "You don't have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        // if no, redirect
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
}

module.exports = middlewareObj;