/// <reference types="Cypress" />

import LeftNavBar from "../pageObjects/leftNavBar.ob"
import ServerInformationPage from "../pageObjects/serverInformationPage.ob"
import StorageSettingsPage from "../pageObjects/storageSettingsPage.ob"
import TenantPage from "../pageObjects/tenantPage.ob"
import EmailSettingsPage from "../pageObjects/emailSettingsPage.ob"
import GeneralSettingsPage from "../pageObjects/generalSettingsPage.ob"
import BrandingSettingsPage from "../pageObjects/brandingSettingsPage.ob"
import EmailNotificationPage from "../pageObjects/emailNotificationPage.ob"
const baseUrl = Cypress.env('url')
const leftNavBar = new LeftNavBar()
const serverInfoPage = new ServerInformationPage()
const storageSettingsPage = new StorageSettingsPage()
const tenantPage = new TenantPage()
const emailSettingsPage = new EmailSettingsPage()
const generalSettingsPage = new GeneralSettingsPage()
const brandingSettingsPage = new BrandingSettingsPage()
const emailNotificationPage = new EmailNotificationPage()


describe('Super User Functionality Test Suite', function () {
    
    before(function () {

        let userID
        let storageID
        cy.visit(baseUrl)
        cy.fixture('superUserFunctionality').then(function (data) {
            this.data = data
        })





    });

    beforeEach(function () {
        Cypress.Cookies.defaults({ preserve: ['SESSION', 'CSRF-TOKEN'] });
    });

    after(function () {
        cy.clearCookies()
        cy.logout()
    });



    describe('Manager tenant connfiguration', function () {

        it.only('Sign in', function () {
            cy.login(this.data.superAdmin.userName, this.data.superAdmin.password)
            cy.url().should('not.include', 'login')
            cy.task('log', this.data.superAdmin.userName + " Succesfully Logged in")

        });

        it.only('Print the product version', function () {
            cy.visit(baseUrl + 'manager')
            leftNavBar.getAdminTab().click()
            cy.url().should('include', 'admin')
            cy.task('log', 'Navigated to admin page')

            serverInfoPage.getVersion().then(function (el) {
                cy.task('log', 'Transit version - ' + el.text())
            })
        });

        it('Add samba storage', function () {
            cy.visit(baseUrl + 'manager')
            leftNavBar.getAdminTab().click()
            cy.url().should('include', 'admin')
            cy.task('log', 'Navigated to admin page')
            cy.wait(4000)
            storageSettingsPage.getStorageSettingsTab().click()
            cy.url().should('include', 'data-storage')
            cy.task('log', 'Navigated to data storages page')
            //cy.reload()
            cy.wait(4000)
            cy.intercept('POST', baseUrl + 'manager/v1/api/crud/dataStorage?*').as('post')
            storageSettingsPage.addSambaDataStorage(
                this.data.storage.type,
                this.data.storage.path,
                this.data.storage.username,
                this.data.storage.password,
                this.data.storage.capacity)

            //cy.get('@post').then(console.log)
            cy.wait('@post').then(function (res) {
                expect(res.response.statusCode).to.eq(200)
                cy.task('log', 'Samba storage added successfully')
            })

        });
        //
        it.only('Add Tenant', function () {
            cy.visit(baseUrl + 'manager')
            leftNavBar.getAdminTab().click()
            cy.url().should('include', 'admin')
            cy.task('log', 'Navigated to admin page')

            tenantPage.getTenantTab().click()
            cy.url().should('include', 'tenant')
            cy.task('log', 'Navigated to tenant page')

            tenantPage.addTenant(
                Cypress.env('tenantName'),
                this.data.tenant.adminEmail,
                this.data.tenant.adminFirstName,
                this.data.tenant.adminLastName,
                this.data.tenant.adminPassword,
                this.data.tenant.adminConfPass,
                this.data.tenant.licenseNumber
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
                this.data.email.host,
                this.data.email.userName,
                this.data.email.password)
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

            generalSettingsPage.configureGeneralSettings(this.data.generalSettings.sessionTimeOut)

            cy.toastMessageAssert('Settings updated successfully').then(() => {
                cy.task('log', 'General settings is configured successfully')
            })

        });

        it('Brandding settings configuration - Favicon and Logo upload', function () {
            cy.visit(baseUrl + 'manager')
            //cy.intercept('POST', '**/tenant-file-upload?*').as('post')
            leftNavBar.getAdminTab().click()
            cy.url().should('include', 'admin')
            cy.task('log', 'Navigated to admin page')

            const filePath = '1.png'
            brandingSettingsPage.getBrandingSettingsTab().click()
            cy.wait(3000)
            cy.url().should('include', 'tenant-file')
            cy.task('log', 'Navigated to Branding page')

            //cy.intercept('POST', '**/tenant-file-upload?*').as('post')
            //Assertion is pending

            brandingSettingsPage.getFaviconUpload().attachFile(filePath)
            cy.task('log', 'Favicon uploaded')
            cy.wait(5000)

            // cy.wait('@post').then(function (res) {
            //     expect(res.response.statusCode).to.eq(200)
            //     cy.task('log', 'Favicon uploaded')
            // })



            brandingSettingsPage.getLogoUploadButton().click().then(function () {

                brandingSettingsPage.getLogoUpload().attachFile(filePath)
                cy.wait(2000)
                brandingSettingsPage.getLogoSaveButton().click({ multiple: true, force: true })
                cy.task('log', 'Logo uploaded')
            })


            //Assertion is pending  
            // cy.wait('@post').then(function (res) {
            //     expect(res.response.statusCode).to.eq(200)
            //     cy.task('log', 'Logo uploaded')
            // })



        });

        it('Brandding settings configuration - Favicon and Logo Remove', function () {
            cy.visit(baseUrl + 'manager')

            leftNavBar.getAdminTab().click()
            cy.url().should('include', 'admin')
            cy.task('log', 'Navigated to admin page')

            brandingSettingsPage.getBrandingSettingsTab().click()
            cy.url().should('include', 'tenant-file')
            cy.task('log', 'Navigated to Branding page')

            //cy.intercept('DELETE', baseUrl+'manager/v1/api/crud/tenant-file/*').as('post')

            //brandingSettingsPage.getFaviconUpload().attachFile(filePath)  
            cy.wait(4000)

            brandingSettingsPage.getRemoveFaviconButton().click()
            brandingSettingsPage.getRemoveConfirmButton().click()
            // cy.wait('@post').then(function (res) {
            //     expect(res.response.statusCode).to.eq(200)
            //     cy.task('log', 'Favicon removed ')
            // })
            //cy.reload()
            cy.wait(3000)
            brandingSettingsPage.getRemoveLogoButton().click()
            brandingSettingsPage.getRemoveConfirmButton().click()
            // cy.wait('@post').then(function (res) {
            //     expect(res.response.statusCode).to.eq(200)
            //     cy.task('log', 'Logo removed ')
            // })


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
                cy.task('log', 'Mail of ' + date + ' resend ')

            })



        });

        //System activity test will be included in future

        it('Add tenant with complex name', function () {
            var string = Cypress.env('tenantName');
            var lengthString = string.length;
            var trimmedString = string.substring(lengthString - 2, lengthString);

            cy.visit(baseUrl + 'manager')
            leftNavBar.getAdminTab().click()
            cy.url().should('include', 'admin')
            cy.task('log', 'Navigated to admin page')

            tenantPage.getTenantTab().click()
            cy.url().should('include', 'tenant')
            cy.task('log', 'Navigated to tenant page')

            tenantPage.addTenant(
                this.data.tenant.complex_tenant + trimmedString,
                this.data.tenant.adminEmail,
                this.data.tenant.adminFirstName,
                this.data.tenant.adminLastName,
                this.data.tenant.adminPassword,
                this.data.tenant.adminConfPass,
                this.data.tenant.licenseNumber
            )
            var str =
                cy.toastMessageAssert("\"" + (this.data.tenant.complex_tenant + trimmedString).toLowerCase() + "\"" + ' was created successfully').then(() => {
                    cy.task('log', 'Tenant ' + this.data.tenant.complex_tenant + trimmedString + ' Created Successfully')
                })

        });



    });

    describe('API related tests', () => {

        it.only('Data storage server response failure', function () {
            cy.visit(baseUrl + 'manager')
            leftNavBar.getAdminTab().click()
            storageSettingsPage.getStorageSettingsTab().click()

            cy.intercept('POST', '**/dataStorage?*', (req) => {

                req.reply((res) => {
                    res.send({
                        statusCode: 400,
                        headers: {
                            'x-api-error': 'dataStorage.path.access'
                        }
                    })

                    // delays the response by 1000ms
                    res.delay(1000)

                    // throttles the response to 64kbps
                    //res.throttle(64)
                })
            }).as('post2')


            storageSettingsPage.addSambaDataStorage(
                this.data.storage.type,
                this.data.storage.path,
                this.data.storage.username,
                this.data.storage.password,
                this.data.storage.capacity)


            cy.wait('@post2').then(function (res) {
                cy.log(res)
                //cy.pause()
                expect(res.response.headers).to.include({
                    'x-api-error': 'dataStorage.path.access'
                })

                cy.task('log', 'Adding samba storage when server respose is 400 failed successfully')
            })

        });

        it.only('Example with API for creating users', function () {
            cy.getCookie("CSRF-TOKEN").then(function (params) {
                cy.log(params)
                cy.request({
                    method: 'POST', url: baseUrl + 'manager/v1/api/crud/user',

                    headers: {

                        'X-CSRF-TOKEN': params.value
                    },

                    body: {
                        'activated': true,
                        'authorities': null,
                        'confirmPassword': "Nil@vo2006",
                        'createdBy': null,
                        'createdDate': null,
                        'email': "sarja13@nilavodev.com",
                        'firstName': null,
                        'id': null,
                        'lastModifiedBy': null,
                        'lastModifiedDate': null,
                        'lastName': null,
                        'login': null,
                        'password': "Nil@vo2006",
                        'roles': ["BiscomReporter"]

                    }
                }).then(function (res) {

                    cy.log(res)
                    this.userID = res.body.id

                })
                cy.task('log', 'Added user via POST request successfully')

            })
        });

        it.only('Delete the created user via API', function () {
            console.log(this.userID)
            cy.getCookie("CSRF-TOKEN").then(function (params) {
                cy.log(params)
                cy.request({
                    method: 'POST', url: baseUrl + 'manager/v1/api/crud/user/delete?*',

                    headers: {

                        'X-CSRF-TOKEN': params.value
                    },

                    body: ["" + this.userID + ""]
                })
                cy.task('log', 'Added user via POST request successfully')

            })
        });
    });
});

