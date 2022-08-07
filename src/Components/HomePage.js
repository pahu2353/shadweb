import React from 'react';
import './HomePage.css';
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
export class HomePage extends React.Component{
    constructor(props){
        super(props);

    }

    render() {
        
        return(
            <div> Home Page
                <div>
                <Link to="/register">
                    <Button variant="danger" size="lg" className="login">
                        Login | Register
                    </Button>
                </Link>
                </div>
            </div>
        )
    }
}
export default HomePage;