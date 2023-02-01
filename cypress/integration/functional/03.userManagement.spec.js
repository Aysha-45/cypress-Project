/// <reference types="Cypress" />

import BrandingSettingsPage from "../pageObjects/brandingSettingsPage.ob"
import EmailNotificationPage from "../pageObjects/emailNotificationPage.ob"
import EmailSettingsPage from "../pageObjects/emailSettingsPage.ob"
import GeneralSettingsPage from "../pageObjects/generalSettingsPage.ob"
import LeftNavBar from "../pageObjects/leftNavBar.ob"
import ServerInformationPage from "../pageObjects/serverInformationPage.ob"
import StorageSettingsPage from "../pageObjects/storageSettingsPage.ob"
import SystemActivityPage from "../pageObjects/systemActivityPage.ob"
import TenantPage from "../pageObjects/tenantPage.ob"
import UserPage from "../pageObjects/userPage.ob"
import MyFilesPage from "../pageObjects/myFilesPage.ob"
import ComposeMessagePage from "../pageObjects/composeMessagePage.ob"
import Helper from "../helper/helper"

const baseUrl = Cypress.env('url')
const tenant = baseUrl + Cypress.env('tenantName') + '/'
const leftNavBar = new LeftNavBar()
const myFilesPage = new MyFilesPage()
const composeMessagePage = new ComposeMessagePage()
const serverInfoPage = new ServerInformationPage()
const storageSettingsPage = new StorageSettingsPage()
const tenantPage = new TenantPage()
const emailSettingsPage = new EmailSettingsPage()
const generalSettingsPage = new GeneralSettingsPage()
const brandingSettingsPage = new BrandingSettingsPage()
const emailNotificationPage = new EmailNotificationPage()
const systemActivityPage = new SystemActivityPage()
const userPage = new UserPage()
const help = new Helper()
let testData = null
//import testData from "../../fixtures/userManagement.json"

describe('User Management Functionality - ' + Cypress.browser.name, () => {

    describe('User Management Functionality from Manager Tenant- ' + Cypress.browser.name, function () {

        before(function () {

            for (var i = 1; i < 4; i++) {
                var clientJson = {
                    squirrelmailServer: Cypress.env('mailServerAddress'),
                    port: Cypress.env('mailServerPort'),
                    user: "porag" + i,
                    pass: "1234",
                }
                cy.task('deleteEmail', clientJson)
            }

            cy.fixture('userManagement').then(function (data) {
                testData = data
            })
            cy.visit(baseUrl + 'manager/').then(function () {
                cy.login(testData.superAdmin.userName, testData.superAdmin.password)
                cy.url().should('not.include', 'login')
                cy.task('log', testData.superAdmin.userName + " Succesfully Logged in")
            })


        });

        beforeEach(function () {
            Cypress.Cookies.defaults({ preserve: ['SESSION', 'CSRF-TOKEN'] });
        });

        after(function () {
            cy.clearCookies()
            cy.logout()
        });

        it('Creates user with Biscom Reporter Role', function () {

            cy.visit(baseUrl + 'manager')
            leftNavBar.getAdminTab().click()
            cy.url().should('include', 'admin')
            cy.cmdLogStep('Navigated to admin page')
            leftNavBar.getUserLinkManagerTenant().should('be.visible').click({ force: true })
            cy.url().should('include', 'user-management')
            cy.cmdLogStep('Navigated to Users page')

            userPage.getAddUserButton().click()
            cy.url().should('include', 'new')
            cy.cmdLogStep('Navigated to New User page')
            userPage.addUserManagerTenant(
                true,
                false,
                false,
                testData.biscomReporter.reporterUserFirstName1,
                testData.biscomReporter.reporterUserLastName1,
                testData.biscomReporter.reporterUserEmail,
                testData.biscomReporter.reporterUserMobile1,
                testData.biscomReporter.reporterUserPassword1)

            cy.toastMessageAssert('User "' + testData.biscomReporter.reporterUserEmail + '" was created successfully').then(() => {
                cy.cmdLogResult('User "' + testData.biscomReporter.reporterUserEmail + '"  created successfully')
                cy.closeAssert()
            })

        });

        it('Creates user with Biscom Tenant Admin Role', function () {
            leftNavBar.getAdminTab().click()
            cy.url().should('include', 'admin')
            cy.cmdLogStep('Navigated to admin page')
            leftNavBar.getUserLinkManagerTenant().should('be.visible').click({ force: true })
            cy.url().should('include', 'user-management')
            cy.cmdLogStep('Navigated to Users page')
            userPage.getAddUserButton().click()
            cy.url().should('include', 'new')
            cy.cmdLogStep('Navigated to New User page')
            userPage.addUserManagerTenant(
                false,
                true,
                false,
                testData.biscomTenantAdmin.biscomTenantAdminUserFirstName1,
                testData.biscomTenantAdmin.biscomTenantAdminUserLastName1,
                testData.biscomTenantAdmin.biscomTenantAdminUserEmail,
                testData.biscomTenantAdmin.biscomTenantAdminMobile1,
                testData.biscomTenantAdmin.biscomTenantAdminUserPassword1)

            cy.toastMessageAssert('User "' + testData.biscomTenantAdmin.biscomTenantAdminUserEmail + '" was created successfully').then(() => {
                cy.cmdLogResult('User "' + testData.biscomTenantAdmin.biscomTenantAdminUserEmail + '"  created successfully')
                cy.closeAssert()
            })

        });

        it('Creates user with Biscom System Admin Role', function () {
            leftNavBar.getAdminTab().click()
            cy.url().should('include', 'admin')
            cy.cmdLogStep('Navigated to admin page')
            leftNavBar.getUserLinkManagerTenant().should('be.visible').click({ force: true })
            cy.url().should('include', 'user-management')
            cy.cmdLogStep('Navigated to Users page')
            userPage.getAddUserButton().click()
            cy.url().should('include', 'new')
            cy.cmdLogStep('Navigated to New User page')
            userPage.addUserManagerTenant(
                false,
                false,
                true,
                testData.biscomSystemAdmin.biscomSystemAdminUserFirstName1,
                testData.biscomSystemAdmin.biscomSystemAdminUserLastName1,
                testData.biscomSystemAdmin.biscomSystemAdminUserEmail,
                testData.biscomSystemAdmin.biscomSystemAdminUserMobile1,
                testData.biscomSystemAdmin.biscomSystemAdminUserPassword1)

            cy.toastMessageAssert('User "' + testData.biscomSystemAdmin.biscomSystemAdminUserEmail + '" was created successfully').then(() => {
                cy.cmdLogResult('User "' + testData.biscomSystemAdmin.biscomSystemAdminUserEmail + '"  created successfully')
                cy.closeAssert()
            })

        });

        it('Edits User with Biscom Reporter Role', function () {
            leftNavBar.getAdminTab().click()
            cy.url().should('include', 'admin')
            cy.cmdLogStep('Navigated to admin page')
            leftNavBar.getUserLinkManagerTenant().should('be.visible').click({ force: true })
            cy.url().should('include', 'user-management')
            cy.cmdLogStep('Navigated to Users page')
            userPage.editUserManagerTenant(
                true,
                false,
                false,
                testData.biscomReporter.reporterUserEmail,
                testData.biscomReporter.reporterUserFirstName2,
                testData.biscomReporter.reporterUserLastName2,
                testData.biscomReporter.reporterUserMobile2)

            cy.toastMessageAssert('User "' + testData.biscomReporter.reporterUserEmail + '" was updated successfully').then(() => {
                cy.cmdLogResult('User "' + testData.biscomReporter.reporterUserEmail + '"  updated successfully')
                cy.closeAssert()
            })

        });

        it('Edits User with Biscom Tenant Admin Role', function () {
            leftNavBar.getAdminTab().click()
            cy.url().should('include', 'admin')
            cy.cmdLogStep('Navigated to admin page')
            leftNavBar.getUserLinkManagerTenant().should('be.visible').click({ force: true })
            cy.url().should('include', 'user-management')
            cy.cmdLogStep('Navigated to Users page')
            userPage.editUserManagerTenant(
                false,
                true,
                false,
                testData.biscomTenantAdmin.biscomTenantAdminUserEmail,
                testData.biscomTenantAdmin.biscomTenantAdminUserFirstName2,
                testData.biscomTenantAdmin.biscomTenantAdminUserLastName2,
                testData.biscomTenantAdmin.biscomTenantAdminMobile2)

            cy.toastMessageAssert('User "' + testData.biscomTenantAdmin.biscomTenantAdminUserEmail + '" was updated successfully').then(() => {
                cy.cmdLogResult('User "' + testData.biscomTenantAdmin.biscomTenantAdminUserEmail + '"  updated successfully')
                cy.closeAssert()
            })

        });

        it('Edits User with Biscom System Admin Role', function () {
            leftNavBar.getAdminTab().click()
            cy.url().should('include', 'admin')
            cy.cmdLogStep('Navigated to admin page')
            leftNavBar.getUserLinkManagerTenant().should('be.visible').click({ force: true })
            cy.url().should('include', 'user-management')
            cy.cmdLogStep('Navigated to Users page')
            userPage.editUserManagerTenant(
                false,
                false,
                true,
                testData.biscomSystemAdmin.biscomSystemAdminUserEmail,
                testData.biscomSystemAdmin.biscomSystemAdminUserFirstName2,
                testData.biscomSystemAdmin.biscomSystemAdminUserLastName2,
                testData.biscomSystemAdmin.biscomSystemAdminUserMobile2)

            cy.toastMessageAssert('User "' + testData.biscomSystemAdmin.biscomSystemAdminUserEmail + '" was updated successfully').then(() => {
                cy.cmdLogResult('User "' + testData.biscomSystemAdmin.biscomSystemAdminUserEmail + '"  updated successfully')
                cy.closeAssert()
            })

        });

        it('Resets Passowrd for User with Biscom Reporter Role', function () {
            leftNavBar.getAdminTab().click()
            cy.url().should('include', 'admin')
            cy.cmdLogStep('Navigated to admin page')
            leftNavBar.getUserLinkManagerTenant().should('be.visible').click({ force: true })
            cy.url().should('include', 'user-management')
            cy.cmdLogStep('Navigated to Users page')
            userPage.resetPasswordUserManagerTenant(
                true,
                false,
                false,
                testData.biscomReporter.reporterUserEmail,
                testData.biscomReporter.reporterUserPassword2,
                testData.biscomReporter.reporterUserPassword2)

            cy.toastMessageAssert('Password changed for "' + testData.biscomReporter.reporterUserEmail + '"').then(() => {
                cy.cmdLogResult('Password changed for "' + testData.biscomReporter.reporterUserEmail + '"')
                cy.closeAssert()
            })

        });

        it('Resets Passowrd for User with Biscom Tenant Admin Role', function () {
            leftNavBar.getAdminTab().click()
            cy.url().should('include', 'admin')
            cy.cmdLogStep('Navigated to admin page')
            leftNavBar.getUserLinkManagerTenant().should('be.visible').click({ force: true })
            cy.url().should('include', 'user-management')
            cy.cmdLogStep('Navigated to Users page')
            userPage.resetPasswordUserManagerTenant(
                false,
                true,
                false,
                testData.biscomTenantAdmin.biscomTenantAdminUserEmail,
                testData.biscomTenantAdmin.biscomTenantAdminUserPassword2,
                testData.biscomTenantAdmin.biscomTenantAdminUserPassword2)

            cy.toastMessageAssert('Password changed for "' + testData.biscomTenantAdmin.biscomTenantAdminUserEmail + '"').then(() => {
                cy.cmdLogResult('Password changed for "' + testData.biscomTenantAdmin.biscomTenantAdminUserEmail + '"')
                cy.closeAssert()
            })

        });

        it('Resets Passowrd for User with Biscom System Admin Role', function () {
            leftNavBar.getAdminTab().click()
            cy.url().should('include', 'admin')
            cy.cmdLogStep('Navigated to admin page')
            leftNavBar.getUserLinkManagerTenant().should('be.visible').click({ force: true })
            cy.url().should('include', 'user-management')
            cy.cmdLogStep('Navigated to Users page')
            userPage.resetPasswordUserManagerTenant(
                false,
                false,
                true,
                testData.biscomSystemAdmin.biscomSystemAdminUserEmail,
                testData.biscomSystemAdmin.biscomSystemAdminUserPassword2,
                testData.biscomSystemAdmin.biscomSystemAdminUserPassword2)

            cy.toastMessageAssert('Password changed for "' + testData.biscomSystemAdmin.biscomSystemAdminUserEmail + '"').then(() => {
                cy.cmdLogResult('Password changed for "' + testData.biscomSystemAdmin.biscomSystemAdminUserEmail + '"')
                cy.closeAssert()
            })

        });

        it('Logs out from current manager tenant user', function () {
            cy.cmdLogStep('Log out from current user')
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult("Succesfully logged out")

        });

        it('Biscom Reporter User Logs in with new password', function () {
            cy.cmdLogStep('Biscom Reporter User Logs in')
            cy.visit(baseUrl + 'manager/').then(function () {
                cy.login(testData.biscomReporter.reporterUserEmail, testData.biscomReporter.reporterUserPassword2)
                cy.url().should('not.include', 'login')
                cy.task('log', testData.biscomReporter.reporterUserEmail + " Succesfully Logged in")
            })
            cy.cmdLogStep('Log out from current user')
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult("Succesfully logged out")

        });

        it('Biscom Tenant Admin User Logs in with new password', function () {
            cy.cmdLogStep('Biscom Tenant Admin User Logs in')
            cy.visit(baseUrl + 'manager/').then(function () {
                cy.login(testData.biscomTenantAdmin.biscomTenantAdminUserEmail, testData.biscomTenantAdmin.biscomTenantAdminUserPassword2)
                cy.url().should('not.include', 'login')
                cy.task('log', testData.biscomTenantAdmin.biscomTenantAdminUserEmail + " Succesfully Logged in")
            })
            cy.cmdLogStep('Log out from current user')
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult("Succesfully logged out")
        });

        it('Biscom System Admin User Logs in with new password', function () {
            cy.cmdLogStep('Biscom System Admin User Logs in')
            cy.visit(baseUrl + 'manager/').then(function () {
                cy.login(testData.biscomSystemAdmin.biscomSystemAdminUserEmail, testData.biscomSystemAdmin.biscomSystemAdminUserPassword2)
                cy.url().should('not.include', 'login')
                cy.task('log', testData.biscomSystemAdmin.biscomSystemAdminUserEmail + " Succesfully Logged in")
            })
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult("Succesfully logged out")
        });

        it('Biscom Transit Account Creation Email Checking', function () {
            var json = {
                squirrelmailServer: Cypress.env('mailServerAddress'),
                port: Cypress.env('mailServerPort'),
                user: "porag1",
                pass: "1234",
                searchString: testData.biscomReporter.reporterAccountCreateEmailSubject,
                timeoutInMs: Cypress.env('emailCheckTimeout'),
                checkIntervalInMs: Cypress.env('emailCheckInterval')
            }

            cy.cmdLogStep('Get the link from ' + testData.biscomReporter.reporterUserEmail + ' mail box')
            //var pattern = '"' + baseUrl + 'manager/' + 'login/"'

            cy.task("awaitEmailInSquirrelmailInbox", json).then((emailBody) => {
                if (emailBody) {

                    cy.log("Email arrived in user's inbox!")
                    //finalLink = help.extractLinkFromEmail(emailBody, pattern)
                    //console.log('Link: ' + finalLink)
                    //cy.visit(finalLink)

                } else {
                    cy.log("Failed to receive email in user's inbox in time!");
                }
            });

        });

        it('Biscom Transit Account Password Reset Email Checking', function () {
            var json = {
                squirrelmailServer: Cypress.env('mailServerAddress'),
                port: Cypress.env('mailServerPort'),
                user: "porag1",
                pass: "1234",
                searchString: testData.biscomReporter.reporterAccountPassResetEmailSubject,
                timeoutInMs: Cypress.env('emailCheckTimeout'),
                checkIntervalInMs: Cypress.env('emailCheckInterval')
            }

            cy.cmdLogStep('Get the link from ' + testData.biscomReporter.reporterAccountPassResetEmailSubject + ' mail box')
            //var pattern = '"' + baseUrl + 'manager/' + 'login/"'

            cy.task("awaitEmailInSquirrelmailInbox", json).then((emailBody) => {
                if (emailBody) {

                    cy.log("Email arrived in user's inbox!")
                    //finalLink = help.extractLinkFromEmail(emailBody, pattern)
                    //console.log('Link: ' + finalLink)
                    //cy.visit(finalLink)

                } else {
                    cy.log("Failed to receive email in user's inbox in time!");
                }
            });

        });

        it('User Delete Operation Super Admin deletes user with Biscom Reporter, Biscom Tenant Admin and Biscom System Admin roles', function () {

            cy.reload()
            cy.visit(baseUrl + 'manager/').then(function () {
                cy.login(testData.superAdmin.userName, testData.superAdmin.password)
                cy.url().should('not.include', 'login')
                cy.task('log', testData.superAdmin.userName + " Succesfully Logged in")
            })


            leftNavBar.getAdminTab().click()
            cy.url().should('include', 'admin')
            cy.cmdLogStep('Navigated to admin page')
            leftNavBar.getUserLinkManagerTenant().should('be.visible').click({ force: true })
            cy.url().should('include', 'user-management')
            cy.cmdLogStep('Navigated to Users page')
            userPage.deleteUserManagerTenant(
                true,
                false,
                false,
                testData.biscomReporter.reporterUserEmail)

            cy.toastMessageAssert('User "' + testData.biscomReporter.reporterUserEmail + '" was deleted successfully').then(() => {
                cy.cmdLogResult('User "' + testData.biscomReporter.reporterUserEmail + '"  deleted successfully')
                cy.closeAssert()
                cy.reload()
            })

            leftNavBar.getAdminTab().click()
            cy.url().should('include', 'admin')
            cy.cmdLogStep('Navigated to admin page')
            leftNavBar.getUserLinkManagerTenant().should('be.visible').click({ force: true })
            cy.url().should('include', 'user-management')
            cy.cmdLogStep('Navigated to Users page')
            userPage.deleteUserManagerTenant(
                true,
                false,
                false,
                testData.biscomTenantAdmin.biscomTenantAdminUserEmail)

            cy.toastMessageAssert('User "' + testData.biscomTenantAdmin.biscomTenantAdminUserEmail + '" was deleted successfully').then(() => {
                cy.cmdLogResult('User "' + testData.biscomTenantAdmin.biscomTenantAdminUserEmail + '"  deleted successfully')
                cy.closeAssert()
                cy.reload()
            })

            leftNavBar.getAdminTab().click()
            cy.url().should('include', 'admin')
            cy.cmdLogStep('Navigated to admin page')
            leftNavBar.getUserLinkManagerTenant().should('be.visible').click({ force: true })
            cy.url().should('include', 'user-management')
            cy.cmdLogStep('Navigated to Users page')
            userPage.deleteUserManagerTenant(
                true,
                false,
                false,
                testData.biscomSystemAdmin.biscomSystemAdminUserEmail)

            cy.toastMessageAssert('User "' + testData.biscomSystemAdmin.biscomSystemAdminUserEmail + '" was deleted successfully').then(() => {
                cy.cmdLogResult('User "' + testData.biscomSystemAdmin.biscomSystemAdminUserEmail + '"  deleted successfully')
                cy.closeAssert()
                cy.reload()
            })

            // cy.logout()
            // cy.url().should('include', 'login')
            // cy.cmdLogResult("Succesfully logged out")
        });



    });

    describe('User Management Functionality from Tenant Admin- ' + Cypress.browser.name, function () {

        before(function () {

            for (var i = 4; i < 8; i++) {
                var clientJson = {
                    squirrelmailServer: Cypress.env('mailServerAddress'),
                    port: Cypress.env('mailServerPort'),
                    user: "porag" + i,
                    pass: "1234",
                }
                cy.task('deleteEmail', clientJson)
            }

            cy.fixture('userManagement').then(function (data) {
                testData = data
            })
            cy.visit(tenant).then(function () {
                cy.login(testData.tenant.adminEmail, testData.tenant.adminPassword2)
                cy.url().should('not.include', 'login')
                cy.task('log', testData.tenant.adminEmail + " Succesfully Logged in")
            })


        });

        beforeEach(function () {
            Cypress.Cookies.defaults({ preserve: ['SESSION', 'CSRF-TOKEN'] });
        });

        after(function () {
            cy.clearCookies()
            cy.logout()
        });



        it('Goes to Users page', function () {
            //cy.visit(baseUrl + 'manager')
            leftNavBar.getAdminTab().click()
            cy.url().should('include', 'admin')
            cy.cmdLogStep('Navigated to admin page')
            leftNavBar.getUserLink().should('be.visible').click({ force: true })
            cy.url().should('include', 'user-management')
            cy.cmdLogStep('Navigated to Users page')
        });

        it('Creates user with Licensed Role', function () {
            userPage.getAddUserButton().click()
            cy.url().should('include', 'new')
            cy.cmdLogStep('Navigated to New User page')
            userPage.addUserTenantAdmin(
                true,
                false,
                false,
                testData.tenant.tenantLicensedUserFirstName1,
                testData.tenant.tenantLicensedUserLastName1,
                testData.tenant.tenantLicensedUserEmail,
                testData.tenant.tenantLicensedUserMobile1,
                testData.tenant.tenantLicensedUserPassword1)

            cy.toastMessageAssert('User "' + testData.tenant.tenantLicensedUserEmail + '" was created successfully').then(() => {
                cy.cmdLogResult('User "' + testData.tenant.tenantLicensedUserEmail + '"  created successfully')
                cy.closeAssert()
            })

        });

        it('Creates user with System Administrator Role', function () {
            leftNavBar.getAdminTab().click()
            cy.url().should('include', 'admin')
            cy.cmdLogStep('Navigated to admin page')
            leftNavBar.getUserLink().should('be.visible').click({ force: true })
            cy.url().should('include', 'user-management')
            cy.cmdLogStep('Navigated to Users page')
            userPage.getAddUserButton().click()
            cy.url().should('include', 'new')
            cy.cmdLogStep('Navigated to New User page')
            userPage.addUserTenantAdmin(
                false,
                true,
                false,
                testData.tenant.tenantSystemAdministratorUserFirstName1,
                testData.tenant.tenantSystemAdministratorUserLastName1,
                testData.tenant.tenantSystemAdministratorUserEmail,
                testData.tenant.tenantSystemAdministratorUserMobile1,
                testData.tenant.tenantSystemAdministratorUserPassword1)

            cy.toastMessageAssert('User "' + testData.tenant.tenantSystemAdministratorUserEmail + '" was created successfully').then(() => {
                cy.cmdLogResult('User "' + testData.tenant.tenantSystemAdministratorUserEmail + '"  created successfully')
                cy.closeAssert()
            })

        });

        it('Creates user with Recipient Role', function () {
            leftNavBar.getAdminTab().click()
            cy.url().should('include', 'admin')
            cy.cmdLogStep('Navigated to admin page')
            leftNavBar.getUserLink().should('be.visible').click({ force: true })
            cy.url().should('include', 'user-management')
            cy.cmdLogStep('Navigated to Users page')
            userPage.getAddUserButton().click()
            cy.url().should('include', 'new')
            cy.cmdLogStep('Navigated to New User page')
            userPage.addUserTenantAdmin(
                false,
                false,
                true,
                testData.tenant.tenantRecipientUserFirstName1,
                testData.tenant.tenantRecipientUserLastName1,
                testData.tenant.tenantRecipientUserEmail,
                testData.tenant.tenantRecipientUserMobile1,
                testData.tenant.tenantRecipientUserPassword1)

            cy.toastMessageAssert('User "' + testData.tenant.tenantRecipientUserEmail + '" was created successfully').then(() => {
                cy.cmdLogResult('User "' + testData.tenant.tenantRecipientUserEmail + '"  created successfully')
                cy.closeAssert()
            })

        });

        it('Creates user with System Administrator Role', function () {
            leftNavBar.getAdminTab().click()
            cy.url().should('include', 'admin')
            cy.cmdLogStep('Navigated to admin page')
            leftNavBar.getUserLink().should('be.visible').click({ force: true })
            cy.url().should('include', 'user-management')
            cy.cmdLogStep('Navigated to Users page')
            userPage.getAddUserButton().click()
            cy.url().should('include', 'new')
            cy.cmdLogStep('Navigated to New User page')
            userPage.addUserTenantAdmin(
                false,
                true,
                false,
                testData.tenant.tenantUserAdministratorUserFirstName2,
                testData.tenant.tenantUserAdministratorUserLastName2,
                testData.tenant.tenantUserAdministratorUserEmail,
                testData.tenant.tenantUserAdministratorUserMobile2,
                testData.tenant.tenantUserAdministratorUserPassword2)

            cy.toastMessageAssert('User "' + testData.tenant.tenantUserAdministratorUserEmail + '" was created successfully').then(() => {
                cy.cmdLogResult('User "' + testData.tenant.tenantUserAdministratorUserEmail + '"  created successfully')
                cy.closeAssert()
            })

        });

        it('Edits User with Licensed Role', function () {
            leftNavBar.getAdminTab().click()
            cy.url().should('include', 'admin')
            cy.cmdLogStep('Navigated to admin page')
            leftNavBar.getUserLink().should('be.visible').click({ force: true })
            cy.url().should('include', 'user-management')
            cy.cmdLogStep('Navigated to Users page')
            userPage.editUserTenantAdmin(
                true,
                false,
                false,
                testData.tenant.tenantLicensedUserEmail,
                testData.tenant.tenantLicensedUserFirstName2,
                testData.tenant.tenantLicensedUserLastName2,
                testData.tenant.tenantLicensedUserMobile2)

            cy.toastMessageAssert('User "' + testData.tenant.tenantLicensedUserEmail + '" was updated successfully').then(() => {
                cy.cmdLogResult('User "' + testData.tenant.tenantLicensedUserEmail + '"  updated successfully')
                cy.closeAssert()
            })

        });

        it('Edits User with System Administrator Role', function () {
            leftNavBar.getAdminTab().click()
            cy.url().should('include', 'admin')
            cy.cmdLogStep('Navigated to admin page')
            leftNavBar.getUserLink().should('be.visible').click({ force: true })
            cy.url().should('include', 'user-management')
            cy.cmdLogStep('Navigated to Users page')
            userPage.editUserTenantAdmin(
                false,
                true,
                false,
                testData.tenant.tenantSystemAdministratorUserEmail,
                testData.tenant.tenantSystemAdministratorUserFirstName2,
                testData.tenant.tenantSystemAdministratorUserLastName2,
                testData.tenant.tenantSystemAdministratorUserMobile2)

            cy.toastMessageAssert('User "' + testData.tenant.tenantSystemAdministratorUserEmail + '" was updated successfully').then(() => {
                cy.cmdLogResult('User "' + testData.tenant.tenantSystemAdministratorUserEmail + '"  updated successfully')
                cy.closeAssert()
            })

        });

        it('Edits User with Recipient Role', function () {
            leftNavBar.getAdminTab().click()
            cy.url().should('include', 'admin')
            cy.cmdLogStep('Navigated to admin page')
            leftNavBar.getUserLink().should('be.visible').click({ force: true })
            cy.url().should('include', 'user-management')
            cy.cmdLogStep('Navigated to Users page')
            userPage.editUserTenantAdmin(
                false,
                false,
                true,
                testData.tenant.tenantRecipientUserEmail,
                testData.tenant.tenantRecipientUserFirstName2,
                testData.tenant.tenantRecipientUserLastName2,
                testData.tenant.tenantRecipientUserMobile2)

            cy.toastMessageAssert('User "' + testData.tenant.tenantRecipientUserEmail + '" was updated successfully').then(() => {
                cy.cmdLogResult('User "' + testData.tenant.tenantRecipientUserEmail + '"  updated successfully')
                cy.closeAssert()
            })

        });

        it('Resets Passowrd for Licensed User', function () {
            leftNavBar.getAdminTab().click()
            cy.url().should('include', 'admin')
            cy.cmdLogStep('Navigated to admin page')
            leftNavBar.getUserLink().should('be.visible').click({ force: true })
            cy.url().should('include', 'user-management')
            cy.cmdLogStep('Navigated to Users page')
            userPage.resetPasswordUserTenantAdmin(
                true,
                false,
                false,
                testData.tenant.tenantLicensedUserEmail,
                testData.tenant.tenantLicensedUserPassword2,
                testData.tenant.tenantLicensedUserPassword2)

            cy.toastMessageAssert('Password changed for "' + testData.tenant.tenantLicensedUserEmail + '"').then(() => {
                cy.cmdLogResult('Password changed for "' + testData.tenant.tenantLicensedUserEmail + '"')
                cy.closeAssert()
            })

        });

        it('Resets Passowrd for System Administrator User', function () {
            leftNavBar.getAdminTab().click()
            cy.url().should('include', 'admin')
            cy.cmdLogStep('Navigated to admin page')
            leftNavBar.getUserLink().should('be.visible').click({ force: true })
            cy.url().should('include', 'user-management')
            cy.cmdLogStep('Navigated to Users page')
            userPage.resetPasswordUserTenantAdmin(
                false,
                true,
                false,
                testData.tenant.tenantSystemAdministratorUserEmail,
                testData.tenant.tenantSystemAdministratorUserPassword2,
                testData.tenant.tenantSystemAdministratorUserPassword2)

            cy.toastMessageAssert('Password changed for "' + testData.tenant.tenantSystemAdministratorUserEmail + '"').then(() => {
                cy.cmdLogResult('Password changed for "' + testData.tenant.tenantSystemAdministratorUserEmail + '"')
                cy.closeAssert()
            })

        });

        it('Resets Passowrd for Recipient User', function () {
            leftNavBar.getAdminTab().click()
            cy.url().should('include', 'admin')
            cy.cmdLogStep('Navigated to admin page')
            leftNavBar.getUserLink().should('be.visible').click({ force: true })
            cy.url().should('include', 'user-management')
            cy.cmdLogStep('Navigated to Users page')
            userPage.resetPasswordUserTenantAdmin(
                false,
                false,
                true,
                testData.tenant.tenantRecipientUserEmail,
                testData.tenant.tenantRecipientUserConfirmPassword2,
                testData.tenant.tenantRecipientUserConfirmPassword2)

            cy.toastMessageAssert('Password changed for "' + testData.tenant.tenantRecipientUserEmail + '"').then(() => {
                cy.cmdLogResult('Password changed for "' + testData.tenant.tenantRecipientUserEmail + '"')
                cy.closeAssert()
            })

        });

        it('Logs out from current Tenant Admin user', function () {
            cy.cmdLogStep('Log out from current user')
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult("Succesfully logged out")

        });

        it('Licensed User Logs in with new password', function () {
            cy.cmdLogStep('Licensed User Logs in')
            cy.visit(tenant).then(function () {
                cy.login(testData.tenant.tenantLicensedUserEmail, testData.tenant.tenantLicensedUserPassword2)
                cy.url().should('not.include', 'login')
                cy.task('log', testData.tenant.tenantLicensedUserEmail + " Succesfully Logged in")
            })
            cy.cmdLogStep('Log out from licensed User')
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult("Succesfully logged out")
        });

        it('System Administrator User Logs in with new password', function () {
            cy.cmdLogStep('System Administrator User Logs in')
            cy.visit(tenant).then(function () {
                cy.login(testData.tenant.tenantSystemAdministratorUserEmail, testData.tenant.tenantSystemAdministratorUserPassword2)
                cy.url().should('not.include', 'login')
                cy.task('log', testData.tenant.tenantSystemAdministratorUserEmail + " Succesfully Logged in")
            })
            cy.cmdLogStep('Log out from system administrator user')
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult("Succesfully logged out")
        });

        it('Recipient User Logs in with new password', function () {
            cy.cmdLogStep('Recipient User Logs in')
            cy.visit(tenant).then(function () {
                cy.login(testData.tenant.tenantRecipientUserEmail, testData.tenant.tenantRecipientUserPassword2)
                cy.url().should('not.include', 'login')
                cy.task('log', testData.tenant.tenantRecipientUserEmail + " Succesfully Logged in")
            })
            cy.cmdLogStep('Log out from recipient user')
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult("Succesfully logged out")
        });

        it('Licensed User Account Creation Email Checking', function () {
            var json = {
                squirrelmailServer: Cypress.env('mailServerAddress'),
                port: Cypress.env('mailServerPort'),
                user: "porag4",
                pass: "1234",
                searchString: testData.tenant.licensedAccountCreateEmailSubject,
                timeoutInMs: Cypress.env('emailCheckTimeout'),
                checkIntervalInMs: Cypress.env('emailCheckInterval')
            }

            cy.cmdLogStep('Get the link from ' + testData.tenant.tenantLicensedUserEmail + ' mail box')
            //var pattern = '"' + baseUrl + 'manager/' + 'login/"'

            cy.task("awaitEmailInSquirrelmailInbox", json).then((emailBody) => {
                if (emailBody) {

                    cy.log("Email arrived in user's inbox!")
                    //finalLink = help.extractLinkFromEmail(emailBody, pattern)
                    //console.log('Link: ' + finalLink)
                    //cy.visit(finalLink)

                } else {
                    cy.log("Failed to receive email in user's inbox in time!");
                }
            });

        });

        it('Licensed User Password Reset Email Checking', function () {
            var json = {
                squirrelmailServer: Cypress.env('mailServerAddress'),
                port: Cypress.env('mailServerPort'),
                user: "porag4",
                pass: "1234",
                searchString: testData.tenant.licensedAccountPassResetEmailSubject,
                timeoutInMs: Cypress.env('emailCheckTimeout'),
                checkIntervalInMs: Cypress.env('emailCheckInterval')
            }

            cy.cmdLogStep('Get the link from ' + testData.tenant.tenantLicensedUserEmail + ' mail box')
            //var pattern = '"' + baseUrl + 'manager/' + 'login/"'

            cy.task("awaitEmailInSquirrelmailInbox", json).then((emailBody) => {
                if (emailBody) {

                    cy.log("Email arrived in user's inbox!")
                    //finalLink = help.extractLinkFromEmail(emailBody, pattern)
                    //console.log('Link: ' + finalLink)
                    //cy.visit(finalLink)

                } else {
                    cy.log("Failed to receive email in user's inbox in time!");
                }
            });

        });

        it('Tenant Admin signs in and performs User disable operation', function () {
            cy.visit(tenant).then(function () {
                cy.login(testData.tenant.adminEmail, testData.tenant.adminPassword2)
                cy.url().should('not.include', 'login')
                cy.task('log', testData.tenant.adminEmail + " Succesfully Logged in")
            })
            leftNavBar.getAdminTab().click()
            cy.url().should('include', 'admin')
            cy.cmdLogStep('Navigated to admin page')
            leftNavBar.getUserLink().should('be.visible').click({ force: true })
            cy.url().should('include', 'user-management')
            cy.cmdLogStep('Navigated to Users page')
            userPage.disableUserTenantAdmin(
                true,
                false,
                false,
                testData.tenant.tenantLicensedUserEmail)

            cy.toastMessageAssert('User "' + testData.tenant.tenantLicensedUserName + '" successfully disabled.').then(() => {
                cy.cmdLogResult('User "' + testData.tenant.tenantLicensedUserEmail + '"  was disabled successfully')
                cy.closeAssert()
            })

        });

        it('Tenant Admin performs User enable operation', function () {
            leftNavBar.getAdminTab().click()
            cy.url().should('include', 'admin')
            cy.cmdLogStep('Navigated to admin page')
            leftNavBar.getUserLink().should('be.visible').click({ force: true })
            cy.url().should('include', 'user-management')
            cy.cmdLogStep('Navigated to Users page')
            userPage.enableUserTenantAdmin(
                true,
                false,
                false,
                testData.tenant.tenantLicensedUserEmail)

            cy.toastMessageAssert('User "' + testData.tenant.tenantLicensedUserName + '" successfully enabled.').then(() => {
                cy.cmdLogResult('User "' + testData.tenant.tenantLicensedUserEmail + '"  was enabled successfully')
                cy.closeAssert()
            })

        });

        it('Tenant Admin performs User delete operation', function () {
            leftNavBar.getAdminTab().click()
            cy.url().should('include', 'admin')
            cy.cmdLogStep('Navigated to admin page')
            leftNavBar.getUserLink().should('be.visible').click({ force: true })
            cy.url().should('include', 'user-management')
            cy.cmdLogStep('Navigated to Users page')
            userPage.deleteUserTenantAdmin(
                true,
                false,
                false,
                testData.tenant.tenantUserAdministratorUserEmail)

            cy.toastMessageAssert('User "' + testData.tenant.tenantUserAdministratorUserEmail + '" was deleted successfully').then(() => {
                cy.cmdLogResult('User "' + testData.tenant.tenantUserAdministratorUserEmail + '"  was successfully deleted')
                cy.closeAssert()
            })

        });





    });

});
