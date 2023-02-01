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
import ReplyMessagePage from "../pageObjects/replyMessagePage.ob"
import Helper from "../helper/helper"
import InboxMessagePage from "../pageObjects/inboxPage.ob"
import SelfRegistrationPage from "../pageObjects/selfRegistrationPage.ob"
import ApiInvoke from "../helper/api"

var baseUrl = Cypress.env('url')
var tenant = baseUrl + Cypress.env('tenantName') //+ '/'
const serverId = Cypress.env('mailosaureServerId')

const leftNavBar = new LeftNavBar()
const myFilesPage = new MyFilesPage()
const composeMessagePage = new ComposeMessagePage()
const replyMessagePage = new ReplyMessagePage()
const inboxMessagePage = new InboxMessagePage()
const serverInfoPage = new ServerInformationPage()
const storageSettingsPage = new StorageSettingsPage()
const tenantPage = new TenantPage()
const emailSettingsPage = new EmailSettingsPage()
const generalSettingsPage = new GeneralSettingsPage()
const brandingSettingsPage = new BrandingSettingsPage()
const emailNotificationPage = new EmailNotificationPage()
const systemActivityPage = new SystemActivityPage()
const selfRegistrationPage = new SelfRegistrationPage()
const userPage = new UserPage()
const help = new Helper()
const api = new ApiInvoke()
let testData = null
let finalLink
//import testData from "../../fixtures/composeMessage.json"



describe('Reply message functionality - ' + Cypress.browser.name, function () {

    before(function () {

        if (Cypress.env('live')) {

            baseUrl = Cypress.env('liveUrl')
            tenant = baseUrl + Cypress.env('liveTenant') //+ '/'
            cy.mailosaurDeleteAllMessages(serverId)

            cy.fixture('replyMessageLive').then(function (data) {
                testData = data
            })
            cy.visit(tenant).then(function () {
                cy.cmdLogStep('Log in as sender user ' + testData.userTenantAdmin)
                cy.login(testData.userTenantAdmin, testData.password)
                cy.url().should('not.include', 'login')
                cy.cmdLogResult(testData.userTenantAdmin + " Succesfully Logged in")
            })



        }
        else {

            for (var i = 1; i < 5; i++) {
                var clientJson = {
                    squirrelmailServer: Cypress.env('mailServerAddress'),
                    port: Cypress.env('mailServerPort'),
                    user: "abir" + i,
                    pass: "1234",
                }
                cy.task('deleteEmail', clientJson)
            }


            cy.fixture('replyMessage').then(function (data) {
                testData = data
            })
            cy.visit(tenant).then(function () {
                cy.cmdLogStep('Log in as sender user ' + testData.userTenantAdmin)
                cy.login(testData.userTenantAdmin, testData.password)
                cy.url().should('not.include', 'login')
                cy.cmdLogResult(testData.userTenantAdmin + " Succesfully Logged in")
            })



        }



    });

    beforeEach(function () {
        Cypress.Cookies.defaults({ preserve: ['SESSION', 'CSRF-TOKEN'] });
    });

    after(function () {
        cy.clearCookies()

    });



    describe('Reply message functionality test environment setup - ' + Cypress.browser.name, function () {

        it('Create licensed user for reply test', function () {




            let userArr = testData.createUser.user
            cy.getCookie("CSRF-TOKEN").then((csrf) => {
                userArr.forEach((user, index) => {
                    let userObj = {
                        email: user,
                        passwd: testData.createUser.userPassword,
                        role: 'Recipient',
                        licensed: true,
                        fname: testData.createUser.fname[index],
                        lname: testData.createUser.lname[index]
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

            /*   
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
   
   
   */

        });

        it('Create external user for reply test', function () {

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
                testData.createUser.userPassword)

            cy.toastMessageAssert('User "' + testData.createUser.tenantRecipientUserEmail + '" was created successfully').then(() => {
                cy.cmdLogResult('User "' + testData.createUser.tenantRecipientUserEmail + '"  created successfully')
            })

            cy.cmdLogStep('Log out from current user')
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult("Succesfully logged out")

        });

        it('Create folder and upload files into that folder, Upload files into root', function () {


            cy.visit(tenant).then(function () {
                cy.cmdLogStep('Log in as sender user ' + testData.userNameSender)
                cy.login(testData.userNameSender, testData.password)
                cy.url().should('not.include', 'login')
                cy.cmdLogResult(testData.userNameSender + " Succesfully Logged in")
            })

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
            myFilesPage.goToSpecificFolder(testData.myFilesFileUpload.newFolderName)
            cy.wait(2000)
            //myFilesPage.searchAndGo(testData.myFilesFileUpload.newFolderName)
            //cy.reload()

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

        it('Send a message to  user without sign in required', () => {

            cy.reload()

            cy.cmdLogStep('Go to compose message page')
            leftNavBar.getComposeMessage().click()
            cy.url().should('include', 'message/new')
            cy.cmdLogResult("Succesfully navigated to compose message page")

            var params = new composeMessagePage.composeMessageParam()
            params.recipient = testData.recipient
            params.subject = testData.subjectForWithoutSignIn
            params.secureNote = testData.secureNote + "recipient sign in not required"
            params.notificationMessage = testData.message
            params.attachedFileLocationMyComputer = testData.attachedFileLocationMyComputer
            params.attachedFileLocationMyFiles = testData.attachedFileLocationMyFiles
            params.signInNotRequired = true
            composeMessagePage.composeMessage(params)

            cy.toastMessageAssert('Message sent')
            cy.cmdLogResult("Message sent successfully")

        });

        it('Send a message to single  user for reply case', function () {
            cy.reload()

            cy.cmdLogStep('Go to compose message page')
            leftNavBar.getComposeMessage().click()
            cy.url().should('include', 'message/new')
            cy.cmdLogResult("Succesfully navigated to compose message page")

            var params = new composeMessagePage.composeMessageParam()
            params.recipient = testData.recipient
            params.subject = testData.subjectReply
            params.secureNote = testData.secureNote
            params.notificationMessage = testData.message
            params.attachedFileLocationMyComputer = testData.attachedFileLocationMyComputer
            composeMessagePage.composeMessage(params)
            cy.toastMessageAssert('Message sent')
            cy.cmdLogResult("Message sent successfully")
        });

        it('Send a message to single  user for reply via mail case', function () {
            cy.reload()

            cy.cmdLogStep('Go to compose message page')
            leftNavBar.getComposeMessage().click()
            cy.url().should('include', 'message/new')
            cy.cmdLogResult("Succesfully navigated to compose message page")

            var params = new composeMessagePage.composeMessageParam()
            params.recipient = testData.recipient
            params.subject = testData.subjectReplyMail
            params.secureNote = testData.secureNote
            params.notificationMessage = testData.message
            params.attachedFileLocationMyComputer = testData.attachedFileLocationMyComputer
            composeMessagePage.composeMessage(params)
            cy.toastMessageAssert('Message sent')
            cy.cmdLogResult("Message sent successfully")
        });

        it('Send a message to multiple  users for reply all case', function () {
            cy.reload()

            cy.cmdLogStep('Go to compose message page')
            leftNavBar.getComposeMessage().click()
            cy.url().should('include', 'message/new')
            cy.cmdLogResult("Succesfully navigated to compose message page")

            var params = new composeMessagePage.composeMessageParam()
            params.recipient = testData.recipient
            params.recipientTwo = testData.recipientTwo;
            params.subject = testData.subjectReplyAll
            params.secureNote = testData.secureNote
            params.notificationMessage = testData.message
            params.attachedFileLocationMyComputer = testData.attachedFileLocationMyComputer
            composeMessagePage.composeMessage(params)
            cy.toastMessageAssert('Message sent')
            cy.cmdLogResult("Message sent successfully")
        });

        it('Send a message to multiple  users for reply all mail case', function () {
            cy.reload()

            cy.cmdLogStep('Go to compose message page')
            leftNavBar.getComposeMessage().click()
            cy.url().should('include', 'message/new')
            cy.cmdLogResult("Succesfully navigated to compose message page")

            var params = new composeMessagePage.composeMessageParam()
            params.recipient = testData.recipient
            params.recipientTwo = testData.recipientTwo;
            params.subject = testData.subjectReplyAllMail
            params.secureNote = testData.secureNote
            params.notificationMessage = testData.message
            params.attachedFileLocationMyComputer = testData.attachedFileLocationMyComputer
            composeMessagePage.composeMessage(params)
            cy.toastMessageAssert('Message sent')
            cy.cmdLogResult("Message sent successfully")
        });

        it('Send a message to multiple  users for reply all with sender in recipient list', function () {
            cy.reload()

            cy.cmdLogStep('Go to compose message page')
            leftNavBar.getComposeMessage().click()
            cy.url().should('include', 'message/new')
            cy.cmdLogResult("Succesfully navigated to compose message page")

            var params = new composeMessagePage.composeMessageParam()
            params.recipient = testData.recipient
            params.recipientTwo = testData.recipientTwo;
            params.recipientThree = testData.userNameSender;
            params.subject = testData.subjectReplyAllWithSender
            params.secureNote = testData.secureNote
            params.notificationMessage = testData.message
            params.attachedFileLocationMyComputer = testData.attachedFileLocationMyComputer
            composeMessagePage.composeMessage(params)
            cy.toastMessageAssert('Message sent')
            cy.cmdLogResult("Message sent successfully")
        });


    });

    describe('Reply functionality test - ' + Cypress.browser.name, function () {

        it('Dowload File for sign in not required messages from email', () => {

            cy.cmdLogStep('Log out from current user')
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult("Succesfully logged out")


            if (Cypress.env('live')) {

                let messageLink
                cy.mailosaurGetMessage(serverId, {
                    sentTo: testData.recipient,
                    subject: testData.subjectForWithoutSignIn,
                    timeout: 60000
                    //subject: 'mailosaur test new '+i
                })
                    .then(email => {
                        expect(email.subject).to.equal(testData.subjectForWithoutSignIn);
                        cy.log(email.subject)
                        messageLink = email.text.links[0].href;
                        cy.log(messageLink)
                        cy.cmdLogResult(messageLink)
                        cy.visit(messageLink)
                    })

            } else {


                var json = {
                    squirrelmailServer: Cypress.env('mailServerAddress'),
                    port: Cypress.env('mailServerPort'),
                    user: "abir2",
                    pass: "1234",
                    searchString: testData.subjectForWithoutSignIn,
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
            // var clientJson = {
            //     server: Cypress.env('mailServerAddress'),
            //     port: Cypress.env('mailServerPort'),
            //     username: "abir2",
            //     password: "1234",
            //     subject: testData.subjectForWithoutSignIn
            // }

            // cy.cmdLogStep('Get the link from ' +testData.recipient + ' mail box')
            // var pattern = '"' + tenant + '/link/.*?"'
            // cy.task('getMailBySubject', clientJson).then(function (emailBody) {
            //     finalLink = help.extractLinkFromEmail(emailBody, pattern)
            //     console.log('Link: ' + finalLink)
            //     cy.visit(finalLink)

            // })

            cy.url().should('include', 'view')
            cy.cmdLogResult("Visited the link")
            cy.get('#message_detail_subject').then(function (text) {
                expect(text.text()).to.contain(testData.subjectForWithoutSignIn)
            })

            cy.cmdLogStep('Click More Icon Button')


            inboxMessagePage.getMoreIcon().click()
            cy.cmdLogStep('Clcik Download as Zip button')
            inboxMessagePage.getDownloadAsZipButtonNoSignIn().contains('Download all attachments as zip')
            //should('contain.text','Download all attachments as zip')
            //contains('Download all attachments as zip')
            cy.download(inboxMessagePage.getDownloadAsZipButtonNoSignIn)
            cy.cmdLogResult("Succesfully download as zip")

            cy.cmdLogStep('Go to Sign In Page')
            cy.reload()
            inboxMessagePage.getSignInButtonNoSignInPage().click()

            cy.cmdLogStep('Log in as recipient user ' + testData.recipient)
            cy.login(testData.recipient, testData.password)
            cy.url().should('not.include', 'login')
            cy.cmdLogResult(testData.recipient + " Succesfully Logged in")


        });

        it('Save Files in Inbox page from recipient user', () => {



            cy.cmdLogStep('Go to Inbox page')
            leftNavBar.getInbox().click()
            //cy.url().should('include', 'message/inbox')
            cy.cmdLogResult("Succesfully navigated to inbox page")

            cy.cmdLogStep('Select Specific message ' + testData.subjectReply)
            inboxMessagePage.goToSpecificMessage(testData.subjectReply)
            cy.cmdLogStep('Click More Option')
            inboxMessagePage.getMoreOptionsButton().click()
            cy.cmdLogStep('Click Save all to files Button')
            inboxMessagePage.getSaveAllAttachmentsToFilesButton().should('be.visible').click()

            cy.cmdLogResult('Save All File Selection window should appear')

            inboxMessagePage.getSaveFileWindowSelectButton().should('be.visible').click()
            cy.toastMessageAssert("Successfully copied files to 'Home' ")
            cy.cmdLogResult("File Saved successfully")


            cy.cmdLogStep('Verify File Restoration - Go to Files')
            leftNavBar.getMyFilessTab().click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully Navigated to My Files Page")


            cy.cmdLogStep('Verify Restoration of that file in My Files')
            var verifyFileRestoredMyFilesPage = null
            verifyFileRestoredMyFilesPage = myFilesPage.verifyItem(testData.myFilesFileUpload.fileName)
            if (verifyFileRestoredMyFilesPage == 1) { cy.cmdLogResult("File Restoration is Verified") }


            cy.cmdLogStep('Log out from current user')
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult("Succesfully logged out")





        });

        it('Reply Message from recipient user', () => {

            cy.cmdLogStep('Log in as recipient user ' + testData.recipient)
            cy.login(testData.recipient, testData.password)
            cy.url().should('not.include', 'login')
            cy.cmdLogResult(testData.recipient + " Succesfully Logged in")

            cy.cmdLogStep('Go to Inbox page')
            leftNavBar.getInbox().click()
            //cy.url().should('include', 'message/inbox')
            cy.cmdLogResult("Succesfully navigated to inbox page")

            cy.cmdLogStep('Select Specific message ' + testData.subjectReply)
            inboxMessagePage.goToSpecificMessage(testData.subjectReply)
            cy.cmdLogStep('Click Reply Option')
            inboxMessagePage.getReplyButton().click()
            var params = new replyMessagePage.replyMessageParam()

            params.secureNote = testData.secureNote + " Reply From recipient"
            params.attachedFileLocationMyComputer = testData.attachedFileLocationMyComputerReply

            replyMessagePage.replyMessage(params)
            cy.toastMessageAssert('Message sent')
            cy.cmdLogResult("Message sent successfully")

            cy.cmdLogStep('Log out from current user')
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult("Succesfully logged out")

        });

        it('Reply Message from sender user', () => {


            cy.cmdLogStep('Log in as sender user ' + testData.userNameSender)
            cy.login(testData.userNameSender, testData.password)
            cy.url().should('not.include', 'login')
            cy.cmdLogResult(testData.userNameSender + " Succesfully Logged in")
            leftNavBar.getInbox().should('be.visible')
            cy.reload()
            cy.cmdLogStep('Go to Inbox page')
            leftNavBar.getInbox().should('be.visible').click()
            //cy.url().should('include', 'message/inbox')
            cy.cmdLogResult("Succesfully navigated to inbox page")

            cy.cmdLogStep('Select Specific message ' + testData.subjectReply)
            inboxMessagePage.goToSpecificMessage(testData.subjectReply)
            cy.cmdLogStep('Click Reply Option')
            cy.wait(3000)
            inboxMessagePage.getReplyButton().click()
            var params = new replyMessagePage.replyMessageParam()

            params.secureNote = testData.secureNote + " Reply From sender"
            params.attachedFileLocationMyComputer = testData.attachedFileLocationMyComputerReply

            replyMessagePage.replyMessage(params)
            cy.toastMessageAssert('Message sent')
            cy.cmdLogResult("Message sent successfully")

            cy.cmdLogStep('Log out from current user')
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult("Succesfully logged out")
        });

        it('Reply message from mail user', () => {


            if (Cypress.env('live')) {

                let messageLink
                cy.mailosaurGetMessage(serverId, {
                    sentTo: testData.recipient,
                    subject: testData.subjectReplyMail,
                    timeout: 60000
                    //subject: 'mailosaur test new '+i
                })
                    .then(email => {
                        expect(email.subject).to.equal(testData.subjectReplyMail);
                        cy.log(email.subject)
                        messageLink = email.text.links[0].href;
                        cy.log(messageLink)
                        cy.cmdLogResult(messageLink)
                        cy.visit(messageLink)
                    })

            } else {

                var json = {
                    squirrelmailServer: Cypress.env('mailServerAddress'),
                    port: Cypress.env('mailServerPort'),
                    user: "abir2",
                    pass: "1234",
                    searchString: testData.subjectReplyMail,
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
            // var clientJson = {
            //     server: Cypress.env('mailServerAddress'),
            //     port: Cypress.env('mailServerPort'),
            //     username: "abir2",
            //     password: "1234",
            //     subject: testData.subjectReplyMail
            // }

            // cy.cmdLogStep('Get the link from ' +testData.recipient + ' mail box')
            // var pattern = '"' + tenant + '/link/.*?"'
            // cy.task('getMailBySubject', clientJson).then(function (emailBody) {
            //     finalLink = help.extractLinkFromEmail(emailBody, pattern)
            //     console.log('Link: ' + finalLink)
            //     cy.visit(finalLink)

            // })

            cy.url().should('include', 'login')
            cy.cmdLogResult("Visited the link")

            cy.cmdLogStep('Log in as recipient user ' + testData.recipient)
            cy.login(testData.recipient, testData.password)
            cy.url().should('not.include', 'login')
            cy.cmdLogResult(testData.userNameSender + " Succesfully Logged in")


            cy.cmdLogStep('Click Reply Option')
            inboxMessagePage.getReplyButton().click()
            var params = new replyMessagePage.replyMessageParam()

            params.secureNote = testData.secureNote + " Reply From recipient via mail"
            params.attachedFileLocationMyComputer = testData.attachedFileLocationMyComputerReply

            replyMessagePage.replyMessage(params)
            cy.toastMessageAssert('Message sent')
            cy.cmdLogResult("Message sent successfully")

            cy.cmdLogStep('Log out from current user')
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult("Succesfully logged out")


        });

        it('Verify reply message from mail user and send another reply from sender', () => {
            cy.reload()
            cy.cmdLogStep('Log in as sender user ' + testData.userNameSender)
            cy.login(testData.userNameSender, testData.password)
            cy.url().should('not.include', 'login')
            cy.cmdLogResult(testData.userNameSender + " Succesfully Logged in")

            cy.cmdLogStep('Go to Inbox page')
            leftNavBar.getInbox().click()
            //cy.url().should('include', 'message/inbox')
            cy.cmdLogResult("Succesfully navigated to inbox page")

            cy.cmdLogStep('Select Specific message ' + testData.subjectReplyMail)
            inboxMessagePage.goToSpecificMessage(testData.subjectReplyMail)
            cy.cmdLogStep('Click Reply Option')
            inboxMessagePage.getReplyButton().click()
            var params = new replyMessagePage.replyMessageParam()

            params.secureNote = testData.secureNote + " Reply From sender"
            params.attachedFileLocationMyComputer = testData.attachedFileLocationMyComputerReply

            replyMessagePage.replyMessage(params)
            cy.toastMessageAssert('Message sent')
            cy.cmdLogResult("Message sent successfully")

            cy.cmdLogStep('Log out from current user')
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult("Succesfully logged out")
        });


    });

    describe('Reply All functionality test - ' + Cypress.browser.name, function () {



        it('Reply All Message from recipient one user', () => {


            cy.reload()
            cy.cmdLogStep('Log in as recipient user ' + testData.recipient)
            cy.login(testData.recipient, testData.password)
            cy.url().should('not.include', 'login')
            cy.cmdLogResult(testData.recipient + " Succesfully Logged in")

            cy.cmdLogStep('Go to Inbox page')
            leftNavBar.getInbox().click()
            //cy.url().should('include', 'message/inbox')
            cy.cmdLogResult("Succesfully navigated to inbox page")

            cy.cmdLogStep('Select Specific message ' + testData.subjectReplyAll)
            inboxMessagePage.goToSpecificMessage(testData.subjectReplyAll)
            cy.cmdLogStep('Click More Option')
            inboxMessagePage.getMoreOptionsButton().should('be.visible').click()
            cy.cmdLogStep('Click Reply All Button')
            inboxMessagePage.getReplyAllButton().should('be.visible').click()

            cy.cmdLogResult('Redirect to Reply all for recipient')

            var params = new replyMessagePage.replyMessageParam()

            params.secureNote = testData.secureNote + " Reply All From recipient"
            params.attachedFileLocationMyComputer = testData.attachedFileLocationMyComputerReply

            replyMessagePage.replyMessage(params)
            cy.toastMessageAssert('Message sent')
            cy.cmdLogResult("Message sent successfully")

            cy.cmdLogStep('Log out from current user')
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult("Succesfully logged out")

        });

        it('Reply All Message from Recipient Two user', () => {

            cy.cmdLogStep('Log in as Recipient two user ' + testData.recipientTwo)
            cy.login(testData.recipientTwo, testData.password)
            cy.url().should('not.include', 'login')
            cy.cmdLogResult(testData.recipientTwo + " Succesfully Logged in")

            cy.cmdLogStep('Go to Inbox page')
            leftNavBar.getInbox().click()
            //cy.url().should('include', 'message/inbox')
            cy.cmdLogResult("Succesfully navigated to inbox page")

            cy.cmdLogStep('Select Specific message ' + testData.subjectReplyAll)
            inboxMessagePage.goToSpecificMessage(testData.subjectReplyAll)
            cy.cmdLogStep('Click More Option')
            inboxMessagePage.getMoreOptionsButton().should('be.visible').click()
            cy.cmdLogStep('Click Reply All Button')
            inboxMessagePage.getReplyAllButton().should('be.visible').click()

            cy.cmdLogResult('Redirect to Reply all for recipient')

            var params = new replyMessagePage.replyMessageParam()

            params.secureNote = testData.secureNote + " Reply All From recipient two"
            params.attachedFileLocationMyComputer = testData.attachedFileLocationMyComputerReply

            replyMessagePage.replyMessage(params)
            cy.toastMessageAssert('Message sent')
            cy.cmdLogResult("Message sent successfully")

            cy.cmdLogStep('Log out from current user')
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult("Succesfully logged out")
        });

        it('Reply All Message from Sender user', () => {

            cy.cmdLogStep('Log in as sender user ' + testData.userNameSender)
            cy.login(testData.userNameSender, testData.password)
            cy.url().should('not.include', 'login')
            cy.cmdLogResult(testData.userNameSender + " Succesfully Logged in")

            cy.cmdLogStep('Go to Inbox page')
            leftNavBar.getInbox().click()
            //cy.url().should('include', 'message/inbox')
            cy.cmdLogResult("Succesfully navigated to inbox page")

            cy.cmdLogStep('Select Specific message ' + testData.subjectReplyAll)
            inboxMessagePage.goToSpecificMessage(testData.subjectReplyAll)
            cy.cmdLogStep('Click More Option')
            inboxMessagePage.getMoreOptionsButton().should('be.visible').click()
            cy.cmdLogStep('Click Reply All Button')
            inboxMessagePage.getReplyAllButton().should('be.visible').click()

            cy.cmdLogResult('Redirect to Reply all for recipient')

            var params = new replyMessagePage.replyMessageParam()

            params.secureNote = testData.secureNote + " Reply All From sender"
            params.attachedFileLocationMyComputer = testData.attachedFileLocationMyComputerReply

            replyMessagePage.replyMessage(params)
            cy.toastMessageAssert('Message sent')
            cy.cmdLogResult("Message sent successfully")

            cy.cmdLogStep('Log out from current user')
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult("Succesfully logged out")
        });

        it('Reply All message from mail user', () => {

            if (Cypress.env('live')) {

                let messageLink
                cy.mailosaurGetMessage(serverId, {
                    sentTo: testData.recipient,
                    subject: testData.subjectReplyAllMail,
                    timeout: 60000
                    //subject: 'mailosaur test new '+i
                })
                    .then(email => {
                        expect(email.subject).to.equal(testData.subjectReplyAllMail);
                        cy.log(email.subject)
                        messageLink = email.text.links[0].href;
                        cy.log(messageLink)
                        cy.cmdLogResult(messageLink)
                        cy.visit(messageLink)
                    })

            } else {

                var json = {
                    squirrelmailServer: Cypress.env('mailServerAddress'),
                    port: Cypress.env('mailServerPort'),
                    user: "abir2",
                    pass: "1234",
                    searchString: testData.subjectReplyAllMail,
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


            cy.url().should('include', 'login')
            cy.cmdLogResult("Visited the link")

            cy.cmdLogStep('Log in as recipient user ' + testData.recipient)
            cy.login(testData.recipient, testData.password)
            cy.url().should('not.include', 'login')
            cy.cmdLogResult(testData.recipient + " Succesfully Logged in")


            cy.cmdLogStep('Click More Option')
            inboxMessagePage.getMoreOptionsButton().should('be.visible').click()
            cy.cmdLogStep('Click Reply All Button')
            inboxMessagePage.getReplyAllButton().should('be.visible').click()
            var params = new replyMessagePage.replyMessageParam()

            params.secureNote = testData.secureNote + " Reply All From recipient via mail"
            params.attachedFileLocationMyComputer = testData.attachedFileLocationMyComputerReply

            replyMessagePage.replyMessage(params)
            cy.toastMessageAssert('Message sent')
            cy.cmdLogResult("Message sent successfully")

            cy.cmdLogStep('Log out from current user')
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult("Succesfully logged out")


        });

        it('Verify reply all message from mail user and send another reply from sender', () => {

            cy.cmdLogStep('Log in as sender user ' + testData.userNameSender)
            cy.login(testData.userNameSender, testData.password)
            cy.url().should('not.include', 'login')
            cy.cmdLogResult(testData.userNameSender + " Succesfully Logged in")

            cy.cmdLogStep('Go to Inbox page')
            leftNavBar.getInbox().click()
            //cy.url().should('include', 'message/inbox')
            cy.cmdLogResult("Succesfully navigated to inbox page")

            cy.cmdLogStep('Select Specific message ' + testData.subjectReplyAllMail)
            inboxMessagePage.goToSpecificMessage(testData.subjectReplyAllMail)
            cy.cmdLogStep('Click Reply Option')
            inboxMessagePage.getReplyButton().click()
            var params = new replyMessagePage.replyMessageParam()

            params.secureNote = testData.secureNote + " Reply From sender"
            params.attachedFileLocationMyComputer = testData.attachedFileLocationMyComputerReply

            replyMessagePage.replyMessage(params)
            cy.toastMessageAssert('Message sent')
            cy.cmdLogResult("Message sent successfully")

            cy.cmdLogStep('Log out from current user')
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult("Succesfully logged out")
        });

        it('Reply All Message from sender user in case of self added in To To filed', () => {

            cy.cmdLogStep('Log in as sender user ' + testData.userNameSender)
            cy.login(testData.userNameSender, testData.password)
            cy.url().should('not.include', 'login')
            cy.cmdLogResult(testData.userNameSender + " Succesfully Logged in")

            cy.cmdLogStep('Go to Inbox page')
            leftNavBar.getInbox().click()
            //cy.url().should('include', 'message/inbox')
            cy.cmdLogResult("Succesfully navigated to inbox page")

            cy.cmdLogStep('Select Specific message ' + testData.subjectReplyAllWithSender)
            inboxMessagePage.goToSpecificMessage(testData.subjectReplyAllWithSender)
            cy.cmdLogStep('Click More Option')
            inboxMessagePage.getMoreOptionsButton().should('be.visible').click()
            cy.cmdLogStep('Click Reply All Button')
            inboxMessagePage.getReplyAllButton().should('be.visible').click()

            cy.cmdLogResult('Redirect to Reply all for recipient')

            var params = new replyMessagePage.replyMessageParam()

            params.secureNote = testData.secureNote + " Reply All From self"
            params.attachedFileLocationMyComputer = testData.attachedFileLocationMyComputerReply

            replyMessagePage.replyMessage(params)
            cy.toastMessageAssert('Message sent')
            cy.cmdLogResult("Message sent successfully")

            cy.cmdLogStep('Log out from current user')
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult("Succesfully logged out")

        });


    });

    describe('Forward message functionality test - ' + Cypress.browser.name, function () {

        it('Send a message to  user for forward case', function () {
            cy.reload()
            cy.cmdLogStep('Log in as sender user ' + testData.userNameSender)
            cy.login(testData.userNameSender, testData.password)
            cy.url().should('not.include', 'login')
            cy.cmdLogResult(testData.userNameSender + " Succesfully Logged in")

            cy.cmdLogStep('Go to compose message page')
            leftNavBar.getComposeMessage().click()
            cy.url().should('include', 'message/new')
            cy.cmdLogResult("Succesfully navigated to compose message page")

            var params = new composeMessagePage.composeMessageParam()
            params.recipient = testData.recipient
            params.subject = testData.subjectForward
            params.secureNote = testData.secureNote
            params.notificationMessage = testData.message
            params.attachedFileLocationMyComputer = testData.attachedFileLocationMyComputer
            composeMessagePage.composeMessage(params)
            cy.toastMessageAssert('Message sent')
            cy.cmdLogResult("Message sent successfully")

            cy.cmdLogStep('Log out from current user')
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult("Succesfully logged out")


        });

        it('Send a message to  user for forward via mail case', function () {

            cy.cmdLogStep('Log in as sender user ' + testData.userNameSender)
            cy.login(testData.userNameSender, testData.password)
            cy.url().should('not.include', 'login')
            cy.cmdLogResult(testData.userNameSender + " Succesfully Logged in")

            cy.cmdLogStep('Go to compose message page')
            leftNavBar.getComposeMessage().click()
            cy.url().should('include', 'message/new')
            cy.cmdLogResult("Succesfully navigated to compose message page")

            var params = new composeMessagePage.composeMessageParam()
            params.recipient = testData.recipient
            params.subject = testData.subjectForwardMail
            params.secureNote = testData.secureNote
            params.notificationMessage = testData.message
            params.attachedFileLocationMyComputer = testData.attachedFileLocationMyComputer
            composeMessagePage.composeMessage(params)
            cy.toastMessageAssert('Message sent')
            cy.cmdLogResult("Message sent successfully")

            cy.cmdLogStep('Log out from current user')
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult("Succesfully logged out")
        });

        it('Forward Message from recipient  user', () => {
            cy.reload()
            cy.cmdLogStep('Log in as recipient user ' + testData.recipient)
            cy.login(testData.recipient, testData.password)
            cy.url().should('not.include', 'login')
            cy.cmdLogResult(testData.recipient + " Succesfully Logged in")

            cy.cmdLogStep('Go to Inbox page')
            leftNavBar.getInbox().click()
            //cy.url().should('include', 'message/inbox')
            cy.cmdLogResult("Succesfully navigated to inbox page")

            cy.cmdLogStep('Select Specific message ' + testData.subjectForward)
            inboxMessagePage.goToSpecificMessage(testData.subjectForward)
            cy.cmdLogStep('Click More Option')
            inboxMessagePage.getMoreOptionsButton().should('be.visible').click()
            cy.cmdLogStep('Click Forward Button')
            inboxMessagePage.getForwardButton().should('be.visible').click()

            cy.cmdLogResult('Redirect to Forward for recipient')

            var params = new replyMessagePage.replyMessageParam()
            params.recipient = testData.recipientTwo
            params.secureNote = testData.secureNote + " Forward From recipient"

            replyMessagePage.replyMessage(params)
            cy.wait(2000)
            cy.toastMessageAssert('Message sent')
            cy.cmdLogResult("Message sent successfully")

            cy.cmdLogStep('Log out from current user')
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult("Succesfully logged out")

        });

        it('verify and reply Forwarded Message from Recipient two user', () => {

            cy.cmdLogStep('Log in as recipient two user ' + testData.recipientTwo)
            cy.login(testData.recipientTwo, testData.password)
            cy.url().should('not.include', 'login')
            cy.cmdLogResult(testData.recipientTwo + " Succesfully Logged in")

            cy.cmdLogStep('Go to Inbox page')
            leftNavBar.getInbox().click()
            //cy.url().should('include', 'message/inbox')
            cy.cmdLogResult("Succesfully navigated to inbox page")

            cy.cmdLogStep('Select Specific message ' + testData.subjectForward)
            inboxMessagePage.goToSpecificMessage(testData.subjectForward)
            cy.cmdLogStep('Click Reply  Button')
            inboxMessagePage.getReplyButton().should('be.visible').click()

            cy.cmdLogResult('Redirect to Reply  for recipient')

            var params = new replyMessagePage.replyMessageParam()

            params.secureNote = testData.secureNote + " Reply All From Recipient two"
            params.attachedFileLocationMyComputer = testData.attachedFileLocationMyComputerReply

            replyMessagePage.replyMessage(params)
            cy.toastMessageAssert('Message sent')
            cy.cmdLogResult("Message sent successfully")

            cy.cmdLogStep('Log out from current user')
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult("Succesfully logged out")
        });

        it('Forward message from mail user', () => {

            if (Cypress.env('live')) {

                let messageLink
                cy.mailosaurGetMessage(serverId, {
                    sentTo: testData.recipient,
                    subject: testData.subjectForwardMail,
                    timeout: 60000
                    //subject: 'mailosaur test new '+i
                })
                    .then(email => {
                        expect(email.subject).to.equal(testData.subjectForwardMail);
                        cy.log(email.subject)
                        messageLink = email.text.links[0].href;
                        cy.log(messageLink)
                        cy.cmdLogResult(messageLink)
                        cy.visit(messageLink)
                    })

            } else {
                var json = {
                    squirrelmailServer: Cypress.env('mailServerAddress'),
                    port: Cypress.env('mailServerPort'),
                    user: "abir2",
                    pass: "1234",
                    searchString: testData.subjectForwardMail,
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

            cy.url().should('include', 'login')
            cy.cmdLogResult("Visited the link")

            cy.cmdLogStep('Log in as recipient user ' + testData.recipient)
            cy.login(testData.recipient, testData.password)
            cy.url().should('not.include', 'login')
            cy.cmdLogResult(testData.recipient + " Succesfully Logged in")


            cy.cmdLogStep('Click More Option')
            inboxMessagePage.getMoreOptionsButton().should('be.visible').click()
            cy.cmdLogStep('Click Forward Button')
            inboxMessagePage.getForwardButton().should('be.visible').click()
            var params = new replyMessagePage.replyMessageParam()
            params.recipient = testData.recipientTwo
            params.secureNote = testData.secureNote + " Forward From recipient via mail"
            params.attachedFileLocationMyComputer = testData.attachedFileLocationMyComputerReply

            replyMessagePage.replyMessage(params)
            cy.wait(2000)
            cy.toastMessageAssert('Message sent')
            cy.cmdLogResult("Message sent successfully")

            cy.cmdLogStep('Log out from current user')
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult("Succesfully logged out")


        });

        it('verify and reply Forwarded Message from Recipient two user', () => {

            cy.cmdLogStep('Log in as recipient two user ' + testData.recipientTwo)
            cy.login(testData.recipientTwo, testData.password)
            cy.url().should('not.include', 'login')
            cy.cmdLogResult(testData.recipientTwo + " Succesfully Logged in")

            cy.cmdLogStep('Go to Inbox page')
            leftNavBar.getInbox().click()
            //cy.url().should('include', 'message/inbox')
            cy.cmdLogResult("Succesfully navigated to inbox page")

            cy.cmdLogStep('Select Specific message ' + testData.subjectForward)
            inboxMessagePage.goToSpecificMessage(testData.subjectForward)
            cy.cmdLogStep('Click Reply  Button')
            inboxMessagePage.getReplyButton().should('be.visible').click()

            cy.cmdLogResult('Redirect to Reply  for recipient')

            var params = new replyMessagePage.replyMessageParam()

            params.secureNote = testData.secureNote + " Reply All From Recipient two"
            params.attachedFileLocationMyComputer = testData.attachedFileLocationMyComputerReply

            replyMessagePage.replyMessage(params)

            cy.toastMessageAssert('Message sent')
            cy.cmdLogResult("Message sent successfully")

            cy.cmdLogStep('Log out from current user')
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult("Succesfully logged out")
        });



    });

    describe('Reply & Reply All functionality test for External User - ' + Cypress.browser.name, function () {

        it('Send a message to  external user for reply case', function () {
            cy.reload()
            cy.cmdLogStep('Log in as sender user ' + testData.userNameSender)
            cy.login(testData.userNameSender, testData.password)
            cy.url().should('not.include', 'login')
            cy.cmdLogResult(testData.userNameSender + " Succesfully Logged in")

            cy.cmdLogStep('Go to compose message page')
            leftNavBar.getComposeMessage().click()
            cy.url().should('include', 'message/new')
            cy.cmdLogResult("Succesfully navigated to compose message page")

            var params = new composeMessagePage.composeMessageParam()
            params.recipient = testData.recipientThreeExternal
            params.subject = testData.subjectReplyExternal
            params.secureNote = testData.secureNote
            params.notificationMessage = testData.message
            params.attachedFileLocationMyComputer = testData.attachedFileLocationMyComputer
            composeMessagePage.composeMessage(params)
            cy.toastMessageAssert('Message sent')
            cy.cmdLogResult("Message sent successfully")
        });

        it('Send a message to  external user for reply case via Mail', function () {

            cy.reload()

            cy.cmdLogStep('Go to compose message page')
            leftNavBar.getComposeMessage().click()
            cy.url().should('include', 'message/new')
            cy.cmdLogResult("Succesfully navigated to compose message page")

            var params = new composeMessagePage.composeMessageParam()
            params.recipient = testData.recipientThreeExternal
            params.subject = testData.subjectReplyExternalMail
            params.secureNote = testData.secureNote
            params.notificationMessage = testData.message
            params.attachedFileLocationMyComputer = testData.attachedFileLocationMyComputer
            composeMessagePage.composeMessage(params)
            cy.toastMessageAssert('Message sent')
            cy.cmdLogResult("Message sent successfully")
        });

        it('Send a message to  external user for reply all case', function () {

            cy.reload()

            cy.cmdLogStep('Go to compose message page')
            leftNavBar.getComposeMessage().click()
            cy.url().should('include', 'message/new')
            cy.cmdLogResult("Succesfully navigated to compose message page")

            var params = new composeMessagePage.composeMessageParam()
            params.recipient = testData.recipientThreeExternal
            params.subject = testData.subjectReplyAllExternal
            params.secureNote = testData.secureNote
            params.notificationMessage = testData.message
            params.attachedFileLocationMyComputer = testData.attachedFileLocationMyComputer
            composeMessagePage.composeMessage(params)
            cy.toastMessageAssert('Message sent')
            cy.cmdLogResult("Message sent successfully")
        });


        it('Send a message to self register external user for reply  case', function () {

            cy.reload()

            cy.cmdLogStep('Go to compose message page')
            leftNavBar.getComposeMessage().click()
            cy.url().should('include', 'message/new')
            cy.cmdLogResult("Succesfully navigated to compose message page")

            var params = new composeMessagePage.composeMessageParam()
            params.recipient = testData.recipientExternalSelfRegistration
            params.subject = testData.subjectReplyExternalSelfRegistration
            params.secureNote = testData.secureNote
            params.notificationMessage = testData.message
            params.attachedFileLocationMyComputer = testData.attachedFileLocationMyComputer
            composeMessagePage.composeMessage(params)
            cy.toastMessageAssert('Message sent')
            cy.cmdLogResult("Message sent successfully")

            cy.cmdLogStep('Log out from current user')
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult("Succesfully logged out")
        });

        it('Reply Message from external user', () => {

            cy.cmdLogStep('Log in as external user ' + testData.recipientThreeExternal)
            cy.login(testData.recipientThreeExternal, testData.password)
            cy.url().should('not.include', 'login')
            cy.cmdLogResult(testData.recipientThreeExternal + " Succesfully Logged in")

            cy.cmdLogStep('Go to Inbox page')
            leftNavBar.getInbox().click()
            //cy.url().should('include', 'message/inbox')
            cy.cmdLogResult("Succesfully navigated to inbox page")

            cy.cmdLogStep('Select Specific message ' + testData.subjectReplyExternal)
            inboxMessagePage.goToSpecificMessage(testData.subjectReplyExternal)
            cy.cmdLogStep('Click Reply Option')
            inboxMessagePage.getReplyButton().click()
            var params = new replyMessagePage.replyMessageParam()

            params.secureNote = testData.secureNote + " Reply From external"
            params.attachedFileLocationMyComputer = testData.attachedFileLocationMyComputerReply

            replyMessagePage.replyMessage(params)
            cy.toastMessageAssert('Message sent')
            cy.cmdLogResult("Message sent successfully")

            cy.cmdLogStep('Log out from current user')
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult("Succesfully logged out")
        });

        it('Verify and Reply External user reply Message from sender user', () => {

            cy.cmdLogStep('Log in as sender user ' + testData.userNameSender)
            cy.login(testData.userNameSender, testData.password)
            cy.url().should('not.include', 'login')
            cy.cmdLogResult(testData.userNameSender + " Succesfully Logged in")

            cy.cmdLogStep('Go to Inbox page')
            leftNavBar.getInbox().click()
            //cy.url().should('include', 'message/inbox')
            cy.cmdLogResult("Succesfully navigated to inbox page")

            cy.cmdLogStep('Select Specific message ' + testData.subjectReplyExternal)
            inboxMessagePage.goToSpecificMessage(testData.subjectReplyExternal)
            cy.cmdLogStep('Click Reply Option')
            inboxMessagePage.getReplyButton().click()
            var params = new replyMessagePage.replyMessageParam()

            params.secureNote = testData.secureNote + " Reply From sender"
            params.attachedFileLocationMyComputer = testData.attachedFileLocationMyComputerReply

            replyMessagePage.replyMessage(params)
            cy.toastMessageAssert('Message sent')
            cy.cmdLogResult("Message sent successfully")

            cy.cmdLogStep('Log out from current user')
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult("Succesfully logged out")
        });


        it('Reply message from mail external user', () => {


            if (Cypress.env('live')) {

                let messageLink
                cy.mailosaurGetMessage(serverId, {
                    sentTo: testData.recipientThreeExternal,
                    subject: testData.subjectReplyExternalMail,
                    timeout: 60000
                    //subject: 'mailosaur test new '+i
                })
                    .then(email => {
                        expect(email.subject).to.equal(testData.subjectReplyExternalMail);
                        cy.log(email.subject)
                        messageLink = email.text.links[0].href;
                        cy.log(messageLink)
                        cy.cmdLogResult(messageLink)
                        cy.visit(messageLink)
                    })

            } else {


                var json = {
                    squirrelmailServer: Cypress.env('mailServerAddress'),
                    port: Cypress.env('mailServerPort'),
                    user: "abir4",
                    pass: "1234",
                    searchString: testData.subjectReplyExternalMail,
                    timeoutInMs: Cypress.env('emailCheckTimeout'),
                    checkIntervalInMs: Cypress.env('emailCheckInterval')
                }

                cy.cmdLogStep('Get the link from ' + testData.recipientThreeExternal + ' mail box')
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

            // var clientJson = {
            //     server: Cypress.env('mailServerAddress'),
            //     port: Cypress.env('mailServerPort'),
            //     username: "abir2",
            //     password: "1234",
            //     subject: testData.subjectReplyMail
            // }

            // cy.cmdLogStep('Get the link from ' +testData.recipient + ' mail box')
            // var pattern = '"' + tenant + '/link/.*?"'
            // cy.task('getMailBySubject', clientJson).then(function (emailBody) {
            //     finalLink = help.extractLinkFromEmail(emailBody, pattern)
            //     console.log('Link: ' + finalLink)
            //     cy.visit(finalLink)

            // })

            cy.url().should('include', 'login')
            cy.cmdLogResult("Visited the link")

            cy.cmdLogStep('Log in as external user ' + testData.recipientThreeExternal)
            cy.login(testData.recipientThreeExternal, testData.password)
            cy.url().should('not.include', 'login')
            cy.cmdLogResult(testData.recipientThreeExternal + " Succesfully Logged in")


            cy.cmdLogStep('Click Reply Option')
            inboxMessagePage.getReplyButton().click()
            var params = new replyMessagePage.replyMessageParam()

            params.secureNote = testData.secureNote + " Reply From recipient external via mail"
            params.attachedFileLocationMyComputer = testData.attachedFileLocationMyComputerReply

            replyMessagePage.replyMessage(params)
            cy.toastMessageAssert('Message sent')
            cy.cmdLogResult("Message sent successfully")

            cy.cmdLogStep('Log out from current user')
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult("Succesfully logged out")


        });

        it('Reply message from mail self Registered external user', () => {



            if (Cypress.env('live')) {

                let messageLink
                cy.mailosaurGetMessage(serverId, {
                    sentTo: testData.recipientExternalSelfRegistration,
                    subject: testData.subjectReplyExternalSelfRegistration,
                    timeout: 60000
                    //subject: 'mailosaur test new '+i
                })
                    .then(email => {
                        expect(email.subject).to.equal(testData.subjectReplyExternalSelfRegistration);
                        cy.log(email.subject)
                        messageLink = email.text.links[0].href;
                        cy.log(messageLink)
                        cy.cmdLogResult(messageLink)
                        cy.visit(messageLink)
                    })

            } else {

                var json = {
                    squirrelmailServer: Cypress.env('mailServerAddress'),
                    port: Cypress.env('mailServerPort'),
                    user: "abir5",
                    pass: "1234",
                    searchString: testData.subjectReplyExternalSelfRegistration,
                    timeoutInMs: Cypress.env('emailCheckTimeout'),
                    checkIntervalInMs: Cypress.env('emailCheckInterval')
                }

                cy.cmdLogStep('Get the link from ' + testData.recipientExternalSelfRegistration + ' mail box')
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
            // var clientJson = {
            //     server: Cypress.env('mailServerAddress'),
            //     port: Cypress.env('mailServerPort'),
            //     username: "abir2",
            //     password: "1234",
            //     subject: testData.subjectReplyMail
            // }

            // cy.cmdLogStep('Get the link from ' +testData.recipient + ' mail box')
            // var pattern = '"' + tenant + '/link/.*?"'
            // cy.task('getMailBySubject', clientJson).then(function (emailBody) {
            //     finalLink = help.extractLinkFromEmail(emailBody, pattern)
            //     console.log('Link: ' + finalLink)
            //     cy.visit(finalLink)

            // })

            cy.url().should('include', 'register')
            cy.cmdLogResult("Visited the link")

            var paramsRegistration = new selfRegistrationPage.selfRegistrationParam()

            paramsRegistration.password = testData.password
            paramsRegistration.confirmPassword = testData.password

            cy.cmdLogStep('Redirect to Self Registration Page')
            selfRegistrationPage.selfRegistration(paramsRegistration)
            cy.cmdLogResult(" Succesfully Self Registered")

            cy.cmdLogStep('Log in as external user ' + testData.recipientExternalSelfRegistration)
            cy.login(testData.recipientExternalSelfRegistration, testData.password)
            cy.url().should('not.include', 'login')
            cy.cmdLogResult(testData.recipientExternalSelfRegistration + " Succesfully Logged in")


            cy.cmdLogStep('Click Reply Option')
            inboxMessagePage.getReplyButton().click()
            var params = new replyMessagePage.replyMessageParam()

            params.secureNote = testData.secureNote + " Reply From recipient external via mail"
            params.attachedFileLocationMyComputer = testData.attachedFileLocationMyComputerReply

            replyMessagePage.replyMessage(params)
            cy.toastMessageAssert('Message sent')
            cy.cmdLogResult("Message sent successfully")

            cy.cmdLogStep('Log out from current user')
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult("Succesfully logged out")


        });








    });

});

