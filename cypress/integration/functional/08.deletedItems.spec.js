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
import DeletedItemsFilePage from "../pageObjects/deletedItemsFilesPage.ob"
import ApiInvoke from "../helper/api"

var baseUrl = Cypress.env('url')
var tenant = baseUrl + Cypress.env('tenantName') //+ '/'
const serverId = Cypress.env('mailosaureServerId')
const leftNavBar = new LeftNavBar()
const myFilesPage = new MyFilesPage()
const deletedItemsFilePage = new DeletedItemsFilePage()
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
const api = new ApiInvoke()
let testData = null


describe('Deleted Items Functionality - ' + Cypress.browser.name, function () {

    before(function () {


        if (Cypress.env('live')) {


            baseUrl = Cypress.env('liveUrl')
            tenant = baseUrl + Cypress.env('liveTenant') //+ '/'



            cy.fixture('deletedItemsLive').then(function (data) {
                testData = data
            })

            cy.visit(tenant)
  



        } else {
            cy.fixture('deletedItems').then(function (data) {
                testData = data
            })
            cy.visit(tenant)
           


        }



    });

    beforeEach(function () {

        Cypress.Cookies.defaults({ preserve: ['SESSION', 'CSRF-TOKEN'] });
    
    });

    after(function () {

        cy.clearCookies()

    });

    describe('Deleted Items Functionality - Test Environment Setup - ' + Cypress.browser.name, function () {

        it('Create Dedicated User for Deleted Items Functionality', function () {
            
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
            //         true,
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

        });

    });
    

    describe('Deleted Items Functionality test - ' + Cypress.browser.name, function () {

        // TODO - Delete Toast Message Undo

        it('Delete Functionality Test', function () {

            // Login
            
            cy.visit(tenant).then(function () {
        
                cy.cmdLogStep('Log in as User : ' + testData.createUser.user[0])
                cy.login(testData.createUser.user[0], testData.createUser.userPassword)
                cy.url().should('not.include', 'login')
                cy.cmdLogResult(testData.createUser.user[0] + " Succesfully Logged in")
            })

            
            cy.cmdLogStep('Go to My Files Page')
            leftNavBar.getMyFilessTab().click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully Navigated to My Files Page")


            cy.cmdLogStep('Upload file')
            myFilesPage.uploadFile(testData.myFilesFileUpload.attachedFileLocationMyComputer)


            // Deletion
            
            cy.cmdLogStep('Delete that file')
            myFilesPage.deleteSingleItem(testData.myFilesFileUpload.fileName)
            cy.toastMessageAssert("deleted successfully").then(() => {
                cy.cmdLogResult('File Deleted Successfully')
                cy.get('.md-toast-text').should('not.exist')
            })
            

            cy.get('[ng-mouseover="vm.viewItem(file)"]').should('not.exist')
            cy.cmdLogResult("File Deletion is Verified - File Not Found in Deleted Items >> Files Page")


        });

        it('Restore Functionality Test', function () {

            // Restoration
            
            cy.visit(tenant)            

            cy.cmdLogStep('Go to Deleted Items Page')
            leftNavBar.getDeletedItems().click()
            cy.url().should('include', 'trash')
            cy.cmdLogResult("Succesfully Navigated to Deleted Items Page")

            cy.cmdLogStep('Go to Files Section in Deleted Items Page')
            deletedItemsFilePage.getDeletedFiles().click()
            cy.url().should('include', 'trash/2')
            cy.cmdLogResult("Succesfully Navigated to Files Section in Deleted Items Page")


            cy.cmdLogStep("Check that File in Deleted Items >> Files")

            // var verifyItem = null
            // verifyItem = deletedItemsFilePage.verifyItem(testData.myFilesFileUpload.fileName)
            // if(verifyItem == 1) { cy.cmdLogResult("File found in Deleted Items >> Files") }

            var fileName = testData.myFilesFileUpload.fileName
            var nameMatch = fileName + ' ' + fileName  
            deletedItemsFilePage.getFilesList().each(function(ele) { 
                var text = ele.text()
                if(text.includes(nameMatch)) { 
                    cy.log('Match Found')
                    cy.cmdLogResult("File found in Deleted Items >> Files")
                    return false
                }
                else {
                    cy.log('Match Not Found') 
                }
            })


            cy.cmdLogStep('Restore that file')
            deletedItemsFilePage.restoreSingleItem(testData.myFilesFileUpload.fileName)
            cy.toastMessageAssert("Item restored successfully").then(() => {
                cy.cmdLogResult('File Restored Successfully')
                cy.get('.md-toast-text').should('not.exist')
            })


            // Restore Verification - from Deleted Items >> Files

            cy.cmdLogStep('Verify File Restoration - Verify whether or not that File exists in Deleted Items >> Files Page')
            cy.url().should('include', 'trash/2')
            cy.get('[ng-mouseover="vm.viewItem(file)"]').should('not.exist')
            cy.cmdLogResult("File Restoration is Verified - File Not Found in Deleted Items >> Files Page")


            // Restore Verification - from My Files

            cy.cmdLogStep('Verify File Restoration - Verify whether or not that File exists in My Files Page')
            leftNavBar.getMyFilessTab().click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully Navigated to My Files Page")


            cy.cmdLogStep('Verify Restoration of that file in My Files')

            // var verifyFileRestoredMyFilesPage = null
            // verifyFileRestoredMyFilesPage = myFilesPage.verifyItem(testData.myFilesFileUpload.fileName)
            // if(verifyFileRestoredMyFilesPage == 1) { cy.cmdLogResult("File Restoration is Verified - File Found in My Files Page") }

            var fileName = testData.myFilesFileUpload.fileName
            var nameMatch = fileName + ' ' + fileName  
            myFilesPage.getFilesList().each(function(ele) { 
                var text = ele.text()
                if(text.includes(nameMatch)) { 
                    cy.log('Match Found')
                    cy.cmdLogResult("File found in Deleted Items >> Files")
                    return false
                }
                else {
                    cy.log('Match Not Found') 
                }
            })


        });

        it('Delete Permanently Functionality Test', function () {

            // Deletion

            cy.visit(tenant)
            
            cy.cmdLogStep('Go to My Files Page')
            leftNavBar.getMyFilessTab().click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully Navigated to My Files Page")

            cy.cmdLogStep('Delete that file again from My Files')
            myFilesPage.deleteSingleItem(testData.myFilesFileUpload.fileName)
            cy.toastMessageAssert("deleted successfully").then(() => {
                cy.cmdLogResult('File Deleted Successfully')
                cy.get('.md-toast-text').should('not.exist')
            })


            cy.get('[ng-mouseover="vm.viewItem(file)"]').should('not.exist')
            cy.cmdLogResult("File Deletion is Verified - File Not Found in Deleted Items >> Files Page")


            // Permanent Deletion

            cy.cmdLogStep('Go to Deleted Items Page')
            leftNavBar.getDeletedItems().click()
            cy.url().should('include', 'trash')
            cy.cmdLogResult("Succesfully Navigated to Deleted Items Page")


            cy.cmdLogStep('Go to Files Section in Deleted Items Page')
            deletedItemsFilePage.getDeletedFiles().click()
            cy.url().should('include', 'trash/2')
            cy.cmdLogResult("Succesfully Navigated to Files Section in Deleted Items Page")


            cy.cmdLogStep("Check that File in Deleted Items >> Files") 

            // var verifyItem = null
            // verifyItem = deletedItemsFilePage.verifyItem(testData.myFilesFileUpload.fileName)
            // if(verifyItem == 1) { cy.cmdLogResult("File found in Deleted Items >> Files") }
           
            var fileName = testData.myFilesFileUpload.fileName
            var nameMatch = fileName + ' ' + fileName  
            deletedItemsFilePage.getFilesList().each(function(ele) { 
                var text = ele.text()
                if(text.includes(nameMatch)) { 
                    cy.log('Match Found')
                    cy.cmdLogResult("File found in Deleted Items >> Files")
                    return false
                }
                else {
                    cy.log('Match Not Found') 
                }
            })
            
    
            cy.cmdLogStep('Permanently Delete that file')
            deletedItemsFilePage.permanentlyDeleteSingleItem(testData.myFilesFileUpload.fileName)
            cy.toastMessageAssert("were deleted").then(() => {
                cy.cmdLogResult('File Deleted Permanently')
                cy.get('.md-toast-text').should('not.exist')
            })


            // Verification -> From Deleted Items >> Files
            
            cy.cmdLogStep('Verify File Permanent Deletion - Verify whether or not that File exists in Deleted Items >> Files Page')
            cy.url().should('include', 'trash/2')
            cy.get('[ng-mouseover="vm.viewItem(file)"]').should('not.exist')
            cy.cmdLogResult("File Permanent Deletion is Verified - File Not Found in Deleted Items >> Files Page")

            
            // Verification -> From My Files

            cy.cmdLogStep('Verify File Permanent Deletion - Verify whether or not that File exists in My Files Page')
            leftNavBar.getMyFilessTab().click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully Navigated to My Files Page")
            cy.get('[ng-mouseover="vm.viewItem(file)"]').should('not.exist')
            cy.cmdLogResult("File Restoration is Verified - File Not Found in My Files Page")


            // Logout

            cy.cmdLogStep('Log out as User : ' + testData.createUser.user[0])
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult(testData.createUser.user[0] + " Succesfully Logged out")


        });
        
    });

    // Not Required for now : Delete Dedicated User

    // describe('Deleted Items Functionality - Reset Test Environment', function () {

    //     it('Delete dedicated user for Deleted Items Functionality', function () {
        
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

    //         userPage.deleteUser(testData.createUser.user[0])
    //         // was deleted successfully
    //         cy.toastMessageAssert("was deleted successfully").then(() => {
    //             cy.cmdLogResult('User  ' + testData.createUser.user[0] + ' Deleted Successfully')
    //         })

    //         // for chrome browser inconsistency
    //         cy.visit(tenant)
            
    //         cy.cmdLogStep('Log out as Tenant Manager : ' + testData.tenantManager.username)
    //         cy.logout()
    //         cy.url().should('include', 'login')
    //         cy.cmdLogResult(testData.tenantManager.username + " Succesfully Logged out")

    //     })

    // });

})
