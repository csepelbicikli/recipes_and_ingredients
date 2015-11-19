var Browser = require('zombie');

Browser.localhost(process.env.IP, process.env.PORT);

describe('User visits index page', function() {
    var browser = new Browser();
    
    before(function() {
        return browser.visit('/');
    });
    
    it('should be successful', function() {
        browser.assert.success();
    });
    
    it('should see welcome page', function() {
        browser.assert.text('div.page-header > h1', 'Recept alkalmazás');
    });
        
    describe('User visits new recipe page', function (argument) {
        var browser = new Browser();
        
        before(function() {
            return browser.visit('/recipes/new');
        });
        
        it('should go to the authentication page', function () {
            browser.assert.redirected();
            browser.assert.success();
            browser.assert.url({ pathname: '/login' });
        });
        
        it('should be able to login with correct credentials', function (done) {
            browser
                .fill('nickname', 'k')
                .fill('password', 'k')
                .pressButton('button[type=submit]')
                .then(function () {
                    browser.assert.redirected();
                    browser.assert.success();
                    browser.assert.url({ pathname: '/recipes/list' });
                    done();
                });
        });
        
        it('should go the recipe page', function () {
            return browser.visit('/recipes/new')
            .then(function () {
                browser.assert.success();
                browser.assert.text('div.page-header > h1', 'Új recept felvitele');
            });
        });
        
        it('should show errors if the form fields are not right', function () {
            return browser
                .fill('nev', '')
                .fill('leiras', '')
                .pressButton('button[type=submit]')
                .then(function() {
                    // browser.assert.redirected();
                    browser.assert.success();
                    browser.assert.element('form .form-group:nth-child(1) [name=nev]');
                    browser.assert.hasClass('form .form-group:nth-child(1)', 'has-error');
                    browser.assert.element('form .form-group:nth-child(2) [name=leiras]');
                    browser.assert.hasClass('form .form-group:nth-child(2)', 'has-error');
                });
        });
            
        it('should show submit the right-filled form fields and go back to list page', function() {
            browser
                .fill('nev', 'Tárkonyos raguleves')
                .fill('leiras', 'elk\r\nlepesek')
                .pressButton('button[type=submit]')
                .then(function() {
                    browser.assert.redirected();
                    browser.assert.success();
                    browser.assert.url({ pathname: '/recipes/list' });
            
            browser.assert.element('table.table');
            browser.assert.text('table.table tbody tr:last-child td:nth-child(2)', 'Tárkonyos raguleves');   
            browser.assert.text('table.table tbody tr:last-child td:nth-child(3) span.label', 'Új');
            browser.assert.text('table.table tbody tr:last-child td:nth-child(4)', 'k');
            });
        });
        
        describe('User visits operator page', function (argument) {
            var browser = new Browser();
            
            before(function() {
                return browser.visit('/recipes/new');
            });
        
            it('should go to the authentication page', function () {
                browser.assert.redirected();
                browser.assert.success();
                browser.assert.url({ pathname: '/login' });
            });
            
            it('should be able to login with correct credentials', function (done) {
            browser
                .fill('nickname', 'kjozsi')
                .fill('password', 'kjozsi')
                .pressButton('button[type=submit]')
                .then(function () {
                    browser.assert.redirected();
                    browser.assert.success();
                    browser.assert.url({ pathname: '/recipes/list' });
                    done();
                });
            });
            
            it('should go the operator page', function () {
                return browser.visit('/operator')
                .then(function () {
                    browser.assert.success();
                    browser.assert.text('div.page-header > h1', 'Felhasználók');
                });
            });
            /*   
            it('should show the user we created in the previous test at the end of the list', function() {
                browser.assert.element('table.table');
                browser.assert.text('table.table tbody tr:last-child td:nth-child(2)', 'n');   
                browser.assert.text('table.table tbody tr:last-child td:nth-child(3)', 'Gipsz');
                browser.assert.text('table.table tbody tr:last-child td:nth-child(4)', 'Jakab');
                browser.assert.text('table.table tbody tr:last-child td:nth-child(5)', 'normal');
            });
            */
            describe('and finally we create an ingredient', function (argument) {
                var browser = new Browser();
            
                before(function() {
                    return browser.visit('/recipes/new');
                });
            
                it('should go to the authentication page', function () {
                    browser.assert.redirected();
                    browser.assert.success();
                    browser.assert.url({ pathname: '/login' });
                });
                
                it('should be able to login with correct credentials', function (done) {
                browser
                    .fill('nickname', 'k')
                    .fill('password', 'k')
                    .pressButton('button[type=submit]')
                    .then(function () {
                        browser.assert.redirected();
                        browser.assert.success();
                        browser.assert.url({ pathname: '/recipes/list' });
                        done();
                    });
                });
                
                it('should see our last recipe at the end of the list', function() {
                    browser.assert.element('table.table');
                    browser.assert.text('table.table tbody tr:last-child td:nth-child(2)', 'Tárkonyos raguleves');   
                    browser.assert.text('table.table tbody tr:last-child td:nth-child(3) span.label', 'Új');
                    browser.assert.text('table.table tbody tr:last-child td:nth-child(4)', 'k');
                });
                
                it('should visit description page of recipe', function(done) {
                    browser
                        .clickLink('table.table tbody tr:last-child td:nth-child(6) a.recipe-describe')
                        .then(function() {
                            //browser.assert.redirected();
                            browser.assert.success();
                            browser.assert.text('div.page-header > h1', 'Tárkonyos raguleves - Részletes recept');
                            done();
                        });
                });
                
                it('should add new ingredient', function(done) {
                    browser
                        .clickLink('#ingredient-new')
                        .then(function() {
                            //browser.assert.redirected();
                            browser.assert.success();
                            browser.assert.text('div.page-header > h1', 'Új hozzávaló felvitele');
                            browser.fill('tartalom', '1 kg ketchup')
                                   .pressButton('button[type=submit]').then(function() {
                                        browser.assert.redirected();
                                        browser.assert.success();
                                        browser.assert.text('div.page-header > h1', 'Tárkonyos raguleves - Részletes recept');
                                        browser.assert.text('.panel-body p.ingredient-list span.elem:last-of-type','1 kg ketchup');
                                        done();
                                   });
                            
                        });
                });
            });
        });
    });
});

