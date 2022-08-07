const express = require('express')

const db = require('./queries')
const { body } = require('express-validator');
const bodyParser = require('body-parser')
const app = express()
const port = 3001

//Sanitization and validation of data that is entered when creating an account
var loginValidate = [
  /*body('email', 'Email is invalid').isEmail(),
  body('password').isLength({ min: 8 })
  .withMessage('Password Must Be at Least 8 Characters')
  .matches('[0-9]').withMessage('Password Must Contain a Number')
  .matches('[A-Z]').withMessage('Password Must Contain an Uppercase Letter')
  .trim().escape(), 
  body('phoneNum').isNumeric().withMessage("Phone number must only consist of numbers").isLength({ max: 11 }).escape(),
  body('firstName').isAlpha().withMessage('Name must consist of only letters.').escape(),
  body('lastName').isAlpha().withMessage('Last name must consist of only letters.').escape(),
  body('city').isAlpha().withMessage('City must consist of only letters.').escape(),
  body('postalCode').escape(),
  body('address').escape(),*/
];


//Bypass of CORS policy
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
  res.header("Access-Control-Allow-Headers", "url, Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Origin");
  next();
});


app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  )

app.post('/users/checkValidEmail',  db.checkValidEmail),
app.post('/users/authenticate', db.checkUserPassword)
app.post('/users/create',loginValidate, db.createUser)
app.post('/users/userProfile', db.getUserProfile)

// uses functions from the express validator library for info  validation
app.post('/modify', 
  body('firstName').isAlpha().isLength({max:30}),
  body('lastName').isAlpha().isLength({max:30}),
  body('phoneNum').isLength({max:12}).isMobilePhone(),
  body('postalCode').isAlphanumeric(),
  db.modifyInfo)

app.listen(port, () => {  
    console.log(`Example app listening on port ${port}`)
})
