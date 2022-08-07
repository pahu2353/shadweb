import React from "react";
import Button from 'react-bootstrap/Button';
import axios from "axios";
export class RegisterPage extends React.Component{
    constructor(props){
        super(props);
        this.state={
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            pronoun: "",
            shadNum: 0,
            shadYear: 0,
            shadLocation: "",
            birthday: "",
            province: "",
            city: "",
            address: "",
            postalCode: "",
            phoneNum: "",
        }
        this.handleTextChange = this.handleTextChange.bind(this);
      }
      handleTextChange(e){
        /* depending on what "id" is passed through the text box, set the 
            corresponding id's state to whatever was in the text*/
        this.setState({[e.target.id]:e.target.value})
        console.log(this.state.email)
    }
    async handleSubmit(e) {
      e.preventDefault();
      //Email and Password Data
      let toSend = this.state;
    
      console.log(toSend);
    
      await axios
        .post("http://localhost:3001/users/create", toSend)
        .then((res) => {
          window.sessionStorage.setItem("accessToken", res.data.accessToken);
          window.location.href = "/profile";
        })
        .catch((err) => {
          console.log("ERR");
          console.log(err.response.data.errors);
          console.log(
            "An error occured when creating the account. Please try again later."
          );
        });
    }
    render() {
        return(
            <div>   
                 
                <form onSubmit={this.handleSubmit} >
                    <h1>
                        <b>Register Account</b>
                    </h1>
                    <input
                        placeholder="Email"
                        type="text"
                        id="email"
                        onChange={this.handleTextChange}
                        className="textbox"
                    />
                    <br />
                    <input
                        placeholder="Password"
                        type="text"
                        id="password"
                        onChange={this.handleTextChange}
                        className="textbox"
                    />
                      <br />
                    <input
                        placeholder="First Name"
                        type="text"
                        id="firstName"
                        onChange={this.handleTextChange}
                        className="textbox"
                    />
                      <br />
                    <input
                        placeholder="Last Name"
                        type="text"
                        id="lastName"
                        onChange={this.handleTextChange}
                        className="textbox"
                    />
                      <br />
                      <input
                        placeholder="Pronoun"
                        type="text"
                        id="pronoun"
                        onChange={this.handleTextChange}
                        className="textbox"
                    />
                      <br />
                      <input
                        placeholder="Birthday"
                        type="text"
                        id="birthday"
                        onChange={this.handleTextChange}
                        className="textbox"
                    />
                       <br />
                    <input
                        placeholder="Phone Number"
                        type="text"
                        id="phoneNum"
                        onChange={this.handleTextChange}
                        className="textbox"
                    /> 
                    <br />
                    <input
                        placeholder="Shad Number"
                        type="text"
                        id="shadNum"
                        onChange={this.handleTextChange}
                        className="textbox"
                    />
                      <br />
                    <input
                        placeholder="Shad Year"
                        type="text"
                        id="shadYear"
                        onChange={this.handleTextChange}
                        className="textbox"
                    />
                      <br />
                    <input
                        placeholder="Shad Location"
                        type="text"
                        id="shadLocation"
                        onChange={this.handleTextChange}
                        className="textbox"
                    />

                    <br />
                    <input
                        placeholder="Province"
                        type="text"
                        id="province"
                        onChange={this.handleTextChange}
                        className="textbox"
                    />
                    <br />
                    <input
                        placeholder="City"
                        type="text"
                        id="city"
                        onChange={this.handleTextChange}
                        className="textbox"
                    />
                      <br />
                    <input
                        placeholder="Address"
                        type="text"
                        id="address"
                        onChange={this.handleTextChange}
                        className="textbox"
                    />
                    <br />
                    <input
                        placeholder="Postal Code"
                        type="text"
                        id="postalCode"
                        onChange={this.handleTextChange}
                        className="textbox"
                    />


                    
                    <div>
                        <Button
                            type="submit"
                            variant="danger"
                            onClick={this.handleSubmit}
                            className="login-button">
                            Register
                        </Button>
                    </div>
                </form>
            </div>
        )
    }

}
export default RegisterPage;