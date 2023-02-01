class TopNavBar {

    getProfileIcon() { return cy.get('[aria-label="Profile"]').first() }

    getGoToProfileOption() { return cy.get('[ui-sref="settings"]').last() }

    getGoToPreferenceOption() { return cy.get('[ui-sref="preferences"]').first() }

    getHomePage() { return cy.get('[ui-sref="home"]') }

    goToProfile() {
        var THIS = this
        this.getProfileIcon().click().then(function() {
            THIS.getGoToProfileOption().should('be.visible').click()
        })
    }

    goToPreference() {
        var THIS = this
        this.getProfileIcon().click().then(function() {
            THIS.getGoToPreferenceOption().should('be.visible').click()
        })
    }     

    // Rayeed - Share Functionality

    getNotificationIcon() { return cy.get('[aria-label="Open Notifications"]') }

    getInvitationOption() { return cy.get('[ng-click="$mdTabsCtrl.select(tab.getIndex())"]').last() } 
    
    getNotificationOption() { return cy.get('[ng-click="$mdTabsCtrl.select(tab.getIndex())"]').first() } 
    
    goToInvitation() {
        var THIS = this
        this.getNotificationIcon().should('be.visible').click().then(function() {
            THIS.getInvitationOption().click({ force : true })
        })
    }

    goToNotificationFromInvitation() { this.getNotificationOption().should('be.visible').click() }

    goToNotification() { this.getNotificationIcon().should('be.visible').click() }

    getInvitationList() { return cy.get('[translate="bsendApp.msg.shareInvite"]') }

    getAcceptButton() { return cy.get('[ng-click="vm.joinSharedFolder($event, notification.data, notification.id)"]') }

    getDeclineButton() { return cy.get('[ng-click="vm.declineInvite($event, notification.data, notification.id)"]') }

    acceptInvitation(folderName) {
        var iter = 0
        var matchIndex = 0
        var THIS = this
        this.goToInvitation()
        this.getInvitationList().each(function(ele) {
            var text = ele.text()
            cy.log(text)
            if(text.includes(folderName)) {
                matchIndex = iter
                THIS.getAcceptButton().eq(matchIndex).click({ force : true })
            }
            iter++
            
        })
    }

    declineInvitation(folderName) {
        var iter = 0
        var matchIndex = 0
        var THIS = this
        this.goToInvitation()
        this.getInvitationList().each(function(ele) {
            var text = ele.text()
            cy.log(text)
            if(text.includes(folderName)) {
                matchIndex = iter
                THIS.getDeclineButton().eq(matchIndex).click({ force : true })
            }
            iter++
            
        })
    }

}

export default TopNavBar