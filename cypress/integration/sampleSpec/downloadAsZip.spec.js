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


describe('Comparison spec', function () {
    before(function () {

        let userID
        let storageID
        cy.visit(baseUrl+'nilavo')
        


    });

    beforeEach(function () {
        Cypress.Cookies.defaults({ preserve: ['SESSION', 'CSRF-TOKEN'] });
    });

    after(function () {
       // cy.clearCookies()
       
    });



    describe('Compose message', () => {


        it('sign in', function () {
/*
            cy.login('abir1@nilavodev.com','Nil@vo2006')
            cy.url().should('not.include', 'login')
            cy.task('log', "abir1@nilavodev.com Succesfully Logged in")

      

            cy.reload()
            const file1 = 'data/5MB'
            const file2 = 'data/favicon.png'

            //Got o my file and upload a file
            cy.get('[ui-sref-active="c-sidenav__item--active"][href="/transit/app/nilavo/my-files/"] > div.md-button > .md-no-style',{ timeout: 20000 }).click().then(function(){
            cy.wait(4000)
            cy.get('a.md-primary > span', { timeout: 20000 }).should('be.visible')
            cy.get('label input[type="file"]',{ timeout: 20000 }).attachFile({filePath:file1}).then(function(){
                cy.get('[translate="bsendApp.file.upload.completed"]',{ timeout: 20000 }).then( param =>{
                    expect(param.text()).to.contain("Completed")
                })
    
            })//.trigger('change', { force: true });
            
        }) 

           
            
            //Create folder
            cy.get('a.md-primary > span').click()
            cy.get('#name').type('Folder 1')
            cy.get('#field_description').type('Description')
            cy.get('[type="submit"] > span').click()

            //Go to that folder and upload file
            cy.get('md-list-item[ng-mouseover="vm.viewItem(file)"]').contains('Folder 1').click({force:true}).then(function (params) {
                cy.wait(3000)
                cy.get('label input[type="file"]').attachFile({filePath:file2,mimeType: 'image/png'})
                cy.get('[translate="bsendApp.file.upload.completed"]',{ timeout: 20000 }).then( param =>{
                    expect(param.text()).to.contain("Completed")
                })
            })
                    

        
            cy.reload()
            //const file2 = 'data/favicon.png'
            //cy.wait(3000)
            //Go to compose message
            cy.get('.c-sidenav__item--lg > div.md-button > .md-no-style').click()
            cy.get('md-content [ng-model="vm.message.to"]').type('abir2@nilavodev.com')
            cy.get('[ng-model="vm.message.subject"]').type('Compose  message 1')
            cy.get('[data-placeholder="Type your secure message in this section. Text entered here will never be sent unsecurely."]').type("Secure message")
            cy.get('[ng-show="!vm.showMessage"]').click()
            cy.get('[data-placeholder="Text entered here will be sent via email, which is not secure."]').type('Notification message')

            
            cy.get('label input[type="file"]',{ timeout: 20000 }).attachFile({filePath:file2,mimeType: 'image/png'})
            //cy.wait(2000)
            cy.get('[class="custom-button attach-files-button md-button md-ink-ripple"]').click()
            cy.get('div button[aria-label="Files"]').click()

            cy.get('span[title="5MB"]').click()
            cy.get('button[ng-click="vm.submit()"][translate="pages.file.explorer.attach"]').click().then(function (){
                cy.get('[translate="bsendApp.file.upload.completed"]',{ timeout: 20000 }).then( param =>{
                    expect(param.text()).to.contain("Completed")
                })
            })
            

            cy.get('[ng-click="vm.save()"]').click()

            cy.task('log', 'Navigated to email-notification page')
            cy.logout()
            cy.cmdLogResult('Navigated to login Page page')
            cy.url().should('include', 'login')
*/
            cy.login('abir2@nilavodev.com','Nil@vo2006')
            cy.url().should('not.include', 'login')
            cy.task('log', "abir2@nilavodev.com Succesfully Logged in")

            cy.wait(4000)
            cy.cmdLogResult('Click More Icon')
            cy.get('[name="more"]').first().click()
            cy.wait(3000)
          //  cy.download( cy.get('[ng-click="downloadAsZIP(selectedMessage.folderId)"]').contains('Download attachments as zip')
            cy.download(function (){return cy.get('[ng-click="downloadAsZIP(selectedMessage.folderId)"]').last()})

        });
    });

  



});


