/// <reference types="Cypress" />

import LeftNavBar from "../pageObjects/leftNavBar.ob"
import ServerInformationPage from "../pageObjects/serverInformationPage.ob"
import StorageSettingsPage from "../pageObjects/storageSettingsPage.ob"
import TenantPage from "../pageObjects/tenantPage.ob"
import EmailSettingsPage from "../pageObjects/emailSettingsPage.ob"
import GeneralSettingsPage from "../pageObjects/generalSettingsPage.ob"
import BrandingSettingsPage from "../pageObjects/brandingSettingsPage.ob"
import EmailNotificationPage from "../pageObjects/emailNotificationPage.ob"
import SystemActivityPage from "../pageObjects/systemActivityPage.ob"
import UserPage from "../pageObjects/userPage.ob"
var baseUrl = Cypress.env('url')
var tenant = baseUrl + Cypress.env('tenantName') //+ '/'
const serverId = Cypress.env('mailosaureServerId')
const leftNavBar = new LeftNavBar()
const serverInfoPage = new ServerInformationPage()
const storageSettingsPage = new StorageSettingsPage()
const tenantPage = new TenantPage()
const emailSettingsPage = new EmailSettingsPage()
const generalSettingsPage = new GeneralSettingsPage()
const brandingSettingsPage = new BrandingSettingsPage()
const emailNotificationPage = new EmailNotificationPage()
const systemActivityPage = new SystemActivityPage()
const userPage = new UserPage()
let testData = null


describe('Teant manager Functionality - ' + Cypress.browser.name, function () {

    before(function () {

        if (Cypress.env('live')) {


            baseUrl = Cypress.env('liveUrl')
            tenant = baseUrl + Cypress.env('liveTenant') //+ '/'



            cy.fixture('tenantManagerFunctionalityLive').then(function (data) {
                testData = data
            })

            cy.visit(tenant).then(function () {
                cy.login(testData.tenantManager.username, testData.tenantManager.password)
                cy.url().should('not.include', 'login')
                cy.task('log', testData.tenantManager.username + " Succesfully Logged in")
            })
  



        } else {
            cy.fixture('tenantManagerFunctionality').then(function (data) {
                testData = data
            })
            cy.visit(tenant).then(function () {
                cy.login(testData.tenantManager.username, testData.tenantManager.password)
                cy.url().should('not.include', 'login')
                cy.task('log', testData.tenantManager.username + " Succesfully Logged in")
            })
           


        }


    });

    beforeEach(function () {
        Cypress.Cookies.defaults({ preserve: ['SESSION', 'CSRF-TOKEN'] });
    });

    after(function () {
        cy.clearCookies()
        cy.logout()
    });



    describe('Tenant manager functionality- ' + Cypress.browser.name, function () {

        it('Create licensed user', function () {
            cy.visit(tenant)

            leftNavBar.getAdminTab().click()
            cy.url().should('include', 'admin')
            cy.cmdLogResult('Navigated to admin page')

            leftNavBar.getUserLink().should('be.visible').click({ force: true })
            var i

            for (i = 0; i <= (testData.createUser.user.length - 1); i++) { createUser(i) }

            function createUser(userNumber) {
                userPage.addUser(
                    true,
                    testData.createUser.fname[userNumber],
                    testData.createUser.lname[userNumber],
                    testData.createUser.user[userNumber],
                    testData.createUser.userPassword)


                cy.toastMessageAssert('was created successfully').then(() => {
                    cy.cmdLogResult('User "' + testData.createUser.user[userNumber] + '" created successfully')
                    cy.get('.md-toast-text').should('not.be.visible')
                })

            }




        });

        it('Create external user', function () {

            cy.visit(tenant)

            leftNavBar.getAdminTab().click()
            cy.url().should('include', 'admin')
            cy.cmdLogResult('Navigated to admin page')

            leftNavBar.getUserLink().should('be.visible').click({ force: true })

            userPage.addUser(
                false,
                testData.createUser.tenantRecipientUserFirstName1,
                testData.createUser.tenantRecipientUserLastName1,
                testData.createUser.tenantRecipientUserEmail,
                testData.createUser.tenantRecipientUserPassword1)

            cy.toastMessageAssert('User "' + testData.createUser.tenantRecipientUserEmail + '" was created successfully').then(() => {
                cy.cmdLogResult('User "' + testData.createUser.tenantRecipientUserEmail + '"  created successfully')
            })



        });

        it('General settings configuration', function () {
            cy.visit(tenant)

            leftNavBar.getAdminTab().click()
            cy.url().should('include', 'admin')
            cy.task('log', 'Navigated to admin page')


            generalSettingsPage.getGeneralSettingsTab().click()
            cy.url().should('include', 'general-setting')
            cy.task('log', 'Navigated to general-setting page')

            generalSettingsPage.configureGeneralSettings(testData.generalSettings.sessionTimeOut)

            cy.toastMessageAssert('Settings updated successfully').then(() => {
                cy.task('log', 'General settings is configured successfully')
            })

            //TODO session timout less than 30 test

        });

        it('Brandding settings configuration - Favicon and Logo upload', function () {
            cy.visit(tenant)
            leftNavBar.getAdminTab().click()
            cy.url().should('include', 'admin')
            cy.task('log', 'Navigated to admin page')

            brandingSettingsPage.getBrandingSettingsTab().click()
            cy.wait(3000)
            cy.url().should('include', 'tenant-file')
            cy.task('log', 'Navigated to Branding page')


            brandingSettingsPage.getFaviconUpload().attachFile(testData.branding.faviconLocation)
            cy.task('log', 'Favicon uploaded') //TODO assertion for Facion upload can be included
            cy.wait(5000)


            brandingSettingsPage.getLogoUploadButton().click().then(function () {

                brandingSettingsPage.getLogoUpload().attachFile(testData.branding.logoLocation)
                cy.wait(2000)
                brandingSettingsPage.getLogoSaveButton().click({ multiple: true, force: true })
                cy.task('log', 'Logo uploaded') //TODO assertion for Logo upload can be included
            })

        });

        it('Brandding settings configuration - Favicon and Logo Remove', function () {
            cy.visit(tenant)

            leftNavBar.getAdminTab().click()
            cy.url().should('include', 'admin')
            cy.task('log', 'Navigated to admin page')

            brandingSettingsPage.getBrandingSettingsTab().click()
            cy.url().should('include', 'tenant-file')
            cy.task('log', 'Navigated to Branding page')

            cy.wait(4000)

            brandingSettingsPage.getRemoveFaviconButton().click()
            brandingSettingsPage.getRemoveConfirmButton().click()
            cy.wait(5000)
            brandingSettingsPage.getRemoveLogoButton().should('be.visible').click()
            brandingSettingsPage.getRemoveConfirmButton().should('be.visible').click()


        });

        it('Resend email notification', function () {
            cy.visit(tenant)

            leftNavBar.getAdminTab().click()
            cy.url().should('include', 'admin')
            cy.task('log', 'Navigated to admin page')

            emailNotificationPage.getEmailNotificationTab().click()
            cy.url().should('include', 'email-notification')
            cy.task('log', 'Navigated to email-notification page')

            cy.intercept('POST', '**/updateMails?*').as('post')

            const dayjs = require('dayjs')
            const date = dayjs('01-01-2021').format('MMM DD, YYYY')

            emailNotificationPage.resendEmailNotification(date)

            cy.wait('@post').then(function (res) {
                expect(res.response.statusCode).to.eq(200)
                cy.task('log', 'Mail of ' + date + ' resend ')

            })



        });


        it('System activity report export', function () {
            cy.visit(tenant)
            leftNavBar.getAdminTab().click()
            cy.url().should('include', 'admin')
            cy.task('log', 'Navigated to admin page')

            systemActivityPage.getSystemActivityTab().click()
            cy.url().should('include', 'transactions')
            cy.task('log', 'Navigated to transaction page')

            systemActivityPage.getExportReportButton().click()
            cy.get('[role="dialog"]').should('be.visible')

            cy.download(systemActivityPage.getExportButton)

            cy.toastMessageAssert('System Activity export request submitted')

        });

        //TODO check the system activity report in my files
        //TOOD generatl settings page functionality

    });

});

