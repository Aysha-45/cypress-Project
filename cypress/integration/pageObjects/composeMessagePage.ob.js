
class ComposeMessagePage {

    getRecipient() { return cy.get('input[ng-model="$mdAutocompleteCtrl.scope.searchText"]').first() }
    getSubject() { return cy.get('input[ng-model="vm.message.subject"]') }
    getSecureNote() { return cy.get('div.ql-editor').first() }
    getShowEmailNotificationLink() { return cy.get('[ng-show="!vm.showMessage"]') }
    getEmailNotificationMessage() { return cy.get('div[class="ql-editor ql-blank"]') }
    getAttachFilesButton() { return cy.get('[translate="bsendApp.message.attachFiles"]') }
    getSaveButton() { return cy.get('[ng-click="vm.autoSaveDraft(true)"]') }
    getSendButton() { return cy.get('[ng-click="vm.save()"]') }
    getSignInRequiredCheckBox() { return cy.get('md-checkbox[aria-label="Require recipients to sign in"][type="checkbox"]') }
    getSubmitButtonForFileAttachment() { return cy.get('[ng-click="vm.submit()"]').contains('Attach') }
    getAlertContinueButton() { return cy.get('[ng-click="dialog.hide()"]') }
    getFilesButton() { return cy.get('[ng-click="vm.changeSource(\'myFiles\')"]') }
    getSaveAsDraftButton() { return cy.get('[translate="entity.action.saveAsDraft"]') }
    getEditButtonOfDraftMessage() { return cy.get('[ng-show="vm.list.totalChecked() <= 1"] [aria-label="Edit"]') }
    getRecipientChip() { return cy.get('md-chip-template md-menu') }






    composeMessageParam() {

        this.recipient = null;
        this.recipientTwo = null;
        this.recipientThree = null;
        this.recipientFour = null;
        this.recipientFive = null;
        this.subject = null;
        this.secureNote = null;
        this.notificationMessage = null;
        this.attachedFileLocationMyComputer = null;
        this.attachedFileLocationMyFiles = null;
        this.signInNotRequired = null;
        this.saveToDraft = null;
        this.doNotSend = null;
        this.assertValue = null;
        this.dragDrop = null;

    }

    composeMessage(params) {
        var THIS = this
        if (params.recipient) {
            this.getRecipient().clear()
            this.getRecipient().focus().type(params.recipient,{waitForAnimations:true})
           // this.getRecipient().type('{enter}')
            this.getSubject().click().then(() => {
                THIS.getRecipientChip().should('contain.text', params.recipient)
            })


        }
        if (params.recipientTwo) {
            this.getRecipient().focus().type(params.recipientTwo,{waitForAnimations:true})
           // this.getRecipient().type('{enter}')
            this.getSubject().click().then(() => {
                THIS.getRecipientChip().should('contain.text', params.recipientTwo)
            })

        }
        if (params.recipientThree) {
            this.getRecipient().focus().type(params.recipientThree,{waitForAnimations:true})
            //this.getRecipient().type('{enter}')
            this.getSubject().click().then(() => {
                THIS.getRecipientChip().should('contain.text', params.recipientThree)
            })

        }
        if (params.recipientFour) {
            this.getRecipient().focus().type(params.recipientFour,{waitForAnimations:true})
           // this.getRecipient().type('{enter}')
            this.getSubject().click().then(() => {
                THIS.getRecipientChip().should('contain.text', params.recipientFour)
            })

        }
        if (params.recipientFive) {
            this.getRecipient().focus().type(params.recipientFive,{waitForAnimations:true})
            //this.getRecipient().type('{enter}')
            this.getSubject().click().then(() => {
                THIS.getRecipientChip().should('contain.text', params.recipientFive)
            })

        }
        if (params.subject) {
            this.getSubject().clear()
            this.getSubject().type(params.subject).should('have.value', params.subject)
        }

        if (params.secureNote) {
            this.getSecureNote().clear({ force: true })
            this.getSecureNote().type(params.secureNote, { force: true })
        }
        if (params.notificationMessage) {

            this.getEmailNotificationMessage().should('not.be.visible')
            this.getShowEmailNotificationLink().click()
            this.getEmailNotificationMessage().should('be.visible')
            this.getEmailNotificationMessage().clear()
            this.getEmailNotificationMessage().type(params.notificationMessage)
        }

        if (params.signInNotRequired) {
            this.getSignInRequiredCheckBox().should('have.attr', 'aria-checked', 'true')
            this.getSignInRequiredCheckBox().click()
            this.getSignInRequiredCheckBox().should('have.attr', 'aria-checked', 'false')
            cy.wait(5000)

            if (params.secureNote) {
                this.getAlertContinueButton().should('be.visible').click()
            }
        }

        if (params.dragDrop) {

        }
        if ((params.attachedFileLocationMyComputer) || (params.attachedFileLocationMyFiles)) {

            this.getAttachFilesButton().click()

            if (params.attachedFileLocationMyComputer) {

                cy.cmdLogStep('Attach file')
                cy.upload(params.attachedFileLocationMyComputer)

                var str = params.attachedFileLocationMyComputer
                var fileNameFromComputer = str.substring(str.lastIndexOf("/") + 1, str.length)

                cy.attachmentAssert(fileNameFromComputer)
                cy.cmdLogResult('Attached file successfully from my computer')


            }
            if (params.attachedFileLocationMyFiles) {

                var str = params.attachedFileLocationMyFiles
                var fileNameFromMyFiles = str.substring(str.lastIndexOf("/") + 1, str.length)

                this.getFilesButton().click()
                //cy.get('[title="' + fileNameFromMyFiles + '"]').click()
                cy.get('[ng-click="selectMember(member)"]').contains(fileNameFromMyFiles).click()
                cy.attachmentAssert(fileNameFromMyFiles)
                cy.cmdLogResult('Attached file successfully from my files')
            }

            this.getSubmitButtonForFileAttachment().click()
            cy.uploadAssert('Completed')
        }



        if (params.saveToDraft) {
            this.getSaveButton().click()
        }

        else if (params.doNotSend) {
            cy.cmdLogResult('Not sending message')
        }

        else {

            this.getSendButton().click()


        }


    }

    goToSpecificDraftMessage(messageSubject) {
        var THIS = this
        cy.get('h4.c-checkable-list-item__subject.p-l-7 > span').each(function (elem) {
            var subject = elem.text()

            if (subject === messageSubject) {
                THIS.getEditButtonOfDraftMessage().click()
                return false
            }
        })
    }


}
export default ComposeMessagePage