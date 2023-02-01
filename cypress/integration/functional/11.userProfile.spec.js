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
import DeletedItemsFilesPage from "../pageObjects/deletedItemsFilesPage.ob"
import UserProfilePage from "../pageObjects/userProfilePage.ob"
import UserPreferencesPage from "../pageObjects/userPreferencesPage.ob"
import TopNavBar from "../pageObjects/topNavBar.ob"
import ApiInvoke from "../helper/api"

var baseUrl = Cypress.env('url')
var tenant = baseUrl + Cypress.env('tenantName') //+ '/'
const serverId = Cypress.env('mailosaureServerId')
const leftNavBar = new LeftNavBar()
const myFilesPage = new MyFilesPage()
const deletedItemsFilesPage = new DeletedItemsFilesPage()
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
const userProfilePage = new UserProfilePage()
const userPreferencesPage = new UserPreferencesPage()
const topNavBar = new TopNavBar()
const help = new Helper()
const api = new ApiInvoke()
let testData = null


describe('User Profile Functionality - ' + Cypress.browser.name, function () {

    before(function () {


        if (Cypress.env('live')) {


            baseUrl = Cypress.env('liveUrl')
            tenant = baseUrl + Cypress.env('liveTenant') //+ '/'



            cy.fixture('userProfileLive').then(function (data) {
                testData = data
            })


        } else {
            cy.fixture('userProfile').then(function (data) {
                testData = data
            })
 
        }

    })

    beforeEach(function () { Cypress.Cookies.defaults({ preserve: ['SESSION', 'CSRF-TOKEN'] }) })

    after(function () { cy.clearCookies() })


    describe('User Profile Functionality - Test Environment Setup - ' + Cypress.browser.name, function () {

        it('Create dedicated users for User Profile Functionality', function () {

            cy.visit(tenant).then(function () {
                cy.cmdLogStep('Log in as Tenant Manager : ' + testData.tenantManager.username)
                cy.login(testData.tenantManager.username, testData.tenantManager.password)
                cy.url().should('not.include', 'login')
                cy.cmdLogResult(testData.tenantManager.username + " Succesfully Logged in")
            })


            let userArr = testData.createUser.user
            cy.getCookie("CSRF-TOKEN").then((csrf) => {
                userArr.forEach((user,index) => {
                    let userObj = {
                        email: user,
                        passwd: testData.createUser.userPassword,
                        role: 'Recipient',
                        licensed: true,
                        fname:testData.createUser.userFirstName[index],
                        lname:testData.createUser.userLastName[index]
                    }
                    api.createUser(csrf.value, tenant, userObj).then((res) => {

                        if (res.status === 200) {
                            console.log(`${user} created sucessfully`)
                        } else if (res.status === 400) {
                            console.error(`${user} already exists`)
                        } else {
                            console.error(`Other error`)
                        }


                    })

                })


            });

            // leftNavBar.getAdminTab().click()
            // cy.url().should('include', 'admin')
            // cy.cmdLogResult('Navigated to admin page')

            // leftNavBar.getUserLink().should('be.visible').click({ force: true })

            // var numOfUser = 0

            // for (numOfUser = 0; numOfUser < testData.createUser.user.length; numOfUser++) { createUser(numOfUser) }

            // function createUser(userNumber) {
            //     userPage.addUser(
            //         testData.createUser.userLicense[userNumber],
            //         testData.createUser.userFirstName[userNumber],
            //         testData.createUser.userLastName[userNumber],
            //         testData.createUser.user[userNumber],
            //         testData.createUser.userPassword)


            //     cy.toastMessageAssert('was created successfully').then(() => {
            //         cy.cmdLogResult('User "' + testData.createUser.user[userNumber] + '" created successfully')
            //         cy.get('.md-toast-text').should('not.be.visible')
            //     })

            // }

            cy.cmdLogStep('Log out as Tenant Manager : ' + testData.tenantManager.username)
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult(testData.tenantManager.username + " Succesfully Logged out")

        })

    })

    describe('User Profile Functionality - ' + Cypress.browser.name, function () {

        it('Update Profile Info & Upload Profile Picture : Licensed User', function () {

            // Login

            cy.visit(tenant).then(function () {
                cy.cmdLogStep('Log in as Licensed User : ' + testData.createUser.user[0])
                cy.login(testData.createUser.user[0], testData.createUser.userPassword)
                cy.url().should('not.include', 'login')
                cy.cmdLogResult(testData.createUser.user[0] + " Succesfully Logged in")
            })


            // go to User Profile Page

            cy.cmdLogStep('Go to User Profile Page')
            topNavBar.goToProfile()
            cy.url().should('include', 'account/settings')
            cy.cmdLogResult("Succesfully Navigated to User Profile Page")


            // Edit User Information

            var params = new userProfilePage.userProfileInfoParams()
            params.firstName = testData.editUserProfile.userFirstName[0]
            params.lastName = testData.editUserProfile.userLastName[0]
            params.mobilePhoneNumber = testData.editUserProfile.userMobileNumber[0]

            userProfilePage.editUserProfile(params)

            cy.toastMessageAssert("Profile information has been updated").then(() => {
                cy.cmdLogResult('User Profile Updated Successfully')
                cy.get('.md-toast-text').should('not.exist')
            })


            // Upload Profile Picture

            var profilePicture = testData.profilePicture.userLicensed
            userProfilePage.uploadProfilePicture(profilePicture)
            cy.task('log', 'Profile Picture Uploaded')

            // TO DO - Assertion for Profile Picture can be included


        })

        it('Change and Verify User Preferences : Licensed User', function () {

            cy.visit(tenant)


            // go to User Preferences Page

            cy.cmdLogStep('Go to User Preferences Page')
            topNavBar.goToPreference()
            cy.url().should('include', 'account/preferences')
            cy.cmdLogResult('Successfully Navigated to User Preference Page')


            // Edit User Preferences

            cy.cmdLogStep('Set Default HomePage >> Files')
            userPreferencesPage.setDefaultHomePage(testData.defaultHomePage.valueFiles)
            cy.toastMessageAssert("Profile information has been updated").then(() => {
                cy.cmdLogResult('User Preference Updated : Default HomePage >> Files')
            })


            // Verify Preferences Change

            cy.visit(tenant)
            cy.url().should('include', 'fetchOption=ALL')


            // go to User Preferences Page

            cy.cmdLogStep('Go to User Preferences Page')
            topNavBar.goToPreference()
            cy.url().should('include', 'account/preferences')
            cy.cmdLogResult('Successfully Navigated to User Preference Page')


            // Reset User Preferences

            cy.cmdLogStep('Set Default HomePage >> Inbox')
            userPreferencesPage.setDefaultHomePage(testData.defaultHomePage.valueInbox)
            cy.toastMessageAssert("Profile information has been updated").then(() => {
                cy.cmdLogResult('User Preference Updated : Default HomePage >> Inbox')
            })


            // Verify Preferences Change

            cy.visit(tenant)
            cy.url().should('include', 'inbox')


            // Logout

            cy.cmdLogStep('Log out as User : ' + testData.createUser.user[0])
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult(testData.createUser.user[0] + " Succesfully Logged out")


        })

        it('Update Profile Info & Upload Profile Picture : External User', function () {

            // Login

            cy.visit(tenant).then(function () {

                cy.cmdLogStep('Log in as Licensed User : ' + testData.createUser.user[1])
                cy.login(testData.createUser.user[1], testData.createUser.userPassword)
                cy.url().should('not.include', 'login')
                cy.cmdLogResult(testData.createUser.user[1] + " Succesfully Logged in")
            })


            // go to User Profile Page

            cy.cmdLogStep('Go to User Profile Page')
            topNavBar.goToProfile()
            cy.url().should('include', 'account/settings')
            cy.cmdLogResult("Succesfully Navigated to User Profile Page")


            // Edit User Information

            var params = new userProfilePage.userProfileInfoParams()
            params.firstName = testData.editUserProfile.userFirstName[1]
            params.lastName = testData.editUserProfile.userLastName[1]
            params.mobilePhoneNumber = testData.editUserProfile.userMobileNumber[1]

            userProfilePage.editUserProfile(params)

            cy.toastMessageAssert("Profile information has been updated").then(() => {
                cy.cmdLogResult('User Profile Updated Successfully')
                cy.get('.md-toast-text').should('not.exist')
            })


            // Upload Profile Picture

            var profilePicture = testData.profilePicture.userExternal
            userProfilePage.uploadProfilePicture(profilePicture)
            cy.task('log', 'Profile Picture Uploaded')

            // TO DO - Assertion for Profile Picture can be included


        })

        it('Change and Verify User Preferences : External User', function () {
            cy.visit(tenant)


            // go to User Preferences Page

            cy.cmdLogStep('Go to User Preferences Page')
            topNavBar.goToPreference()
            cy.url().should('include', 'account/preferences')
            cy.cmdLogResult('Successfully Navigated to User Preference Page')


            // Edit User Preferences

            cy.cmdLogStep('Set Default HomePage >> Files')
            userPreferencesPage.setDefaultHomePage(testData.defaultHomePage.valueFiles)
            cy.toastMessageAssert("Profile information has been updated").then(() => {
                cy.cmdLogResult('User Preference Updated : Default HomePage >> Files')
            })


            // Verify Preferences Change

            cy.visit(tenant)
            cy.url().should('include', 'fetchOption=ALL')


            // go to User Preferences Page

            cy.cmdLogStep('Go to User Preferences Page')
            topNavBar.goToPreference()
            cy.url().should('include', 'account/preferences')
            cy.cmdLogResult('Successfully Navigated to User Preference Page')


            // Reset User Preferences

            cy.cmdLogStep('Set Default HomePage >> Inbox')
            userPreferencesPage.setDefaultHomePage(testData.defaultHomePage.valueInbox)
            cy.toastMessageAssert("Profile information has been updated").then(() => {
                cy.cmdLogResult('User Preference Updated : Default HomePage >> Inbox')
            })


            // Verify Preferences Change

            cy.visit(tenant)
            cy.url().should('include', 'inbox')


            // Logout

            cy.cmdLogStep('Log out as User : ' + testData.createUser.user[1])
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult(testData.createUser.user[1] + " Succesfully Logged out")


        })

    })


    // Not Needed for now - Delete Dedicated User

    // describe('User Profile Functionality - Reset Test Environment', function () {

    //     it('Delete dedicated users for User Profile Functionality', function () {

    //         cy.visit(tenant).then(function () {
    //             cy.cmdLogStep('Log in as Tenant Manager : ' + testData.tenantManager.username)
    //             cy.login(testData.tenantManager.username, testData.tenantManager.password)
    //             cy.url().should('not.include', 'login')
    //             cy.cmdLogResult(testData.tenantManager.username + " Succesfully Logged in")

    //         })

    //         leftNavBar.getAdminTab().click()
    //         cy.url().should('include', 'admin')
    //         cy.cmdLogResult('Navigated to admin page')

    //         leftNavBar.getUserLink().should('be.visible').click({ force: true })

    //         var deleteUserIndex = 0
    //         for (deleteUserIndex = 0; deleteUserIndex < testData.createUser.user.length; deleteUserIndex++)
    //         {
    //             if(testData.createUser.userLicense[deleteUserIndex]==false)
    //             {
    //                 cy.cmdLogStep('Go to External Users Page')
    //                 userPage.getExternalUsers().should('exist').click({ force : true })
    //                 cy.url().should('include', 'tenant-user-management/1')
    //                 cy.cmdLogResult("Succesfully Navigated to External Users Page")
    //             }

    //             userPage.deleteUser(testData.createUser.user[deleteUserIndex])
    //             cy.toastMessageAssert("was deleted successfully").then(() => {
    //                 cy.cmdLogResult('User  ' + testData.createUser.user[deleteUserIndex] + ' Deleted Successfully')
    //                 cy.get('.md-toast-text').should('not.be.visible')

    //             })

    //         }

    //         cy.visit(tenant)

    //         cy.cmdLogStep('Log out as Tenant Manager : ' + testData.tenantManager.username)
    //         cy.logout()
    //         cy.url().should('include', 'login')
    //         cy.cmdLogResult(testData.tenantManager.username + " Succesfully Logged out")


    //     })

    // })

})