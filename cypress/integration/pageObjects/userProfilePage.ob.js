class userProfilePage {

    getFirstNameField() { return cy.get('[id="firstName"]') }

    getLastNameField() { return cy.get('[id="lastName"]') }

    getPhoneNumberField() { return cy.get('[id="mobilePhoneNumber"]') }

    getSaveButton() { return cy.get('[ng-click="vm.save()"]') }

    getUploadProfilePictureButton() { return cy.get('[class="upload-pic"]') }

    getChooseProfilePictureButton() { return cy.get('[class="dialog-btn md-button md-ink-ripple ng-empty ng-valid"]').contains('Choose Picture') }

    saveUploadedProfilePictureButton() { return cy.get('[ng-click="vm.upload(picFile.name)"]') }

    getPreferenceOption() { return cy.get('[has-any-authority="common.userProfile"]') }

    getPictureUpload() { return cy.get('input[ng-model="picFile"]') }
    
    userProfileInfoParams() {

        this.firstName = null;
        this.lastName = null;
        this.mobilePhoneNumber = null;

    }

    editUserProfile(params) {

        if(params.firstName) { this.getFirstNameField().clear().type(params.firstName) }
        if(params.lastName) { this.getLastNameField().clear().type(params.lastName) }
        if(params.mobilePhoneNumber) { this.getPhoneNumberField().clear().type(params.mobilePhoneNumber) }

        this.getSaveButton().should('be.visible').click()

    }

    uploadProfilePicture(attachedProfilePicture) {

        this.getUploadProfilePictureButton().click({ force : true })
        this.getPictureUpload().attachFile(attachedProfilePicture)
        cy.wait(2000)
        this.saveUploadedProfilePictureButton().first().should('be.visible').click()
        //cy.wait(2000)
        this.getSaveButton().should('exist').click({ force : true })

    }

}

export default userProfilePage