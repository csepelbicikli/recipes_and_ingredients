var express = require('express');
var passport = require('passport');

var router = express.Router();

router.get('/', function (req, res) {
    if('operator'==req.user.role){
        req.app.models.user.find().then(function (users) {
            res.render('operator/operator', {
                users: users,
                messages_info: req.flash('info'),
                messages_error: req.flash('error')
            });
        });
    }else{
        req.flash('error','Művelet sikertelen: nincs jogosultsága');
        res.redirect('/recipes/list');   
    }
});
router.get('/delete/:id', function (req, res) {
    if(req.user.role=='operator'){
        var id = req.params.id;
        req.app.models.recipe.find({user:id}).then(function (recipes) {
            recipes.forEach(function (r){
                req.app.models.ingredient.destroy({recipe:r.id}).then(function (){
                    req.app.models.recipe.destroy({id:r.id}).catch(function(err) {console.log(err)});
                });
            });
            req.app.models.user.destroy({id:id}).then(function (){
                req.flash('info','Felhasználó sikeresen törölve');
                res.redirect('/operator');
            }).catch(function (err){console.log(err)});
            
        });
    }else{
            req.flash('error','Művelet sikertelen: nincs jogosultsága');
            res.redirect('/recipes/list');
        }
});

module.exports = router;