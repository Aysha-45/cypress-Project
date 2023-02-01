class EmailSettingsPage {

    getMailSettingsTab() { return cy.contains("Mail Settings") }
    getServerHost() { return cy.get('[id="host"]') }
    getUserName() { return cy.get('[name="userName"]') }
    getPassword() { return cy.get('[name="password"]') }
    getSaveButton() { return cy.get('span[translate="bsendApp.emailSetting.save"]') }

    configureMail(host, emailUserName, emailPassword){
        this.getServerHost().clear()
        this.getUserName().clear()
        this.getPassword().clear()
        this.getServerHost().clear().type(host)
        this.getUserName().type(emailUserName)
        this.getPassword().type(emailPassword)
        this.getSaveButton().click()
    }

}
export default EmailSettingsPage