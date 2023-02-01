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

const baseUrl = Cypress.env('url')
const leftNavBar = new LeftNavBar()
const serverInfoPage = new ServerInformationPage()
const storageSettingsPage = new StorageSettingsPage()
const tenantPage = new TenantPage()
const emailSettingsPage = new EmailSettingsPage()
const generalSettingsPage = new GeneralSettingsPage()
const brandingSettingsPage = new BrandingSettingsPage()
const emailNotificationPage = new EmailNotificationPage()
const systemActivityPage = new SystemActivityPage()
let testData = null
 
//this is a test pollSCM new 2 id test 22 aaaaaattt aaa aaaaa hohoohoho 2 kkk v
describe('Super User Functionality - ' + Cypress.browser.name, function () {

    before(function () {

        cy.fixture('superUserFunctionality').then(function (data) {
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



    describe('Manager tenant connfigurations- ' + Cypress.browser.name, function () {

        it('Get transit version and print', function () {
            cy.visit(baseUrl + 'manager')
            leftNavBar.getAdminTab().click()
            cy.url().should('include', 'admin')
            cy.cmdLogStep('Navigated to admin page')
            serverInfoPage.getVersion().then(function (el) {
                cy.cmdLogResult('Transit version - ' + el.text())
            })
        });

        it('Add samba storage', function () {
            cy.visit(baseUrl + 'manager')
            leftNavBar.getAdminTab().click()
            cy.url().should('include', 'admin')
            cy.task('log', 'Navigated to admin page')

            storageSettingsPage.getStorageSettingsTab().click()
            cy.url().should('include', 'data-storage')
            cy.task('log', 'Navigated to data storages page')

            cy.intercept('POST', baseUrl + 'manager/v1/api/crud/dataStorage?*').as('post')

            storageSettingsPage.addSambaDataStorage(
                testData.storage.type,
                testData.storage.path,
                testData.storage.username,
                testData.storage.password,
                testData.storage.capacity)

            cy.wait('@post').then(function (res) {
                expect(res.response.statusCode).to.eq(200)
                cy.task('log', 'Samba storage added successfully')
            })

        });

        it('Add Tenant', function () {
            cy.visit(baseUrl + 'manager')
            leftNavBar.getAdminTab().click()
            cy.url().should('include', 'admin')
            cy.task('log', 'Navigated to admin page')

            tenantPage.getTenantTab().click()
            cy.url().should('include', 'tenant')
            cy.task('log', 'Navigated to tenant page')

            tenantPage.addTenant(
                Cypress.env('tenantName'),
                testData.tenant.adminEmail,
                testData.tenant.adminFirstName,
                testData.tenant.adminLastName,
                testData.tenant.adminPassword,
                testData.tenant.adminConfPass,
                testData.tenant.licenseNumber
            )

            cy.toastMessageAssert("\"" + Cypress.env('tenantName') + "\"" + ' was created successfully').then(() => {
                cy.task('log', 'Tenant ' + Cypress.env('tenantName') + ' Created Successfully')
            })

        });

        it('Email settings configuration', function () {
            cy.visit(baseUrl + 'manager')

            leftNavBar.getAdminTab().click()
            cy.url().should('include', 'admin')
            cy.task('log', 'Navigated to admin page')

            emailSettingsPage.getMailSettingsTab().click()
            cy.url().should('include', 'email-settin')
            cy.task('log', 'Navigated to email-settin page')

            emailSettingsPage.configureMail(
                testData.email.host,
                testData.email.userName,
                testData.email.password)

            //TODO Assertion for email configuration needs to be included
            cy.task('log', 'Assertion is pending, under development')

        });

        it('General settings configuration', function () {
            cy.visit(baseUrl + 'manager')

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
            cy.visit(baseUrl + 'manager')
            leftNavBar.getAdminTab().click()
            cy.url().should('include', 'admin')
            cy.task('log', 'Navigated to admin page')

            brandingSettingsPage.getBrandingSettingsTab().click()
            cy.wait(3000)
            cy.url().should('include', 'tenant-file')
            cy.task('log', 'Navigated to Branding page')


            brandingSettingsPage.getFaviconUpload().attachFile(testData.branding.faviconLocation)
            cy.task('log', 'Favicon uploaded') //TODO assertion for Favicon upload can be included
            cy.wait(5000)


            brandingSettingsPage.getLogoUploadButton().click().then(function () {

                brandingSettingsPage.getLogoUpload().attachFile(testData.branding.logoLocation)
                cy.wait(2000)
                brandingSettingsPage.getLogoSaveButton().click({ multiple: true, force: true })
                cy.task('log', 'Logo uploaded') //TODO assertion for Logo upload can be included
            })

        });

        it('Brandding settings configuration - Favicon and Logo Remove', function () {
            cy.visit(baseUrl + 'manager')

            leftNavBar.getAdminTab().click()
            cy.url().should('include', 'admin')
            cy.task('log', 'Navigated to admin page')

            brandingSettingsPage.getBrandingSettingsTab().click()
            cy.url().should('include', 'tenant-file')
            cy.task('log', 'Navigated to Branding page')

            cy.wait(4000)

            brandingSettingsPage.getRemoveFaviconButton().should('be.visible').click()
            brandingSettingsPage.getRemoveConfirmButton().should('be.visible').click()
            cy.wait(5000)
            brandingSettingsPage.getRemoveLogoButton().should('be.visible').click()
            brandingSettingsPage.getRemoveConfirmButton().should('be.visible').click()


        });

        it('Resend email notification', function () {
            cy.visit(baseUrl + 'manager')

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
                
            })

            cy.cmdLogResult('Mail of ' + date + ' resend ')



        });


        it('Add tenant with complex name', function () {
            var string = Cypress.env('tenantName');
            var lengthString = string.length;
            var trimmedString = string.substring(lengthString - 4, lengthString);
            var finalComplexTenantName

            cy.visit(baseUrl + 'manager')
            leftNavBar.getAdminTab().click()
            cy.url().should('include', 'admin')
            cy.task('log', 'Navigated to admin page')

            tenantPage.getTenantTab().click()
            cy.url().should('include', 'tenant')
            cy.task('log', 'Navigated to tenant page')

            if (Cypress.browser.name === 'chrome'){
                finalComplexTenantName = 'CHrm'+trimmedString
            }else if(Cypress.browser.name === 'firefox') {
                finalComplexTenantName = 'FFox'+trimmedString
            }

            tenantPage.addTenant(
                finalComplexTenantName,
                testData.tenant.adminEmail,
                testData.tenant.adminFirstName,
                testData.tenant.adminLastName,
                testData.tenant.adminPassword,
                testData.tenant.adminConfPass,
                testData.tenant.licenseNumber
            )
            var str =
                cy.toastMessageAssert("\"" + (finalComplexTenantName).toLowerCase() + "\"" + ' was created successfully').then(() => {
                    cy.task('log', 'Tenant ' + finalComplexTenantName + ' Created Successfully')
                })

        });

        //TODO System activity export report

        it('System activity report export', function () {
            cy.visit(baseUrl + 'manager')
            leftNavBar.getAdminTab().click()
            cy.url().should('include', 'admin')
            cy.task('log', 'Navigated to admin page')

            systemActivityPage.getSystemActivityTab().click()
            cy.url().should('include', 'transactions')
            cy.task('log', 'Navigated to transaction page')

            systemActivityPage.getExportReportButton().click()
            cy.get('[role="dialog"]').should('be.visible')

            cy.download(systemActivityPage.getExportButton)

            //TODO csv file reading can be included in future
            //cy.readFile('cypress/downloads/a.png','base64').then(function(content){console.log('hahaha '+content)})


        });


        //TODO Outlook add in configuration
        // it('Outlook addin configuration', function () {
        //     cy.visit(baseUrl + 'manager')
        //     leftNavBar.getAdminTab().click()
        //     cy.url().should('include', 'admin')
        //     cy.task('log', 'Navigated to admin page')


        // });

        //TODO Password policy will be included under user management spec
        //TODO Tenant settings
        //TODO Integration settings
        //TODO System activity test will be included in future

    });

});

