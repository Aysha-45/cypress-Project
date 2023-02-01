class SignUpPage {


    getEmail() {
        return cy.get('[ng-reflect-name="email"]')
    }
    getPassword() {
        return cy.get('[ng-reflect-name="password"]')
    }
    getFirstName() {
        return cy.get('[ng-reflect-name="firstName"]')
    }
    getLastName() {
        return cy.get('[ng-reflect-name="lastName"]')
    }
    getCompanyName() {
        return cy.get('[ng-reflect-name="company"]')
    }
    getCompanyAddress() {
        return cy.get('[name="companyAddress"]')
    }
    getCityName() {
        return cy.get('[ng-reflect-name="city"]')
    }

    getZipCode() {
        return cy.get('[ng-reflect-name="zipCode"]')
    }
    getPhoneNumber() {
        return cy.get('[ng-reflect-name="phoneNumber"]')
    }
    getDomainName() {
        return cy.get('[ng-reflect-name="domain"]')
    }
    getNextButton() {
        return cy.get('button[class="mat-focus-indicator mat-raised-button mat-button-base mat-primary"]')
            .contains('Next')
    }

    getTosErrorMessage(){
        return cy.get('[jhitranslate="userManagement.tos_error"]')
    }

    getTosCheckBox(){
        return cy.get('#mat-checkbox-2-input')
    }


    getState() {
        return cy.get(`mat-select[name="companyState"]`)
    }

    selectState(stateName) {
        return cy.get(`mat-select[name="companyState"]`)
            .click()
            .then(() => {
                cy.get('mat-option')
                    .contains(stateName)
                    .click()
            })
    }

    getAlert() {
        return cy.get('[role="alert"]')
    }

    getNumberOfUser(){
        return cy.get('#mat-input-11')
    }

    getNumberOfUserHint(){
        return cy.get('#mat-hint-1')
    }

    getPlanCardTitle(){
        return cy.get('.plan-card2 .plan-title')
    }

    getNumberOfUserFromOrderDetail(){
        return  cy.get('.plan-card-calc > :nth-child(2) > :nth-child(1)')
    }

    getPricePerUserPerMonthOrderDetail(){
        return cy.get('.plan-card-calc > :nth-child(2) > :nth-child(4)')
    }

    getPriceTotal(){
        return cy.get('.plan-card-calc > :nth-child(2) > :nth-child(2)')
    }
    
    getPriceTotalBeforeTax(){
        return cy.get('[style="float: right; font-size: 24px;"]')
    }

    getDiscountPrice(){
        return cy.get('.plan-card-calc > :nth-child(2) > :nth-child(9)')
    }

    getNextButtonPlanForm(){
        return cy.get('button[class="mat-focus-indicator mat-raised-button mat-button-base mat-primary"]:nth-child(2)').contains('Next')
    }

    getNextButtonCreditCardForm(){
        return cy.get('#cdk-step-content-0-2 > .signup-form > .btn-group > .mat-raised-button')
    }

    getIframeBody(iframe) {
        // get the iframe > document > body
        // and retry until the body element is not empty
        return cy
            .get(iframe)
            .its('0.contentDocument.body').should('not.be.empty')
            // wraps "body" DOM element to allow
            // chaining more Cypress commands, like ".find(...)"
            // https://on.cypress.io/wrap
            .then(cy.wrap)
    }

    getCreditCardNumber(){
        return this.getIframeBody('#chargify-field-card > iframe').find('#cfy-number')
    }
    getFirstNameCreditCardInfo(){
        return this.getIframeBody('#chargify-field-firstName > iframe').find('#cfy-firstName')
    }
    getLastNameCreditCardInfo(){
        return this.getIframeBody('#chargify-field-lastName > iframe').find('#cfy-lastName')
    }
    getMonthCreditCardInfo(){
        return this.getIframeBody('#chargify-field-month > iframe').find('#cfy-month')
    }
    getYearCreditCardInfo(){
        return  this.getIframeBody('#chargify-field-year > iframe').find('#cfy-year')
    }
    getCvvCreditCardInfo(){
        return this.getIframeBody('#chargify-field-cvv > iframe').find('#cfy-cvv')
    }
    getBillinAddressAsCompanyCheckBox(){
        return cy.get('#mat-checkbox-1-input')
    }

    getBillingAddress() {
        return cy.get('[name="billingAddress"]')
    }
    getBillingCity() {
        return cy.get('[name="billingCity"]')
    }

    getBillingZipCode() {
        return cy.get('[name="billingZipCode"]')
    }

    getCreditCardImage(){
        return this.getIframeBody('#chargify-field-card > iframe').find('.cfy-cc-image').find('img')
        
    }
    getEditAccountInfo(){
        return cy.get('[jhitranslate="userManagement.account_information"] +  mat-icon')
    }
    getEditDomainName(){
        return cy.get('[jhitranslate="userManagement.domainName"] +  mat-icon')
    }
    getEditSelectedPlan(){
        return cy.get('[jhitranslate="userManagement.selectedPlan"] +  mat-icon')
    }
    getEditpaymentMethod(){
        return cy.get('[jhitranslate="userManagement.paymentMethod"] +  mat-icon')
    }

    getAccountInfoForm(){
        return cy.get('#cdk-step-content-0-0',{timeout: 15000})
    }
    getConfirmForm(){
        return cy.get('#cdk-step-content-0-3',{timeout: 15000})
    }

    getPaymentForm(){
        return cy.get('#cdk-step-content-0-2',{timeout: 15000})
    }

    getPlanForm(){
        return cy.get('#cdk-step-content-0-1',{timeout: 15000})
    }

    getBackButtonConfirmationForm(){
        return cy.get('#cdk-step-content-0-3 > .signup-form > .btn-group > .mat-stroked-button')
    }

    getBackButtonCardForm(){
        return cy.get('#cdk-step-content-0-2 > .signup-form > .btn-group > .mat-stroked-button')
    }

    getBackButtonPlanForm(){
        return cy.get('#cdk-step-content-0-1 > .signup-form > .btn-group > .mat-stroked-button')
    }

    getStartTrialButton(){
        return cy.get('button').contains('Start Free Trial')
    }

    getSignUpCompletePage(){
        return cy.get('.signup-complete')
    }

    getSignUpCompleteMessge(){
        return cy.get('[jhitranslate="signupProgress.completedMessage.thank-you"]',{timeout:60000})
    }
    getSignUpCompleteFullMessge(){
        return cy.get('.completed-message-section',{timeout:60000})
    }
    getGoToMyAccountButton(){
        return cy.get('.mat-focus-indicator')
    }

    selectBillingState(stateName) {
        return cy.get(`mat-select[name="billingState"]`)
            .click()
            .then(() => {
                cy.get('mat-option')
                    .contains(stateName)
                    .click({force:true})
            })
    }


    alertMessageAssert(length, message) {
        this.getAlert()
            .should('have.length', length)
            .each(function (element) {
                expect(element.text()).to.contain(message)
            }).then(function () {
                cy.task('log', length + ' field of the form contains the text- ' + message)

            })
    }

    fillAccountInformationForm(email, passwd, fName, lName, company, cAddress, city, state, zipcode, phone, domain) {
        this.getEmail().type(email)
        this.getPassword().type(passwd)
        this.getFirstName().type(fName)
        this.getLastName().type(lName)
        this.getCompanyName().type(company)
        this.getCompanyAddress().type(cAddress)
        this.getCityName().type(city)
        this.selectState(state)
        this.getZipCode().type(zipcode)
        this.getPhoneNumber().type(phone)
        this.getDomainName().type(domain)
        //this.getNextButton().click()
    }

    filCreditCardInfo(cardType,fName,lName,month,year,cvv,billingAddressBool,bAddress,bCity,bState,bZip){
        cy.cmdLogStep('Fill the credit card info')

            this.getCreditCardNumber().clear().type(cardType)
            cy.cmdLogResult('Amex card number entered: '+cardType)

            this.getFirstNameCreditCardInfo().clear().type(fName)
            cy.cmdLogResult('Firsr name entered: '+fName)

            this.getLastNameCreditCardInfo().clear().type(lName)
            cy.cmdLogResult('Last name entered: '+lName)

            this.getMonthCreditCardInfo().clear().type(month)
            cy.cmdLogResult('Month entered: '+month)

            this.getYearCreditCardInfo().clear().type(year)
            cy.cmdLogResult('Year entered: '+year)

            this.getCvvCreditCardInfo().clear().type(cvv)
            cy.cmdLogResult('CVV entered: '+cvv)

            if(billingAddressBool){
                cy.cmdLogStep('Uncheck the same billing address as company')
                this.getBillinAddressAsCompanyCheckBox().uncheck({force:true})
                cy.cmdLogResult('Billing address as company is unchecked')
    
                this.getBillingAddress().clear().type(bAddress)
                cy.cmdLogResult("Billing address entered: "+bAddress)
    
                this.getBillingCity().clear().type(bCity)
                cy.cmdLogResult('Billing city entered: '+bCity)
    
                this.selectBillingState(bState)
                cy.cmdLogResult('Billing state slected: '+bState)
    
                this.getBillingZipCode().clear().type(bZip)
                cy.cmdLogResult('Billing zip code entered: '+bZip)
    
            }
            
    }

    passWordRuleChekMatContent(type){
        cy.get('[class="mat-card-content"] div:nth-child(n)').each(function(el) {

            var text = el.text()
            if(text.includes(type)){
                expect(text).to.contain('done')
            }
        })
    }


}
export default SignUpPage