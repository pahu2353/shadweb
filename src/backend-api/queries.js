require('dotenv').config()
const config = require("./auth.config");
var jwt = require("jsonwebtoken");

const { validationResult } = require('express-validator');
const Pool = require('pg').Pool

//Info required to access database
const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT
})


/**Checks whether the given email and password exists within the database
 * 
 * @param {string} email the user's email.
 * @param {string} password the user's password.
 * @return {object} every row that contains the specific email and password combination
 */
const checkUserPassword = (request, response) => {
    
    const {email, password} = request.body
    pool.query('SELECT * FROM applicant_data.account_details WHERE email = $1 AND password = crypt($2, password)', [email, password], (error, results) =>{
        if (error) {
            throw error
        }
        response.status(201).send(results.rows)
    })
}


/**Makes a user in the postgres database
 * 
 * @param {string} email the user's email.
 * @param {string} password the user's password.
 * @param {string} firstName the user's first name
 * @param {string} lastName the user's last name
 * @param {string} country the user's country
 * @param {string} province the user's province
 * @param {string} city the user's city
 * @param {string} postalCode the user's postal code
 * @param {string} address the user's address
 * @param {int} phoneNum the user's phone number
 * @param {string} pronoun the user's pronoun
 * @return {object} a temporary authentication token containing the user's account id
*/
const createUser = (request, response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(422).json({errors:errors.array()})
  }
    const {email, password, firstName, lastName, shadNum, shadYear, shadLocation, birthday, pronoun, province, city, postalCode, address, phoneNum} = request.body;

    var creation_date = new Date();
    creation_date =  (creation_date.getUTCFullYear() + '-' + (creation_date.getUTCMonth() + 1) + '-' + creation_date.getUTCDate());
    
    pool.on('error', (err, client) =>  {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    })
    pool.connect((err, client, done)=> {
      if (err) throw err
      client.query('INSERT INTO account_details (email, password) VALUES ($1, crypt($2, gen_salt(\'bf\'))) ', [email, password], (error, results) => {

        if (error){
            throw error
        }
         })

         client.query('INSERT INTO personal_details (phone_number, address, city, postal_code, province) VALUES ($1, $2, $3, $4, $5, $6) ', [firstName, lastName, pronoun, phoneNum, address, city, postalCode, province , creation_date, role], (error, results) => {
          if (error){
            return console.error("Error with database input", error.stack)
          }
         
        })

        client.query('INSERT INTO applicant_data.profile_table (first_name, last_name, pronoun) VALUES ($1, $2, $3) ', [firstName, lastName, pronoun], (error, results) => {
          
          if (error){
              throw error
          }

           }) 
           client.query('SELECT account_id FROM applicant_data.account_details WHERE email = $1', [email], (error, results) => {

            done()
            if (error) {
              throw error
            }

            var currentAccountId = (results.rows[0]['account_id'])
            //currentAccountId = results
              //Creating and returning the token
           var token = jwt.sign({ id: currentAccountId}, config.secret, {
            expiresIn: 86400 // 24 hours
          });
            response.status(201).send({        
              accessToken: token
          });          
        })
         
      })
    
}

/**Return a user's profile data
 * 
 * @param {object} token the authentication token provided by the user.
 * @return {object} a json object that contains the following profile info: phone_number, address, city, country, postal_code, province, first_name, last_name and email.
 * 
*/
const getUserProfile = (request, response) => {
    let data = []
    let token = request.body.token;

    var accountId =  JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    var accountId = accountId["id"]


    pool.on('error', (err, client) =>  {
      console.error('Unexpected error on idle client', err)
      process.exit(-1)
    })
    pool.connect((err, client, done)=> {
      if (err) throw err
    
      client.query('SELECT phone_number, address, city, country, postal_code, province FROM applicant_data.contact_info WHERE account_id = $1', [accountId], (error, results) => {

        if (error){
            throw error
        }
        data.push(results.rows)
         })

         client.query('SELECT first_name, last_name FROM applicant_data.profile_table WHERE account_id = $1', [accountId],(error, results) => {
          if (error){
            return console.error("Error with database input", error.stack)
          }

          data.push(results.rows)

        })
        client.query('SELECT email FROM applicant_data.account_details WHERE account_id = $1', [accountId], (error, results) => {

          if (error){
              throw error
          }
          data.push(results.rows)
          return response.status(200).send({
            data})
           })

      })
    
}
/**Checking whether or not an email has been used before
 * @param {string} email the email to check 
 * @return {object} the email account, if it exists. Otherwise, returns empty.
 */

const checkValidEmail = (request, response) => {
  const {email} = request.body
  pool.query('SELECT exists(SELECT * FROM applicant_data.account_details WHERE email = $1)', [email], (error, results) => {
      if (error){
          throw error
      }
      response.status(201).send(results.rows)
  })
}



/**a function that takes info from the frontend and modifies the info within the database
 * @param {string} profileId the user's profile id.
 * @param {string} firstName the user's first name
 * @param {string} lastName the user's last name
 * @param {string} pronoun the user's pronoun
 * @param {string} contactId the user's contact id
 * @param {string} city the user's city
 * @param {string} country the user's country
 * @param {string} postalCode the user's postal code
 * @param {int} phoneNum the user's phone number
 * @param {string} address the user's address
 * @param {string} province the user's province
 */
const modifyInfo = (request, response) => {

  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({errors:errors.array()})
  }

  const profileId = parseInt(request.body.profileID)
  const firstName = request.body.firstName
  const lastName = request.body.lastName
  const pronoun = request.body.pronouns
  const contactId = parseInt(request.body.contactID)
  const city = request.body.city
  const country = request.body.country
  const postalCode = request.body.postalCode
  const phoneNum = request.body.phoneNum
  const address = request.body.address
  const province = request.body.province

  pool.connect((error, client, release) => {
    if (error) {
      return console.error("Error with client", error.stack)
    }
    client.query('UPDATE public.profile_table SET first_name = $1, last_name = $2, pronoun = $3 WHERE profile_id = $4', [firstName, lastName, pronoun, profileId], (error, results) => { 
      release()
      if (error){
        return console.error("Error with database input", error.stack)
      }
    })
  })
  
  pool.query('UPDATE public.contact_info SET city = $1, country = $2, postal_code = $3, phone_number = $4, address = $5, province = $6 WHERE contact_id = $7', [city, country, postalCode, phoneNum, address, province, contactId], (error, results) => {
    if (error) {
      throw error
    }
  })

}

  module.exports = {
    checkValidEmail,
    createUser,
    checkUserPassword,
    modifyInfo,
    getUserProfile,
  }