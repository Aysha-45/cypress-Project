class UserPage {

    getSearchBoxManagerTenant() { return cy.get('[ng-model="vm.search.searchText"]').first() }

    getSearchIconManagerTenant() { return cy.get('[aria-label="search"]').first() }

    getSearchBoxTenantAdmin() { return cy.get('[ng-model="vm.search.searchText"]').first() }

    getSearchIconTenantAdmin() { return cy.get('[aria-label="search"]').first() }

    getHovertoEmailManagerTenant() {return cy.get('[ng-click="vm.rowClicked(user)"]') }

    getHovertoEmailManagerTenantOp() {return cy.get('[ng-bind-html="user.email | highlight: \'email\':user.$trackingId"]') }

    getHovertoEmailTenantAdmin() {return cy.get('[ng-click="vm.rowClicked(user)"]') }

    getHovertoEmailExternalTenantAdmin() {return cy.get('[ng-click="vm.rowClicked(user)"]') }

    getResetPasswordLink() { return cy.get('.link-item').contains("Reset Password") }

    getEditLink() { return cy.get('.link-item').contains("Edit") }

    getDeleteLink() { return cy.get('.link-item').contains("Delete") }

    getDisableUserLink() { return cy.get('.link-item').contains("Disable User") }

    getEnableUserLink() { return cy.get('.link-item').contains("Enable User") }

    getUserDeleteConfirmButtonManagerTenant() { return cy.get('[ng-click="vm.confirmDelete()"]') }

    getUserDeleteCancelButtonManagerTenant() { return cy.get('[ng-click="vm.clear()"]') }

    getUserDeleteConfirmButtonTenantAdmin() { return cy.get('[ng-click="vm.confirmDelete()"]') }

    getUserDeleteCancelButtonTenantAdmin() { return cy.get('[ng-click="vm.clear()"]') }

    getDisableUserConfirmButton() { return cy.get('[ng-click="dialog.hide()"]') }

    getDisableUserCancelButton() { return cy.get('[ng-click="dialog.abort()"]') }

    getEnableUserConfirmButton() { return cy.get('[ng-click="dialog.hide()"]') }

    getEnableUserCancelButton() { return cy.get('[ng-click="dialog.abort()"]') }

    getActivityReportLink() { return cy.get('.link-item').contains("Activity Report") }

    getAddUserButton() { return cy.get('span[translate="bsendApp.user.home.button.addUser"]') }

    getFirstName() { return cy.get('#firstName') }

    getLastName() { return cy.get('#lastName') }

    getEmail() { return cy.get('#email') }

    getPassword() { return cy.get('#password') }

    getConfirmPassword() { return cy.get('#confirmPassword') }

    getMobile() { return cy.get('#mobilePhoneNumber') }

    getSaveButton() { return cy.get('[translate="bsendApp.user.save"]') }

    getLicensedUserCheckBox() { return cy.get('[name="licensedUser"]') }

    getSystemAdminCheckBox() { return cy.get('#has_admin_role') }

    getBiscomRporterRoleRadioButton() {return cy.get('div [value="BiscomReporter"]') }

    getBiscomTenantAdminRoleRadioButton() {return cy.get('div [value="BiscomTenantAdmin"]') }

    getBiscomSystemAdminRoleRadioButton() {return cy.get('div [value="BiscomSystemAdmin"]') }

    getManagerTenantRoleConfirmButton() {return cy.get('[ng-click="dialog.hide()"]') }

    getAutomaticGeneratePasswordCheckBoxManagerTenant() { return cy.get('[ng-model="vm.user.generatePassword"]') }

    getAutomaticGeneratePasswordCheckBoxTenantAdmin() { return cy.get('[ng-model="vm.user.generatePassword"]') }

    getAutomaticGeneratePasswordCheckBox() { return cy.get('[name="generatePassword"]') }

    getLicensedUsers() { return cy.get('[ng-click="$mdTabsCtrl.select(tab.getIndex())"]').contains('Licensed Users') }

    getExternalUsers() { return cy.get('[ng-click="$mdTabsCtrl.select(tab.getIndex())"]').contains('External Users') }

    getUsersList() { return cy.get('[ng-mouseover="vm.viewItem(user)"]') }

    getHiddenDeleteUserIcon() { return cy.get('[ng-click="vm.goToDelete(user)"]') }

    getDeleteUserConfirmationButton() { return cy.get('[ng-click="vm.confirmDelete()"]') }

    scrollToBottomUserList(){return cy.get('[class="md-virtual-repeat-scroller"]').first().scrollTo('bottom') }

    addUser(licensed, fname, lname, email, password) {
        var THIS = this
        this.getAddUserButton().click()
        this.getFirstName().clear().type(fname)
        this.getLastName().clear().type(lname)
        this.getEmail().clear().type(email)

        if (licensed) {
            this.getLicensedUserCheckBox().invoke('attr', 'aria-checked').should('eq','true').then(function (val) {
                if (val === 'false') {
                    THIS.getLicensedUserCheckBox().click()
                }
            })
        } else {
            this.getLicensedUserCheckBox().invoke('attr', 'aria-checked').should('eq','true').then(function (val) {
                if (val === 'true') {
                    THIS.getLicensedUserCheckBox().click()
                }
            })
        }

        if (password) {
            this.getAutomaticGeneratePasswordCheckBox().invoke('attr', 'aria-checked').should('eq','true').then((val)=>{
                if (val === 'true') {
                    THIS.getAutomaticGeneratePasswordCheckBox().click()
                    THIS.getPassword().clear().type(password)
                    THIS.getConfirmPassword().clear().type(password)
                }
            })

        }
    

        this.getSaveButton().click()
    }


    deleteUser(user)
    {
        var THIS = this
        var iter = 0 
        var matchedIndex = null

        this.getUsersList().each(function(ele){
            var text = ele.text()
            cy.log(text)
            if(text.includes(user)){
                matchedIndex = iter
                cy.log(matchedIndex)
                THIS.getHiddenDeleteUserIcon().eq(matchedIndex).invoke('show').click({ force : true }).then(function(){
                    THIS.getDeleteUserConfirmationButton().click()
                })                
                return false
            }
            iter++ ;

        })

    }

    addUserManagerTenant(reporter, bistenadmin, bissysadmin, fname, lname, email, mobile, password) {
        var THIS = this
        //this.getAddUserButton().click()
        this.getFirstName().clear().type(fname)
        this.getLastName().clear().type(lname)
        this.getEmail().clear().type(email)
        this.getMobile().clear().type(mobile)
        this.getPassword().clear().type(password)
        this.getConfirmPassword().clear().type(password)

        if (reporter) {
            this.getBiscomRporterRoleRadioButton().click()
            this.getManagerTenantRoleConfirmButton().click()
        } 

        if (bistenadmin) {
            this.getBiscomTenantAdminRoleRadioButton().invoke('attr', 'aria-checked').then(function (val) {
                if (val === 'false') {
                    THIS.getBiscomTenantAdminRoleRadioButton().click()
                    THIS.getManagerTenantRoleConfirmButton().click()
                }
            })
        } else {
            this.getBiscomTenantAdminRoleRadioButton().invoke('attr', 'aria-checked').then(function (val) {
                if (val === 'true') {
                    THIS.getBiscomTenantAdminRoleRadioButton().click()
                    THIS.getManagerTenantRoleConfirmButton().click()
                }
            })
        }

        if (bissysadmin) {
            this.getBiscomSystemAdminRoleRadioButton().invoke('attr', 'aria-checked').then(function (val) {
                if (val === 'false') {
                    THIS.getBiscomSystemAdminRoleRadioButton().click()
                    THIS.getManagerTenantRoleConfirmButton().click()
                }
            })
        } else {
            this.getBiscomSystemAdminRoleRadioButton().invoke('attr', 'aria-checked').then(function (val) {
                if (val === 'true') {
                    THIS.getBiscomSystemAdminRoleRadioButton().click()
                    THIS.getManagerTenantRoleConfirmButton().click()
                }
            })
        }

        this.getSaveButton().click()

    }

    editUserManagerTenant(reporter, bistenadmin, bissysadmin, email, fname, lname, mobile) {
        var THIS = this

        if (reporter) {
            //this.getSearchBoxManagerTenant().clear().type(email)
            //this.getSearchIconManagerTenant().click()
            this.getHovertoEmailManagerTenant().contains( email).scrollIntoView().trigger('mouseover')
            this.getEditLink().scrollIntoView().click({ force: true })
            this.getFirstName().clear().type(fname)
            this.getLastName().clear().type(lname)
            this.getMobile().clear().type(mobile)
        }

        if (bistenadmin) {
            //this.getSearchBoxManagerTenant().clear().type(email)
            //this.getSearchIconManagerTenant().click()
            this.getHovertoEmailManagerTenant().contains( email).scrollIntoView().trigger('mouseover')
            this.getEditLink().scrollIntoView().click({ force: true })
            this.getFirstName().clear().type(fname)
            this.getLastName().clear().type(lname)
            this.getMobile().clear().type(mobile)
        }

        if (bissysadmin) {
            //this.getSearchBoxManagerTenant().clear().type(email)
            //this.getSearchIconManagerTenant().click()
            this.getHovertoEmailManagerTenant().contains( email).scrollIntoView().trigger('mouseover')
            this.getEditLink().scrollIntoView().click({ force: true })
            this.getFirstName().clear().type(fname)
            this.getLastName().clear().type(lname)
            this.getMobile().clear().type(mobile)
        }

        this.getSaveButton().click()

    }

    resetPasswordUserManagerTenant(reporter, bistenadmin, bissysadmin, email, password, confpassword) {
        var THIS = this

        if (reporter) {
            //this.getSearchBoxManagerTenant().clear().type(email)
            //this.getSearchIconManagerTenant().click()
            this.getHovertoEmailManagerTenant().contains( email).scrollIntoView().trigger('mouseover')
            this.getResetPasswordLink().scrollIntoView().click({ force: true })
            this.getAutomaticGeneratePasswordCheckBoxManagerTenant().invoke('attr', 'aria-checked').should('eq','true').then((val)=>{
                if (val === 'true') {
                    THIS.getAutomaticGeneratePasswordCheckBoxManagerTenant().should('be.visible').click()
                    THIS.getPassword().should('be.visible').clear().type(password)
                    THIS.getConfirmPassword().should('be.visible').clear().type(confpassword)
                }
            })
        }

        if (bistenadmin) {
            //this.getSearchBoxManagerTenant().clear().type(email)
            //this.getSearchIconManagerTenant().click()
            this.getHovertoEmailManagerTenant().contains( email).scrollIntoView().trigger('mouseover')
            this.getResetPasswordLink().scrollIntoView().click({ force: true })
            this.getAutomaticGeneratePasswordCheckBoxManagerTenant().invoke('attr', 'aria-checked').should('eq','true').then((val)=>{
                if (val === 'true') {
                    THIS.getAutomaticGeneratePasswordCheckBoxManagerTenant().should('be.visible').click()
                    THIS.getPassword().should('be.visible').clear().type(password)
                    THIS.getConfirmPassword().should('be.visible').clear().type(confpassword)
                }
            })
        }

        if (bissysadmin) {
            //this.getSearchBoxManagerTenant().clear().type(email)
            //this.getSearchIconManagerTenant().click()
            this.getHovertoEmailManagerTenant().contains( email).scrollIntoView().trigger('mouseover')
            this.getResetPasswordLink().scrollIntoView().click({ force: true })
            this.getAutomaticGeneratePasswordCheckBoxManagerTenant().invoke('attr', 'aria-checked').should('eq','true').then((val)=>{
                if (val === 'true') {
                    THIS.getAutomaticGeneratePasswordCheckBoxManagerTenant().should('be.visible').click()
                    THIS.getPassword().should('be.visible').clear().type(password)
                    THIS.getConfirmPassword().should('be.visible').clear().type(confpassword)
                }
            })
        }

        this.getSaveButton().click()

    }

    deleteUserManagerTenant(reporter, bistenadmin, bissysadmin, email) {
        var THIS = this

        if (reporter) {
            //this.getSearchBoxManagerTenant().clear().type(email)
            //this.getSearchIconManagerTenant().click()
            this.getHovertoEmailManagerTenant().contains( email).scrollIntoView().trigger('mouseover')
            this.getDeleteLink().scrollIntoView().click({ force: true })
        }

        if (bistenadmin) {
            //this.getSearchBoxManagerTenant().clear().type(email)
            //this.getSearchIconManagerTenant().click()
            this.getHovertoEmailManagerTenant().contains( email).scrollIntoView().trigger('mouseover')
            this.getDeleteLink().scrollIntoView().click({ force: true })
            
        }

        if (bissysadmin) {
            //this.getSearchBoxManagerTenant().clear().type(email)
            //this.getSearchIconManagerTenant().click()
            this.getHovertoEmailManagerTenant().contains( email).scrollIntoView().trigger('mouseover')
            this.getDeleteLink().scrollIntoView().click({ force: true })
        
        }

        this.getUserDeleteConfirmButtonManagerTenant().should('be.visible').click({ force: true })
    }

    addUserTenantAdmin(licensed, sysadmin, recipient, fname, lname, email, mobile, password) {
        var THIS = this
        this.getFirstName().clear().type(fname)
        this.getLastName().clear().type(lname)
        this.getEmail().clear().type(email)
        this.getMobile().clear().type(mobile)

        if (licensed) {
            this.getLicensedUserCheckBox().invoke('attr', 'aria-checked').then(function (val) {
                if (val === 'false') {
                    THIS.getLicensedUserCheckBox().click()
                }
            })
        } /*else {
            this.getLicensedUserCheckBox().invoke('attr', 'aria-checked').then(function (val) {
                if (val === 'true') {
                    THIS.getLicensedUserCheckBox().click()
                }
            })
        }*/

        if (sysadmin) {
            this.getLicensedUserCheckBox().invoke('attr', 'aria-checked').then(function (val) {
                if (val === 'false') {
                    THIS.getLicensedUserCheckBox().click()
                }
            })
            this.getSystemAdminCheckBox().invoke('attr','aria-checked').then(function (val){
                if (val === 'false') {
                    THIS.getSystemAdminCheckBox().click()
                }
            }) 
        } /*else {
            this.getLicensedUserCheckBox().invoke('attr', 'aria-checked').then(function (val) {
                if (val === 'true') {
                    THIS.getLicensedUserCheckBox().click()
                }
            })
        }*/

        if (recipient) {
            this.getLicensedUserCheckBox().invoke('attr', 'aria-checked').then(function (val) {
                if (val === 'true') {
                    THIS.getLicensedUserCheckBox().click()
                }
            }) 
        } /*else {
            this.getLicensedUserCheckBox().invoke('attr', 'aria-checked').then(function (val) {
                if (val === 'true') {
                    THIS.getLicensedUserCheckBox().click()
                }
            })
        }*/

        this.getAutomaticGeneratePasswordCheckBox().invoke('attr', 'aria-checked').then((val)=>{
                if (val === 'true') {
                    THIS.getAutomaticGeneratePasswordCheckBox().click()
                    THIS.getPassword().clear().type(password)
                    THIS.getConfirmPassword().clear().type(password)
                }
            })

        this.getSaveButton().click()
    }

    editUserTenantAdmin(licensed, sysadmin, recipient, email, fname, lname, mobile) {
        var THIS = this

        if (licensed) {
            //this.getSearchBoxTenantAdmin().clear().type(email)
            //this.getSearchIconTenantAdmin().click()
            this.getLicensedUsers().click({ force: true })
            this.scrollToBottomUserList()
this.getHovertoEmailTenantAdmin().contains( email).scrollIntoView().trigger('mouseover')
            this.getEditLink().scrollIntoView().click()
            this.getFirstName().clear().type(fname)
            this.getLastName().clear().type(lname)
            this.getMobile().clear().type(mobile)
        }

        if (sysadmin) {
            //this.getSearchBoxTenantAdmin().clear().type(email)
            //this.getSearchIconTenantAdmin().click()
            this.getLicensedUsers().click({ force: true })
            this.scrollToBottomUserList()
this.getHovertoEmailTenantAdmin().contains( email).scrollIntoView().trigger('mouseover')
            this.getEditLink().scrollIntoView().click()
            this.getFirstName().clear().type(fname)
            this.getLastName().clear().type(lname)
            this.getMobile().clear().type(mobile)
        }

        if (recipient) {
            this.getExternalUsers().click()
            //this.getSearchBoxTenantAdmin().clear().type(email)
            //this.getSearchIconTenantAdmin().click()
            this.getHovertoEmailExternalTenantAdmin().contains( email).scrollIntoView().trigger('mouseover',{ force: true })
            this.getEditLink().scrollIntoView().click({ force: true })
            this.getFirstName().clear().type(fname)
            this.getLastName().clear().type(lname)
            this.getMobile().clear().type(mobile)
        }

        this.getSaveButton().click()

    }

    resetPasswordUserTenantAdmin(licensed, sysadmin, recipient, email, password, confpassword) {
        var THIS = this

        if (licensed) {
            //this.getSearchBoxTenantAdmin().clear().type(email)
            //this.getSearchIconTenantAdmin().click()
            this.getLicensedUsers().click({ force: true })
            this.scrollToBottomUserList()
this.getHovertoEmailTenantAdmin().contains( email).scrollIntoView().trigger('mouseover')
            this.getResetPasswordLink().scrollIntoView().click()
            this.getAutomaticGeneratePasswordCheckBoxTenantAdmin().invoke('attr', 'aria-checked').should('eq','true').then((val)=>{
                if (val === 'true') {
                    THIS.getAutomaticGeneratePasswordCheckBoxTenantAdmin().should('be.visible').click()
                    THIS.getPassword().should('be.visible').clear().type(password)
                    THIS.getConfirmPassword().should('be.visible').clear().type(confpassword)
                }
            })    
        }

        if (sysadmin) {
            //this.getSearchBoxTenantAdmin().clear().type(email)
            //this.getSearchIconTenantAdmin().click()
            this.getLicensedUsers().click({ force: true })
            this.scrollToBottomUserList()
this.getHovertoEmailTenantAdmin().contains( email).scrollIntoView().trigger('mouseover')
            this.getResetPasswordLink().scrollIntoView().click()
            this.getAutomaticGeneratePasswordCheckBoxTenantAdmin().invoke('attr', 'aria-checked').should('eq','true').then((val)=>{
                if (val === 'true') {
                    THIS.getAutomaticGeneratePasswordCheckBoxTenantAdmin().should('be.visible').click()
                    THIS.getPassword().should('be.visible').clear().type(password)
                    THIS.getConfirmPassword().should('be.visible').clear().type(confpassword)
                }
            })
        }

        if (recipient) {
            this.getExternalUsers().click()
            //this.getSearchBoxTenantAdmin().clear().type(email)
            //this.getSearchIconTenantAdmin().click()
            this.getHovertoEmailTenantAdmin().contains( email).scrollIntoView().trigger('mouseover',{ force: true })
            this.getResetPasswordLink().scrollIntoView().click({ force: true })
            this.getAutomaticGeneratePasswordCheckBoxTenantAdmin().invoke('attr', 'aria-checked').should('eq','true').then((val)=>{
                if (val === 'true') {
                    THIS.getAutomaticGeneratePasswordCheckBoxTenantAdmin().should('be.visible').click()
                    THIS.getPassword().should('be.visible').clear().type(password)
                    THIS.getConfirmPassword().should('be.visible').clear().type(confpassword)
                }
            })
        }

        this.getSaveButton().click()

    }

    disableUserTenantAdmin(licensed, sysadmin, recipient, email) {
        var THIS = this

        if (licensed) {
            //this.getSearchBoxTenantAdmin().clear().type(email)
            //this.getSearchIconTenantAdmin().click()
            this.getLicensedUsers().click({ force: true })
            this.scrollToBottomUserList()
this.getHovertoEmailTenantAdmin().contains( email).scrollIntoView().trigger('mouseover')
            this.getDisableUserLink().scrollIntoView().click()
            this.getDisableUserCancelButton().click()
            this.scrollToBottomUserList()
this.getHovertoEmailTenantAdmin().contains( email).scrollIntoView().trigger('mouseover')
            this.getDisableUserLink().scrollIntoView().click()    
        }

        if (sysadmin) {
            //this.getSearchBoxTenantAdmin().clear().type(email)
            //this.getSearchIconTenantAdmin().click()
            this.getLicensedUsers().click({ force: true })
            this.scrollToBottomUserList()
this.getHovertoEmailTenantAdmin().contains( email).scrollIntoView().trigger('mouseover')
            this.getDisableUserLink().scrollIntoView().click()
        }

        if (recipient) {
            this.getExternalUsers().click()
            //this.getSearchBoxTenantAdmin().clear().type(email)
            //this.getSearchIconTenantAdmin().click()
            this.getHovertoEmailTenantAdmin().contains( email).scrollIntoView().trigger('mouseover',{ force: true })
            this.getDisableUserLink().scrollIntoView().click({ force: true })
        }

        this.getDisableUserConfirmButton().click({ force: true })

    }

    enableUserTenantAdmin(licensed, sysadmin, recipient, email) {
        var THIS = this

        if (licensed) {
            //this.getSearchBoxTenantAdmin().clear().type(email)
            //this.getSearchIconTenantAdmin().click()
            this.getLicensedUsers().click({ force: true })
            this.scrollToBottomUserList()
this.getHovertoEmailTenantAdmin().contains( email).scrollIntoView().trigger('mouseover')
            this.getEnableUserLink().scrollIntoView().click()
            this.getEnableUserCancelButton().click()
            this.scrollToBottomUserList()
this.getHovertoEmailTenantAdmin().contains( email).scrollIntoView().trigger('mouseover')
            this.getEnableUserLink().scrollIntoView().click()    
        }

        if (sysadmin) {
            //this.getSearchBoxTenantAdmin().clear().type(email)
            //this.getSearchIconTenantAdmin().click()
            this.getLicensedUsers().click({ force: true })
            this.scrollToBottomUserList()
this.getHovertoEmailTenantAdmin().contains( email).scrollIntoView().trigger('mouseover')
            this.getEnableUserLink().scrollIntoView().click()
        }

        if (recipient) {
            this.getExternalUsers().click()
            //this.getSearchBoxTenantAdmin().clear().type(email)
            //this.getSearchIconTenantAdmin().click()
            this.getHovertoEmailTenantAdmin().contains( email).scrollIntoView().trigger('mouseover',{ force: true })
            this.getEnableUserLink().scrollIntoView().click({ force: true })
        }

        this.getEnableUserConfirmButton().click({ force: true })

    }

    deleteUserTenantAdmin(licensed, sysadmin, recipient, email) {
        var THIS = this

        if (licensed) {
            //this.getSearchBoxTenantAdmin().clear().type(email)
            //this.getSearchIconTenantAdmin().click()
            this.getLicensedUsers().click({ force: true })
            this.scrollToBottomUserList()
this.getHovertoEmailTenantAdmin().contains( email).scrollIntoView().trigger('mouseover')
            this.getDeleteLink().scrollIntoView().click()
            this.getUserDeleteCancelButtonTenantAdmin().click()
            this.scrollToBottomUserList()
this.getHovertoEmailTenantAdmin().contains( email).scrollIntoView().trigger('mouseover')
            this.getDeleteLink().scrollIntoView().click()
        }

        if (sysadmin) {
            //this.getSearchBoxTenantAdmin().clear().type(email)
            //this.getSearchIconTenantAdmin().click()
            this.getLicensedUsers().click({ force: true })
            this.scrollToBottomUserList()
this.getHovertoEmailTenantAdmin().contains( email).scrollIntoView().trigger('mouseover')
            this.getDeleteLink().scrollIntoView().click()
        }

        if (recipient) {
            this.getExternalUsers().click()
            //this.getSearchBoxTenantAdmin().clear().type(email)
            //this.getSearchIconTenantAdmin().click()
            this.getHovertoEmailExternalTenantAdmin().contains( email).scrollIntoView().trigger('mouseover',{ force: true })
            this.getDeleteLink().scrollIntoView().click({ force: true })
        }

        this.getUserDeleteConfirmButtonTenantAdmin().click({ force: true })

    }


}

export default UserPage