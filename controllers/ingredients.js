var express = require('express');
var router = express.Router();

router.get('/modify/:id', function (req, res) {
    var id = req.params.id;
    req.app.models.ingredient.find({id:id}).then(function (ingredients) {
        var i = ingredients[0];
        if (i.recipe.user==req.user.id||req.user.role=='operator'){
            var validationErrors = (req.flash('validationErrors') || [{}]).pop();
            var data = req.flash('data').pop() || {tartalom:i.content,recept:i.recipe};
            res.render('ingredients/modify', {
                validationErrors: validationErrors,
                data: data,
            });
        }else{
            req.flash('error','Művelet sikertelen: nincs jogosultsága');
            res.redirect('/recipes/list');
        }
    });
});

router.post('/modify/:id', function (req, res) {
    var id = req.params.id;
    req.app.models.ingredient.find({id:id}).then(function (ingredients) {
        var i = ingredients[0];
        req.app.models.recipe.find({id:i.recipe}).then(function (recipes) {
            var r=recipes[0];
            if (r.user==req.user.id||req.user.role=='operator'){
                req.sanitizeBody('tartalom').escape();
                req.checkBody('tartalom', 'Hibás tartalom').notEmpty().withMessage('Kötelező megadni!');
                var validationErrors = req.validationErrors(true);
                if (validationErrors) {
                    req.flash('validationErrors', validationErrors);
                    req.flash('data', req.body);
                    res.redirect('/ingredients/modify/'+id);
                }
                else {
                    req.app.models.ingredient.update({id:id},{
                        content: req.body.tartalom
                    })
                    .then(function (ingredient) {
                        req.flash('info', 'Hozzávaló sikeresen módosítva!');
                        res.redirect('/recipes/describe/'+i.recipe);
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
                }
            }else{
                req.flash('error','Művelet sikertelen: nincs jogosultsága');
                res.redirect('/recipes/list');
            }
        });
    });
});

router.get('/delete/:id', function (req, res) {
    var id = req.params.id;
    req.app.models.ingredient.find({id:id}).then(function (ingredients) {
        var i = ingredients[0];
        req.app.models.recipe.find({id:i.recipe}).then(function (recipes) {
            var r=recipes[0];
            if(i.recipe.user==req.user.id||req.user.role=='operator'){
                req.app.models.ingredient.destroy({id:i.id}).then(function (){
                    req.flash('info','Hozzávaló sikeresen törölve');
                    res.redirect('/recipes/describe/'+i.recipe);
                });
            }else{
                req.flash('error','Művelet sikertelen: nincs jogosultsága');
                res.redirect('/recipes/list');
            }
        });
    });
});

router.get('/new', function (req, res) {
    var rID = req.query.id;
    req.app.models.recipe.find({id:rID}).then(function (recipes) {
        var r = recipes[0];
        console.log(r);
        if(r.user==req.user.id||req.user.role=='operator'){
            var validationErrors = (req.flash('validationErrors') || [{}]).pop();
            var data = req.flash('data').pop() || {recept:r.id};
            res.render('ingredients/new', {
                validationErrors: validationErrors,
                data: data,
            });
        }else{
            req.flash('error','Művelet sikertelen: nincs jogosultsága');
            res.redirect('/recipes/list');
        }
    });
});

router.post('/new', function (req, res) {
    var rID = req.query.id;
    req.app.models.recipe.find({id:rID}).then(function (recipes) {
        var r = recipes[0];
        if(r.user==req.user.id||req.user.role=='operator'){
            req.checkBody('tartalom', 'Hibás tartalom').notEmpty().withMessage('Kötelező megadni!');
            var validationErrors = req.validationErrors(true);
            if (validationErrors) {
                req.flash('validationErrors', validationErrors);
                req.flash('data', req.body);
                res.redirect('/ingredients/'+rID+'/new');
            }
            else {
                req.app.models.ingredient.create({
                    content: req.body.tartalom,
                    recipe: rID,
                })
                .then(function (ingredient) {
                    req.flash('info', 'Hozzávaló sikeresen felvéve!');
                    res.redirect('/recipes/describe/'+rID);
                })
                .catch(function (err) {
                    console.log(err);
                });
            }
        }else{
            req.flash('error','Művelet sikertelen: nincs jogosultsága');
            res.redirect('/recipes/list');
        }
    });
});
module.exports = router;