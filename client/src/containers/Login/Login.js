import React, { Component } from 'react';
import axios from 'axios';
import textContent from '../../assets/text.json';
import Info from '../../components/UI/Info/Info';
import Backdrop from '../../components/UI/Backdrop/Backdrop'
import SandboxBanner from '../../components/UI/SandboxBanner/SandboxBanner';
import Footer from '../../components/UI/Footer/Footer';
import BackgroundImage from '../../assets/images/login_background.png';
import LinkImage from '../../assets/images/ExternalLink.png';

import classes from './Login.module.css'

/*
    React container that renders the login page
    props:
        click: (function) changes the state of the Layout parent container
            so that the selected page is leads, rendering the leads container
        roleChange: (function) changes the role of the user in the state of 
            the Layout container. 
        
    author: David Kennedy
*/
class Login extends Component {
    state = {
        showInfo: false
    }

    modalToggleHandler = () => {
        this.setState((prevState, props) => ({
            showInfo: !prevState.showInfo
        }))
    }

    render() {
        const backgroundStyle = {
            backgroundImage: `url(${BackgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }

        return (
            <div className={classes.Login} style={backgroundStyle}>
                <Backdrop show={this.state.showInfo} click={this.modalToggleHandler} />
                <div className={classes.LoginContent}>
                    <div className={classes.MessageBox}>
                        <h1> {textContent.login.title} </h1>
                        <p className={classes.InfoBoxParagraph}> {textContent.login.paragraph} </p>
                    </div>
                    <div className={classes.ButtonGroup}>
                        <div className={classes.LoginButtonGroup}>
                            <button onClick={this.login.bind(this, 'agent')}>{textContent.login.loginButton}</button>
                            <Info show={this.state.showInfo} click={this.modalToggleHandler} page="Login"></Info>
                        </div>
                        <a className={classes.GithubLink} href={textContent.links.github} target='_blank' rel="noopener noreferrer">
                            {textContent.login.GitHub} <img src={LinkImage} alt="Github Icon"></img></a>
                    </div>

                </div>
                <SandboxBanner />
                <Footer />
            </div>
        )
    }

    /*
        Click handler for the agent and broker login buttons.

    */
    login = async (role) => {
        try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
            // Fetch a CSRF token bound to this session before triggering the
            // JWT-grant flow.  The token must be echoed back in the request
            // header so the server can verify the call originates from this SPA.
            const csrfRes = await axios.get(`${apiUrl}/auth/csrf-token`, { withCredentials: true });
            const csrfToken = csrfRes.data.csrfToken;

            //get the jwt stored in session cookie
            let loginReq = await axios.post(
                `${apiUrl}/auth/login`,
                {},
                {
                    withCredentials: true,
                    headers: { 'X-CSRF-Token': csrfToken },
                }
            );
            //if status is 210, redirect the user to the constent page
            if (loginReq.status === 210) {
                window.location = loginReq.data;
            }
            //switch the role
            this.props.roleChange(role);
            //reder the leads page
            this.props.click();

        } catch (error) {
            console.log("Login error: ");
            console.log(error);
        }
    }
}


export default Login;