/// <reference types="Cypress" />

//import { AssertionError } from "chai"

class SignInPage
{   

    getUserNameBox(){
        return cy.get('#username')
    }

    getPasswordBox(){
        return cy.get('#password')
    }

    getSignInButton(){
        return cy.get('#signinButton')
    }

    signIn(username,password){
        this.getUserNameBox().type(username)
        this.getPasswordBox().type(password)
        this.getSignInButton().click()
        
        
    }








}

export default SignInPage