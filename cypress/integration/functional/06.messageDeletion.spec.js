/// <reference types="Cypress" />


import LeftNavBar from "../pageObjects/leftNavBar.ob"
import ComposeMessagePage from "../pageObjects/composeMessagePage.ob"
import InboxPage from "../pageObjects/inboxPage.ob"
import DeletedItemsMessagePage from "../pageObjects/deletedItemsMessagePage.ob"
import SentPage from "../pageObjects/sentPage.ob"
import DraftsPage from "../pageObjects/draftsPage.ob"
import ApiInvoke from "../helper/api"

var baseUrl = Cypress.env('url')
var tenant = baseUrl + Cypress.env('tenantName') //+ '/'
const serverId = Cypress.env('mailosaureServerId')
const leftNavBar = new LeftNavBar()
const composeMessagePage = new ComposeMessagePage()
const inboxPage = new InboxPage()
const deletedItemsMessagePage = new DeletedItemsMessagePage()
const sentPage = new SentPage()
const draftPage = new DraftsPage()
const api = new ApiInvoke()
let testData = null


describe('Message Deletion Functionality - ' + Cypress.browser.name, function (){

    before(function () {

        
        if (Cypress.env('live')) {


            baseUrl = Cypress.env('liveUrl')
            tenant = baseUrl + Cypress.env('liveTenant') //+ '/'



            cy.fixture('messageDeletionLive').then(function (data) {
                testData = data
            })
            cy.visit(tenant)



        } else {
            cy.fixture('messageDeletion').then(function (data) {
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
        //cy.logout()

    });

    describe('Message Deletion Functionality - Test Environment Setup - ' + Cypress.browser.name, function () {

        it('Create dedicated users for Message Deletion Functionality', function () {
            
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

            // for (numOfUser = 0; numOfUser < testData.createUser.user.length; numOfUser++)
            // {
            //     createUser(numOfUser)
            // }

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

        it('Send Some Messages from : rayeed1@nilavodev.com', function () {
            
            cy.visit(tenant).then(function () {
                cy.cmdLogStep('Log in as User : ' + testData.createUser.user[0])
                cy.login(testData.createUser.user[0], testData.createUser.userPassword)
                cy.url().should('not.include', 'login')
                cy.cmdLogResult(testData.createUser.user[0] + " Succesfully Logged in")
            })

            var msgIndex = 0
            
            for(msgIndex = 0 ; msgIndex < testData.composeMessageParams.messagesFromUser1.length ; msgIndex++){

                cy.cmdLogStep('Go to compose message page')
                leftNavBar.getComposeMessage().click()
                cy.url().should('include', 'message/new')
                cy.cmdLogResult("Succesfully navigated to compose message page")
                
                var params = new composeMessagePage.composeMessageParam()
                params.recipient = testData.composeMessageParams.recipient[1]
                params.subject = testData.composeMessageParams.messagesFromUser1[msgIndex]               
                params.secureNote = testData.composeMessageParams.secureNote
                params.notificationMessage = testData.composeMessageParams.notificationMessage
                

                composeMessagePage.composeMessage(params)
                cy.toastMessageAssert('Message sent')
                cy.cmdLogResult("Message sent successfully")
            }

        });

        it('Save Some Messages as Draft from : rayeed1@nilavodev.com', function () {
            
            cy.visit(tenant)

            var draftIndex = 0
            for(draftIndex = 0 ; draftIndex < (testData.composeMessageParams.draftSubject.length) ; draftIndex++){

                cy.cmdLogStep('Go to compose message page')
                leftNavBar.getComposeMessage().click()
                cy.url().should('include', 'message/new')
                cy.cmdLogResult("Succesfully navigated to compose message page")
                
                var params = new composeMessagePage.composeMessageParam()
                params.recipient = testData.composeMessageParams.recipient[1]
                params.subject = testData.composeMessageParams.draftSubject[draftIndex]
                params.secureNote = testData.composeMessageParams.secureNote
                params.notificationMessage = testData.composeMessageParams.notificationMessage
                
                params.saveToDraft = true

                composeMessagePage.composeMessage(params)
                cy.toastMessageAssert('Message Saved')
                cy.cmdLogResult("Message Saved successfully")
            }


            cy.cmdLogStep('Log out as User : ' + testData.createUser.user[0])
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult(testData.createUser.user[0] + " Succesfully Logged out")

        });

        it('Send Some Messages from : rayeed2@nilavodev.com', function () {
            
            cy.visit(tenant).then(function () {
                cy.cmdLogStep('Log in as User : ' + testData.createUser.user[1])
                cy.login(testData.createUser.user[1], testData.createUser.userPassword)
                cy.url().should('not.include', 'login')
                cy.cmdLogResult(testData.createUser.user[1] + " Succesfully Logged in")
            })

            var msgIndex = 0
            
            for(msgIndex = 0 ; msgIndex < testData.composeMessageParams.messagesFromUser2.length ; msgIndex++){
                
                cy.cmdLogStep('Go to compose message page')
                leftNavBar.getComposeMessage().click()
                cy.url().should('include', 'message/new')
                cy.cmdLogResult("Succesfully navigated to compose message page")
                
                var params = new composeMessagePage.composeMessageParam()
                params.recipient = testData.composeMessageParams.recipient[0]
                params.subject = testData.composeMessageParams.messagesFromUser2[msgIndex]
                params.secureNote = testData.composeMessageParams.secureNote
                params.notificationMessage = testData.composeMessageParams.notificationMessage


                composeMessagePage.composeMessage(params)
                cy.toastMessageAssert('Message sent')
                cy.cmdLogResult("Message sent successfully")
            }            


            cy.cmdLogStep('Log out as User : ' + testData.createUser.user[1])
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult(testData.createUser.user[1] + " Succesfully Logged out")

        });
        
    });

    describe('Message Deletion Functionality - ' + Cypress.browser.name, function()
    {

        it('Delete & Restore Single Message from Inbox', function()
        {
            cy.visit(tenant).then(function () {
                cy.cmdLogStep('Log in as User : ' + testData.createUser.user[0])
                cy.login(testData.createUser.user[0], testData.createUser.userPassword)
                cy.url().should('not.include', 'login')
                cy.cmdLogResult(testData.createUser.user[0] + " Succesfully Logged in")
            })
            
            // Msg to be Deleted & Restored
            var singleInbox = testData.composeMessageParams.subjectSingleUser2

            cy.cmdLogStep('Go to Inbox')
            leftNavBar.getInboxTab().click()
            cy.url().should('include', 'inbox')
            cy.get('[md-virtual-repeat="message in vm.list.items"]').should('be.visible')
            cy.cmdLogResult("Succesfully Navigated to Inbox")

            cy.cmdLogStep('Check whether or not the Message to be deleted exists in Inbox')

            // var msgFoundInbox = 0
            // msgFoundInbox = inboxPage.verifyMessage(singleInbox)
            // if (msgFoundInbox == 1) { cy.cmdLogResult("Message exists in Inbox") }

            var nameMatch = singleInbox 
            inboxPage.getMessageList().each(function(ele) { 
                var text = ele.text()
                if(text.includes(nameMatch)) { 
                    cy.log('Message Found')
                    return false
                }
                else {
                    cy.log('Message Not Found') 
                }
            })


            // Delete
            
            cy.cmdLogStep('Delete the Message from Inbox')
            inboxPage.deleteSingleMessageByCheckBox(singleInbox)         
            cy.toastMessageAssert("deleted successfully").then(() => {
                cy.cmdLogResult('Message Deleted Successfully')
                cy.get('.md-toast-text').should('not.exist')
            })


            cy.cmdLogStep('Check the Message in Inbox')

            // var msgFoundInbox = 0
            // msgFoundInbox = inboxPage.verifyMessage(singleInbox)
            // if (msgFoundInbox == 0) { cy.cmdLogResult("Message deleted from Inbox") }

            var nameMatch = singleInbox 
            inboxPage.getMessageList().each(function(ele) { 
                var text = ele.text()
                if(text.includes(nameMatch)) { 
                    cy.log('Message Found')
                    return false
                }
                else {
                    cy.log('Message Not Found') 
                }
            })
        

            cy.cmdLogStep('Go to Deleted Items >> Message Section')
            leftNavBar.getDeletedItems().click({force : true})
            cy.url().should('include', 'trash/0')
            cy.get('[md-virtual-repeat="message in vm.list.items"]').should('be.visible')
            cy.cmdLogResult("Succesfully Navigated to Deleted Items >> Message Section")


            cy.cmdLogStep('Check the Message in Deleted Items >> Message')

            // var msgFoundDeletedMsgs = 0
            // msgFoundDeletedMsgs = deletedItemsMessagePage.verifyMessage(singleInbox)
            // if (msgFoundDeletedMsgs == 1) { cy.cmdLogResult("Message exists in Deleted Items >> Message") }

            var nameMatch = singleInbox 
            deletedItemsMessagePage.getMessageList().each(function(ele) { 
                var text = ele.text()
                if(text.includes(nameMatch)) { 
                    cy.log('Message Found')
                    return false
                }
                else {
                    cy.log('Message Not Found') 
                }
            })


            // Restore

            cy.cmdLogStep('Restore the Message from Deleted Items >> Message')
            deletedItemsMessagePage.restoreSingleMessageByHiddenRestoreIcon(singleInbox)
            cy.toastMessageAssert("restored successfully").then(() => {
                cy.cmdLogResult('Message Restored Successfully')
                cy.get('.md-toast-text').should('not.exist')
            })


            cy.cmdLogStep('Verify Restoration from Deleted Items >> Messages')
            cy.get('[md-virtual-repeat="message in vm.list.items"]').should('not.exist')
            cy.cmdLogResult("Restoration Verified from Deleted Items >> Messages")


            cy.cmdLogStep('Verify Restoration from Inbox')
            leftNavBar.getInboxTab().click()
            cy.url().should('include', 'inbox')
            cy.get('[md-virtual-repeat="message in vm.list.items"]').should('be.visible')
            cy.cmdLogResult("Succesfully Navigated to Inbox")


            // var msgFoundInbox = 0
            // msgFoundInbox = inboxPage.verifyMessage(singleInbox)
            // if (msgFoundInbox == 1) { cy.cmdLogResult("Restoration Verified from Inbox") }

            var nameMatch = singleInbox 
            inboxPage.getMessageList().each(function(ele) { 
                var text = ele.text()
                if(text.includes(nameMatch)) { 
                    cy.log('Message Found')
                    return false
                }
                else {
                    cy.log('Message Not Found') 
                }
            })


        })

        it('Delete & Restore Multiple Messages from Inbox', function(){

            cy.visit(tenant)

            // Messages to be Deleted
            var multipleInbox1 = testData.composeMessageParams.subjectMultipleUser2[0]
            var multipleInbox2 = testData.composeMessageParams.subjectMultipleUser2[1]

            cy.cmdLogStep('Go to Inbox')
            leftNavBar.getInboxTab().click()
            cy.url().should('include', 'inbox')
            cy.get('[md-virtual-repeat="message in vm.list.items"]').should('be.visible')
            cy.cmdLogResult("Succesfully Navigated to Inbox")

            cy.cmdLogStep('Check whether or not the Messages to be deleted exists in Inbox')

            // var msgFoundInbox1 = 0
            // var msgFoundInbox2 = 0

            // msgFoundInbox1 = inboxPage.verifyMessage(multipleInbox1)
            // msgFoundInbox2 = inboxPage.verifyMessage(multipleInbox2)

            // if (msgFoundInbox1 == 1 && msgFoundInbox2 == 1) { cy.cmdLogResult("Messages exist in Inbox") }

            var nameMatch = multipleInbox1 
            inboxPage.getMessageList().each(function(ele) { 
                var text = ele.text()
                if(text.includes(nameMatch)) { 
                    cy.log('Message Found')
                    return false
                }
                else {
                    cy.log('Message Not Found') 
                }
            })

            var nameMatch = multipleInbox2 
            inboxPage.getMessageList().each(function(ele) { 
                var text = ele.text()
                if(text.includes(nameMatch)) { 
                    cy.log('Message Found')
                    return false
                }
                else {
                    cy.log('Message Not Found') 
                }
            })


            // Delete

            cy.cmdLogStep('Delete the Messages from Inbox')
            var params = new inboxPage.multipleMessageParams()

            params.MatchText1 = multipleInbox1
            params.MatchText2 = multipleInbox2

            inboxPage.deleteMultipleMessageByCheckBox(params)
            cy.toastMessageAssert("were deleted").then(() => {
                cy.cmdLogResult('Messages Deleted Successfully')
                //cy.get('.md-toast-text').should('not.exist')
                cy.closeAssert()
            })

            //cy.get('.md-toast-text').should('not.exist')
            cy.closeAssert()
            cy.get('.md-toast-text').should('not.exist')
            cy.cmdLogStep('Check the Messages in Inbox')

            // var msgFoundInbox1 = 0
            // var msgFoundInbox2 = 0

            // msgFoundInbox1 = inboxPage.verifyMessage(multipleInbox1)
            // msgFoundInbox2 = inboxPage.verifyMessage(multipleInbox2)
            // if (msgFoundInbox1 == 0 && msgFoundInbox2 == 0) { cy.cmdLogResult("Messages deleted from Inbox") }

          
            var nameMatch = multipleInbox1 
            inboxPage.getMessageList().each(function(ele) { 
                var text = ele.text()
                if(text.includes(nameMatch)) { 
                    cy.log('Message Found')
                    return false
                }
                else {
                    cy.log('Message Not Found') 
                }
            })

            var nameMatch = multipleInbox2 
            inboxPage.getMessageList().each(function(ele) { 
                var text = ele.text()
                if(text.includes(nameMatch)) { 
                    cy.log('Message Found')
                    return false
                }
                else {
                    cy.log('Message Not Found') 
                }
            })  

            cy.reload()
            cy.cmdLogStep('Go to Deleted Items >> Message Section')
            leftNavBar.getDeletedItems().click()
            cy.url().should('include', 'trash/0')
            cy.get('[md-virtual-repeat="message in vm.list.items"]').should('be.visible')
            cy.cmdLogResult("Succesfully Navigated to Deleted Items >> Message Section")


            cy.cmdLogStep('Check the Messages in Deleted Items >> Message')
            // var msgFoundDeletedMsgs1 = 0
            // var msgFoundDeletedMsgs2 = 0

            // msgFoundDeletedMsgs1 = deletedItemsMessagePage.verifyMessage(multipleInbox1)
            // msgFoundDeletedMsgs2 = deletedItemsMessagePage.verifyMessage(multipleInbox2)
            // if (msgFoundDeletedMsgs1 == 1 && msgFoundDeletedMsgs2 == 1) { cy.cmdLogResult("Messages exist in from Deleted Items >> Message") }

            var nameMatch = multipleInbox1 
            deletedItemsMessagePage.getMessageList().each(function(ele) { 
                var text = ele.text()
                if(text.includes(nameMatch)) { 
                    cy.log('Message Found')
                    return false
                }
                else {
                    cy.log('Message Not Found') 
                }
            })

            var nameMatch = multipleInbox2 
            deletedItemsMessagePage.getMessageList().each(function(ele) { 
                var text = ele.text()
                if(text.includes(nameMatch)) { 
                    cy.log('Message Found')
                    return false
                }
                else {
                    cy.log('Message Not Found') 
                }
            })
            

            // Restore

            // cy.cmdLogStep('Restore the Messages from Deleted Items >> Message')
            // var params = new deletedItemsMessagePage.multipleMessageParams()

            // params.MatchText1 = multipleInbox1
            // params.MatchText2 = multipleInbox2

            deletedItemsMessagePage.restoreAllMessage()
            
            cy.toastMessageAssert("restored successfully").then(() => {
                cy.cmdLogResult('Messages Restored Successfully')
                cy.get('.md-toast-text').should('not.exist')
            })

            cy.cmdLogStep('Verify Restoration from Deleted Items >> Messages')
            cy.get('[md-virtual-repeat="message in vm.list.items"]').should('not.exist')
            cy.cmdLogResult("Restoration Verified from Deleted Items >> Messages")


            cy.cmdLogStep('Verify Restoration from Inbox')
            leftNavBar.getInboxTab().click()
            cy.url().should('include', 'inbox')
            cy.get('[md-virtual-repeat="message in vm.list.items"]').should('be.visible')
            cy.cmdLogResult("Succesfully Navigated to Inbox")

            // var msgFoundInbox1 = 0
            // var msgFoundInbox2 = 0

            // msgFoundInbox1 = inboxPage.verifyMessage(multipleInbox1)
            // msgFoundInbox2 = inboxPage.verifyMessage(multipleInbox2)
            // if(msgFoundInbox1 == 1 && msgFoundInbox2 == 1) { cy.cmdLogResult("Restoration Verified from Inbox") }


            var nameMatch = multipleInbox1 
            inboxPage.getMessageList().each(function(ele) { 
                var text = ele.text()
                if(text.includes(nameMatch)) { 
                    cy.log('Message Found')
                    return false
                }
                else {
                    cy.log('Message Not Found') 
                }
            })

            var nameMatch = multipleInbox2 
            inboxPage.getMessageList().each(function(ele) { 
                var text = ele.text()
                if(text.includes(nameMatch)) { 
                    cy.log('Message Found')
                    return false
                }
                else {
                    cy.log('Message Not Found') 
                }
            }) 
            


        })

        it('Delete & Restore Single Message from Sent', function()
        {
            cy.visit(tenant)
            
            // Msg to be Deleted & Restored
            var singleSent = testData.composeMessageParams.subjectSingleUser1

            cy.cmdLogStep('Go to Sent')
            leftNavBar.getSentTab().click()
            cy.url().should('include', 'sent')
            cy.get('[md-virtual-repeat="message in vm.list.items"]').should('be.visible')
            cy.cmdLogResult("Succesfully Navigated to Sent")


            cy.cmdLogStep('Check whether or not the Message to be deleted exists in Sent')

            // var msgFoundSent = 0
            // msgFoundSent = sentPage.verifyMessage(msgFoundSent)
            // if (msgFoundSent == 1) { cy.cmdLogResult("Message exists in Sent") }

            var nameMatch = singleSent 
            sentPage.getMessageList().each(function(ele) { 
                var text = ele.text()
                if(text.includes(nameMatch)) { 
                    cy.log('Message Found')
                    return false
                }
                else {
                    cy.log('Message Not Found') 
                }
            })


            cy.cmdLogStep('Delete the Message from Sent')
            sentPage.deleteSingleMessageByCheckBox(singleSent)          
            cy.toastMessageAssert("deleted successfully").then(() => {
                cy.cmdLogResult('Message Deleted Successfully')
                cy.get('.md-toast-text').should('not.exist')
            })


            cy.cmdLogStep('Check the Message in Sent')
            // var msgFoundSent = 0
            // msgFoundSent = sentPage.verifyMessage(singleSent)
            // if (msgFoundSent == 0) { cy.cmdLogResult("Message deleted from Sent") }

            var nameMatch = singleSent 
            sentPage.getMessageList().each(function(ele) { 
                var text = ele.text()
                if(text.includes(nameMatch)) { 
                    cy.log('Message Found')
                    return false
                }
                else {
                    cy.log('Message Not Found') 
                }
            })


            cy.cmdLogStep('Go to Deleted Items >> Message Section')
            leftNavBar.getDeletedItems().click()
            deletedItemsMessagePage.getDeletedItemsSentTab().click()
            cy.url().should('include', 'trash/1')
            cy.get('[md-virtual-repeat="message in vm.list.items"]').should('be.visible')
            cy.cmdLogResult("Succesfully Navigated to Deleted Items >> Message Section")


            cy.cmdLogStep('Check the Message in Deleted Items >> Message')

            // var msgFoundDeletedMsgs = 0
            // msgFoundDeletedMsgs = deletedItemsMessagePage.verifyMessage(singleSent)
            // if (msgFoundDeletedMsgs == 1) { cy.cmdLogResult("Message exists in from Deleted Items >> Message") }

            var nameMatch = singleSent 
            deletedItemsMessagePage.getMessageList().each(function(ele) { 
                var text = ele.text()
                if(text.includes(nameMatch)) { 
                    cy.log('Message Found')
                    return false
                }
                else {
                    cy.log('Message Not Found') 
                }
            })


            // Single Message Restore

            cy.cmdLogStep('Restore the Message from Deleted Items >> Message')
            deletedItemsMessagePage.restoreSingleMessageByHiddenRestoreIcon(singleSent)
            cy.toastMessageAssert("restored successfully").then(() => {
                cy.cmdLogResult('Message Restored Successfully')
                cy.get('.md-toast-text').should('not.exist')
            })


            cy.cmdLogStep('Verify Restoration from Deleted Items >> Messages')
            cy.get('[md-virtual-repeat="message in vm.list.items"]').should('not.exist')
            cy.cmdLogResult("Restoration Verified from Deleted Items >> Messages")


            cy.cmdLogStep('Verify Restoration from Sent')
            leftNavBar.getSentTab().click()
            cy.url().should('include', 'sent')
            cy.get('[md-virtual-repeat="message in vm.list.items"]').should('be.visible')
            cy.cmdLogResult("Succesfully Navigated to Sent")

            // var msgFoundSent = 0
            // msgFoundSent = sentPage.verifyMessage(msgFoundSent)
            // if (msgFoundSent == 1) { cy.cmdLogResult("Restoration Verified from Sent") }

            var nameMatch = singleSent 
            sentPage.getMessageList().each(function(ele) { 
                var text = ele.text()
                if(text.includes(nameMatch)) { 
                    cy.log('Message Found')
                    return false
                }
                else {
                    cy.log('Message Not Found') 
                }
            })


        })

        it('Delete & Restore Multiple Messages from Sent', function(){

            cy.visit(tenant)

            // Messages to be Deleted
            var multipleSent1 = testData.composeMessageParams.subjectMultipleUser1[0]
            var multipleSent2 = testData.composeMessageParams.subjectMultipleUser1[1]


            cy.cmdLogStep('Go to Sent')
            leftNavBar.getSentTab().click()
            cy.url().should('include', 'sent')
            cy.get('[md-virtual-repeat="message in vm.list.items"]').should('be.visible')
            cy.cmdLogResult("Succesfully Navigated to Sent")


            cy.cmdLogStep('Check whether or not the Messages to be deleted exists in Sent')
            // var msgFoundSent1 = 0
            // var msgFoundSent2 = 0

            // msgFoundSent1 = sentPage.verifyMessage(multipleSent1)
            // msgFoundSent2 = sentPage.verifyMessage(multipleSent2)

            // if (msgFoundSent1 == 1 && msgFoundSent2 == 1) { cy.cmdLogResult("Messages exist in Sent") }

            var nameMatch = multipleSent1 
            sentPage.getMessageList().each(function(ele) { 
                var text = ele.text()
                if(text.includes(nameMatch)) { 
                    cy.log('Message Found')
                    return false
                }
                else {
                    cy.log('Message Not Found') 
                }
            })

            var nameMatch = multipleSent2
            sentPage.getMessageList().each(function(ele) { 
                var text = ele.text()
                if(text.includes(nameMatch)) { 
                    cy.log('Message Found')
                    return false
                }
                else {
                    cy.log('Message Not Found') 
                }
            })


            // Delete Multiple Messages

            cy.cmdLogStep('Delete the Messages from Sent')
            var params = new sentPage.multipleMessageParams()

            params.MatchText1 = multipleSent1
            params.MatchText2 = multipleSent2

            sentPage.deleteMultipleMessageByCheckBox(params)
            cy.toastMessageAssert("were deleted").then(() => {
                cy.cmdLogResult('Messages Deleted Successfully')
                //cy.get('.md-toast-text').should('not.exist')
                cy.closeAssert()
            })

            //cy.get('.md-toast-text').should('not.exist')
            cy.closeAssert()
            cy.get('.md-toast-text').should('not.exist')
            cy.cmdLogStep('Check the Messages in Sent')
            // var msgFoundSent1 = 0
            // var msgFoundSent2 = 0

            // msgFoundSent1 = sentPage.verifyMessage(multipleSent1)
            // msgFoundSent2 = sentPage.verifyMessage(multipleSent2)
            // if (msgFoundSent1 == 0 && msgFoundSent2 == 0) { cy.cmdLogResult("Messages deleted from Sent") }

            var nameMatch = multipleSent1 
            sentPage.getMessageList().each(function(ele) { 
                var text = ele.text()
                if(text.includes(nameMatch)) { 
                    cy.log('Message Found')
                    return false
                }
                else {
                    cy.log('Message Not Found') 
                }
            })

            var nameMatch = multipleSent2 
            sentPage.getMessageList().each(function(ele) { 
                var text = ele.text()
                if(text.includes(nameMatch)) { 
                    cy.log('Message Found')
                    return false
                }
                else {
                    cy.log('Message Not Found') 
                }
            })

            cy.wait(3000)
            
            cy.cmdLogStep('Go to Deleted Items >> Message Section')
            leftNavBar.getDeletedItems().click()
            deletedItemsMessagePage.getDeletedItemsSentTab().click()
            cy.url().should('include', 'trash/1')
            cy.get('[md-virtual-repeat="message in vm.list.items"]').should('be.visible')
            cy.cmdLogResult("Succesfully Navigated to Deleted Items >> Message Section")


            cy.cmdLogStep('Check the Messages in Deleted Items >> Message')

            // var msgFoundDeletedMsgs1 = 0
            // var msgFoundDeletedMsgs2 = 0

            // msgFoundDeletedMsgs1 = deletedItemsMessagePage.verifyMessage(multipleSent1)
            // msgFoundDeletedMsgs2 = deletedItemsMessagePage.verifyMessage(multipleSent2)
            // if (msgFoundDeletedMsgs1 == 1 && msgFoundDeletedMsgs2 == 1){ cy.cmdLogResult("Messages exist in from Deleted Items >> Message") }

            var nameMatch = multipleSent1 
            deletedItemsMessagePage.getMessageList().each(function(ele) { 
                var text = ele.text()
                if(text.includes(nameMatch)) { 
                    cy.log('Message Found')
                    return false
                }
                else {
                    cy.log('Message Not Found') 
                }
            })

            var nameMatch = multipleSent2 
            deletedItemsMessagePage.getMessageList().each(function(ele) { 
                var text = ele.text()
                if(text.includes(nameMatch)) { 
                    cy.log('Message Found')
                    return false
                }
                else {
                    cy.log('Message Not Found') 
                }
            })


            // Restore Multiple Messages

            cy.cmdLogStep('Restore the Messages from Deleted Items >> Message')
            // var params = new deletedItemsMessagePage.multipleMessageParams()

            // params.MatchText1 = multipleSent1
            // params.MatchText2 = multipleSent2

            // deletedItemsMessagePage.restoreMultipleMessageByCheckBox(params)
            
            deletedItemsMessagePage.restoreAllMessage()
            cy.toastMessageAssert("restored successfully").then(() => {
                cy.cmdLogResult('Messages Restored Successfully')
                cy.get('.md-toast-text').should('not.exist')
            })


            cy.cmdLogStep('Verify Restoration from Deleted Items >> Messages')
            cy.get('[md-virtual-repeat="message in vm.list.items"]').should('not.exist')
            cy.cmdLogResult("Restoration Verified from Deleted Items >> Messages")


            cy.cmdLogStep('Verify Restoration from Sent')
            leftNavBar.getSentTab().click()
            cy.url().should('include', 'sent')
            cy.get('[md-virtual-repeat="message in vm.list.items"]').should('be.visible')
            cy.cmdLogResult("Succesfully Navigated to Sent")

            // var msgFoundSent1 = 0
            // var msgFoundSent2 = 0

            // msgFoundSent1 = sentPage.verifyMessage(multipleSent1)
            // msgFoundSent2 = sentPage.verifyMessage(multipleSent2)

            // if (msgFoundSent1 == 1 && msgFoundSent2 == 1) { cy.cmdLogResult("Restoration Verified from Sent") }

            var nameMatch = multipleSent1 
            sentPage.getMessageList().each(function(ele) { 
                var text = ele.text()
                if(text.includes(nameMatch)) { 
                    cy.log('Message Found')
                    return false
                }
                else {
                    cy.log('Message Not Found') 
                }
            })

            var nameMatch = multipleSent2 
            sentPage.getMessageList().each(function(ele) { 
                var text = ele.text()
                if(text.includes(nameMatch)) { 
                    cy.log('Message Found')
                    return false
                }
                else {
                    cy.log('Message Not Found') 
                }
            })

        })

        it('Delete Single Message from Drafts', function()
        {
            cy.visit(tenant)

            // Msg to be Deleted
            var singleDrafts = testData.composeMessageParams.draftSubject[0]

            cy.cmdLogStep('Go to Drafts')
            leftNavBar.getDraftMessage().click({ force : true })
            cy.url().should('include', 'drafts')
            cy.get('[md-virtual-repeat="message in vm.list.items"]').should('be.visible')
            cy.cmdLogResult("Succesfully Navigated to Drafts")


            // Single Message Delete

            cy.cmdLogStep('Delete the Message from Drafts')
            draftPage.deleteSingleMessageByCheckBox(singleDrafts)
         
            cy.toastMessageAssert("Message deleted successfully").then(() => {
                cy.cmdLogResult('Message Deleted Successfully')
                cy.get('.md-toast-text').should('not.exist')
            })


            cy.cmdLogStep('Check the Message in Drafts')
            // var msgFoundDrafts = 0
            // msgFoundDrafts = draftPage.verifyMessage(singleDrafts)
            // if (msgFoundDrafts == 0) { cy.cmdLogResult("Message deleted from Drafts") }
            
            var nameMatch = singleDrafts 
            draftPage.getMessageList().each(function(ele) { 
                var text = ele.text()
                if(text.includes(nameMatch)) { 
                    cy.log('Message Found')
                    return false
                }
                else {
                    cy.log('Message Not Found') 
                }
            })


            cy.cmdLogStep('Check the Message in Deleted Items >> Message Section')
            leftNavBar.getDeletedItems().click()
            cy.url().should('include', 'trash/0')
            cy.get('[md-virtual-repeat="message in vm.list.items"]').should('not.exist')
            cy.cmdLogResult("Message Not Found in Deleted Items >> Message Section")

        })

        it('Delete Multiple Messages from Drafts', function(){

            cy.visit(tenant)

            // Messages to be Deleted
            var multipleDraft1 = testData.composeMessageParams.draftSubject[1]
            var multipleDraft2 = testData.composeMessageParams.draftSubject[2]

            cy.cmdLogStep('Go to Drafts')
            leftNavBar.getDraftMessage().click({ force : true })
            cy.url().should('include', 'drafts')
            cy.get('[md-virtual-repeat="message in vm.list.items"]').should('be.visible')
            cy.cmdLogResult("Succesfully Navigated to Drafts")


            // Multiple Message Delete
            cy.cmdLogStep('Delete the Messages from Drafts')
            var params = new draftPage.multipleMessageParams()

            params.MatchText1 = multipleDraft1
            params.MatchText2 = multipleDraft2


            draftPage.deleteMultipleMessageByCheckBox(params)
            cy.toastMessageAssert("were deleted").then(() => {
                cy.cmdLogResult('Messages Deleted Successfully')
                cy.get('.md-toast-text').should('not.exist')
            })
            

            cy.cmdLogStep('Check the Message in Drafts')
            cy.get('[md-virtual-repeat="message in vm.list.items"]').should('not.exist')
            cy.cmdLogResult("Message deleted from Drafts")


            cy.cmdLogStep('Check the Messages in Deleted Items >> Inbox Section')
            leftNavBar.getDeletedItems().click()
            cy.url().should('include', 'trash/0')
            cy.get('[md-virtual-repeat="message in vm.list.items"]').should('not.exist')
            cy.cmdLogResult("Messages Not Found in Deleted Items >> Inbox Section")

            cy.wait(1000)

            cy.cmdLogResult("Messages Not Found in Deleted Items >> Sent Section")
            cy.cmdLogStep('Go to Deleted Items >> Sent Section')
            deletedItemsMessagePage.getDeletedItemsSentTab().click()
            cy.url().should('include', 'trash/1')
            cy.get('[md-virtual-repeat="message in vm.list.items"]').should('not.exist')
            cy.cmdLogResult("Messages Not Found in Deleted Items >> Sent Section")

        })

        it('Permanent Delete Single Message from Inbox', function()
        {
            cy.visit(tenant)
            
            // Msg to be Deleted
            var singleInbox = testData.composeMessageParams.subjectSingleUser2

            cy.cmdLogStep('Go to Inbox')
            leftNavBar.getInboxTab().click()
            cy.url().should('include', 'inbox')
            cy.get('[md-virtual-repeat="message in vm.list.items"]').should('be.visible')
            cy.cmdLogResult("Succesfully Navigated to Inbox")


            cy.cmdLogStep('Check whether or not the Message to be deleted exists in Inbox')
            // var msgFoundInbox = 0
            // msgFoundInbox = inboxPage.verifyMessage(singleInbox)
            // if (msgFoundInbox == 1){ cy.cmdLogResult("Message exists in Inbox") }

            var nameMatch = singleInbox 
            inboxPage.getMessageList().each(function(ele) { 
                var text = ele.text()
                if(text.includes(nameMatch)) { 
                    cy.log('Message Found')
                    return false
                }
                else {
                    cy.log('Message Not Found') 
                }
            })


            cy.cmdLogStep('Delete the Message from Inbox')
            inboxPage.deleteSingleMessageByCheckBox(singleInbox)          
            cy.toastMessageAssert("deleted successfully").then(() => {
                cy.cmdLogResult('Message Deleted Successfully')
                cy.get('.md-toast-text').should('not.exist')
            })


            cy.cmdLogStep('Check the Message in Inbox')
            // var msgFoundInbox = 0
            // msgFoundInbox = inboxPage.verifyMessage(singleInbox)
            // if (msgFoundInbox == 0) { cy.cmdLogResult("Message deleted from Inbox") }

            var nameMatch = singleInbox 
            inboxPage.getMessageList().each(function(ele) { 
                var text = ele.text()
                if(text.includes(nameMatch)) { 
                    cy.log('Message Found')
                    return false
                }
                else {
                    cy.log('Message Not Found') 
                }
            })


            cy.cmdLogStep('Go to Deleted Items >> Message Section')
            leftNavBar.getDeletedItems().click()
            cy.url().should('include', 'trash/0')
            cy.get('[md-virtual-repeat="message in vm.list.items"]').should('be.visible')
            cy.cmdLogResult("Succesfully Navigated to Deleted Items >> Message Section")


            cy.cmdLogStep('Check the Message in Deleted Items >> Message')
            // var msgFoundDeletedMsgs = 0
            // msgFoundDeletedMsgs = deletedItemsMessagePage.verifyMessage(singleInbox)
            // if (msgFoundDeletedMsgs == 1) { cy.cmdLogResult("Message exists in Deleted Items >> Message") }

            var nameMatch = singleInbox 
            deletedItemsMessagePage.getMessageList().each(function(ele) { 
                var text = ele.text()
                if(text.includes(nameMatch)) { 
                    cy.log('Message Found')
                    return false
                }
                else {
                    cy.log('Message Not Found') 
                }
            })


            // Single Message Permanently Delete
            cy.cmdLogStep('Permanently Delete the Message from Deleted Items >> Message')
            deletedItemsMessagePage.permanentDeleteSingleMessageByHiddenDeleteIcon(singleInbox)
            cy.toastMessageAssert("were deleted").then(() => {
                cy.cmdLogResult('Message Deleted Permanently')
                cy.get('.md-toast-text').should('not.exist')
            })


            cy.cmdLogStep('Verify Permanent Deletion from Deleted Items >> Messages')
            cy.get('[md-virtual-repeat="message in vm.list.items"]').should('not.exist')
            cy.cmdLogResult("Permanent Deletion Verified from Deleted Items >> Messages")


            cy.cmdLogStep('Verify Permanent Deletion from Inbox')
            leftNavBar.getInboxTab().click()
            cy.url().should('include', 'inbox')
            cy.get('[md-virtual-repeat="message in vm.list.items"]').should('be.visible')
            cy.cmdLogResult("Succesfully Navigated to Inbox")

            // var msgFoundInbox = 0
            // msgFoundInbox = inboxPage.verifyMessage(singleInbox)
            // if (msgFoundInbox == 0) { cy.cmdLogResult("Message Not Found -> Permanent Deletion Verified from Inbox") }

            var nameMatch = singleInbox 
            inboxPage.getMessageList().each(function(ele) { 
                var text = ele.text()
                if(text.includes(nameMatch)) { 
                    cy.log('Message Found')
                    return false
                }
                else {
                    cy.log('Message Not Found') 
                }
            })


        })

        it('Permanent Delete Multiple Messages from Inbox', function(){

            cy.visit(tenant)

            // Messages to be Deleted
            var multipleInbox1 = testData.composeMessageParams.subjectMultipleUser2[0]
            var multipleInbox2 = testData.composeMessageParams.subjectMultipleUser2[1]

            cy.cmdLogStep('Go to Inbox')
            leftNavBar.getInboxTab().click()
            cy.url().should('include', 'inbox')
            cy.get('[md-virtual-repeat="message in vm.list.items"]').should('be.visible')
            cy.cmdLogResult("Succesfully Navigated to Inbox")


            cy.cmdLogStep('Check whether or not the Messages to be deleted exists in Inbox')
            // var msgFoundInbox1 = 0
            // var msgFoundInbox2 = 0

            // msgFoundInbox1 = inboxPage.verifyMessage(multipleInbox1)
            // msgFoundInbox2 = inboxPage.verifyMessage(multipleInbox2)
            // if (msgFoundInbox1 == 1 && msgFoundInbox2 == 1) { cy.cmdLogResult("Messages exist in Inbox") }

            var nameMatch = multipleInbox1 
            inboxPage.getMessageList().each(function(ele) { 
                var text = ele.text()
                if(text.includes(nameMatch)) { 
                    cy.log('Message Found')
                    return false
                }
                else {
                    cy.log('Message Not Found') 
                }
            })

            var nameMatch = multipleInbox2 
            inboxPage.getMessageList().each(function(ele) { 
                var text = ele.text()
                if(text.includes(nameMatch)) { 
                    cy.log('Message Found')
                    return false
                }
                else {
                    cy.log('Message Not Found') 
                }
            })


            // Delete Multiple Messages
            cy.cmdLogStep('Delete the Messages from Inbox')
            var params = new inboxPage.multipleMessageParams()

            params.MatchText1 = multipleInbox1
            params.MatchText2 = multipleInbox2

            inboxPage.deleteMultipleMessageByCheckBox(params)
            cy.toastMessageAssert("were deleted").then(() => {
                cy.cmdLogResult('Messages Deleted Successfully')
                cy.closeAssert()
            })

            cy.closeAssert()
            cy.get('.md-toast-text').should('not.exist')
            
            cy.cmdLogStep('Check the Messages in Inbox')

            // var msgFoundInbox1 = 0
            // var msgFoundInbox2 = 0

            // msgFoundInbox1 = inboxPage.verifyMessage(multipleInbox1)
            // msgFoundInbox2 = inboxPage.verifyMessage(multipleInbox2)
            // if (msgFoundInbox1 == 0 && msgFoundInbox2 == 0) { cy.cmdLogResult("Messages deleted from Inbox") }

            var nameMatch = multipleInbox1 
            inboxPage.getMessageList().each(function(ele) { 
                var text = ele.text()
                if(text.includes(nameMatch)) { 
                    cy.log('Message Found')
                    return false
                }
                else {
                    cy.log('Message Not Found') 
                }
            })

            var nameMatch = multipleInbox2 
            inboxPage.getMessageList().each(function(ele) { 
                var text = ele.text()
                if(text.includes(nameMatch)) { 
                    cy.log('Message Found')
                    return false
                }
                else {
                    cy.log('Message Not Found') 
                }
            })

            cy.wait(1000)


            cy.cmdLogStep('Go to Deleted Items >> Message Section')
            leftNavBar.getDeletedItems().click()
            cy.url().should('include', 'trash/0')
            cy.get('[md-virtual-repeat="message in vm.list.items"]').should('be.visible')
            cy.cmdLogResult("Succesfully Navigated to Deleted Items >> Message Section")


            cy.cmdLogStep('Check the Messages in Deleted Items >> Message')
            // var msgFoundDeletedMsgs1 = 0
            // var msgFoundDeletedMsgs2 = 0

            // msgFoundDeletedMsgs1 = deletedItemsMessagePage.verifyMessage(multipleInbox1)
            // msgFoundDeletedMsgs2 = deletedItemsMessagePage.verifyMessage(multipleInbox2)
            // if (msgFoundDeletedMsgs1 == 1 && msgFoundDeletedMsgs2 == 1) { cy.cmdLogResult("Messages exist in from Deleted Items >> Message") }

            var nameMatch = multipleInbox1 
            deletedItemsMessagePage.getMessageList().each(function(ele) { 
                var text = ele.text()
                if(text.includes(nameMatch)) { 
                    cy.log('Message Found')
                    return false
                }
                else {
                    cy.log('Message Not Found') 
                }
            })

            var nameMatch = multipleInbox2 
            deletedItemsMessagePage.getMessageList().each(function(ele) { 
                var text = ele.text()
                if(text.includes(nameMatch)) { 
                    cy.log('Message Found')
                    return false
                }
                else {
                    cy.log('Message Not Found') 
                }
            })

            // Permanently Delete Multiple Messages
            cy.cmdLogStep('Permanently Delete the Messages from Deleted Items >> Message')
            // var params = new deletedItemsMessagePage.multipleMessageParams()
            // params.MatchText1 = multipleInbox1
            // params.MatchText2 = multipleInbox2
            // deletedItemsMessagePage.permanentDeleteMultipleMessageByCheckBox(params)

            deletedItemsMessagePage.permanentlyDeleteAllMessage()
            cy.toastMessageAssert("were deleted").then(() => {
                cy.cmdLogResult('Messages Permanently Deleted')
                cy.get('.md-toast-text').should('not.exist')
            })


            cy.cmdLogStep('Verify Permanent Deletion from Deleted Items >> Messages')
            cy.get('[md-virtual-repeat="message in vm.list.items"]').should('not.exist')
            cy.cmdLogResult("Permanent Deletion Verified from Deleted Items >> Messages")


            cy.cmdLogStep('Verify Restoration from Inbox')
            leftNavBar.getInboxTab().click()
            cy.url().should('include', 'inbox')
            cy.get('[md-virtual-repeat="message in vm.list.items"]').should('be.visible')
            cy.cmdLogResult("Succesfully Navigated to Inbox")


            // var msgFoundInbox1 = 0
            // var msgFoundInbox2 = 0

            // msgFoundInbox1 = inboxPage.verifyMessage(multipleInbox1)
            // msgFoundInbox2 = inboxPage.verifyMessage(multipleInbox2)
            // if(msgFoundInbox1 == 0 && msgFoundInbox2 == 0) { cy.cmdLogResult("Messages Not Found -> Permanent Deletion Verified from Inbox") }


            var nameMatch = multipleInbox1 
            inboxPage.getMessageList().each(function(ele) { 
                var text = ele.text()
                if(text.includes(nameMatch)) { 
                    cy.log('Message Found')
                    return false
                }
                else {
                    cy.log('Message Not Found') 
                }
            })

            var nameMatch = multipleInbox2 
            inboxPage.getMessageList().each(function(ele) { 
                var text = ele.text()
                if(text.includes(nameMatch)) { 
                    cy.log('Message Found')
                    return false
                }
                else {
                    cy.log('Message Not Found') 
                }
            })
        })

        it('Permanent Delete Single Message from Sent', function()
        {
            cy.visit(tenant)
            
            // Msg to be Deleted
            var singleSent = testData.composeMessageParams.subjectSingleUser1

            cy.cmdLogStep('Go to Sent')
            leftNavBar.getSentTab().click()
            cy.url().should('include', 'sent')
            cy.get('[md-virtual-repeat="message in vm.list.items"]').should('be.visible')
            cy.cmdLogResult("Succesfully Navigated to Sent")

            cy.cmdLogStep('Check whether or not the Message to be deleted exists in Sent')
            // var msgFoundSent = 0
            // msgFoundSent = sentPage.verifyMessage(singleSent)
            // if (msgFoundSent == 1) { cy.cmdLogResult("Message exists in Sent") }

            var nameMatch = singleSent 
            sentPage.getMessageList().each(function(ele) { 
                var text = ele.text()
                if(text.includes(nameMatch)) { 
                    cy.log('Message Found')
                    return false
                }
                else {
                    cy.log('Message Not Found') 
                }
            })

            cy.cmdLogStep('Delete the Message from Sent')
            sentPage.deleteSingleMessageByCheckBox(singleSent)          
            cy.toastMessageAssert("deleted successfully").then(() => {
                cy.cmdLogResult('Message Deleted Successfully')
                cy.get('.md-toast-text').should('not.exist')
            })


            cy.cmdLogStep('Check the Message in Sent')
            // var msgFoundSent = 0
            // msgFoundSent = sentPage.verifyMessage(msgFoundSent)
            // if (msgFoundSent == 0) { cy.cmdLogResult("Message deleted from Sent") }

            var nameMatch = singleSent 
            sentPage.getMessageList().each(function(ele) { 
                var text = ele.text()
                if(text.includes(nameMatch)) { 
                    cy.log('Message Found')
                    return false
                }
                else {
                    cy.log('Message Not Found') 
                }
            })

            cy.wait(1500)

            cy.cmdLogStep('Go to Deleted Items >> Message Section')
            leftNavBar.getDeletedItems().click()
            deletedItemsMessagePage.getDeletedItemsSentTab().click()
            cy.url().should('include', 'trash/1')
            cy.get('[md-virtual-repeat="message in vm.list.items"]').should('be.visible')
            cy.cmdLogResult("Succesfully Navigated to Deleted Items >> Message Section")


            cy.cmdLogStep('Check the Message in Deleted Items >> Message')
            // var msgFoundDeletedMsgs = 0
            // msgFoundDeletedMsgs = deletedItemsMessagePage.verifyMessage(singleSent)
            // if (msgFoundDeletedMsgs == 1) { cy.cmdLogResult("Message exists in from Deleted Items >> Message") }

            var nameMatch = singleSent 
            deletedItemsMessagePage.getMessageList().each(function(ele) { 
                var text = ele.text()
                if(text.includes(nameMatch)) { 
                    cy.log('Message Found')
                    return false
                }
                else {
                    cy.log('Message Not Found') 
                }
            })


            // Single Message Permanent Deletion
            cy.cmdLogStep('Permanently Delete the Message from Deleted Items >> Message')
            deletedItemsMessagePage.permanentDeleteSingleMessageByHiddenDeleteIcon(singleSent)
            cy.toastMessageAssert("were deleted").then(() => {
                cy.cmdLogResult('Message Permanently Deleted')
                cy.get('.md-toast-text').should('not.exist')
            })


            cy.cmdLogStep('Verify Permanent Deletion from Deleted Items >> Messages')
            cy.get('[md-virtual-repeat="message in vm.list.items"]').should('not.exist')
            cy.cmdLogResult("Permanent Deletion Verified from Deleted Items >> Messages")


            cy.cmdLogStep('Verify Permanent Deletion from Sent')
            leftNavBar.getSentTab().click()
            cy.url().should('include', 'sent')
            cy.get('[md-virtual-repeat="message in vm.list.items"]').should('be.visible')
            cy.cmdLogResult("Succesfully Navigated to Sent")


            // var msgFoundSent = 0
            // msgFoundSent = sentPage.verifyMessage(msgFoundSent)
            // if (msgFoundSent == 0) { cy.cmdLogResult("Message Not Found -> Permanent Deletion Verified from Sent") }

            var nameMatch = singleSent 
            sentPage.getMessageList().each(function(ele) { 
                var text = ele.text()
                if(text.includes(nameMatch)) { 
                    cy.log('Message Found')
                    return false
                }
                else {
                    cy.log('Message Not Found') 
                }
            })


        })

        it('Permanent Delete Multiple Messages from Sent', function(){

            cy.visit(tenant)

            // Messages to be Deleted
            var multipleSent1 = testData.composeMessageParams.subjectMultipleUser1[0]
            var multipleSent2 = testData.composeMessageParams.subjectMultipleUser1[1]

            cy.cmdLogStep('Go to Sent')
            leftNavBar.getSentTab().click()
            cy.url().should('include', 'sent')
            cy.get('[md-virtual-repeat="message in vm.list.items"]').should('be.visible')
            cy.cmdLogResult("Succesfully Navigated to Sent")

            cy.cmdLogStep('Check whether or not the Messages to be deleted exists in Sent')
            // var msgFoundSent1 = 0
            // var msgFoundSent2 = 0

            // msgFoundSent1 = sentPage.verifyMessage(multipleSent1)
            // msgFoundSent2 = sentPage.verifyMessage(multipleSent2)

            // if (msgFoundSent1 == 1 && msgFoundSent2 == 1) { cy.cmdLogResult("Messages exist in Sent") }

            var nameMatch = multipleSent1 
            sentPage.getMessageList().each(function(ele) { 
                var text = ele.text()
                if(text.includes(nameMatch)) { 
                    cy.log('Message Found')
                    return false
                }
                else {
                    cy.log('Message Not Found') 
                }
            })

            var nameMatch = multipleSent2 
            sentPage.getMessageList().each(function(ele) { 
                var text = ele.text()
                if(text.includes(nameMatch)) { 
                    cy.log('Message Found')
                    return false
                }
                else {
                    cy.log('Message Not Found') 
                }
            })


            // Delete Multiple Messages
            cy.cmdLogStep('Delete the Messages from Sent')
            var params = new sentPage.multipleMessageParams()

            params.MatchText1 = multipleSent1
            params.MatchText2 = multipleSent2

            sentPage.deleteMultipleMessageByCheckBox(params)
            cy.toastMessageAssert("were deleted").then(() => {
                cy.cmdLogResult('Messages Deleted Successfully')
                cy.closeAssert()
            })

            cy.wait(1500)
            cy.closeAssert()
            cy.get('.md-toast-text').should('not.exist')

            cy.cmdLogStep('Check the Messages in Sent')
            cy.get('[md-virtual-repeat="message in vm.list.items"]').should('not.exist')
            cy.cmdLogResult("Messages deleted from Sent")

            cy.wait(1000)

            cy.cmdLogStep('Go to Deleted Items >> Sent Section')
            leftNavBar.getDeletedItems().click()
            deletedItemsMessagePage.getDeletedItemsSentTab().click()
            cy.url().should('include', 'trash/1')
            cy.get('[md-virtual-repeat="message in vm.list.items"]').should('be.visible')
            cy.cmdLogResult("Succesfully Navigated to Deleted Items >> Sent Section")


            cy.cmdLogStep('Check the Messages in Deleted Items >> Message')
            // var msgFoundDeletedMsgs1 = 0
            // var msgFoundDeletedMsgs2 = 0

            // msgFoundDeletedMsgs1 = deletedItemsMessagePage.verifyMessage(multipleSent1)
            // msgFoundDeletedMsgs2 = deletedItemsMessagePage.verifyMessage(multipleSent2)
            // if (msgFoundDeletedMsgs1 == 1 && msgFoundDeletedMsgs2 == 1) { cy.cmdLogResult("Messages exist in from Deleted Items >> Message") }

            var nameMatch = multipleSent1 
            deletedItemsMessagePage.getMessageList().each(function(ele) { 
                var text = ele.text()
                if(text.includes(nameMatch)) { 
                    cy.log('Message Found')
                    return false
                }
                else {
                    cy.log('Message Not Found') 
                }
            })

            var nameMatch = multipleSent2 
            deletedItemsMessagePage.getMessageList().each(function(ele) { 
                var text = ele.text()
                if(text.includes(nameMatch)) { 
                    cy.log('Message Found')
                    return false
                }
                else {
                    cy.log('Message Not Found') 
                }
            })

            // Permanently Delete Multiple Messages
            cy.cmdLogStep('Permanently Delete the Messages from Deleted Items >> Message')
            // var params = new deletedItemsMessagePage.multipleMessageParams()
            // params.MatchText1 = multipleSent1
            // params.MatchText2 = multipleSent2
            // deletedItemsMessagePage.permanentDeleteMultipleMessageByCheckBox(params)
            
            deletedItemsMessagePage.permanentlyDeleteAllMessage()
            cy.toastMessageAssert("were deleted").then(() => {
                cy.cmdLogResult('Messages Permanently Deleted')
                cy.get('.md-toast-text').should('not.exist')
            })


            cy.cmdLogStep('Verify Permanent Deletion from Deleted Items >> Messages')
            cy.get('[md-virtual-repeat="message in vm.list.items"]').should('not.exist')
            cy.cmdLogResult("Permanent Deletion Verified from Deleted Items >> Messages")


            cy.cmdLogStep('Verify Permanent Deletion from Sent')
            leftNavBar.getSentTab().click()
            cy.url().should('include', 'sent')
            cy.get('[md-virtual-repeat="message in vm.list.items"]').should('not.exist')
            cy.cmdLogResult("Messages Not Found -> Permanent Deletion Verified from Sent")


            cy.cmdLogStep('Log out as User : ' + testData.createUser.user[0])
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult(testData.createUser.user[0] + " Succesfully Logged out")
            

        })

    })

    // Not Required for now : Delete Dedicated User

    // describe('Message Deletion Functionality - Reset Test Environment', function () {

    //     it('Delete dedicated users for Message Deletion Functionality', function () {
            
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

    //         var deleteUserIndex = 0
    //         for (deleteUserIndex = 0; deleteUserIndex < testData.createUser.user.length; deleteUserIndex++)
    //         {
    //             userPage.deleteUser(testData.createUser.user[deleteUserIndex])
    //             cy.toastMessageAssert("was deleted successfully").then(() => {
    //                 cy.cmdLogResult('User  ' + testData.createUser.user[deleteUserIndex] + ' Deleted Successfully')
    //                 cy.get('.md-toast-text').should('not.be.visible')
    //             })
    //         }

    //         cy.visit(tenant)

    //         cy.cmdLogStep('Log out as Tenant Manager : ' + testData.tenantManager.username)
    //         cy.logout()
    //         cy.url().should('include', 'login')
    //         cy.cmdLogResult(testData.tenantManager.username + " Succesfully Logged out")

    //     });

    // });

})