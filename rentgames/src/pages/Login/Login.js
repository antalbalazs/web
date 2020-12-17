import {React} from 'react'
import { Component } from 'react';
import './styles/loginStyle.css';

export class Login extends Component{

    sendLoginRequest(event){

        event.preventDefault()
        let user = {}
        const formData = new FormData(document.querySelector('form'))
        
        for (var userData of formData.entries()) {
            user[userData[0]] = userData[1]
        }

        fetch("http://localhost:8080/authenticate",{method: 'POST',body:JSON.stringify(user),headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }})
        .then(response => {
            if(response.ok){
                return response.json()
            }else{
                throw new Error("Wrong credentials")
            }
        })
        .then(responseData => {
            localStorage.setItem('token',responseData.jwt)
            window.location.href = "/games"
        })
        .catch(e => alert(e.message))
    }

    render() {
        return (
            <div id="loginContainer">
                <form onSubmit={this.sendLoginRequest.bind(this)} id="loginForm">
                    <label for="username">Username:</label>
                    <input type="text" id="username" name="username" placeholder="Username"/><br/>
                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password" placeholder="Password"/><br/>
                    <input type="submit" id="loginButton" value="Login"/>
                </form>
            </div>
        )
    }
}