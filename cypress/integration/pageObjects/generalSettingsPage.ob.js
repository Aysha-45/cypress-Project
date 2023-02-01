class GeneralSettingsPage{

    getGeneralSettingsTab(){return cy.contains("General Settings")}
    getTimeZone(){}
    getsessionTimeout(){return cy.get('[name="sessionTimeout"]')}
    getSaveButton(){return cy.get('span[translate="bsendApp.generalSetting.save"]')}

    configureGeneralSettings(sessionTimeout){
        this.getsessionTimeout().clear().type(sessionTimeout)
        this.getSaveButton().click()
    }
} 
export default GeneralSettingsPage