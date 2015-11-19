var express = require('express');

var router = express.Router();

var statusTexts = {
    'uj': 'Új',
    'modositva': 'Módosítva',
    'elfogadott': 'Elfogadva',
    'elutasitott': 'Elutasítva',
    'dijazott': 'Díjazott',
};
var statusClasses = {
    'uj': 'danger',
    'modositva': 'info',
    'elfogadott': 'default',
    'elutasitott': 'warning',
    'dijazott': 'success',
};
function decorateRecipes(recipeContainer) {
    return recipeContainer.map(function (r) {
        r.statusText = statusTexts[r.status];
        r.statusClass = statusClasses[r.status];
        r.descriptionHTML=r.description;
        while((r.descriptionHTML).indexOf('\n')>-1){
            r.descriptionHTML = (r.descriptionHTML).replace('\n','<br>');
        }
        while((r.descriptionHTML).indexOf('\r')>-1){
            r.descriptionHTML = (r.descriptionHTML).replace('\r','');
        }
        return r;
    });
}

router.get('/list', function (req, res) {
    req.app.models.recipe.find().then(function (recipes) {
        recipes=recipes.filter(function (r){
            return (r.user==req.user.id)||req.user.role=='operator';
        });
        req.app.models.user.find().then(function (users) {
            recipes.map(function (r){
                r.nickname='';
                users.forEach(function (u){
                    if(u.id==r.user){
                        r.nickname=u.nickname;
                    }
                });
                return r;
            });
            res.render('recipes/list', {
            recipes: decorateRecipes(recipes),
            messages_info: req.flash('info'),
            messages_error: req.flash('error')
            });
        });
    });
});

router.get('/describe/:id', function (req, res) {
    var id = req.params.id;
    req.app.models.recipe.find({id:id}).then(function (recipes) {
        var r = recipes[0];
        if (r.user==req.user.id||req.user.role=='operator'){
            req.app.models.ingredient.find({recipe:r.id}).then(function (ingredients){
                console.log(ingredients);
                res.render('recipes/describe', {
                    recipe: decorateRecipes([r])[0],
                    messages: req.flash('info'),
                    ingredients:ingredients,
                });
            });
        }else{
            req.flash('error','Művelet sikertelen: nincs jogosultsága');
            res.redirect('/recipes/list');   
        }
    });
});

router.get('/modify/:id', function (req, res) {
    var id = req.params.id;
    req.app.models.recipe.find({id:id}).then(function (recipes) {
        var r = recipes[0];
        if (r.user==req.user.id||req.user.role=='operator'){
            var validationErrors = (req.flash('validationErrors') || [{}]).pop();
            var data = req.flash('data').pop() || {nev:r.name,leiras:r.description};
            res.render('recipes/modify', {
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
    //id-s tag lekerese
    var id = req.params.id;
    req.checkBody('nev', 'Hibás név').notEmpty().withMessage('Kötelező megadni!');
    req.sanitizeBody('leiras').escape();
    req.checkBody('leiras', 'Hibás leírás').notEmpty().withMessage('Kötelező megadni!');
    var validationErrors = req.validationErrors(true);
    if (validationErrors) {
        // űrlap megjelenítése a hibákkal és a felküldött adatokkal
        req.flash('validationErrors', validationErrors);
        req.flash('data', req.body);
        res.redirect('/recipes/modify/'+id);
    }
    else {
        req.app.models.recipe.update({id:id},{
            status: 'modositva',
            name: req.body.nev,
            description: req.body.leiras
        })
        .then(function (recipe) {
            //siker
            req.flash('info', 'Recept sikeresen módosítva!');
            res.redirect('/recipes/list');
        })
        .catch(function (err) {
            //hiba
            console.log(err);
        });
    }
});


router.get('/delete/:id', function (req, res) {
    var id = req.params.id;
    req.app.models.recipe.find({id:id}).then(function (recipes) {
        var r = recipes[0];
        
        if(r.user==req.user.id||req.user.role=='operator'){
            req.app.models.ingredient.destroy({recipe:r.id}).then(function (){
                req.app.models.recipe.destroy({id:r.id}).then(function (){
                    req.flash('info','Recept sikeresen törölve');
                    res.redirect('/recipes/list');
                });
            });
        }else{
            req.flash('error','Művelet sikertelen: nincs jogosultsága');
            res.redirect('/recipes/list');
        }
    });
});

router.get('/new', function (req, res) {
    var validationErrors = (req.flash('validationErrors') || [{}]).pop();
    var data = (req.flash('data') || [{}]).pop();
    
    res.render('recipes/new', {
        validationErrors: validationErrors,
        data: data,
    });
});
router.post('/new', function (req, res) {
    // adatok ellenőrzése
    req.checkBody('nev', 'Hibás név').notEmpty().withMessage('Kötelező megadni!');
    req.sanitizeBody('leiras').escape();
    req.checkBody('leiras', 'Hibás leírás').notEmpty().withMessage('Kötelező megadni!');
    
    var validationErrors = req.validationErrors(true);
    //console.log(validationErrors);
    //console.log(req.body);
    
    if (validationErrors) {
        // űrlap megjelenítése a hibákkal és a felküldött adatokkal
        req.flash('validationErrors', validationErrors);
        req.flash('data', req.body);
        res.redirect('/recipes/new');
    }
    else {
        // adatok elmentése (ld. később) és a hibalista megjelenítése
        req.app.models.recipe.create({
            status: 'uj',
            name: req.body.nev,
            description: req.body.leiras,
            user: req.user
        })
        .then(function (recipe) {
            //siker
            req.flash('info', 'Recept sikeresen felvéve!');
            res.redirect('/recipes/list');
        })
        .catch(function (err) {
            //hiba
            console.log(err);
        });
    }
});



module.exports = router;