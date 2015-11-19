var expect = require("chai").expect;
var bcrypt = require('bcryptjs');

var Waterline = require('waterline');
var waterlineConfig = require('../config/waterline');
var userCollection = require('../models/user');
var recipeCollection = require('../models/recipe');
var ingredientCollection = require('../models/ingredient');

var User;
function getUserData() {
    return {
        nickname: 'abcdef',
        password: 'jelszo',
        surname: 'Gipsz',
        forename: 'Jakab',
    };
}

before(function (done) {
    // ORM indítása
    var orm = new Waterline();

    orm.loadCollection(Waterline.Collection.extend(userCollection));
    orm.loadCollection(Waterline.Collection.extend(recipeCollection));
    orm.loadCollection(Waterline.Collection.extend(ingredientCollection));
    waterlineConfig.connections.default.adapter = 'memory';

    orm.initialize(waterlineConfig, function(err, models) {
        if(err) throw err;
        User = models.collections.user;
        done();
    });
});

describe('UserModel', function () {

    beforeEach(function (done) {
        User.destroy({}, function (err) {
            done();
        });
    });
    
    it('should work', function () {
        expect(true).to.be.true;
    });
        
    it('should be able to create a user', function () {
        return User.create({
                nickname: 'abcdef',
                password: 'jelszo',
                surname: 'Gipsz',
                forename: 'Jakab',
        })
        .then(function (user) {
            expect(user.nickname).to.equal('abcdef');
            expect(bcrypt.compareSync('jelszo', user.password)).to.be.true;
            expect(user.surname).to.equal('Gipsz');
            expect(user.forename).to.equal('Jakab');
        });
    });
    
    
    it('should be able to find a user', function() {
        return User.create(getUserData())
        .then(function(user) {
            return User.findOneByNickname(user.nickname);
        })
        .then(function (user) {
            expect(user.nickname).to.equal('abcdef');
            expect(bcrypt.compareSync('jelszo', user.password)).to.be.true;
            expect(user.surname).to.equal('Gipsz');
            expect(user.forename).to.equal('Jakab');
        });
    });
    
    it('should be able to update a user', function() {
        var newForename = 'Joska';
        
        return User.create(getUserData())
        .then(function(user) {
            var id = user.id;
            return User.update(id, { forename: newForename });
        })
        .then(function (userArray) {
            var user = userArray.shift();
            expect(user.nickname).to.equal('abcdef');
            expect(bcrypt.compareSync('jelszo', user.password)).to.be.true;
            expect(user.surname).to.equal('Gipsz');
            expect(user.forename).to.equal('Joska');
        });
    });
        
    
        
    [
        {name: 'surname', value: ''},
        {name: 'forename', value: ''},
        {name: 'nickname', value: ''},
        {name: 'password', value: ''},
        {name: 'role', value: ''},
    ].forEach(function (attr) {
        it('should throw error for invalid data: ' + attr.name, function () {
            var userData = getUserData();
    
            userData[attr.name] = attr.value;
            
            expect(User.create(userData)).to.throw;
        });    
    });
    
    describe('#validPassword', function() {
        it('should return true with right password', function() {
             return User.create(getUserData()).then(function(user) {
                 expect(user.validPassword('jelszo')).to.be.true;
             })
        });
        it('should return false with wrong password', function() {
             return User.create(getUserData()).then(function(user) {
                 expect(user.validPassword('titkos')).to.be.false;
             })
        });
    });

});



