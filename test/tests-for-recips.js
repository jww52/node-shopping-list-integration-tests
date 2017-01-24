const chai = require('chai');
const chaiHttp = require('chai-http');

const{app, runServer, closeServer} = require('../server');

const should = chai.should();

chai.use(chaiHttp);

describe('Recipes', function () {

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  it('Should list recipes on GET', function() {
    return chai.request(app)
    .get('/recipes')
    .then(function(res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('array');
      res.body.length.should.be.at.least(1);

      const expectedKeys = ['id', 'name', 'ingredients'];
      res.body.forEach(function(item) {
        item.should.be.a('object');
        item.should.include.keys(expectedKeys);
      });
    });
  });

  it('Should add a new recipe on POST', function() {
    const newRecipe = {name: 'iceWater', ingredients: ['water', 'ice']};
    return chai.request(app)
    .post('/recipes')
    .send(newRecipe)
    .then(function (res) {
      res.should.have.status(201);
      res.should.be.json;
      res.should.be.a('object');
      res.body.should.include.keys('id', 'name', 'ingredients');
      res.body.id.should.not.be.null;
      res.body.should.deep.equal(Object.assign(newRecipe, {id: res.body.id}));
    });//then
  });//it should

  it('Should update a recipe on PUT', function() {
    const updatedRecipe = {name: 'iceTea', ingredients: ['Tea', 'ice']};
    return chai.request(app)
    .get('/recipes')
    .then(function(res) {
      updatedRecipe.id = res.body[0].id;
      return chai.request(app)
      .put(`/recipes/${updatedRecipe.id}`)
      .send(updatedRecipe);
    })
    .then(function (res) {
      res.should.have.status(200);
      res.should.be.json;
      res.should.be.a('object');
      res.body.should.deep.equal(updatedRecipe);
    });
  });//it should

  it('Should delete recipes on DELETE', function() {
    return chai.request(app)
    .get('/recipes')
    .then(function(res){
      return chai.request(app)
        .delete(`/recipes/${res.body[0].id}`);
    })
    .then(function(res) {
      res.should.have.status(204);
    });
  });//it should
});//describe closing
