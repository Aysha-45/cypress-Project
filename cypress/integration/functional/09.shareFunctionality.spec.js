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
import SelfRegistrationPage from "../pageObjects/selfRegistrationPage.ob"
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
const selfRegistrationPage = new SelfRegistrationPage()
const api = new ApiInvoke()
let testData = null
let finalLink


describe('Share Functionality - ' + Cypress.browser.name, function () {

    before(function () { 

        if (Cypress.env('live')) {

            baseUrl = Cypress.env('liveUrl')
            tenant = baseUrl + Cypress.env('liveTenant') //+ '/'
            cy.mailosaurDeleteAllMessages(serverId)

            cy.fixture('shareFunctionalityLive').then(function (data) { testData = data }) 

        }
        else{
            var clientJson = {
                squirrelmailServer: Cypress.env('mailServerAddress'),
                port: Cypress.env('mailServerPort'),
                user: "rayeed9",
                pass: "1234",
            }
            cy.task('deleteEmail', clientJson)
    
            cy.fixture('shareFunctionality').then(function (data) { testData = data }) 
        }
    
    })

    beforeEach(function () { Cypress.Cookies.defaults({ preserve: ['SESSION', 'CSRF-TOKEN'] }) })

    afterEach(function () { })

    after(function () { cy.clearCookies() })




    describe('Share Functionality - Test Environment Setup - ' + Cypress.browser.name, function () {

        it('Create dedicated users for Share Functionality', function () {

            cy.visit(tenant).then(function () {
                cy.cmdLogStep('Log in as Tenant Manager : ' + testData.tenantManager.username)
                cy.login(testData.tenantManager.username, testData.tenantManager.password)
                cy.url().should('not.include', 'login')
                cy.cmdLogResult(testData.tenantManager.username + " Succesfully Logged in")
            })


            let userArr = testData.createUser.user
            // let userArrFname = testData.createUser.userFirstName
            // let userArrlname = testData.createUser.userLastName
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
            //         testData.createUser.userLicense,
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

    describe('Share Functionality - ' + Cypress.browser.name, function () {
        
        it('User 1 - Create a Folder in My Files & Upload Files, Upload File in Root (for Later)', function () {

            cy.visit(tenant).then(function () {
                cy.cmdLogStep('Log in as User : ' + testData.createUser.user[0])
                cy.login(testData.createUser.user[0], testData.createUser.userPassword)
                cy.url().should('not.include', 'login')
                cy.cmdLogResult(testData.createUser.user[0] + " Succesfully Logged in")
            })

            cy.cmdLogStep('Go to My Files')
            leftNavBar.getMyFilessTab().should('be.visible').click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully Naviagted to My Files")


            cy.cmdLogStep('Create a Folder in My Files Page')
            var folderName = testData.myFilesUser1.sharedFolderName
            var folderDesc = testData.myFilesUser1.sharedFolderDesc

            myFilesPage.createFolder(folderName, folderDesc)
            cy.toastMessageAssert("successfully created").then(() => {
                cy.cmdLogResult('Folder Created Successfully')
                cy.get('.md-toast-text').should('not.exist')
            })


            cy.cmdLogStep('Verify Folder Creation in My Files Page')
            // var folderFound = 0
            // folderFound = myFilesPage.verifyItem(folderName)
            // if (folderFound == 1) { cy.cmdLogResult("Folder Creation Verified in My Files Page -> Folder Found in My Files") }

            let res = folderName + ' ' + folderName  
            myFilesPage.getFilesList().should('be.visible').then(function() {
                cy.log('Search : ' + res)
                myFilesPage.getFilesList().each(function(ele) { 
                    var text = ele.text()
                    cy.log(text)
                    if(text.includes(res)) { 
                        cy.log('Match Found')
                        cy.cmdLogResult("Folder Creation Verified in My Files Page -> Folder Found in My Files")
                        return false
                    }
                    else {
                        cy.log('Match Not Found') 
                    }
                })
            })


            cy.cmdLogStep('Go to the Specific Folder : ' + folderName)
            myFilesPage.goToSpecificFolder(folderName)
            cy.wait(2000)
            cy.cmdLogResult('Succesfully Naviagted to the Specific Folder : ' + folderName)

            // cy.cmdLogStep('Verify the Naviagation to Specific Folder Page : ' + folderName)
            // if (myFilesPage.getFolderPath().should('be.visible').contains(folderName)) {
            //     cy.cmdLogResult('Naviagation to the Specific Folder : ' + folderName + ' is Verified')
            // }


            cy.cmdLogStep('Upload File to Specific Folder : ' + folderName)
            var file1 = testData.myFilesUser1.fileUploadedInSharedFolder
            myFilesPage.uploadFile(file1)


            cy.cmdLogStep('Verify Uploaded File in My Files >> Specific Folder')
            // var fileFound = 0
            // fileFound = myFilesPage.verifyItem(file1)
            // if (fileFound == 1) { cy.cmdLogResult("File Uploadation Verified -> File Found in My Files >> Specific Folder") }

            var fileName = file1.substring(file1.lastIndexOf("/") + 1, file1.length)
            let res1 = fileName + ' ' + fileName
            myFilesPage.getFilesList().should('be.visible').then(function() {
                cy.log('Search : ' + res1)
                myFilesPage.getFilesList().each(function(ele) { 
                    var text = ele.text()
                    cy.log(text)
                    if(text.includes(res1)) { 
                        cy.log('Match Found')
                        cy.cmdLogResult("File Uploadation Verified -> File Found in My Files >> Specific Folder")
                        return false
                    }
                    else {
                        cy.log('Match Not Found') 
                    }
                })
            })


            cy.cmdLogStep('Navigate to Root Folder')
            var rootFolder = testData.rootFolderName
            //myFilesPage.navigateBetweenFolders(rootFolder)
            cy.cmdLogStep('Go to My Files')
            leftNavBar.getMyFilessTab().should('be.visible').click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully Naviagted to My Files")
            cy.cmdLogResult('Succesfully Naviagted to Root Folder')


            // cy.cmdLogStep('Verify the Naviagation to Root Folder ' + rootFolder)
            // if (myFilesPage.getFolderPath().should('be.visible').contains(rootFolder)) {
            //     cy.cmdLogResult('Naviagation to the Root Folder : ' + rootFolder + ' is Verified')
            // }


            cy.cmdLogStep('Upload File to Root Folder : ' + rootFolder)
            var fileRoot = testData.myFilesUser1.fileUploadedInRootFolder
            myFilesPage.uploadFile(fileRoot)

            cy.wait(2000)

            cy.cmdLogStep('Verify Uploaded File in My Files >> Root Folder')
            // var fileFound = 0
            // fileFound = myFilesPage.verifyItem(fileRoot)
            // if (fileFound == 1) { cy.cmdLogResult("File Uploadation Verified -> File Found in My Files >> Root Folder") }
            
            var fileName = fileRoot.substring(fileRoot.lastIndexOf("/") + 1, fileRoot.length)
            let res2 = fileName + ' ' + fileName
            myFilesPage.getFilesList().should('be.visible').then(function() {
                cy.log('Search : ' + res2)
                myFilesPage.getFilesList().each(function(ele) { 
                    var text = ele.text()
                    cy.log(text)
                    if(text.includes(res2)) { 
                        cy.log('Match Found')
                        cy.cmdLogResult("File Uploadation Verified -> File Found in My Files >> Root Folder")
                        return false
                    }
                    else {
                        cy.log('Match Not Found') 
                    }
                })
            })

        })

        it('User 1 - Share the Folder - with Editor Role', function () {

            cy.cmdLogStep('Go to My Files')
            leftNavBar.getMyFilessTab().should('be.visible').click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully Naviagted to My Files")

            cy.wait(2000)
            var folderName = testData.myFilesUser1.sharedFolderName
            var recipient1 = testData.createUser.user[1]
            // var recipient2 = testData.createUser.user[2]
            var role = testData.shareFolderRoles.editor
            var note = testData.shareFolderNote


            cy.cmdLogStep('Verify Folder in My Files Page')
            // var folderFound = 0
            // folderFound = myFilesPage.verifyItem(folderName)
            // if (folderFound == 1) { cy.cmdLogResult("Folder Found in My Files") }

            let res = folderName + ' ' + folderName  
            myFilesPage.getFilesList().should('be.visible').then(function() {
                cy.log('Search : ' + res)
                myFilesPage.getFilesList().each(function(ele) { 
                    var text = ele.text()
                    cy.log(text)
                    if(text.includes(res)) { 
                        cy.log('Match Found')
                        cy.cmdLogResult("Folder Found in My Files")
                        return false
                    }
                    else {
                        cy.log('Match Not Found') 
                    }
                })
            })


            cy.cmdLogStep('Share the Folder')

            var params = new myFilesPage.shareFolderParams()
            params.folderName = folderName
            params.recipient1 = recipient1
            // params.recipient2 = recipient2
            params.role = role
            params.note = note

            myFilesPage.shareFolderByCheckBox(params)

            cy.toastMessageAssert('successfully shared').then(() => {
                cy.cmdLogResult('Folder "' + folderName + '" Shared Successfully')
                cy.get('.md-toast-text').should('not.be.visible')
            })


            cy.cmdLogStep('Verify Folder Sharing - Go to My Files')
            leftNavBar.getMyFilessTab().should('be.visible').click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully Naviagted to My Files")


            cy.cmdLogStep('Open the Share Window of the Folder : ' + folderName + ' and Verify Sharing')
            myFilesPage.verifyFolderShareFromShareWindow(folderName, recipient1, role)


            cy.cmdLogStep('Log out as User : ' + testData.createUser.user[0])
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult(testData.createUser.user[0] + " Succesfully Logged out")

        })
        
        it('User 2 - Accept the Shared Folder Invitation', function () {

            cy.visit(tenant).then(function () {
                cy.cmdLogStep('Log in as User : ' + testData.createUser.user[1])
                cy.login(testData.createUser.user[1], testData.createUser.userPassword)
                cy.url().should('not.include', 'login')
                cy.cmdLogResult(testData.createUser.user[1] + " Succesfully Logged in")
            })

            var sharedFolderName = testData.myFilesUser1.sharedFolderName

            cy.cmdLogStep('Accept the Invitation of the Folder : ' + sharedFolderName)
            topNavBar.acceptInvitation(sharedFolderName)
            cy.get('body').trigger('{esc}');
            cy.cmdLogResult('Accepted the Invitation of the Folder : ' + sharedFolderName)


            // cy.cmdLogStep('Verify Invitation Acceptance of the Folder : ' + sharedFolderName)
            // if (myFilesPage.getFolderPath().should('be.visible').contains(sharedFolderName)) {
            //     cy.cmdLogStep('Invitation Acceptance Verified of the Folder : ' + sharedFolderName + ' -> Navigated to this Folder')
            // }


        })

        it('User 2 - Download File from Shared Folder', function () {

            var fileInSharedFolder = testData.myFilesUser1.fileUploadedInSharedFolder
            var filename = fileInSharedFolder.substring(fileInSharedFolder.lastIndexOf("/") + 1, fileInSharedFolder.length)
            var sharedFolderName = testData.myFilesUser1.sharedFolderName

            cy.cmdLogStep('Download the File : ' + filename + ' - from Shared Folder : ' + sharedFolderName)
            myFilesPage.downloadSingleFile(filename)

            // TO DO - Assertion for Dowwnload

        })

        it('User 2 - Create a Sub-Folder in the Shared Folder & Upload Files, Upload File in Root (for Later)', function () {

            cy.visit(tenant)

            cy.cmdLogStep('Go to My Files')
            leftNavBar.getMyFilessTab().should('be.visible').click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully Naviagted to My Files")

            var folderName = testData.myFilesUser1.sharedFolderName
            cy.cmdLogStep('Go to the Specific Folder : ' + folderName)
            myFilesPage.goToSpecificFolder(folderName)
            cy.wait(2000)
            cy.cmdLogResult('Succesfully Naviagted to the Specific Folder : ' + folderName)


            cy.cmdLogStep('Create a Folder in Shared Folder')
            var folderName = testData.myFilesUser2.sharedSubFolderName
            var folderDesc = testData.myFilesUser2.sharedSubFolderDesc

            myFilesPage.createFolder(folderName, folderDesc)
            cy.toastMessageAssert("successfully created").then(() => {
                cy.cmdLogResult('Folder Created Successfully')
                cy.get('.md-toast-text').should('not.exist')
            })


            cy.cmdLogStep('Go to the Shared Folder >> Sub Folder : ' + folderName)
            myFilesPage.goToSpecificFolder(folderName)
            cy.wait(2000)
            cy.cmdLogResult('Succesfully Naviagted to the Shared Folder >> Sub Folder : ' + folderName)



            cy.cmdLogStep('Upload File to Sub-Folder : ' + folderName)
            var file1 = testData.myFilesUser2.fileUploadedInSharedSubFolder
            myFilesPage.uploadFile(file1)


            cy.cmdLogStep('Verify Uploaded File in My Files >> Shared Folder >> Sub Folder')
            // var fileFound = 0
            // fileFound = myFilesPage.verifyItem(file1)
            // if (fileFound == 1) { cy.cmdLogResult("File Uploadation Verified -> File Found in My Files >> Shared Folder >> Sub Folder") }

            var fileName = file1.substring(file1.lastIndexOf("/") + 1, file1.length)
            let res = fileName + ' ' + fileName
            myFilesPage.getFilesList().should('be.visible').then(function() {
                cy.log('Search : ' + res)
                myFilesPage.getFilesList().each(function(ele) { 
                    var text = ele.text()
                    cy.log(text)
                    if(text.includes(res)) { 
                        cy.log('Match Found')
                        cy.cmdLogResult("File Uploadation Verified -> File Found in My Files >> Shared Folder >> Sub Folder")
                        return false
                    }
                    else {
                        cy.log('Match Not Found') 
                    }
                })
            })


            cy.cmdLogStep('Navigate to Root Folder')
            var rootFolder = testData.rootFolderName
            //myFilesPage.navigateBetweenFolders(rootFolder)
            cy.cmdLogStep('Go to My Files')
            leftNavBar.getMyFilessTab().should('be.visible').click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully Naviagted to My Files")
            cy.cmdLogResult('Succesfully Naviagted to Root Folder')


            // cy.cmdLogStep('Verify the Naviagation to Root Folder ' + rootFolder)
            // if (myFilesPage.getFolderPath().should('be.visible').contains(rootFolder)) {
            //     cy.cmdLogResult('Naviagation to the Root Folder : ' + rootFolder + ' is Verified')
            // }


            cy.cmdLogStep('Upload File to Root Folder : ' + rootFolder)
            var fileRoot = testData.myFilesUser2.fileUploadedInRootFolder
            myFilesPage.uploadFile(fileRoot)

            cy.wait(2000)

            cy.cmdLogStep('Verify Uploaded File in My Files >> Root Folder')
            // var fileFound = 0
            // fileFound = myFilesPage.verifyItem(fileRoot)
            // if (fileFound == 1) { cy.cmdLogResult("File Uploadation Verified -> File Found in My Files >> Root Folder") }

            var fileName = fileRoot.substring(fileRoot.lastIndexOf("/") + 1, fileRoot.length)
            let res1 = fileName + ' ' + fileName
            myFilesPage.getFilesList().should('be.visible').then(function() { 
                cy.log('Search : ' + res1)
                myFilesPage.getFilesList().each(function(ele) { 
                    var text = ele.text()
                    cy.log(text)
                    if(text.includes(res1)) { 
                        cy.log('Match Found')
                        cy.cmdLogResult("File Uploadation Verified -> File Found in My Files >> Root Folder")
                        return false
                    }
                    else {
                        cy.log('Match Not Found') 
                    }
                })
            })


            cy.cmdLogStep('Log out as User : ' + testData.createUser.user[1])
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult(testData.createUser.user[1] + " Succesfully Logged out")

        })
        
        it('User 1 - Download File from Shared Sub-Folder', function() {

            cy.visit(tenant).then(function () {
                cy.cmdLogStep('Log in as User : ' + testData.createUser.user[0])
                cy.login(testData.createUser.user[0], testData.createUser.userPassword)
                cy.url().should('not.include', 'login')
                cy.cmdLogResult(testData.createUser.user[0] + " Succesfully Logged in")
            })

            cy.cmdLogStep('Go to My Files')
            leftNavBar.getMyFilessTab().should('be.visible').click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully Naviagted to My Files")

            var folderName = testData.myFilesUser1.sharedFolderName
            cy.cmdLogStep('Go to the Specific Folder : ' + folderName)
            myFilesPage.goToSpecificFolder(folderName)
            cy.wait(2000)
            cy.cmdLogResult('Succesfully Naviagted to the Specific Folder : ' + folderName)

            // cy.cmdLogStep('Verify the Naviagation to Specific Folder Page : ' + folderName)
            // if (myFilesPage.getFolderPath().should('be.visible').contains(folderName)) {
            //     cy.cmdLogResult('Naviagation to the Specific Folder : ' + folderName + ' is Verified')
            // }

            var subFolderName = testData.myFilesUser2.sharedSubFolderName
            cy.cmdLogStep('Go to the Specific Folder : ' + subFolderName)
            myFilesPage.goToSpecificFolder(subFolderName)
            cy.cmdLogResult('Succesfully Naviagted to the Specific Folder : ' + subFolderName)

            // cy.cmdLogStep('Verify the Naviagation to Specific Folder Page : ' + subFolderName)
            // if (myFilesPage.getFolderPath().should('be.visible').contains(subFolderName)) {
            //     cy.cmdLogResult('Naviagation to the Specific Folder : ' + subFolderName + ' is Verified')
            // }

            var fileInSharedSubFolder = testData.myFilesUser2.fileUploadedInSharedSubFolder
            var filename = fileInSharedSubFolder.substring(fileInSharedSubFolder.lastIndexOf("/") + 1, fileInSharedSubFolder.length)
            var sharedSubFolderName = testData.myFilesUser2.sharedSubFolderName

            cy.cmdLogStep('Download the File : ' + filename + ' - from Shared Sub-Folder : ' + sharedSubFolderName)
            myFilesPage.downloadSingleFile(filename)

        })

        it('User 1 - Copy File to Shared Folder', function() {

            var fileInRoot = testData.myFilesUser1.fileUploadedInRootFolder
            var fileRootSearch = fileInRoot.substring(fileInRoot.lastIndexOf("/") + 1, fileInRoot.length) 
            var folderName = testData.myFilesUser1.sharedFolderName

            cy.visit(tenant)

            cy.cmdLogStep('Go to My Files')
            leftNavBar.getMyFilessTab().should('be.visible').click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully Naviagted to My Files") 

            cy.cmdLogStep('Copy File to Shared Folder')

            cy.cmdLogStep('Select File')
            myFilesPage.checkSingleItem(fileRootSearch)
            cy.cmdLogResult("File Checked")


            cy.cmdLogStep('Copy File')
            //myFilesPage.getCopyButton().click({ force : true })
            myFilesPage.getCopyButton().should('be.visible').click()
            myFilesPage.selectFolderInWindow(folderName)

            cy.toastMessageAssert('Successfully copied').then(() => {
                cy.cmdLogResult('File  Successfully Copied to"' + folderName)
                cy.get('.md-toast-text').should('not.exist')
            })

            cy.cmdLogResult("File Succesfully Copied to Shared Folder")

            cy.cmdLogStep('Verify Copy Functionality')

            cy.cmdLogStep('Go to My Files')
            leftNavBar.getMyFilessTab().should('be.visible').click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully Naviagted to My Files") 

            cy.cmdLogStep('Go to the Specific Folder : ' + folderName)
            myFilesPage.goToSpecificFolder(folderName)
            cy.wait(2000)
            cy.cmdLogResult('Succesfully Naviagted to the Specific Folder : ' + folderName)

            // cy.cmdLogStep('Verify the Naviagation to Specific Folder Page : ' + folderName)
            // if (myFilesPage.getFolderPath().should('be.visible').contains(folderName)) {
            //     cy.cmdLogResult('Naviagation to the Specific Folder : ' + folderName + ' is Verified')
            // }

            cy.cmdLogStep('Verify File in Specific Folder Page : ' + folderName)
            let res1 = fileRootSearch + ' ' + fileRootSearch
            myFilesPage.getFilesList().should('be.visible').then(function() { 
                cy.log('Search : ' + res1)
                myFilesPage.getFilesList().each(function(ele) { 
                    var text = ele.text()
                    cy.log(text)
                    if(text.includes(res1)) { 
                        cy.log('Match Found')
                        cy.cmdLogResult("File Copy Functionality Verified -> File Found in My Files >> Shared Folder")
                        return false
                    }
                    else {
                        cy.log('Match Not Found') 
                    }
                })
            })

            cy.cmdLogStep('Log out as User : ' + testData.createUser.user[0])
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult(testData.createUser.user[0] + " Succesfully Logged out")

        })

        it('User 2 - Check the Copied File in Shared Folder', function() { 
            
            cy.visit(tenant).then(function () {
                cy.cmdLogStep('Log in as User : ' + testData.createUser.user[1])
                cy.login(testData.createUser.user[1], testData.createUser.userPassword)
                cy.url().should('not.include', 'login')
                cy.cmdLogResult(testData.createUser.user[1] + " Succesfully Logged in")
            })

            var fileInRoot = testData.myFilesUser1.fileUploadedInRootFolder
            var fileRootSearch = fileInRoot.substring(fileInRoot.lastIndexOf("/") + 1, fileInRoot.length) 
            var folderName = testData.myFilesUser1.sharedFolderName

            cy.cmdLogStep('Check the Copied File in Shared Folder')

            cy.cmdLogStep('Go to My Files')
            leftNavBar.getMyFilessTab().should('be.visible').click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully Naviagted to My Files") 

            cy.cmdLogStep('Go to the Specific Folder : ' + folderName)
            myFilesPage.goToSpecificFolder(folderName)
            cy.wait(2000)
            cy.cmdLogResult('Succesfully Naviagted to the Specific Folder : ' + folderName)

            // cy.cmdLogStep('Verify the Naviagation to Specific Folder Page : ' + folderName)
            // if (myFilesPage.getFolderPath().should('be.visible').contains(folderName)) {
            //     cy.cmdLogResult('Naviagation to the Specific Folder : ' + folderName + ' is Verified')
            // }

            cy.cmdLogStep('Verify File in Specific Folder Page : ' + folderName)
            let res1 = fileRootSearch + ' ' + fileRootSearch
            myFilesPage.getFilesList().should('be.visible').then(function() { 
                cy.log('Search : ' + res1)
                myFilesPage.getFilesList().each(function(ele) { 
                    var text = ele.text()
                    cy.log(text)
                    if(text.includes(res1)) { 
                        cy.log('Match Found')
                        cy.cmdLogResult("File Copy Functionality Verified -> File Found in My Files >> Shared Folder")
                        return false
                    }
                    else {
                        cy.log('Match Not Found') 
                    }
                })
            })

        })

        it('User 2 - Rename a File in Shared Folder', function() {

            var folderName = testData.myFilesUser1.sharedFolderName
            var subFolderName = testData.myFilesUser2.sharedSubFolderName
            
            cy.cmdLogStep('Go to My Files')
            leftNavBar.getMyFilessTab().should('be.visible').click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully Naviagted to My Files") 
            
            cy.cmdLogStep('Go to the Specific Folder : ' + folderName)
            
            myFilesPage.goToSpecificFolder(folderName)
            cy.wait(2000)
            cy.cmdLogResult('Succesfully Naviagted to the Specific Folder : ' + folderName)
            
            // cy.cmdLogStep('Verify the Naviagation to Specific Folder Page : ' + folderName)
            // if (myFilesPage.getFolderPath().should('be.visible').contains(folderName)) {
            //     cy.cmdLogResult('Naviagation to the Specific Folder : ' + folderName + ' is Verified')
            // }
           
            cy.cmdLogStep('Go to the Specific Folder : ' + subFolderName)
           // cy.reload()
            myFilesPage.goToSpecificFolder(subFolderName)
            cy.wait(2000)
            cy.cmdLogResult('Succesfully Naviagted to the Specific Folder : ' + subFolderName)

            // cy.cmdLogStep('Verify the Naviagation to Specific Folder Page : ' + subFolderName)
            // if (myFilesPage.getFolderPath().should('be.visible').contains(subFolderName)) {
            //     cy.cmdLogResult('Naviagation to the Specific Folder : ' + subFolderName + ' is Verified')
            // }

            var fileInSharedSubFolder = testData.myFilesUser2.fileUploadedInSharedSubFolder
            var filename = fileInSharedSubFolder.substring(fileInSharedSubFolder.lastIndexOf("/") + 1, fileInSharedSubFolder.length)

            var newFileName = filename + " " + "Renamed by User 2"
            myFilesPage.renameSingleItem(filename , newFileName)

            cy.toastMessageAssert('successfully saved').then(() => {
                cy.cmdLogResult('File Successfully Renamed')
                cy.get('.md-toast-text').should('not.exist')
            })

            let res = newFileName + ' ' + newFileName  
            myFilesPage.getFilesList().should('be.visible').then(function() {
                cy.log('Search : ' + res)
                myFilesPage.getFilesList().each(function(ele) { 
                    var text = ele.text()
                    cy.log(text)
                    if(text.includes(res)) { 
                        cy.log('Match Found')
                        cy.cmdLogResult("File Rename Verified in My Files Page -> Renamed File Found")
                        return false
                    }
                    else {
                        cy.log('Match Not Found') 
                    }
                })
            })
            
        })

        it('User 2 - Move File to Shared Folder', function() { 

            var folderName = testData.myFilesUser1.sharedFolderName
            let fileInRoot = testData.myFilesUser2.fileUploadedInRootFolder
            let fileRootSearch = fileInRoot.substring(fileInRoot.lastIndexOf("/") + 1, fileInRoot.length)

            cy.cmdLogStep('Go to My Files')
            leftNavBar.getMyFilessTab().should('be.visible').click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully Naviagted to My Files") 

            cy.cmdLogStep('Move File to Shared Folder')

            cy.cmdLogStep('Select File')
            myFilesPage.checkSingleItem(fileRootSearch)
            cy.cmdLogResult("File Checked")


            cy.cmdLogStep('Move File')
            //myFilesPage.getMoveButton().click({ force : true })
            myFilesPage.getMoveButton().should('be.visible').click()
            myFilesPage.selectFolderInWindow(folderName)

            cy.toastMessageAssert('Successfully moved').then(() => {
                cy.cmdLogResult('File  Successfully Moved to"' + folderName)
                cy.get('.md-toast-text').should('not.exist')
            })

            cy.cmdLogResult("File Succesfully Moved to Shared Folder")

            cy.cmdLogStep('Verify Move Functionality')

            cy.cmdLogStep('Go to My Files')
            leftNavBar.getMyFilessTab().should('be.visible').click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully Naviagted to My Files") 

            cy.cmdLogStep('Go to the Specific Folder : ' + folderName)
            myFilesPage.goToSpecificFolder(folderName)
            cy.wait(2000)
            cy.cmdLogResult('Succesfully Naviagted to the Specific Folder : ' + folderName)

            // cy.cmdLogStep('Verify the Naviagation to Specific Folder Page : ' + folderName)
            // if (myFilesPage.getFolderPath().should('be.visible').contains(folderName)) {
            //     cy.cmdLogResult('Naviagation to the Specific Folder : ' + folderName + ' is Verified')
            // }

            cy.cmdLogStep('Verify File in Specific Folder Page : ' + folderName)
            let res1 = fileRootSearch + ' ' + fileRootSearch
            myFilesPage.getFilesList().should('be.visible').then(function() { 
                cy.log('Search : ' + res1)
                myFilesPage.getFilesList().each(function(ele) { 
                    var text = ele.text()
                    cy.log(text)
                    if(text.includes(res1)) { 
                        cy.log('Match Found')
                        cy.cmdLogResult("File Move Functionality Verified -> File Found in My Files >> Shared Folder")
                        return false
                    }
                    else {
                        cy.log('Match Not Found') 
                    }
                })
            })

            cy.cmdLogStep('Log out as User : ' + testData.createUser.user[1])
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult(testData.createUser.user[1] + " Succesfully Logged out")

        })

        it('User 1 - Check the Moved File in Shared Folder', function() { 
            
            cy.visit(tenant).then(function () {
                cy.cmdLogStep('Log in as User : ' + testData.createUser.user[0])
                cy.login(testData.createUser.user[0], testData.createUser.userPassword)
                cy.url().should('not.include', 'login')
                cy.cmdLogResult(testData.createUser.user[0] + " Succesfully Logged in")
            })

            let fileInRoot = testData.myFilesUser2.fileUploadedInRootFolder
            let fileRootSearch = fileInRoot.substring(fileInRoot.lastIndexOf("/") + 1, fileInRoot.length) 
            var folderName = testData.myFilesUser1.sharedFolderName

            cy.cmdLogStep('Check the Moved File in Shared Folder')

            cy.cmdLogStep('Go to My Files')
            leftNavBar.getMyFilessTab().should('be.visible').click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully Naviagted to My Files") 

            cy.cmdLogStep('Go to the Specific Folder : ' + folderName)
            myFilesPage.goToSpecificFolder(folderName)
            cy.wait(2000)
            cy.cmdLogResult('Succesfully Naviagted to the Specific Folder : ' + folderName)

            // cy.cmdLogStep('Verify the Naviagation to Specific Folder Page : ' + folderName)
            // if (myFilesPage.getFolderPath().should('be.visible').contains(folderName)) {
            //     cy.cmdLogResult('Naviagation to the Specific Folder : ' + folderName + ' is Verified')
            // }

            cy.cmdLogStep('Verify File in Specific Folder Page : ' + folderName)
            let res1 = fileRootSearch + ' ' + fileRootSearch
            myFilesPage.getFilesList().should('be.visible').then(function() { 
                cy.log('Search : ' + res1)
                myFilesPage.getFilesList().each(function(ele) { 
                    var text = ele.text()
                    cy.log(text)
                    if(text.includes(res1)) { 
                        cy.log('Match Found')
                        cy.cmdLogResult("File Move Functionality Verified -> File Found in My Files >> Shared Folder")
                        return false
                    }
                    else {
                        cy.log('Match Not Found') 
                    }
                })
            })

        })

        it('User 1 - Check the Renamed File in Shared Folder', function() { 
 
            var folderName = testData.myFilesUser1.sharedFolderName
            var subFolderName = testData.myFilesUser2.sharedSubFolderName

            var fileInSharedSubFolder = testData.myFilesUser2.fileUploadedInSharedSubFolder
            var filename = fileInSharedSubFolder.substring(fileInSharedSubFolder.lastIndexOf("/") + 1, fileInSharedSubFolder.length)

            var newFileName = filename + " " + "Renamed by User 2"

            cy.cmdLogStep('Check the Renamed File in Shared Folder')

            cy.cmdLogStep('Go to My Files')
            leftNavBar.getMyFilessTab().should('be.visible').click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully Naviagted to My Files") 
            cy.cmdLogResult('renamed name: '+newFileName)
            cy.cmdLogStep('Go to the Specific Folder : ' + folderName)
            myFilesPage.goToSpecificFolder(folderName)
            cy.wait(2000)
            cy.cmdLogResult('Succesfully Naviagted to the Specific Folder : ' + folderName)

            // cy.cmdLogStep('Verify the Naviagation to Specific Folder Page : ' + folderName)
            // if (myFilesPage.getFolderPath().should('be.visible').contains(folderName)) {
            //     cy.cmdLogResult('Naviagation to the Specific Folder : ' + folderName + ' is Verified')
            // }

            cy.cmdLogStep('Go to the Specific Folder : ' + subFolderName)
            myFilesPage.goToSpecificFolder(subFolderName)
            cy.cmdLogResult('Succesfully Naviagted to the Specific Folder : ' + subFolderName)

            // cy.cmdLogStep('Verify the Naviagation to Specific Folder Page : ' + subFolderName)
            // if (myFilesPage.getFolderPath().should('be.visible').contains(subFolderName)) {
            //     cy.cmdLogResult('Naviagation to the Specific Folder : ' + subFolderName + ' is Verified')
            // }

            cy.cmdLogStep('Verify File in Specific Folder Page : ' + subFolderName)
            let res1 = newFileName + ' ' + newFileName
            myFilesPage.getFilesList().should('be.visible').then(function() { 
                cy.log('Search : ' + res1)
                myFilesPage.getFilesList().each(function(ele) { 
                    var text = ele.text()
                    cy.log(text)
                    if(text.includes(res1)) { 
                        cy.log('Match Found')
                        cy.cmdLogResult("File Rename Functionality Verified -> File Found in My Files >> Shared Folder")
                        return false
                    }
                    else {
                        cy.log('Match Not Found') 
                    }
                })
            })

        })

        it('User 1 - Rename a File in Shared Folder', function() {

            var folderName = testData.myFilesUser1.sharedFolderName
            var subFolderName = testData.myFilesUser2.sharedSubFolderName

            cy.cmdLogStep('Go to My Files')
            leftNavBar.getMyFilessTab().should('be.visible').click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully Naviagted to My Files") 

            cy.cmdLogStep('Go to the Specific Folder : ' + folderName)
            myFilesPage.goToSpecificFolder(folderName)
            cy.wait(2000)
            cy.cmdLogResult('Succesfully Naviagted to the Specific Folder : ' + folderName)

            // cy.cmdLogStep('Verify the Naviagation to Specific Folder Page : ' + folderName)
            // if (myFilesPage.getFolderPath().should('be.visible').contains(folderName)) {
            //     cy.cmdLogResult('Naviagation to the Specific Folder : ' + folderName + ' is Verified')
            // }

            let fileInSharedFolder = testData.myFilesUser1.fileUploadedInSharedFolder
            let filename = fileInSharedFolder.substring(fileInSharedFolder.lastIndexOf("/") + 1, fileInSharedFolder.length)

            let newFileName = filename + " " + "Renamed by User 1"
            myFilesPage.renameSingleItem(filename , newFileName)

            cy.toastMessageAssert('successfully saved').then(() => {
                cy.cmdLogResult('File Successfully Renamed')
                cy.get('.md-toast-text').should('not.exist')
            })

            let res = newFileName + ' ' + newFileName  
            myFilesPage.getFilesList().should('be.visible').then(function() {
                cy.log('Search : ' + res)
                myFilesPage.getFilesList().each(function(ele) { 
                    var text = ele.text()
                    cy.log(text)
                    if(text.includes(res)) { 
                        cy.log('Match Found')
                        cy.cmdLogResult("File Rename Verified in My Files Page -> Renamed File Found")
                        return false
                    }
                    else {
                        cy.log('Match Not Found') 
                    }
                })
            })

            cy.cmdLogStep('Log out as User : ' + testData.createUser.user[0])
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult(testData.createUser.user[0] + " Succesfully Logged out")
            
        })
        
        it('User 2 - Check the Renamed File in Shared Folder', function() { 
 
            cy.visit(tenant).then(function () {
                cy.cmdLogStep('Log in as User : ' + testData.createUser.user[1])
                cy.login(testData.createUser.user[1], testData.createUser.userPassword)
                cy.url().should('not.include', 'login')
                cy.cmdLogResult(testData.createUser.user[1] + " Succesfully Logged in")
            })

            var folderName = testData.myFilesUser1.sharedFolderName

            let fileInSharedFolder = testData.myFilesUser1.fileUploadedInSharedFolder
            let filename = fileInSharedFolder.substring(fileInSharedFolder.lastIndexOf("/") + 1, fileInSharedFolder.length)

            var newFileName = filename + " " + "Renamed by User 1"

            cy.cmdLogStep('Check the Renamed File in Shared Folder')

            cy.cmdLogStep('Go to My Files')
            leftNavBar.getMyFilessTab().should('be.visible').click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully Naviagted to My Files") 

            cy.cmdLogStep('Go to the Specific Folder : ' + folderName)
            myFilesPage.goToSpecificFolder(folderName)
            cy.wait(2000)
            cy.cmdLogResult('Succesfully Naviagted to the Specific Folder : ' + folderName)

            // cy.cmdLogStep('Verify the Naviagation to Specific Folder Page : ' + folderName)
            // if (myFilesPage.getFolderPath().should('be.visible').contains(folderName)) {
            //     cy.cmdLogResult('Naviagation to the Specific Folder : ' + folderName + ' is Verified')
            // }

            cy.cmdLogStep('Verify File in Specific Folder Page : ' + folderName)
            let res1 = newFileName + ' ' + newFileName
            myFilesPage.getFilesList().should('be.visible').then(function() { 
                cy.log('Search : ' + res1)
                myFilesPage.getFilesList().each(function(ele) { 
                    var text = ele.text()
                    cy.log(text)
                    if(text.includes(res1)) { 
                        cy.log('Match Found')
                        cy.cmdLogResult("File Rename Functionality Verified -> File Found in My Files >> Shared Folder")
                        return false
                    }
                    else {
                        cy.log('Match Not Found') 
                    }
                })
            })

        })

        it('User 2 - Unsubscribe the Shared Folder', function() { 

            cy.cmdLogStep('Go to My Files')
            leftNavBar.getMyFilessTab().should('be.visible').click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully Naviagted to My Files") 

            var folderName = testData.myFilesUser1.sharedFolderName + " - Shared by Rayeed6_FN Rayeed6_LN"
            cy.cmdLogStep('Unsubscribe the Shared Folder')
            cy.reload()
            cy.wait(3000)
            myFilesPage.unsubscribeFolder(folderName)
            cy.toastMessageAssert('Successfully unsubscribed').then(() => {
                cy.cmdLogResult("Succesfully Unsubscribed Folder : " + folderName)
                cy.get('.md-toast-text').should('not.exist')
            })
            
            cy.cmdLogStep('Verify Unsubscription - from Collaborator End')
            cy.cmdLogStep('Go to My Files')
            leftNavBar.getMyFilessTab().should('be.visible').click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully Naviagted to My Files")       
            cy.get('[ng-mouseover="vm.viewItem(file)"]').should('not.exist')
            cy.cmdLogResult("Folder Unsubscription Verified - Folder Not Found in My Files") 

            cy.cmdLogStep('Log out as User : ' + testData.createUser.user[1])
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult(testData.createUser.user[1] + " Succesfully Logged out")

        })

        it('User 1 - Verify Unsubscription - from Owner End', function() {

            cy.visit(tenant).then(function () {
                cy.cmdLogStep('Log in as User : ' + testData.createUser.user[0])
                cy.login(testData.createUser.user[0], testData.createUser.userPassword)
                cy.url().should('not.include', 'login')
                cy.cmdLogResult(testData.createUser.user[0] + " Succesfully Logged in")
            })
 

            var folderName = testData.myFilesUser1.sharedFolderName
            var recipient1 = testData.createUser.user[1]
            var role = testData.shareFolderRoles.editor

            cy.cmdLogStep('Verify Folder Unsubscription - Go to My Files')
            leftNavBar.getMyFilessTab().should('be.visible').click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully Naviagted to My Files")


            cy.cmdLogStep('Open the Share Window of the Folder : ' + folderName + ' and Verify Unsubscription')
            myFilesPage.verifyFolderUnsubscriptionFromShareWindow(folderName, recipient1, role)


            cy.cmdLogStep('Log out as User : ' + testData.createUser.user[0])
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult(testData.createUser.user[0] + " Succesfully Logged out")


        })

        it('User 2 - Rejoin the Shared Folder', function() { 

            cy.visit(tenant).then(function () {
                cy.cmdLogStep('Log in as User : ' + testData.createUser.user[1])
                cy.login(testData.createUser.user[1], testData.createUser.userPassword)
                cy.url().should('not.include', 'login')
                cy.cmdLogResult(testData.createUser.user[1] + " Succesfully Logged in")
            })

            var folderName = testData.myFilesUser1.sharedFolderName

            cy.cmdLogStep('Go to My Files')
            leftNavBar.getMyFilessTab().should('be.visible').click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully Naviagted to My Files")

            cy.cmdLogStep('Rejoin the Shared Folder')
            myFilesPage.rejoinUnsubscribedFolder(folderName)

            cy.cmdLogStep('Verify Folder Rejoin')
            cy.cmdLogStep('Go to My Files')
            leftNavBar.getMyFilessTab().should('be.visible').click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully Naviagted to My Files")

            myFilesPage.getFilesList().each(function(ele) { 
                let txt = ele.text()
                if(txt.includes(folderName)) 
                { 
                    cy.log('Folder Found - Rejoin Verified')
                    return false
                }  
                else { cy.log('Folder Not Found') }
            })
            
            cy.cmdLogStep('Log out as User : ' + testData.createUser.user[1])
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult(testData.createUser.user[1] + " Succesfully Logged out")

        })

        it('User 1 - Verify Folder Rejoin - from Owner End', function() {

            cy.visit(tenant).then(function () {
                cy.cmdLogStep('Log in as User : ' + testData.createUser.user[0])
                cy.login(testData.createUser.user[0], testData.createUser.userPassword)
                cy.url().should('not.include', 'login')
                cy.cmdLogResult(testData.createUser.user[0] + " Succesfully Logged in")
            })
 

            var folderName = testData.myFilesUser1.sharedFolderName
            var recipient1 = testData.createUser.user[1]
            var role = testData.shareFolderRoles.editor

            cy.cmdLogStep('Verify Folder Rejoin - Go to My Files')
            leftNavBar.getMyFilessTab().should('be.visible').click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully Naviagted to My Files")


            cy.cmdLogStep('Open the Share Window of the Folder : ' + folderName + ' and Verify Folder Rejoin')
            myFilesPage.verifyFolderShareFromShareWindow(folderName, recipient1, role)

        })

        it('User 1 - Share the Folder - with Viewer Role', function () {

            cy.cmdLogStep('Go to My Files')
            leftNavBar.getMyFilessTab().should('be.visible').click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully Naviagted to My Files")


            var folderName = testData.myFilesUser1.sharedFolderName
            // var recipient1 = testData.createUser.user[1]
            var recipient2 = testData.createUser.user[2]
            var role = testData.shareFolderRoles.viewer
            // var note = testData.shareFolderNote


            cy.cmdLogStep('Verify Folder in My Files Page')
            // var folderFound = 0
            // folderFound = myFilesPage.verifyItem(folderName)
            // if (folderFound == 1) { cy.cmdLogResult("Folder Found in My Files") }

            let res = folderName + ' ' + folderName  
            myFilesPage.getFilesList().should('be.visible').then(function() {
                cy.log('Search : ' + res)
                myFilesPage.getFilesList().each(function(ele) { 
                    var text = ele.text()
                    cy.log(text)
                    if(text.includes(res)) { 
                        cy.log('Match Found')
                        cy.cmdLogResult("Folder Found in My Files")
                        return false
                    }
                    else {
                        cy.log('Match Not Found') 
                    }
                })
            })


            cy.cmdLogStep('Share the Folder')

            var params = new myFilesPage.shareFolderParams()
            params.folderName = folderName
            // params.recipient1 = recipient1
            params.recipient2 = recipient2
            params.role = role
            // params.note = note

            myFilesPage.shareFolderByCheckBox(params)

            cy.toastMessageAssert('successfully shared').then(() => {
                cy.cmdLogResult('Folder "' + folderName + '" Shared Successfully')
                cy.get('.md-toast-text').should('not.be.visible')
            })


            cy.cmdLogStep('Verify Folder Sharing - Go to My Files')
            leftNavBar.getMyFilessTab().should('be.visible').click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully Naviagted to My Files")


            cy.cmdLogStep('Open the Share Window of the Folder : ' + folderName + ' and Verify Sharing')
            myFilesPage.verifyFolderShareFromShareWindow(folderName, recipient2, role)


            cy.cmdLogStep('Log out as User : ' + testData.createUser.user[0])
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult(testData.createUser.user[0] + " Succesfully Logged out")

        })

        it('User 3 - Accept the Shared Folder Invitation', function () {

            cy.visit(tenant).then(function () {
                cy.cmdLogStep('Log in as User : ' + testData.createUser.user[2])
                cy.login(testData.createUser.user[2], testData.createUser.userPassword)
                cy.url().should('not.include', 'login')
                cy.cmdLogResult(testData.createUser.user[2] + " Succesfully Logged in")
            })

            var sharedFolderName = testData.myFilesUser1.sharedFolderName

            cy.cmdLogStep('Accept the Invitation of the Folder : ' + sharedFolderName)
            topNavBar.acceptInvitation(sharedFolderName)
            cy.get('body').trigger('{esc}');
            cy.cmdLogResult('Accepted the Invitation of the Folder : ' + sharedFolderName)


            // cy.cmdLogStep('Verify Invitation Acceptance of the Folder : ' + sharedFolderName)
            // if (myFilesPage.getFolderPath().should('be.visible').contains(sharedFolderName)) {
            //     cy.cmdLogStep('Invitation Acceptance Verified of the Folder : ' + sharedFolderName + ' -> Navigated to this Folder')
            // }


        })

        it('User 3 - Download File from Shared Folder', function () {

            var fileInSharedFolder = testData.myFilesUser1.fileUploadedInRootFolder
            var filename = fileInSharedFolder.substring(fileInSharedFolder.lastIndexOf("/") + 1, fileInSharedFolder.length)
            var sharedFolderName = testData.myFilesUser1.sharedFolderName
            var sharedSubFolderName = testData.myFilesUser2.sharedSubFolderName

            cy.cmdLogStep('Download File from Shared Folder')

            cy.cmdLogStep('Go to My Files')
            leftNavBar.getMyFilessTab().should('be.visible').click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully Naviagted to My Files")

            cy.cmdLogStep('Go to the Specific Folder : ' + sharedFolderName)
            myFilesPage.goToSpecificFolder(sharedFolderName)
            cy.cmdLogResult('Succesfully Naviagted to the Specific Folder : ' + sharedFolderName)

            cy.cmdLogStep('Download the File : ' + filename + ' - from Shared Folder : ' + sharedFolderName)
            myFilesPage.downloadSingleFile(filename)

            cy.cmdLogResult("Succesfully Downloaded File from Shared Folder")

            // TO DO - Assertion for Dowwnload

        })

        it('User 3 - Check Options for Collaborator - Viewer', function() { 

            var fileInSharedFolder = testData.myFilesUser1.fileUploadedInRootFolder
            var filename = fileInSharedFolder.substring(fileInSharedFolder.lastIndexOf("/") + 1, fileInSharedFolder.length)
            var sharedFolderName = testData.myFilesUser1.sharedFolderName
            var sharedSubFolderName = testData.myFilesUser2.sharedSubFolderName

            cy.cmdLogStep('Go to My Files')
            leftNavBar.getMyFilessTab().should('be.visible').click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully Naviagted to My Files")

            cy.cmdLogStep('Go to the Specific Folder : ' + sharedFolderName)
            myFilesPage.goToSpecificFolder(sharedFolderName)
            cy.cmdLogResult('Succesfully Naviagted to the Specific Folder : ' + sharedFolderName)

            cy.cmdLogStep('Check Add Folder Option - Should Not be There')
            myFilesPage.getAddFolderButton().should('not.be.visible')
            cy.cmdLogResult('Add Folder Option - Not Found - Verified')

            cy.cmdLogStep('Check Upload Option - Should Not be There')
            // upload button - only one case of element not to be visible
            cy.get('[ng-click="$mdMenu.open()"]').contains('Upload').should('not.be.visible')
            cy.cmdLogResult('Upload Option - Not Found - Verified')

            cy.cmdLogStep('Check Sharing Option - Should Be Visible')
            myFilesPage.getSharingOption().should('be.visible')
            cy.cmdLogResult('Sharing Option - Visible - Verified')

            cy.cmdLogStep('Check Options for Specific File')

            cy.cmdLogStep('Check File - ' + filename)
            myFilesPage.checkSingleItem(filename)
            cy.cmdLogResult('File Checked - ' + filename)

            cy.cmdLogStep('Specific File - Check Send Option - Should Not be There')
            myFilesPage.getSendOptionSingleFileCheck().should('not.be.visible')
            cy.cmdLogResult('Specific File - Send Option - Not Found - Verified')

            cy.cmdLogStep('Specific File - Check Download Option - Should be There')
            myFilesPage.getDownloadButtonSingleFileCheck().should('be.visible')
            cy.cmdLogResult('Specific File - Download Option - Found - Verified')

            cy.cmdLogStep('Specific File - Check Rename Option - Should Not be There')
            myFilesPage.getRenameOption().should('not.be.visible')
            cy.cmdLogResult('Specific File - Rename Option - Not Found - Verified')

            cy.cmdLogStep('Specific File - Check Edit Description Option - Should Not be There')
            myFilesPage.getEditDescriptionOption().should('not.be.visible')
            cy.cmdLogResult('Specific File - Edit Description Option - Not Found - Verified')

            cy.cmdLogStep('Specific File - Check Version Option - Should Not be There')
            myFilesPage.getVersionHistory().should('not.be.visible')
            cy.cmdLogResult('Specific File - Version Option - Not Found - Verified')

            cy.cmdLogStep('Specific File - Check Move Option - Should Not be There')
            myFilesPage.getMoveButton().should('not.be.visible')
            cy.cmdLogResult('Specific File - Move Option - Not Found - Verified')

            cy.cmdLogStep('Specific File - Check Copy Option - Should Not be There')
            myFilesPage.getCopyButton().should('not.be.visible')
            cy.cmdLogResult('Specific File - Copy Option - Not Found - Verified')

            cy.cmdLogStep('Go to My Files')
            leftNavBar.getMyFilessTab().should('be.visible').click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully Naviagted to My Files")

            cy.cmdLogStep('Go to the Specific Folder : ' + sharedFolderName)
            myFilesPage.goToSpecificFolder(sharedFolderName)
            cy.cmdLogResult('Succesfully Naviagted to the Specific Folder : ' + sharedFolderName)

            cy.cmdLogStep('Check Options for Specific Folder')
            
            cy.cmdLogStep('Check Sub-Folder - ' + sharedSubFolderName)
            myFilesPage.checkSingleItem(sharedSubFolderName)
            cy.cmdLogResult('Sub-Folder Checked - ' + sharedSubFolderName)

            cy.cmdLogStep('Specific Sub-Folder - Check Download as ZIP Option - Should be There')
            myFilesPage.getDownloadAsZipButton().should('be.visible')
            cy.cmdLogResult('Specific Sub-Folder - Download as ZIP Option - Found - Verified')

            cy.cmdLogStep('Specific Sub-Folder - Check Rename Option - Should Not be There')
            myFilesPage.getRenameOption().should('not.be.visible')
            cy.cmdLogResult('Specific Sub-Folder - Rename Option - Not Found - Verified')

            cy.cmdLogStep('Specific Sub-Folder - Check Edit Description Option - Should Not be There')
            myFilesPage.getEditDescriptionOption().should('not.be.visible')
            cy.cmdLogResult('Specific Sub-Folder - Edit Description Option - Not Found - Verified')

            cy.cmdLogStep('Specific Sub-Folder - Check Move Option - Should Not be There')
            myFilesPage.getMoveButton().should('not.be.visible')
            cy.cmdLogResult('Specific Sub-Folder - Move Option - Not Found - Verified')

            cy.cmdLogStep('Specific Sub-Folder - Check Copy Option - Should Not be There')
            myFilesPage.getCopyButton().should('not.be.visible')
            cy.cmdLogResult('Specific Sub-Folder - Copy Option - Not Found - Verified')

            cy.cmdLogStep('Specific Sub-Folder - Check Properties Option - Should be There')
            myFilesPage.getPropertiesOption().should('be.visible')
            cy.cmdLogResult('Specific Sub-Folder - Properties Option - Found - Verified')


            cy.cmdLogStep('Log out as User : ' + testData.createUser.user[2])
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult(testData.createUser.user[2] + " Succesfully Logged out")


        })

        it('User 1 - Rename Shared Folder', function() { 

            cy.visit(tenant).then(function () {
                cy.cmdLogStep('Log in as User : ' + testData.createUser.user[0])
                cy.login(testData.createUser.user[0], testData.createUser.userPassword)
                cy.url().should('not.include', 'login')
                cy.cmdLogResult(testData.createUser.user[0] + " Succesfully Logged in")
            })
 

            var folderName = testData.myFilesUser1.sharedFolderName
            var folderNewName = folderName + " " + "(Renamed)"

            cy.cmdLogStep('Go to My Files')
            leftNavBar.getMyFilessTab().should('be.visible').click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully Naviagted to My Files")
            cy.wait(2000)
            cy.cmdLogStep('Rename Shared Folder : '  + folderName)
            myFilesPage.renameSingleItem(folderName, folderNewName)
            cy.toastMessageAssert('successfully saved').then(() => {
                cy.cmdLogResult("Succesfully Renamed Shared Folder : " + folderName)
                cy.get('.md-toast-text').should('not.exist')
            })          


            cy.cmdLogStep('Verify Folder Rename - Go to My Files')
            leftNavBar.getMyFilessTab().should('be.visible').click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully Naviagted to My Files")

            let x = folderNewName + " " + folderNewName 
            myFilesPage.getFilesList().should('be.visible').then(function() {
                cy.log('Search : ' + x)
                myFilesPage.getFilesList().each(function(ele) { 
                    var text = ele.text()
                    cy.log(text)
                    if(text.includes(x)) { 
                        cy.log('Match Found')
                        cy.cmdLogResult("Folder Rename Verified in My Files Page -> Renamed Folder Found")
                        return false
                    }
                    else {
                        cy.log('Match Not Found') 
                    }
                })
            })

            cy.cmdLogStep('Log out as User : ' + testData.createUser.user[0])
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult(testData.createUser.user[0] + " Succesfully Logged out")


        })

        it('User 2 - Verify Folder Rename - Shared Folder (Should not be Renamed)', function() { 

            cy.visit(tenant).then(function () {
                cy.cmdLogStep('Log in as User : ' + testData.createUser.user[1])
                cy.login(testData.createUser.user[1], testData.createUser.userPassword)
                cy.url().should('not.include', 'login')
                cy.cmdLogResult(testData.createUser.user[1] + " Succesfully Logged in")
            })
 

            var folderName = testData.myFilesUser1.sharedFolderName

            cy.cmdLogStep('Go to My Files')
            leftNavBar.getMyFilessTab().should('be.visible').click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully Naviagted to My Files")


            let n1 = folderName + ' - Shared by Rayeed6_FN Rayeed6_LN'
            let x = n1 + ' ' + n1
            myFilesPage.getFilesList().should('be.visible').then(function() {
                cy.log('Search : ' + x)
                myFilesPage.getFilesList().each(function(ele) { 
                    var text = ele.text()
                    cy.log(text)
                    if(text.includes(x)) { 
                        cy.log('Match Found')
                        cy.cmdLogResult("Verified in My Files Page -> Folder Rename Functions Locally - No Efect on Other Users")
                        return false
                    }
                    else {
                        cy.log('Match Not Found') 
                    }
                })
            })

            cy.cmdLogStep('Log out as User : ' + testData.createUser.user[1])
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult(testData.createUser.user[1] + " Succesfully Logged out")


        })

        it('User 1 - Delete Shared Folder', function() { 

            cy.visit(tenant).then(function () {
                cy.cmdLogStep('Log in as User : ' + testData.createUser.user[0])
                cy.login(testData.createUser.user[0], testData.createUser.userPassword)
                cy.url().should('not.include', 'login')
                cy.cmdLogResult(testData.createUser.user[0] + " Succesfully Logged in")
            })
 

            var folderName = testData.myFilesUser1.sharedFolderName
            var folderNewName = folderName + " " + "(Renamed)"

            cy.cmdLogStep('Go to My Files')
            leftNavBar.getMyFilessTab().should('be.visible').click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully Naviagted to My Files")

            cy.cmdLogStep('Delete Shared Folder : '  + folderNewName)
            myFilesPage.deleteSingleItem(folderNewName)
            myFilesPage.getDeleteButtonInWindows().should('be.visible').click()
           

            cy.toastMessageAssert('deleted successfully').then(() => {
                cy.cmdLogResult("Succesfully Deleted Shared Folder : " + folderNewName)
                cy.get('.md-toast-text').should('not.exist')
            })          


            cy.cmdLogStep('Verify Folder Deletion - Go to My Files')
            leftNavBar.getMyFilessTab().should('be.visible').click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully Naviagted to My Files")

            let x = folderNewName + " " + folderNewName 
            myFilesPage.getFilesList().should('be.visible').then(function() {
                cy.log('Search : ' + x)
                myFilesPage.getFilesList().each(function(ele) { 
                    var text = ele.text()
                    cy.log(text)
                    if(text.includes(x)) { 
                        cy.log('Match Found')
                        cy.cmdLogResult("Delete Verification Failed")
                        return false
                    }
                    else {
                        cy.log('Match Not Found') 
                    }
                })
            })

            cy.cmdLogStep('Log out as User : ' + testData.createUser.user[0])
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult(testData.createUser.user[0] + " Succesfully Logged out")


        })

        it('User 2 - Check for Deleted Shared Folder', function() { 

            cy.visit(tenant).then(function () {
                cy.cmdLogStep('Log in as User : ' + testData.createUser.user[1])
                cy.login(testData.createUser.user[1], testData.createUser.userPassword)
                cy.url().should('not.include', 'login')
                cy.cmdLogResult(testData.createUser.user[1] + " Succesfully Logged in")
            })
 

            cy.cmdLogStep('Go to My Files')
            leftNavBar.getMyFilessTab().should('be.visible').click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully Naviagted to My Files")

            cy.cmdLogStep('Check for the Deleted Shared Folder')
            myFilesPage.getFilesList().should('not.exist')
            cy.cmdLogResult("Shared Folder Deletion Verified")


            cy.cmdLogStep('Log out as User : ' + testData.createUser.user[1])
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult(testData.createUser.user[1] + " Succesfully Logged out")


        })

        it('User 1 - Restore Shared Folder', function() {

            cy.visit(tenant).then(function () {
                cy.cmdLogStep('Log in as User : ' + testData.createUser.user[0])
                cy.login(testData.createUser.user[0], testData.createUser.userPassword)
                cy.url().should('not.include', 'login')
                cy.cmdLogResult(testData.createUser.user[0] + " Succesfully Logged in")
            })
 

            var folderName = testData.myFilesUser1.sharedFolderName
            var folderNewName = folderName + " " + "(Renamed)"

            cy.cmdLogStep("Restore Shared Folder - Go to Deleted Items >> Files Page")
            leftNavBar.getDeletedItems().click()
            cy.url().should('include', 'trash')
            deletedItemsFilesPage.getDeletedFiles().click()
            cy.url().should('include', 'trash/2')
            cy.cmdLogResult("Succesfully Navigated to Deleted Items >> Files Page")
            deletedItemsFilesPage.restoreSingleItem(folderNewName)
            cy.toastMessageAssert("Item restored successfully").then(() => {
                cy.cmdLogResult('Folder Restored Successfully')
                cy.get('.md-toast-text').should('not.exist')
            })

        })

        it('User 1 - Verify Restoration - Check the Restored Folder', function() { 

            var folderName = testData.myFilesUser1.sharedFolderName
            var folderNewName = folderName + " " + "(Renamed)"

            cy.cmdLogStep('Go to My Files')
            leftNavBar.getMyFilessTab().should('be.visible').click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully Naviagted to My Files")

            let x = folderNewName + ' ' + folderNewName
            myFilesPage.getFilesList().should('be.visible').then(function() {
                cy.log('Search : ' + x)
                myFilesPage.getFilesList().each(function(ele) { 
                    var text = ele.text()
                    cy.log(text)
                    if(text.includes(x)) { 
                        cy.log('Match Found')
                        cy.cmdLogResult("Folder Restoration Verified in My Files Page -> Folder Found")
                        return false
                    }
                    else {
                        cy.log('Match Not Found') 
                    }
                })
            })

        })

        it('User 1 - Check Collaborators for the Restored Folder', function() { 

            cy.cmdLogStep('Go to My Files')
            leftNavBar.getMyFilessTab().should('be.visible').click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully Naviagted to My Files")
            cy.wait(2000)
            var folderName = testData.myFilesUser1.sharedFolderName
            var folderNewName = folderName + " " + "(Renamed)"

            cy.cmdLogStep('Check Collaborators for the Restored Folder : ' + folderNewName)
            myFilesPage.openShareWindowSpecificFolder(folderNewName)
            myFilesPage.getCollaboratorsList().should('not.exist')
            cy.cmdLogStep('No Collaborators Found for the Restored Folder : ' + folderNewName)

            cy.cmdLogStep('Log out as User : ' + testData.createUser.user[0])
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult(testData.createUser.user[0] + " Succesfully Logged out")


        })

        it('User 2 - Check for Deleted Shared Folder', function() { 

            cy.visit(tenant).then(function () {
                cy.cmdLogStep('Log in as User : ' + testData.createUser.user[1])
                cy.login(testData.createUser.user[1], testData.createUser.userPassword)
                cy.url().should('not.include', 'login')
                cy.cmdLogResult(testData.createUser.user[1] + " Succesfully Logged in")
            })
 

            cy.cmdLogStep('Go to My Files')
            leftNavBar.getMyFilessTab().should('be.visible').click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully Naviagted to My Files")

            cy.cmdLogStep('Check for the Deleted Shared Folder')
            myFilesPage.getFilesList().should('not.exist')
            cy.cmdLogResult("Shared Folder Deletion Verified")


            cy.cmdLogStep('Log out as User : ' + testData.createUser.user[1])
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult(testData.createUser.user[1] + " Succesfully Logged out")


        })

        it('User 1 - Rename Shared Folder (To Original/Initial Name)', function() { 

            cy.visit(tenant).then(function () {
                cy.cmdLogStep('Log in as User : ' + testData.createUser.user[0])
                cy.login(testData.createUser.user[0], testData.createUser.userPassword)
                cy.url().should('not.include', 'login')
                cy.cmdLogResult(testData.createUser.user[0] + " Succesfully Logged in")
            })
 

            var folderName = testData.myFilesUser1.sharedFolderName
            var folderNewName = folderName + " " + "(Renamed)"

            cy.cmdLogStep('Go to My Files')
            leftNavBar.getMyFilessTab().should('be.visible').click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully Naviagted to My Files")
            cy.wait(2000)
            cy.cmdLogStep('Rename Shared Folder : '  + folderNewName)
            myFilesPage.renameSingleItem(folderNewName, folderName)
            cy.toastMessageAssert('successfully saved').then(() => {
                cy.cmdLogResult("Succesfully Renamed Shared Folder (To Original Name) : " + folderName)
                cy.get('.md-toast-text').should('not.exist')
            })          

        })

        it('User 1 - Share the Folder - with Registered Users', function () {

            cy.cmdLogStep('Go to My Files')
            leftNavBar.getMyFilessTab().should('be.visible').click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully Naviagted to My Files")


            var folderName = testData.myFilesUser1.sharedFolderName
            var recipient1 = testData.createUser.user[1]
            var recipient2 = testData.createUser.user[2]
            var role = testData.shareFolderRoles.editor
            var note = testData.shareFolderNote


            cy.cmdLogStep('Verify Folder in My Files Page')
            // var folderFound = 0
            // folderFound = myFilesPage.verifyItem(folderName)
            // if (folderFound == 1) { cy.cmdLogResult("Folder Found in My Files") }

            let res = folderName + ' ' + folderName  
            myFilesPage.getFilesList().should('be.visible').then(function() {
                cy.log('Search : ' + res)
                myFilesPage.getFilesList().each(function(ele) { 
                    var text = ele.text()
                    cy.log(text)
                    if(text.includes(res)) { 
                        cy.log('Match Found')
                        cy.cmdLogResult("Folder Found in My Files")
                        return false
                    }
                    else {
                        cy.log('Match Not Found') 
                    }
                })
            })


            cy.cmdLogStep('Share the Folder')

            var params = new myFilesPage.shareFolderParams()
            params.folderName = folderName
            params.recipient1 = recipient1
            params.recipient2 = recipient2
            params.role = role
            params.note = note

            myFilesPage.shareFolderByCheckBox(params)

            cy.toastMessageAssert('successfully shared').then(() => {
                cy.cmdLogResult('Folder "' + folderName + '" Shared Successfully')
                cy.get('.md-toast-text').should('not.be.visible')
            })


            cy.cmdLogStep('Verify Folder Sharing - Go to My Files')
            leftNavBar.getMyFilessTab().should('be.visible').click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully Naviagted to My Files")


            cy.cmdLogStep('Verify Sharing with Collaborator : ' + recipient1)
            myFilesPage.verifyFolderShareFromShareWindow(folderName, recipient1, role)

            cy.cmdLogStep('Verify Folder Sharing - Go to My Files')
            leftNavBar.getMyFilessTab().should('be.visible').click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully Naviagted to My Files")

            cy.cmdLogStep('Verify Sharing with Collaborator : ' + recipient2)
            myFilesPage.verifyFolderShareFromShareWindow(folderName, recipient2, role)


        })

        it('User 1 - Share the Folder - with Non-Registered Users', function () {

            cy.cmdLogStep('Go to My Files')
            leftNavBar.getMyFilessTab().should('be.visible').click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully Naviagted to My Files")


            var folderName = testData.myFilesUser1.sharedFolderName
            var recipient = testData.createUser.unregisteredUser
            var role = testData.shareFolderRoles.editor
            var note = testData.shareFolderNote


            cy.cmdLogStep('Verify Folder in My Files Page')
            // var folderFound = 0
            // folderFound = myFilesPage.verifyItem(folderName)
            // if (folderFound == 1) { cy.cmdLogResult("Folder Found in My Files") }

            let res = folderName + ' ' + folderName  
            myFilesPage.getFilesList().should('be.visible').then(function() {
                cy.log('Search : ' + res)
                myFilesPage.getFilesList().each(function(ele) { 
                    var text = ele.text()
                    cy.log(text)
                    if(text.includes(res)) { 
                        cy.log('Match Found')
                        cy.cmdLogResult("Folder Found in My Files")
                        return false
                    }
                    else {
                        cy.log('Match Not Found') 
                    }
                })
            })


            cy.cmdLogStep('Share the Folder')

            var params = new myFilesPage.shareFolderParams()
            params.folderName = folderName
            params.recipient1 = recipient
            params.role = role
            params.note = note

            myFilesPage.shareFolderByCheckBox(params)

            cy.toastMessageAssert('successfully shared').then(() => {
                cy.cmdLogResult('Folder "' + folderName + '" Shared Successfully')
                cy.get('.md-toast-text').should('not.be.visible')
            })


            cy.cmdLogStep('Verify Folder Sharing - Go to My Files')
            leftNavBar.getMyFilessTab().should('be.visible').click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully Naviagted to My Files")


            cy.cmdLogStep('Verify Sharing with Collaborator : ' + recipient)
            myFilesPage.verifyFolderShareFromShareWindow(folderName, recipient, role)


            cy.cmdLogStep('Log out as User : ' + testData.createUser.user[0])
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult(testData.createUser.user[0] + " Succesfully Logged out")

        })

        it('User 2 - Decline the Shared Folder Invitation', function () {

            cy.visit(tenant).then(function () {
                cy.cmdLogStep('Log in as User : ' + testData.createUser.user[1])
                cy.login(testData.createUser.user[1], testData.createUser.userPassword)
                cy.url().should('not.include', 'login')
                cy.cmdLogResult(testData.createUser.user[1] + " Succesfully Logged in")
            })

            var sharedFolderName = testData.myFilesUser1.sharedFolderName

            cy.cmdLogStep('Decline the Invitation of the Folder : ' + sharedFolderName)
            topNavBar.declineInvitation(sharedFolderName)
            cy.cmdLogResult('Declined the Invitation of the Folder : ' + sharedFolderName)


            // cy.cmdLogStep('Verify Invitation Acceptance of the Folder : ' + sharedFolderName)
            // if (myFilesPage.getFolderPath().should('be.visible').contains(sharedFolderName)) {
            //     cy.cmdLogStep('Invitation Acceptance Verified of the Folder : ' + sharedFolderName + ' -> Navigated to this Folder')
            // }

        })

        it('User 2 - Check in My Files for Declined Shared Folder', function() { 

            cy.cmdLogStep('Go to My Files')
            leftNavBar.getMyFilessTab().should('be.visible').click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully Naviagted to My Files")

            cy.cmdLogStep('Check for the Declined Shared Folder')
            myFilesPage.getFilesList().should('not.exist')
            cy.cmdLogResult("Shared Folder Declination Verified")


            cy.cmdLogStep('Log out as User : ' + testData.createUser.user[1])
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult(testData.createUser.user[1] + " Succesfully Logged out")

        })

        it('User 4 - Check Received Message Link, Open Link, Do Self-Registration & Accept Invitation', function() { 


            if (Cypress.env('live')) {

                let messageLink
                cy.mailosaurGetMessage(serverId, {
                    sentTo: testData.createUser.unregisteredUser,
                    subject: testData.subjectShareFolder,
                    timeout: 40000
                    //subject: 'mailosaur test new '+i
                })
                    .then(email => {
                        expect(email.subject).to.equal(testData.subjectShareFolder);
                        cy.log(email.subject)
                        messageLink = email.text.links[0].href;
                        cy.log(messageLink)
                        cy.cmdLogResult(messageLink)
                        cy.visit(messageLink)
                    })
            }
            else{

            
            var json = {
                squirrelmailServer: Cypress.env('mailServerAddress'),
                port: Cypress.env('mailServerPort'),
                user: "rayeed9",
                pass: "1234",
                searchString: testData.subjectShareFolder,
                timeoutInMs: Cypress.env('emailCheckTimeout'),
                checkIntervalInMs: Cypress.env('emailCheckInterval')
            }

            cy.cmdLogStep('Get the link from ' + testData.createUser.unregisteredUser + ' mail box')
            var pattern = '"' + tenant + '/link/.*?"'

            cy.task("awaitEmailInSquirrelmailInbox", json).then((emailBody) => {
                if (emailBody) {
                    cy.log("Email arrived in user's inbox!")  
                    finalLink = help.extractLinkFromEmail(emailBody, pattern)
                    console.log('Link: ' + finalLink)
                    cy.visit(finalLink)
                }

                else { cy.log("Failed to receive email in user's inbox in time!") }

            }) 

        }

            cy.url().should('include', 'register')
            cy.cmdLogResult("Visited the link")

            var paramsRegistration = new selfRegistrationPage.selfRegistrationParam()

            paramsRegistration.firstName = testData.createUser.unregisteredUserFirstName
            paramsRegistration.lastName = testData.createUser.unregisteredUserLastName
            paramsRegistration.password = testData.createUser.userPassword
            paramsRegistration.confirmPassword = testData.createUser.userPassword

            cy.cmdLogStep('Redirect to Self Registration Page')
            selfRegistrationPage.selfRegistration(paramsRegistration)
            cy.cmdLogResult(" Succesfully Self Registered")


            cy.cmdLogStep('Log in as External User : ' + testData.createUser.unregisteredUser)
            cy.login(testData.createUser.unregisteredUser, testData.createUser.userPassword)
            cy.url().should('not.include', 'login')
            cy.cmdLogResult(testData.createUser.unregisteredUser + " Succesfully Logged in")

            cy.cmdLogStep('Accept Invitation from Home Page Popup')
            myFilesPage.acceptButtonHomePopup().should('be.visible').click()
            cy.cmdLogResult("Invitation Accepted from Home Page Popup")

            
            cy.cmdLogStep('Verify Invitation Accept - Go to My Files')
            leftNavBar.getMyFilessTab().should('be.visible').click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully Naviagted to My Files")

            var folderName = testData.myFilesUser1.sharedFolderName

            let n1 = folderName + ' - Shared by Rayeed6_FN Rayeed6_LN'
            let x = n1 + ' ' + n1
            myFilesPage.getFilesList().should('be.visible').then(function() {
                cy.log('Search : ' + x)
                myFilesPage.getFilesList().each(function(ele) { 
                    var text = ele.text()
                    cy.log(text)
                    if(text.includes(x)) { 
                        cy.log('Match Found')
                        cy.cmdLogResult("Accept Invitation Verified -> Folder Found in My Files Page")
                        return false
                    }
                    else {
                        cy.log('Match Not Found') 
                    }
                })
            })



        })

        it('User 4 - Download File from Shared Folder', function () {

            var fileInSharedFolder = testData.myFilesUser1.fileUploadedInSharedFolder
            var filename = fileInSharedFolder.substring(fileInSharedFolder.lastIndexOf("/") + 1, fileInSharedFolder.length)
            var sharedFolderName = testData.myFilesUser1.sharedFolderName


            cy.cmdLogStep('Go to My Files')
            leftNavBar.getMyFilessTab().should('be.visible').click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully Naviagted to My Files")

            cy.cmdLogStep('Go to the Specific Folder : ' + sharedFolderName)
            myFilesPage.goToSpecificFolder(sharedFolderName)
            cy.cmdLogResult('Succesfully Naviagted to the Specific Folder : ' + sharedFolderName)

            cy.cmdLogStep('Download the File : ' + filename + ' - from Shared Folder : ' + sharedFolderName)
            myFilesPage.downloadSingleFile(filename)

            // TO DO - Assertion for Dowwnload

        })

        it('User 4 - Check Options for External User as Collaborator - Editor', function() { 

            var fileInSharedFolder = testData.myFilesUser1.fileUploadedInRootFolder
            var filename = fileInSharedFolder.substring(fileInSharedFolder.lastIndexOf("/") + 1, fileInSharedFolder.length)
            var sharedFolderName = testData.myFilesUser1.sharedFolderName
            var sharedSubFolderName = testData.myFilesUser2.sharedSubFolderName


            cy.cmdLogStep('Go to My Files')
            leftNavBar.getMyFilessTab().should('be.visible').click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully Naviagted to My Files")

            cy.cmdLogStep('Go to the Specific Folder : ' + sharedFolderName)
            myFilesPage.goToSpecificFolder(sharedFolderName)
            cy.cmdLogResult('Succesfully Naviagted to the Specific Folder : ' + sharedFolderName)

            cy.cmdLogStep('Check Add Folder Option - Should be There')
            myFilesPage.getAddFolderButton().should('be.visible')
            cy.cmdLogResult('Add Folder Option - Found - Verified')

            cy.cmdLogStep('Check Upload Option - Should be There')
            // upload button - only one case of element not to be visible
            cy.get('[ng-click="$mdMenu.open()"]').should('be.visible')
            cy.cmdLogResult('Upload Option - Found - Verified')

            cy.cmdLogStep('Check Sharing Option - Should Be Visible')
            myFilesPage.getSharingOption().should('be.visible')
            cy.cmdLogResult('Sharing Option - Visible - Verified')

            cy.cmdLogStep('Check Options for Specific File')

            cy.cmdLogStep('Check File - ' + filename)
            myFilesPage.checkSingleItem(filename)
            cy.cmdLogResult('File Checked - ' + filename)

            cy.cmdLogStep('Specific File - Check Send Option - Should Not be There')
            myFilesPage.getSendOptionSingleFileCheck().should('not.be.visible')
            cy.cmdLogResult('Specific File - Send Option - Not Found - Verified')

            cy.cmdLogStep('Specific File - Check Download Option - Should be There')
            myFilesPage.getDownloadButtonSingleFileCheck().should('be.visible')
            cy.cmdLogResult('Specific File - Download Option - Found - Verified')

            cy.cmdLogStep('Specific File - Check Rename Option - Should be There')
            myFilesPage.getRenameOption().should('be.visible')
            cy.cmdLogResult('Specific File - Rename Option - Found - Verified')

            cy.cmdLogStep('Specific File - Check Edit Description Option - Should be There')
            myFilesPage.getEditDescriptionOption().should('be.visible')
            cy.cmdLogResult('Specific File - Edit Description Option - Found - Verified')

            cy.cmdLogStep('Specific File - Check Version Option - Should be There')
            myFilesPage.getVersionHistory().should('be.visible')
            cy.cmdLogResult('Specific File - Version Option - Found - Verified')

            cy.cmdLogStep('Specific File - Check Move Option - Should be There')
            myFilesPage.getMoveButton().should('be.visible')
            cy.cmdLogResult('Specific File - Move Option - Found - Verified')

            cy.cmdLogStep('Specific File - Check Copy Option - Should be There')
            myFilesPage.getCopyButton().should('be.visible')
            cy.cmdLogResult('Specific File - Copy Option - Found - Verified')

            cy.reload()

            // cy.cmdLogStep('Check Options for Specific Folder')
            
            cy.cmdLogStep('Check Sub-Folder - ' + sharedSubFolderName)
            myFilesPage.checkSingleItem(sharedSubFolderName)
            cy.cmdLogResult('Sub-Folder Checked - ' + sharedSubFolderName)

            cy.cmdLogStep('Specific Sub-Folder - Check Download as ZIP Option - Should be There')
            myFilesPage.getDownloadAsZipButton().should('be.visible')
            cy.cmdLogResult('Specific Sub-Folder - Download as ZIP Option - Found - Verified')

            cy.cmdLogStep('Specific Sub-Folder - Check Rename Option - Should be There')
            myFilesPage.getRenameOption().should('be.visible')
            cy.cmdLogResult('Specific Sub-Folder - Rename Option - Found - Verified')

            cy.cmdLogStep('Specific Sub-Folder - Check Edit Description Option - Should be There')
            myFilesPage.getEditDescriptionOption().should('be.visible')
            cy.cmdLogResult('Specific Sub-Folder - Edit Description Option - Found - Verified')

            cy.cmdLogStep('Specific Sub-Folder - Check Move Option - Should be There')
            myFilesPage.getMoveButton().should('be.visible')
            cy.cmdLogResult('Specific Sub-Folder - Move Option - Found - Verified')

            cy.cmdLogStep('Specific Sub-Folder - Check Copy Option - Should be There')
            myFilesPage.getCopyButton().should('be.visible')
            cy.cmdLogResult('Specific Sub-Folder - Copy Option - Found - Verified')

            cy.cmdLogStep('Specific Sub-Folder - Check Properties Option - Should be There')
            myFilesPage.getPropertiesOption().should('be.visible')
            cy.cmdLogResult('Specific Sub-Folder - Properties Option - Found - Verified')


            cy.cmdLogStep('Log out as User : ' + testData.createUser.unregisteredUser)
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult(testData.createUser.unregisteredUser + " Succesfully Logged out")


        })

        it('User 1 - Change Role of External User : from Editor to Viewer', function() {

            cy.visit(tenant).then(function () {
                cy.cmdLogStep('Log in as User : ' + testData.createUser.user[0])
                cy.login(testData.createUser.user[0], testData.createUser.userPassword)
                cy.url().should('not.include', 'login')
                cy.cmdLogResult(testData.createUser.user[0] + " Succesfully Logged in")
            })

            cy.cmdLogStep('Go to My Files')
            leftNavBar.getMyFilessTab().should('be.visible').click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully Naviagted to My Files")

            var folderName = testData.myFilesUser1.sharedFolderName
            var recipient = testData.createUser.unregisteredUser
            var role = testData.shareFolderRoles.viewer

            var params = new myFilesPage.shareFolderParams()

            params.folderName = folderName
            params.recipient1 = recipient
            params.role = role

            myFilesPage.shareFolderByCheckBox(params)

            cy.toastMessageAssert('successfully shared').then(() => {
                cy.cmdLogResult('Folder "' + folderName + '" Shared Successfully')
                cy.get('.md-toast-text').should('not.be.visible')
            })

            
            cy.cmdLogStep('Verify Role Change - Go to My Files')
            leftNavBar.getMyFilessTab().should('be.visible').click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully Naviagted to My Files")


            cy.cmdLogStep('Verify Role Changing of Collaborator : ' + recipient)
            myFilesPage.verifyFolderShareFromShareWindow(folderName, recipient, role)


            cy.cmdLogStep('Log out as User : ' + testData.createUser.user[0])
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult(testData.createUser.user[0] + " Succesfully Logged out")


        })

        it('User 4 - Check Options for External User as Collaborator - Viewer', function() { 

            cy.visit(tenant).then(function () {
                cy.cmdLogStep('Log in as User : ' + testData.createUser.unregisteredUser)
                cy.login(testData.createUser.unregisteredUser, testData.createUser.userPassword)
                cy.url().should('not.include', 'login')
                cy.cmdLogResult(testData.createUser.user[0] + " Succesfully Logged in")
            })

            var fileInSharedFolder = testData.myFilesUser1.fileUploadedInRootFolder
            var filename = fileInSharedFolder.substring(fileInSharedFolder.lastIndexOf("/") + 1, fileInSharedFolder.length)
            var sharedFolderName = testData.myFilesUser1.sharedFolderName
            var sharedSubFolderName = testData.myFilesUser2.sharedSubFolderName


            cy.cmdLogStep('Go to My Files')
            leftNavBar.getMyFilessTab().should('be.visible').click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully Naviagted to My Files")

            cy.cmdLogStep('Go to the Specific Folder : ' + sharedFolderName)
            myFilesPage.goToSpecificFolder(sharedFolderName)
            cy.cmdLogResult('Succesfully Naviagted to the Specific Folder : ' + sharedFolderName)

            cy.cmdLogStep('Check Add Folder Option - Should Not be There')
            myFilesPage.getAddFolderButton().should('not.be.visible')
            cy.cmdLogResult('Add Folder Option - Not Found - Verified')

            cy.cmdLogStep('Check Upload Option - Should Not be There')
            // upload button - only one case of element not to be visible
            cy.get('[ng-click="$mdMenu.open()"]').contains('Upload').should('not.be.visible')
            cy.cmdLogResult('Upload Option - Not Found - Verified')

            cy.cmdLogStep('Check Sharing Option - Should Be Visible')
            myFilesPage.getSharingOption().should('be.visible')
            cy.cmdLogResult('Sharing Option - Visible - Verified')

            cy.cmdLogStep('Check Options for Specific File')

            cy.cmdLogStep('Check File - ' + filename)
            myFilesPage.checkSingleItem(filename)
            cy.cmdLogResult('File Checked - ' + filename)

            cy.cmdLogStep('Specific File - Check Send Option - Should Not be There')
            myFilesPage.getSendOptionSingleFileCheck().should('not.be.visible')
            cy.cmdLogResult('Specific File - Send Option - Not Found - Verified')

            cy.cmdLogStep('Specific File - Check Download Option - Should be There')
            myFilesPage.getDownloadButtonSingleFileCheck().should('be.visible')
            cy.cmdLogResult('Specific File - Download Option - Found - Verified')

            cy.cmdLogStep('Specific File - Check Rename Option - Should Not be There')
            myFilesPage.getRenameOption().should('not.be.visible')
            cy.cmdLogResult('Specific File - Rename Option - Not Found - Verified')

            cy.cmdLogStep('Specific File - Check Edit Description Option - Should Not be There')
            myFilesPage.getEditDescriptionOption().should('not.be.visible')
            cy.cmdLogResult('Specific File - Edit Description Option - Not Found - Verified')

            cy.cmdLogStep('Specific File - Check Version Option - Should Not be There')
            myFilesPage.getVersionHistory().should('not.be.visible')
            cy.cmdLogResult('Specific File - Version Option - Not Found - Verified')

            cy.cmdLogStep('Specific File - Check Move Option - Should Not be There')
            myFilesPage.getMoveButton().should('not.be.visible')
            cy.cmdLogResult('Specific File - Move Option - Not Found - Verified')

            cy.cmdLogStep('Specific File - Check Copy Option - Should Not be There')
            myFilesPage.getCopyButton().should('not.be.visible')
            cy.cmdLogResult('Specific File - Copy Option - Not Found - Verified')

            cy.reload()
            cy.wait(2000)
            // cy.cmdLogStep('Check Options for Specific Folder')
            
            cy.cmdLogStep('Check Sub-Folder - ' + sharedSubFolderName)
            myFilesPage.checkSingleItem(sharedSubFolderName)
            cy.cmdLogResult('Sub-Folder Checked - ' + sharedSubFolderName)

            //cy.reload()
            cy.cmdLogStep('Specific Sub-Folder - Check Download as ZIP Option - Should be There')
            myFilesPage.getDownloadAsZipButton().should('be.visible')
            cy.cmdLogResult('Specific Sub-Folder - Download as ZIP Option - Found - Verified')

            cy.cmdLogStep('Specific Sub-Folder - Check Rename Option - Should Not be There')
            myFilesPage.getRenameOption().should('not.be.visible')
            cy.cmdLogResult('Specific Sub-Folder - Rename Option - Not Found - Verified')

            cy.cmdLogStep('Specific Sub-Folder - Check Edit Description Option - Should Not be There')
            myFilesPage.getEditDescriptionOption().should('not.be.visible')
            cy.cmdLogResult('Specific Sub-Folder - Edit Description Option - Not Found - Verified')

            cy.cmdLogStep('Specific Sub-Folder - Check Move Option - Should Not be There')
            myFilesPage.getMoveButton().should('not.be.visible')
            cy.cmdLogResult('Specific Sub-Folder - Move Option - Not Found - Verified')

            cy.cmdLogStep('Specific Sub-Folder - Check Copy Option - Should Not be There')
            myFilesPage.getCopyButton().should('not.be.visible')
            cy.cmdLogResult('Specific Sub-Folder - Copy Option - Not Found - Verified')

            cy.cmdLogStep('Specific Sub-Folder - Check Properties Option - Should be There')
            myFilesPage.getPropertiesOption().should('be.visible')
            cy.cmdLogResult('Specific Sub-Folder - Properties Option - Found - Verified')


            cy.cmdLogStep('Log out as User : ' + testData.createUser.unregisteredUser)
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult(testData.createUser.unregisteredUser + " Succesfully Logged out")

        })

    })

})