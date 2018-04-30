const express = require('express')
const app     = express()
const hbs     = require('hbs')
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/cars')
.then(() => {
  console.log('Connected to Mongo Database - cars')
}).catch(err => {
  console.error('Error connecting to  Mongo Database - cars', err)
});

const carSchema = new Schema({
  brand: {type: String, required: true},
  model: {type: String, required: true},
  year: {type: String, required: true},
  color: {type: String, required: true},
});

const Car = mongoose.model('Car', carSchema);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/cars', function (req, res) {
  Car.find()
  .then(cars => {
    let data = {};
    data.theList = cars;
    res.render('index', data);
  })
  .catch(theError => {
    console.log(theError);
  })
});

app.get('/cars/new', function (req, res) {
    res.render('newcar');
  });

// Exists inbetween two routes. Exists only in the backend for calcualtions.
// Then redirects us to the homepage.
app.post('/cars/create', function (req, res) {
  console.log("ReqBody: ", req.body);

  const theActualBrand = req.body.theBrand;
  const theActualModel = req.body.theModel;
  const theActualYear = req.body.theYear;
  const theActualColor = req.body.theColor;
  
  const newCar = new Car({
    brand: theActualBrand,
    model: theActualModel,
    year: theActualYear,
    color: theActualColor
  });

  newCar.save()
  .then(car => {
    // console.log(car);
  })
  .catch(theError => { console.log(theError) })
  
  res.redirect('/cars')
});

app.post('/cars/delete/:id', function(req, res){
  const carId = req.params.id;
  Car.findByIdAndRemove(carId)
  .then(car => {
    console.log(car);
  })
  .catch(error => {
    console.log(error);
  })
res.redirect('/cars')
})

app.get('/cars/edit/:id', function (req, res) {
  Car.findById(req.params.id)
  .then(theCar => {
    res.render('editcar', {car: theCar})
  })
});

// req.params for the id + req.body to 
app.post('/cars/update/:id', function (req, res) {
  Car.findByIdAndUpdate(req.params.id, {
    brand: req.body.brand,
    model: req.body.model,
    year: req.body.year,
    color: req.body.color
  })
  .then(car => {
    // console.log(car);
  })
  .catch(theError => { console.log(theError) })
  
  res.redirect('/cars')
  })

app.listen(3000, () => console.log('Server started - localhost:3000'));

//Closes the connection to the video database.
// mongoose.connection.close();