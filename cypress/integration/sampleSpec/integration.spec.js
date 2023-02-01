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


describe('Integration suite', function () {
    before(function () {

        let userID
        let storageID
        cy.visit('https://sendqa.com/transit/app/integration/login/')
        





    });

    beforeEach(function () {
        Cypress.Cookies.defaults({ preserve: ['SESSION', 'CSRF-TOKEN'] });
    });

    after(function () {
        //cy.clearCookies()
        //cy.logout()
    });



    describe('API related tests', () => {

        it('Sign in', function () {
            cy.login('sarja@nilavo.com','Nil@vo2006')
            cy.url().should('not.include', 'login')
            cy.task('log', "sarja@nilavo.com Succesfully Logged in")

        });


        it('Integration', function () {

            cy.visit('https://sendqa.com/transit/app/integration/my-files/0S8zgHB?fetchOption=ALL')
            cy.wait(7000)
            cy.intercept('GET', 'https://sendqa.com/transit/app/integration/v1/api/crud/dropboxFile?*', (req) => {

                req.reply((res) => {
                    res.send({
                        statusCode: 404,
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
            // cy.wait(5000)        
            // cy.get('div a[aria-label="Files"]').click({force:true})
            cy.wait(5000)
            //cy.get('[ui-sref-active="c-sidenav__item--active"][href="/transit/app/integration/my-files/"] > div.md-button > .md-no-style').click()
            cy.get('[ng-click="$mdMenu.open()"]').click()
            cy.wait(2000)
            cy.get('[ng-click="showFileExplorer()"]').click()
            cy.wait(2000)
            cy.get('[aria-label="Dropbox"]').click()
            cy.wait(4000)

            cy.wait('@post2').then(function (res) {
                cy.log(res)
                //cy.pause()
                expect(res.response.headers).to.include({
                    'x-api-error': 'dataStorage.path.access'
                })

                cy.task('log', 'Adding samba storage when server respose is 400 failed successfully')
            })
        });

    });
});

