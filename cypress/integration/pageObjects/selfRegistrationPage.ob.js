``
/// <reference types="Cypress" />

//import { AssertionError } from "chai"

class SelfRegistrationPage
{   

 
   
    getFirstNameBox(){
        return cy.get('#firstName')
    }
    getLastNameBox(){
        return cy.get('#lastName')
    }
   
    getMobileBox(){
        return cy.get('#mobilePhoneNumber')
    }

    getPassword(){
        return cy.get('#password')
    }

    getConfirmPassword(){
        return cy.get('#confirmPassword')
    }

    getRegisterButton(){
        return cy.get('[translate="register.form.button"]')
        
    }

   
   
    selfRegistrationParam() {

        this.firstName = null;
        this.lastName = null;
        this.mobile = null;
        this.password = null;
        this.confirmPassword = null;
       

    }

    
    selfRegistration(params) {

        

        if (params.firstName) {

           
            this.getFirstNameBox().clear().type(params.firstName)

        };
        if (params.lastName) {

            this.getLastNameBox().clear().type(params.lastName)

        };
       
        if (params.mobile) {

            
            this.getMobileBox().clear().type(params.mobile)

        };
        if (params.password) {

           
            this.getPassword().clear().type(params.password)


        };
        if (params.confirmPassword) {

            
            this.getConfirmPassword().clear().type(params.confirmPassword)

        };
      
         

        this.getRegisterButton().click()


      


    }

   
   
    

    }

    
   


export default SelfRegistrationPage







