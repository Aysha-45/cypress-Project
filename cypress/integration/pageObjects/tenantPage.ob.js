class TenantPage {

    getTenantTab(){return cy.contains("Tenants")}
    getAddTenantButton() { return cy.contains('Add Tenant') }
    getTenantName() { return cy.get('[name="name"]') }
    getSessionTimeout() { return cy.get('[name="sessionTimeout"]') }
    getAdmiEmail() { return cy.get('[name="adminEmail"]') }
    getAdminFirstName() { return cy.get('[name="adminFirstName"]') }
    getAdminLastName() { return cy.get('[name="adminLastName"]') }
    getPassword() { return cy.get('[name="adminPassword"]') }
    getPasswordConfirmation() { return cy.get('[name="adminConfirmPassword"]') }
    getNumberOfLicensedUser() { return cy.get('[name="licensedUserLimit"]') }
    getSaveButton() { return cy.get('span[translate="bsendApp.tenant.save"]') }
    getTotalStorage() { return cy.get('#tenantTotalStorage') }


    addTenant(tenantName,adminEmail,adminFirstName,adminLastName,tenantAdminPassword,tenantAdminConfPass,licensedUserNumber,storage,sessionTimeOut){
        this.getAddTenantButton().click()
        this.getTenantName().type(tenantName)
        this.getNumberOfLicensedUser().type(licensedUserNumber)
        this.getAdmiEmail().type(adminEmail)
        this.getAdminFirstName().type(adminFirstName)
        this.getAdminLastName().type(adminLastName)
        this.getPassword().type(tenantAdminPassword)
        this.getPasswordConfirmation().type(tenantAdminConfPass)
        this.getSaveButton().click()

    }



} 
export default TenantPage