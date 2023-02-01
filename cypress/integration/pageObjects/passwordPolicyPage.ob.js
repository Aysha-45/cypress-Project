class PasswordPolicyPage {

    getPasswordPolicyLink(){return cy.contains("Password Policy")}
    getMinimumLengthField() { return cy.get('[name="minLength"]') }
    getPasswordComplexityOne() { return cy.get('[translate="bsendApp.password-policy.complexity.uppercase"]') }
    getPasswordComplexityTwo() { return cy.get('[translate="bsendApp.password-policy.complexity.lowercase"]') }
    getPasswordComplexityThree() { return cy.get('[translate="bsendApp.password-policy.complexity.number"]') }
    getPasswordComplexityFour() { return cy.get('[translate="bsendApp.password-policy.complexity.specialCharacter"]') }
    getRestToDefault() { return cy.get('span[translate="bsendApp.password-policy.resetToDefault"]')}
    getSaveButton() { return cy.get('span[translate="bsendApp.password-policy.save"]') }
    


    passwordPolicyFirst(minLength){
        this.getPasswordPolicyLink().click()
        this.getMinimumLengthField().type(minLength)
        this.getPasswordComplexityOne().click()
        this.getPasswordComplexityTwo().click()
        this.getPasswordComplexityThree().click()
        this.getPasswordComplexityFour().click()
        this.getSaveButton().click()

    }



} 
export default PasswordPolicyPage