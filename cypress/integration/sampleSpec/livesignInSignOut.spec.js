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


describe('FIle Management spec', function () {
    before(function () {

        let userID
        let storageID
        cy.visit('https://sendqa.com/transit/app/volumetest01/login/')



    });

    beforeEach(function () {
        Cypress.Cookies.defaults({ preserve: ['SESSION', 'CSRF-TOKEN'] });
    });

    after(function () {
        cy.clearCookies()

    });



    describe('Multiple folder creation', () => {


        it('sign in', function () {

            cy.login('abir@nilavo.com', 'Nil@vo2006')
            cy.url().should('not.include', 'login')
            cy.task('log', "abi@nilavo.com Succesfully Logged in")



            cy.reload()
            const file1 = 'data/favicon.png'
            const file2 = 'data/favicon.png'
            const file3 = 'data/customers.xlsx'
            const file4 = 'data/report.docx'
            const file5 = 'data/tax.pdf'
            var i;
            //Got o my file and upload a file
            for (i = 0; i < 50; i++) {
                cy.get('div a[aria-label="Files"]', { timeout: 20000 }).should('be.visible').click().then(function () {
                    cy.wait(5000+i*500)

                    // cy.get('a.md-primary > span', { timeout: 20000 }).should('be.visible')


                })

                //cy.reload()

                //Create folder
                cy.get('a.md-primary > span').click({ timeout: 20000 })
                cy.get('#name').type('Account' + i)
                cy.get('#field_description').type('Description')
                cy.get('[type="submit"] > span').click()

                // cy.wait(4000)
                cy.get('[ng-model="vm.search.searchText"]').first().type('Account' + i).type('{enter}')

                //  cy.wait(2000)

                //Go to that folder and upload file

                cy.get('[ng-click="vm.clearSearch()"]', { timeout: 10000 }).should('be.visible');
                cy.get('md-list-item[ng-mouseover="vm.viewItem(file)"]').contains('Account' + i).click({ force: true }).then(function (params) {
                    //cy.wait(3000)
                    cy.get('a.md-primary > span').should('be.visible').click({ force: true })
                    cy.get('#name').type('Customers ')
                    cy.get('#field_description').type('Description')
                    cy.get('[type="submit"] > span').should('be.visible').click({ force: true })

                    // cy.wait(4000)

                    // cy.get('md-list-item[ng-mouseover="vm.viewItem(file)"]').contains('Customers').click({ force: true }).then(function (params) {

                    //cy.wait(4000)

                    // cy.get('label input[type="file"]').attachFile({ filePath: file3})
                    //  cy.get('[translate="bsendApp.file.upload.completed"]', { timeout: 20000 }).then(param => {
                    //      expect(param.text()).to.contain("Completed")
                    //    })
                    //   })

                    //  cy.wait(4000)
                    //  cy.go('back')  

                    //  cy.wait(3000)
                    cy.get('[type="submit"] > span').should('not.exist')
                    cy.get('a.md-primary > span').should('be.visible').click({ force: true })
                    cy.get('#name').type('Reports ')
                    cy.get('#field_description').type('Description')
                    cy.get('[type="submit"] > span').should('be.visible').click({ force: true })

                    // cy.wait(4000)

                    // cy.get('md-list-item[ng-mouseover="vm.viewItem(file)"]').contains('Reports').click({ force: true }).then(function (params) {

                    //  cy.wait(4000)

                    //  cy.get('label input[type="file"]').attachFile({ filePath: file4})
                    //   cy.get('[translate="bsendApp.file.upload.completed"]', { timeout: 20000 }).then(param => {
                    //       expect(param.text()).to.contain("Completed")
                    //    })
                    //   })

                    //  cy.wait(4000)
                    //   cy.go('back') 
                    //   cy.wait(3000)
                    cy.get('[type="submit"] > span').should('not.exist')
                    cy.get('a.md-primary > span').should('be.visible').click({ force: true })
                    cy.get('#name').type('Taxes ')
                    cy.get('#field_description').type('Description')
                    cy.get('[type="submit"] > span').should('be.visible').click({ force: true })

                    //  cy.wait(4000)

                    // cy.get('md-list-item[ng-mouseover="vm.viewItem(file)"]').contains('Taxes').click({ force: true }).then(function (params) {

                    //  cy.wait(4000)

                    //   cy.get('label input[type="file"]').attachFile({ filePath: file5})
                    //    cy.get('[translate="bsendApp.file.upload.completed"]', { timeout: 20000 }).then(param => {
                    //        expect(param.text()).to.contain("Completed")
                    //     })
                    //    })

                    // cy.wait(4000)




                })

                cy.get('div a[aria-label="Contacts"]', { timeout: 20000 }).should('be.visible').click({ force: true }).then(function () {
                    //   cy.wait(4000)
                   // cy.get('a.md-primary > span', { timeout: 20000 }).should('be.visible')


                })
                cy.task('log', "FOlder created " + i)

            }


            cy.logout()
            cy.cmdLogResult('Navigated to login Page page')
            cy.url().should('include', 'login')





        });
    });





});


