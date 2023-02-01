class userPreferencesPage {

    getDefaultHomePageSetField() { return cy.get('[id="home-page"]')}

    getInboxOptionForDefaultHomePage() { return cy.get('[ng-repeat="item in vm.homePageList"]').contains('Inbox')}

    getFilesOptionForDefaultHomePage() { return cy.get('[ng-repeat="item in vm.homePageList"]').contains('Files')}

    getSaveButton() { return cy.get('[ng-click="vm.save()"]')}    
    
    setDefaultHomePage(fieldValue)
    {
        this.getDefaultHomePageSetField().click({ force : true})

        if(fieldValue == "INBOX") { this.getInboxOptionForDefaultHomePage().click({ force : true}) }
        else if(fieldValue == "FILES") { this.getFilesOptionForDefaultHomePage().click({ force : true}) }

        this.getSaveButton().click({ force : true} )
    }

}

export default userPreferencesPage

