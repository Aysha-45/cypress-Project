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

var baseUrl = Cypress.env('url')
var tenant = baseUrl + Cypress.env('tenantName') //+ '/'
const serverId = Cypress.env('mailosaureServerId')


const leftNavBar = new LeftNavBar()
const myFilesPage = new MyFilesPage()
const composeMessagePage = new ComposeMessagePage()
const help = new Helper()
let testData = null
let finalLink


//import testData from "../../fixtures/composeMessage.json"


describe('Compose message functionality - ' + Cypress.browser.name, function () {

    before(function () {


        if (Cypress.env('live')) {


            baseUrl = Cypress.env('liveUrl')
            tenant = baseUrl + Cypress.env('liveTenant') //+ '/'
            cy.mailosaurDeleteAllMessages(serverId)



            cy.fixture('composeMessageLive').then(function (data) {
                testData = data
            })
            cy.visit(tenant).then(function () {
                cy.cmdLogStep('Log in as sender user ' + testData.userNameSender)
                cy.login(testData.userNameSender, testData.password)
                cy.url().should('not.include', 'login')
                cy.cmdLogResult(testData.userNameSender + " Succesfully Logged in")
            })



        } else {
            for (var i = 1; i < 6; i++) {
                var clientJson = {
                    squirrelmailServer: Cypress.env('mailServerAddress'),
                    port: Cypress.env('mailServerPort'),
                    user: "sarja" + i,
                    pass: "1234",
                }
                cy.task('deleteEmail', clientJson)
            }


            cy.fixture('composeMessage').then(function (data) {
                testData = data
            })
            cy.visit(tenant).then(function () {
                cy.cmdLogStep('Log in as sender user ' + testData.userNameSender)
                cy.login(testData.userNameSender, testData.password)
                cy.url().should('not.include', 'login')
                cy.cmdLogResult(testData.userNameSender + " Succesfully Logged in")
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



    describe('Compose message functionality test environment setup - ' + Cypress.browser.name, function () {

        it('Create folder and upload files into that folder, Upload files into root', function () {

            cy.cmdLogStep('Go to my files page')
            leftNavBar.getMyFilessTab().click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully navigated to my files page")


            cy.cmdLogStep('Create a folder')
            myFilesPage.createFolder(
                testData.myFilesFileUpload.newFolderName,
                testData.myFilesFileUpload.folderDescription
            )

            cy.toastMessageAssert("successfully created").then(() => {
                cy.cmdLogResult('Folder created Successfully')
            })

            cy.cmdLogStep('Go to that folder')
            myFilesPage.searchAndGo(testData.myFilesFileUpload.newFolderName)

            cy.cmdLogStep('Upload file')
            myFilesPage.uploadFile(testData.myFilesFileUpload.subFolderAttachedFileLocationMyComputer)

            cy.cmdLogStep('Go to my files page')
            leftNavBar.getMyFilessTab().click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully navigated to my files page")
            cy.reload()
            
            cy.cmdLogStep('Upload file')
            myFilesPage.uploadFile(testData.myFilesFileUpload.attachedFileLocationMyComputer)


        });

    });

    describe('Compose message test - ' + Cypress.browser.name, function () {

        it('Send a message with sign in required ', function () {

            cy.reload()

            cy.cmdLogStep('Go to compose message page')
            leftNavBar.getComposeMessage().click()
            cy.url().should('include', 'message/new')
            cy.cmdLogResult("Succesfully navigated to compose message page")

            var params = new composeMessagePage.composeMessageParam()
            params.recipient = testData.recipient
            params.subject = testData.subject
            params.secureNote = testData.secureNote
            params.notificationMessage = testData.message
            params.attachedFileLocationMyComputer = testData.attachedFileLocationMyComputer
            params.attachedFileLocationMyFiles = testData.attachedFileLocationMyFiles
            composeMessagePage.composeMessage(params)
            cy.toastMessageAssert('Message sent')
            cy.cmdLogResult("Message sent successfully")
        });

        it('Send a message ,file attached form computer only', function () {

            cy.reload()

            cy.cmdLogStep('Go to compose message page')
            leftNavBar.getComposeMessage().click()
            cy.url().should('include', 'message/new')
            cy.cmdLogResult("Succesfully navigated to compose message page")

            var params = new composeMessagePage.composeMessageParam()
            params.recipient = testData.recipient
            params.subject = 'File attached from computer ' + testData.subject
            params.secureNote = 'File attached from computer ' + testData.secureNote
            params.notificationMessage = 'File attached from computer ' + testData.message
            params.attachedFileLocationMyComputer = testData.attachedFileLocationMyComputer
            //params.attachedFileLocationMyFiles = testData.attachedFileLocationMyFiles
            composeMessagePage.composeMessage(params)
            cy.toastMessageAssert('Message sent')
            cy.cmdLogResult("Message sent successfully")
        });

        it('Send a message, file  attached from myfiles only', function () {

            cy.reload()

            cy.cmdLogStep('Go to compose message page')
            leftNavBar.getComposeMessage().click()
            cy.url().should('include', 'message/new')
            cy.cmdLogResult("Succesfully navigated to compose message page")

            var params = new composeMessagePage.composeMessageParam()
            params.recipient = testData.recipient
            params.subject = 'File attached from myfiles ' + testData.subject
            params.secureNote = 'File attached from myfiles ' + testData.secureNote
            params.notificationMessage = 'File attached from myfiles ' + testData.message
            //params.attachedFileLocationMyComputer = testData.attachedFileLocationMyComputer
            params.attachedFileLocationMyFiles = testData.attachedFileLocationMyFiles
            composeMessagePage.composeMessage(params)
            cy.toastMessageAssert('Message sent')
            cy.cmdLogResult("Message sent successfully")
        });
        it('Send a message to multiple user with sign in required', function () {
            cy.reload()

            cy.cmdLogStep('Go to compose message page')
            leftNavBar.getComposeMessage().click()
            cy.url().should('include', 'message/new')
            cy.cmdLogResult("Succesfully navigated to compose message page")

            var params = new composeMessagePage.composeMessageParam()
            params.recipient = testData.recipient
            params.recipientTwo = testData.recipientTwo;
            params.recipientThree = testData.recipientThree;
            params.subject = testData.subject + " multiple recipient"
            params.secureNote = testData.secureNote + " multiple recipient"
            params.notificationMessage = testData.message
            params.attachedFileLocationMyComputer = testData.attachedFileLocationMyComputer
            params.attachedFileLocationMyFiles = testData.attachedFileLocationMyFiles
            composeMessagePage.composeMessage(params)
            cy.toastMessageAssert('Message sent')
            cy.cmdLogResult("Message sent successfully")
        });

        it('Send a message to multiple user without sign in required', () => {

            cy.reload()

            cy.cmdLogStep('Go to compose message page')
            leftNavBar.getComposeMessage().click()
            cy.url().should('include', 'message/new')
            cy.cmdLogResult("Succesfully navigated to compose message page")

            var params = new composeMessagePage.composeMessageParam()
            params.recipient = testData.recipient
            params.recipientTwo = testData.recipientTwo;
            //params.recipientThree = testData.recipientThree;
            params.subject = testData.subject + " multiple recipient sign in not required"
            params.secureNote = testData.secureNote + " multiple recipient sign in not required"
            params.notificationMessage = testData.message
            params.attachedFileLocationMyComputer = testData.attachedFileLocationMyComputer
            params.attachedFileLocationMyFiles = testData.attachedFileLocationMyFiles
            params.signInNotRequired = true
            composeMessagePage.composeMessage(params)

            cy.toastMessageAssert('Message sent')
            cy.cmdLogResult("Message sent successfully")

            cy.cmdLogStep('Log out from current user')
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult("Succesfully logged out")

        });


        it('Check sign in not required messages from email recpient 1 ', () => {

            if (Cypress.env('live')) {
                let messageLink
                cy.mailosaurGetMessage(serverId, {
                    sentTo: testData.recipient,
                    subject: testData.subject + " multiple recipient sign in not required",
                    timeout: 60000
                    //subject: 'mailosaur test new '+i
                })
                    .then(email => {
                        expect(email.subject).to.equal(testData.subject + " multiple recipient sign in not required");
                        cy.log(email.subject)
                        messageLink = email.text.links[0].href;
                        cy.log(messageLink)
                        cy.visit(messageLink)
                    })
            }
            else {
                var json = {
                    squirrelmailServer: Cypress.env('mailServerAddress'),
                    port: Cypress.env('mailServerPort'),
                    user: "sarja3",
                    pass: "1234",
                    searchString: testData.subject + " multiple recipient sign in not required",
                    timeoutInMs: Cypress.env('emailCheckTimeout'),
                    checkIntervalInMs: Cypress.env('emailCheckInterval')
                }

                cy.cmdLogStep('Get the link from ' + testData.recipient + ' mail box')
                var pattern = '"' + tenant + '/link/.*?"'

                cy.task("awaitEmailInSquirrelmailInbox", json).then((emailBody) => {
                    if (emailBody) {

                        cy.log("Email arrived in user's inbox!")
                        finalLink = help.extractLinkFromEmail(emailBody, pattern)
                        console.log('Link: ' + finalLink)
                        cy.visit(finalLink)

                    } else {
                        cy.log("Failed to receive email in user's inbox in time!");
                    }
                });

            }


            cy.url().should('include', 'view')
            cy.cmdLogResult("Visited the link")
            cy.get('#message_detail_subject').then(function (text) {
                expect(text.text()).to.contain(testData.subject + " multiple recipient sign in not required")
            })

            //TODO validate the delivery
        });

        //TODO check the sign in not required message can be accessed withut sign in
        it('Check sign in not required messages from email recpient 2', () => {



            if (Cypress.env('live')) {
                let messageLink
                cy.mailosaurGetMessage(serverId, {
                    sentTo: testData.recipientTwo,
                    subject: testData.subject + " multiple recipient sign in not required",
                    timeout: 60000
                    //subject: 'mailosaur test new '+i
                })
                    .then(email => {
                        expect(email.subject).to.equal(testData.subject + " multiple recipient sign in not required");
                        cy.log(email.subject)
                        messageLink = email.text.links[0].href;
                        cy.log(messageLink)
                        cy.visit(messageLink)
                    })
            }
            else {


                var json = {
                    squirrelmailServer: Cypress.env('mailServerAddress'),
                    port: Cypress.env('mailServerPort'),
                    user: "sarja4",
                    pass: "1234",
                    searchString: testData.subject + " multiple recipient sign in not required",
                    timeoutInMs: Cypress.env('emailCheckTimeout'),
                    checkIntervalInMs: Cypress.env('emailCheckInterval')
                }

                cy.cmdLogStep('Get the link from ' + testData.recipientTwo + ' mail box')
                var pattern = '"' + tenant + '/link/.*?"'

                cy.task("awaitEmailInSquirrelmailInbox", json).then((emailBody) => {
                    if (emailBody) {

                        cy.log("Email arrived in user's inbox!")
                        finalLink = help.extractLinkFromEmail(emailBody, pattern)
                        console.log('Link: ' + finalLink)
                        cy.visit(finalLink)

                    } else {
                        cy.log("Failed to receive email in user's inbox in time!");
                    }
                });


            }

            cy.url().should('include', 'view')
            cy.cmdLogResult("Visited the link")
            cy.get('#message_detail_subject').then(function (text) {
                expect(text.text()).to.contain(testData.subject + " multiple recipient sign in not required")
            })


            //TODO validate the delivery


            //TODO validate the delivery



        });


        it('Save draft of a message', () => {

            cy.visit(tenant).then(function () {
                cy.cmdLogStep('Log in as sender user ' + testData.userNameSender)
                cy.login(testData.userNameSender, testData.password)
                cy.url().should('not.include', 'login')
                cy.cmdLogResult(testData.userNameSender + " Succesfully Logged in")
            })

            cy.reload()

            cy.cmdLogStep('Go to compose message page')
            leftNavBar.getComposeMessage().click()
            cy.url().should('include', 'message/new')
            cy.cmdLogResult("Succesfully navigated to compose message page")

            var params = new composeMessagePage.composeMessageParam()
            params.recipient = testData.recipient
            params.subject = testData.subject + " message saved to draft"
            params.secureNote = testData.secureNote + " message saved to draft"
            params.notificationMessage = testData.message
            params.attachedFileLocationMyComputer = testData.attachedFileLocationMyComputer
            params.attachedFileLocationMyFiles = testData.attachedFileLocationMyFiles
            params.saveToDraft = true
            composeMessagePage.composeMessage(params)
            cy.toastMessageAssert('Message Saved')
            cy.cmdLogResult("Message Saved successfully")
        });

        //TODO check draft section for the saved message


        it('Save draft of a message by moving to another page', () => {
            cy.reload()

            cy.cmdLogStep('Go to compose message page')
            leftNavBar.getComposeMessage().click()
            cy.url().should('include', 'message/new')
            cy.cmdLogResult("Succesfully navigated to compose message page")

            var params = new composeMessagePage.composeMessageParam()
            params.recipient = testData.recipient
            params.subject = testData.subject + " message saved to draft 2"
            params.secureNote = testData.secureNote + " message saved to draft 2"
            params.notificationMessage = testData.message
            params.attachedFileLocationMyComputer = testData.attachedFileLocationMyComputer
            params.attachedFileLocationMyFiles = testData.attachedFileLocationMyFiles
            params.doNotSend = true
            composeMessagePage.composeMessage(params)

            leftNavBar.getMyFilessTab().click()
            composeMessagePage.getSaveAsDraftButton().click()

            //TODO include assertion
            //cy.toastMessageAssert('Message Saved')
            cy.cmdLogResult("Message Saved successfully")
        });

        //TODO check draft section for the saved message

        it('Go to draft,edit message and send', () => {
            cy.reload()

            cy.cmdLogStep('Go to compose message page')
            leftNavBar.getDraftMessage().should('be.visible').click()
            composeMessagePage.goToSpecificDraftMessage(testData.subject + " message saved to draft")
            cy.url().should('include', 'edit')
            cy.wait(3000)
            var params = new composeMessagePage.composeMessageParam()
            //params.recipient = ''
            composeMessagePage.composeMessage(params)
            cy.toastMessageAssert('Message sent')
            cy.cmdLogResult("Message sent successfully")
        });
        //TOD some more edit case can be included for the draft message




    });

    describe('Compose messsage field validation check - ' + Cypress.browser.name, function () {

        it('To field empty', () => {

            cy.reload()

            cy.cmdLogStep('Go to compose message page')
            leftNavBar.getComposeMessage().click()
            cy.url().should('include', 'message/new')
            cy.cmdLogResult("Succesfully navigated to compose message page")

            var params = new composeMessagePage.composeMessageParam()
            params.subject = 'To filed empty ' + testData.subject
            params.secureNote = 'To filed empty ' + testData.secureNote
            params.notificationMessage = 'To filed empty ' + testData.message

            composeMessagePage.composeMessage(params)


            cy.get('[aria-label="Alert"]').then(function (el) {
                expect(el.text()).to.contain('Please specify at least one recipient. If any groups have been specified, please ensure that they have members.')
            })
            composeMessagePage.getAlertContinueButton().click()


        });

        it('To field invalid', () => {


            cy.reload()

            cy.cmdLogStep('Go to compose message page')
            leftNavBar.getComposeMessage().click()
            cy.url().should('include', 'message/new')
            cy.cmdLogResult("Succesfully navigated to compose message page")

            var params = new composeMessagePage.composeMessageParam()
            params.recipient = 'Invalid1234'
            params.subject = 'Invalide email' + testData.subject
            params.secureNote = 'Invalide email' + testData.secureNote
            params.notificationMessage = 'Invalide email' + testData.message
            composeMessagePage.composeMessage(params)

            cy.get('[aria-label="Alert"]').then(function (el) {
                expect(el.text()).to.contain('Invalid value found in To field:')
            })
            composeMessagePage.getAlertContinueButton().click()

        });

        it('Subject field empty', () => {

            cy.reload()

            cy.cmdLogStep('Go to compose message page')
            leftNavBar.getComposeMessage().click()
            cy.url().should('include', 'message/new')
            cy.cmdLogResult("Succesfully navigated to compose message page")

            var params = new composeMessagePage.composeMessageParam()
            params.recipient = testData.recipient
            //params.subject = testData.subject + " multiple recipient sign in not required"
            params.secureNote = 'Subject empty ' + testData.secureNote
            params.notificationMessage = 'Subject empty ' + testData.message

            composeMessagePage.composeMessage(params)

            cy.toastMessageAssert('Message sent')
            cy.cmdLogResult("Message sent successfully")
        });

        it('Secure note and message field empty', () => {



            cy.reload()

            cy.cmdLogStep('Go to compose message page')
            leftNavBar.getComposeMessage().click()
            cy.url().should('include', 'message/new')
            cy.cmdLogResult("Succesfully navigated to compose message page")

            var params = new composeMessagePage.composeMessageParam()
            params.recipient = testData.recipient
            params.subject = 'Secure note and notification message empty' + testData.subject
            // params.secureNote = testData.secureNote
            //params.notificationMessage = testData.message

            composeMessagePage.composeMessage(params)

            cy.toastMessageAssert('Message sent')
            cy.cmdLogResult("Message sent successfully")
        });



    });


});

