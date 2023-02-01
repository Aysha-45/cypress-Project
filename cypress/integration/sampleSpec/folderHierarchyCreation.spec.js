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
var i = 0;

//const tenantName = 'dten2'
//const userName = 'sarja1@nilavodev.com'
const tenantName = 'volumetest01'
const userName = 'sarja@nilavo.com'
const passwd = 'Nil@vo2006'
const url = "https://sendqa.com/transit/app/" + tenantName + "/"
//const url = "http://192.168.10.245/transit/app/" + tenantName + "/"

describe('Folder hierarchy spec', function () {
    before(function () {

        let userID
        let storageID

        cy.visit(url + 'login/').then(function () {
            cy.login(userName, passwd)
            cy.url().should('not.include', 'login')
            cy.task('log', userName + " Succesfully Logged in")
        })



    });

    beforeEach(function () {
        Cypress.Cookies.defaults({ preserve: ['SESSION', 'CSRF-TOKEN'] });
    });

    after(function () {
        cy.logout()
        cy.cmdLogResult('Navigated to login Page page')
        cy.url().should('include', 'login')
        cy.clearCookies()

    });



    describe('Folder hierarchy creation', () => {

        Cypress._.times(100, (i) => {
            
            it('Folder ' + i + ' creation with subfolder and file', function () {
                //Got o my file and create folder
                var filePath = 'data/'
                var fileName = 'reply.txt'
                var parentFolder = 'Account' + i
                var subFolderOne = 'Customer'
                var subFolderTwo = 'Reports'
                var subFolderThree = 'Taxes'

                cy.visit(url + 'my-files/').then(function () {
                    cy.url().should('include', 'fetchOption=ALL')
                })

                //Create folder
                createFolder(parentFolder)
                cy.cmdLogResult(parentFolder + ' Created')
                searchAndGo(parentFolder).then(function (params) {
                    //File upload 
                    cy.wait(2000)
                    let parentFolderUrl = null
                    cy.url().then(function(currentUrl){
                        parentFolderUrl = currentUrl
                    })

                    //Create subfolder and upload file
                    createFolder(subFolderOne)
                    cy.cmdLogResult(subFolderOne + ' Created')
                    createFolder(subFolderTwo)
                    cy.cmdLogResult(subFolderTwo + ' Created')
                    createFolder(subFolderThree)
                    cy.cmdLogResult(subFolderThree + ' Created')

                    goToFolder(subFolderOne).then(function(){
                        uploadFile(filePath, fileName)
                        cy.visit(parentFolderUrl)
                    })

                    goToFolder(subFolderTwo).then(function(){
                        uploadFile(filePath, fileName)
                        cy.visit(parentFolderUrl)
                    })

                    goToFolder(subFolderThree).then(function(){
                        uploadFile(filePath, fileName)
                        cy.visit(parentFolderUrl)
                    })
                   

                })


                cy.task('log', "Folder" + i + " created with subfolder and files")
            });
        });
    });





});


function uploadFile(filePath, fileName) {
    cy.wait(1000)
    cy.get('[ng-click="$mdMenu.open()"]').click({ timeout: 20000 })
    cy.get('[ng-click="showFileExplorer()"]').click()

    cy.cmdLogStep('Attach file')
    cy.get('label input[type="file"][href=""][ngf-select="vm.addToUploadQueue($files)"]', { timeout: 20000 }).attachFile({ filePath: filePath + fileName })
    cy.get('div[aria-label="' + fileName + '\"]').should('be.visible')
    cy.cmdLogResult('Attached file successfully')

    cy.get('[ng-click="vm.submit()"]').contains('Upload').click()
    cy.uploadAssert('Completed')

    cy.cmdLogResult('File uploaded successfully')
}

function createFolder(folderName) {
    cy.get('a.md-primary > span').click({ timeout: 20000 })
    cy.get('#name').type(folderName)
    cy.get('#field_description').type('Description')
    cy.get('[type="submit"] > span').click()
}

function searchAndGo(folderName) {
    cy.get('[ng-model="vm.search.searchText"]').first().type(folderName).type('{enter}')


    //Go to that folder and create subfolder

    cy.get('[ng-click="vm.clearSearch()"]', { timeout: 10000 }).should('be.visible');
    return cy.get('md-list-item[ng-mouseover="vm.viewItem(file)"]').contains(folderName).click({ force: true })
}

function goToFolder(folderName){
    return cy.get('md-list-item[ng-mouseover="vm.viewItem(file)"]').contains(folderName).click({ force: true })
}

function commentOut(){
    // it('Folder ' + i + ' creation with subfolder with file uploading', function () {


            //     //Got o my file and create folder


            //     cy.visit(url + 'my-files/').then(function () {
            //         cy.url().should('include', 'fetchOption=ALL')
            //     })

            //     //Create folder
            //     cy.get('a.md-primary > span').click({ timeout: 20000 })
            //     cy.get('#name').type('Account' + i)
            //     cy.get('#field_description').type('Description')
            //     cy.get('[type="submit"] > span').click()


            //     cy.get('[ng-model="vm.search.searchText"]').first().type('Account' + i).type('{enter}')


            //     //Go to that folder and create subfolder

            //     cy.get('[ng-click="vm.clearSearch()"]', { timeout: 10000 }).should('be.visible');
            //     cy.get('md-list-item[ng-mouseover="vm.viewItem(file)"]').contains('Account' + i).click({ force: true }).then(function (params) {


            //         //File upload 
            //         var filePath = 'data/'
            //         var fileName = 'reply.txt'
            //         cy.wait(2000)
            //         cy.get('[ng-click="$mdMenu.open()"]').should('be.visible').click({ timeout: 20000 })
            //         cy.get('[ng-click="showFileExplorer()"]').click()

            //         cy.cmdLogStep('Attach file')
            //         cy.get('label input[type="file"][href=""][ngf-select="vm.addToUploadQueue($files)"]', { timeout: 20000 }).attachFile({ filePath: filePath + fileName })
            //         cy.get('div[aria-label="' + fileName + '\"]').should('be.visible')
            //         cy.cmdLogResult('Attached file successfully')

            //         cy.get('[ng-click="vm.submit()"]').contains('Upload').click()
            //         cy.uploadAssert('Completed')

            //         cy.cmdLogResult('File uploaded successfully')
            //         //cy.reload()
            //         //File upload


            //         cy.get('a.md-primary > span').should('be.visible').click({ force: true })
            //         cy.get('#name').type('Customers ')
            //         cy.get('#field_description').type('Description')
            //         cy.get('[type="submit"] > span').should('be.visible').click({ force: true })

            //         //Go the folder and upload file
            //         cy.get('md-list-item[ng-mouseover="vm.viewItem(file)"]', { timeout: 10000 }).contains('Customers').click({ force: true })
            //         var filePath = 'data/'
            //         var fileName = 'reply.txt'
            //         cy.wait(2000)
            //         cy.get('[ng-click="$mdMenu.open()"]').should('be.visible').click({ timeout: 20000 })
            //         cy.get('[ng-click="showFileExplorer()"]').click()

            //         cy.cmdLogStep('Attach file')
            //         cy.get('label input[type="file"][href=""][ngf-select="vm.addToUploadQueue($files)"]', { timeout: 20000 }).attachFile({ filePath: filePath + fileName })
            //         cy.get('div[aria-label="' + fileName + '\"]').should('be.visible')
            //         cy.cmdLogResult('Attached file successfully')

            //         cy.get('[ng-click="vm.submit()"]').contains('Upload').click()
            //         cy.uploadAssert('Completed')

            //         cy.cmdLogResult('File uploaded successfully')
            //         cy.reload()
            //         cy.go('back')

            //         //File upload subfolder end

            //         cy.get('[type="submit"] > span').should('not.exist')
            //         cy.get('a.md-primary > span').should('be.visible').click({ force: true })
            //         cy.get('#name').type('Reports ')
            //         cy.get('#field_description').type('Description')
            //         cy.get('[type="submit"] > span').should('be.visible').click({ force: true })


            //         //Go the folder and upload file
            //         cy.get('md-list-item[ng-mouseover="vm.viewItem(file)"]', { timeout: 10000 }).contains('Reports').click({ force: true })
            //         var filePath = 'data/'
            //         var fileName = 'reply.txt'
            //         cy.wait(2000)
            //         cy.get('[ng-click="$mdMenu.open()"]').should('be.visible').click({ timeout: 20000 })
            //         cy.get('[ng-click="showFileExplorer()"]').click()

            //         cy.cmdLogStep('Attach file')
            //         cy.get('label input[type="file"][href=""][ngf-select="vm.addToUploadQueue($files)"]', { timeout: 20000 }).attachFile({ filePath: filePath + fileName })
            //         cy.get('div[aria-label="' + fileName + '\"]').should('be.visible')
            //         cy.cmdLogResult('Attached file successfully')

            //         cy.get('[ng-click="vm.submit()"]').contains('Upload').click()
            //         cy.uploadAssert('Completed')

            //         cy.cmdLogResult('File uploaded successfully')
            //         cy.reload()
            //         cy.go('back')

            //         //File upload subfolder end


            //         cy.get('[type="submit"] > span').should('not.exist')
            //         cy.get('a.md-primary > span').should('be.visible').click({ force: true })
            //         cy.get('#name').type('Taxes ')
            //         cy.get('#field_description').type('Description')
            //         cy.get('[type="submit"] > span').should('be.visible').click({ force: true })

            //         //Go the folder and upload file
            //         cy.get('md-list-item[ng-mouseover="vm.viewItem(file)"]', { timeout: 10000 }).contains('Taxes').click({ force: true })
            //         var filePath = 'data/'
            //         var fileName = 'reply.txt'
            //         cy.wait(2000)
            //         cy.get('[ng-click="$mdMenu.open()"]').should('be.visible').click({ timeout: 20000 })
            //         cy.get('[ng-click="showFileExplorer()"]').click()

            //         cy.cmdLogStep('Attach file')
            //         cy.get('label input[type="file"][href=""][ngf-select="vm.addToUploadQueue($files)"]', { timeout: 20000 }).attachFile({ filePath: filePath + fileName })
            //         cy.get('div[aria-label="' + fileName + '\"]').should('be.visible')
            //         cy.cmdLogResult('Attached file successfully')

            //         cy.get('[ng-click="vm.submit()"]').contains('Upload').click()
            //         cy.uploadAssert('Completed')

            //         cy.cmdLogResult('File uploaded successfully')
            //         cy.reload()
            //         cy.go('back')

            //         //File upload subfolder end


            //     })


            //     cy.task('log', "Folder created " + i + " with files")



            // });
}