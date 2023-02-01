
import LeftNavBar from "../pageObjects/leftNavBar.ob"
import TenantPage from "../pageObjects/tenantPage.ob"
import UserPage from "../pageObjects/userPage.ob"
import MyFilesPage from "../pageObjects/myFilesPage.ob"
import ComposeMessagePage from "../pageObjects/composeMessagePage.ob"
import Helper from "../helper/helper"
import InboxPage from "../pageObjects/inboxPage.ob"
import SentPage from "../pageObjects/sentPage.ob"
import ReplyMessagePage from "../pageObjects/replyMessagePage.ob"
import ApiInvoke from "../helper/api"

var baseUrl = Cypress.env('url')
var tenant = baseUrl + Cypress.env('tenantName') //+ '/'
const serverId = Cypress.env('mailosaureServerId')
const leftNavBar = new LeftNavBar()
const myFilesPage = new MyFilesPage()
const composeMessagePage = new ComposeMessagePage()
const tenantPage = new TenantPage()
const userPage = new UserPage()
const help = new Helper()
const inboxPage = new InboxPage()
const sentPage = new SentPage()
const replyMessagePage = new ReplyMessagePage()
const api = new ApiInvoke()
let testData = null
let finalLink

describe(' Message history check  functionality - '+ Cypress.browser.name, function () {

    before(function () {

        if (Cypress.env('live')) {


            baseUrl = Cypress.env('liveUrl')
            tenant = baseUrl + Cypress.env('liveTenant') //+ '/'



            cy.fixture('messageHistoryLive').then(function (data) {
                testData = data
            })
  



        } else {
            cy.fixture('messageHistory').then(function (data) {
                testData = data
            })
           


        }





    });

    beforeEach(function () {
        Cypress.Cookies.defaults({ preserve: ['SESSION', 'CSRF-TOKEN'] });
    });

    after(function () {
        cy.clearCookies()
        // cy.logout()
    });



    describe(' Message  history check functionality test environment setup - ' + Cypress.browser.name, function () {

        it('log in as admin,Create licensed user', function () {
            cy.visit(tenant).then(function () {
                cy.cmdLogStep('Log in as Admin ' + testData.tenantManager.username)
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
                        fname:testData.createUser.fname[index],
                        lname:testData.createUser.lname[index]
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
            // var i

            // for (i = 0; i <= (testData.createUser.user.length - 1); i++) { createUser(i) }

            // function createUser(userNumber) {
            //     userPage.addUser(
            //         true,
            //         testData.createUser.fname[userNumber],
            //         testData.createUser.lname[userNumber],
            //         testData.createUser.user[userNumber],
            //         testData.createUser.userPassword)


            //     cy.toastMessageAssert('was created successfully').then(() => {
            //         cy.cmdLogResult('User "' + testData.createUser.user[userNumber] + '" created successfully')
            //         cy.get('.md-toast-text').should('not.be.visible')
            //     })

            // }

            cy.cmdLogStep("Log out")
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult(testData.tenantManager.username + " Succesfully Logged out")



        });


    });

    describe(' Message  history check functionality test - ' + Cypress.browser.name, function () {

       


        it('View message history and download attachments  for multiple recipient ', function () {
        
            //SENDER SIGN IN
            cy.visit(tenant).then(function () {
                cy.cmdLogStep('Log in as sender ' + testData.composeMessage.userNameSender)
                cy.login(testData.composeMessage.userNameSender, testData.composeMessage.password)
                cy.url().should('not.include', 'login')
                cy.cmdLogResult(testData.composeMessage.userNameSender + " Succesfully Logged in")
            })

            cy.cmdLogStep('Go to compose message page')
            leftNavBar.getComposeMessage().click()
            cy.url().should('include', 'message/new')
            cy.cmdLogResult("Succesfully navigated to compose message page")

            var params = new composeMessagePage.composeMessageParam()

            params.recipient = testData.composeMessage.recipient
            params.recipientTwo = testData.composeMessage.recipientTwo;
            params.recipientThree = testData.composeMessage.recipientThree;
            params.secureNote = testData.composeMessage.secureNote
            params.subject = testData.composeMessage.subject
            params.message = testData.composeMessage.message
            params.attachedFileLocationMyComputer = testData.composeMessage.attachedFileLocationMyComputer
            composeMessagePage.composeMessage(params)
            cy.toastMessageAssert('Message sent')
            cy.cmdLogResult("Message sent successfully")

            //SIGNOUT
            cy.cmdLogStep("Log out")
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult(testData.composeMessage.userNameSender + " Succesfully Logged out")


            //cy.visit(tenant).then(function () {
                cy.cmdLogStep('Log in as recipient ' + testData.composeMessage.recipient)
                cy.login(testData.composeMessage.recipient, testData.composeMessage.password)
                cy.url().should('not.include', 'login')
                cy.cmdLogResult(testData.composeMessage.recipient + " Succesfully Logged in")
            //})
            cy.cmdLogStep('Go to Inbox page')
            leftNavBar.getInbox().click()
            //cy.url().should('include', 'message/inbox')
            cy.cmdLogResult("Succesfully navigated to inbox page")

            cy.cmdLogStep('Check specific message')

            inboxPage.checkSingleMessage(testData.composeMessage.subject)
            inboxPage.getMoreOptionsButton().click()
            cy.cmdLogStep('Click Download as Zip button')
            cy.download(inboxPage.getDownloadAsZipButton)
            cy.cmdLogResult("Succesfully download as zip")

            cy.cmdLogStep("Log out")
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult(testData.composeMessage.recipient + " Succesfully Logged out")

            cy.reload()

            //cy.visit(tenant).then(function () {
                cy.cmdLogStep('Log in as recipient ' + testData.composeMessage.recipientTwo)
                cy.login(testData.composeMessage.recipientTwo, testData.composeMessage.password)
                cy.url().should('not.include', 'login')
                cy.cmdLogResult(testData.composeMessage.recipientTwo + " Succesfully Logged in")
            //})

            cy.cmdLogStep('Go to Inbox page')
            leftNavBar.getInbox().click()
            //cy.url().should('include', 'message/inbox')
            cy.cmdLogResult("Succesfully navigated to inbox page")

            cy.cmdLogStep('Check specific message')

            inboxPage.checkSingleMessage(testData.composeMessage.subject)
            inboxPage.getMoreOptionsButton().click()
            cy.cmdLogStep('Click Download as Zip button')
            cy.download(inboxPage.getDownloadAsZipButton)
            cy.cmdLogResult("Succesfully download as zip")

            cy.cmdLogStep("Log out")
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult(testData.composeMessage.recipientTwo + " Succesfully Logged out")

            //cy.reload()

            cy.cmdLogStep('Log in as recipient ' + testData.composeMessage.recipientThree)
            cy.login(testData.composeMessage.recipientThree, testData.composeMessage.password)
            cy.url().should('not.include', 'login')
            cy.cmdLogResult(testData.composeMessage.recipientThree + " Succesfully Logged in")

            // cy.visit(tenant).then(function () {
            //     cy.cmdLogStep('Log in as recipient ' + testData.composeMessage.recipientThree)
            //     cy.login(testData.composeMessage.recipientThree, testData.composeMessage.password)
            //     cy.url().should('not.include', 'login')
            //     cy.cmdLogResult(testData.composeMessage.recipientThree + " Succesfully Logged in")
            // })

            cy.cmdLogStep('Go to Inbox page')
            leftNavBar.getInbox().click()
           // cy.url().should('include', 'message/inbox')
            cy.cmdLogResult("Succesfully navigated to inbox page")

            cy.cmdLogStep('Check specific message')

            inboxPage.checkSingleMessage(testData.composeMessage.subject)
            inboxPage.getMoreOptionsButton().click()
            cy.cmdLogStep('Click Download as Zip button')
            cy.download(inboxPage.getDownloadAsZipButton)
            cy.cmdLogResult("Succesfully download as zip")

            cy.cmdLogResult("Log out")
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult(testData.composeMessage.recipientThree + " Succesfully Logged out")

            cy.cmdLogStep('Check message  history form Sent messages')
           // cy.visit(tenant).then(function () {
                cy.cmdLogStep('Log in as sender ' + testData.composeMessage.userNameSender)
                cy.login(testData.composeMessage.userNameSender, testData.composeMessage.password)
                cy.url().should('not.include', 'login')
                cy.cmdLogResult(testData.composeMessage.userNameSender + " Succesfully Logged in")
           // })

            leftNavBar.getSentTab().click()
            cy.url().should('include', 'message/sent')
            cy.cmdLogStep('select specific message')
            sentPage.checkSingleMessage(testData.composeMessage.subject)
            cy.cmdLogResult(" go to history of that delivery")
            sentPage.getHistory()


            //test
            // sentPage.messageHistoryCheck('','',callback)

            // function callback(bool) {
            //     x = bool
            //     cy.log('call '+bool)

            //     if(x){
            //         cy.log('val '+ x)
            //     }else{
            //         cy.log('val '+ x) 
            //     }

            //         }

            // if (x){
            //     cy.log('test1')
            //     cy.log('My final val : ' + x)
            //     cy.log('test2')
            // }
       
            // it(){}
//working
            cy.cmdLogStep('Verify message history for: ' + testData.composeMessage.recipient)
            sentPage.getMessageHistoryList().each((value) => {
                var result = value.text()


                if (result.includes(testData.composeMessage.recipient + testData.checkMessageHistory.userActivity)) {

                    cy.cmdLogResult('Message history found for '+testData.composeMessage.recipient )
                 
            

                }
               else  if (result.includes(testData.composeMessage.recipient + testData.checkMessageHistory.userActivityWindows)) {

                    cy.cmdLogResult('Message history found for '+testData.composeMessage.recipient)
                   
                    


                }
               else  if (result.includes(testData.composeMessage.recipientTwo+ testData.checkMessageHistory.userActivity)) {

                    cy.cmdLogResult('Message history found for '+testData.composeMessage.recipientTwo )
                 
            

                }
               else  if (result.includes(testData.composeMessage.recipientTwo + testData.checkMessageHistory.userActivityWindows)) {

                    cy.cmdLogResult('Message history found for '+testData.composeMessage.recipientTwo)
                   
                    


                }
                else if (result.includes(testData.composeMessage.recipientThree + testData.checkMessageHistory.userActivity)) {

                    cy.cmdLogResult('Message history found for '+testData.composeMessage.recipientThree )
                 
            

                }
                else if (result.includes(testData.composeMessage.recipientThree + testData.checkMessageHistory.userActivityWindows)) {

                    cy.cmdLogResult('Message history found for '+testData.composeMessage.recipientThree)
                   
                    


                }
            
                else {

                    cy.cmdLogResult('Message history not found ')

                }
            })


             
        //not needed
        //     cy.cmdLogStep('Verify message history for:  ' + testData.composeMessage.recipient)

        //    var verifyHistory  =
        //    sentPage.messageHistoryCheck(testData.composeMessage.recipient, testData.checkMessageHistory.userActivity).then((a)=>{
        //     console.log('found '+a)
        //     if(a){
        //         consoley.log('found '+a)
        //     }
        //    })


        //    console.log(verifyHistory)  
        //    cy.log('Outside ' +verifyHistory)
        //      //cy.log('bool: '+x)
        //     //cy.wait(50000)
        //not needed




         
            cy.cmdLogStep('Log out ')
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult(testData.composeMessage.userNameSender + ",Succesfully logged out")


            
        })



        it('message reply for single reply history single recipient', function () {


            cy.cmdLogStep('Reply Message from recipient one')

            cy.visit(tenant).then(function () {
                cy.cmdLogStep('Log in as recipient one ' + testData.composeMessage.recipient)
                cy.login(testData.composeMessage.recipient, testData.composeMessage.password)
                cy.url().should('not.include', 'login')
                cy.cmdLogResult(testData.composeMessage.recipient + " Succesfully Logged in")
            })

            cy.cmdLogStep('Go to Inbox page')
            leftNavBar.getInbox().click()
           // cy.url().should('include', 'message/inbox')
            cy.cmdLogResult("Succesfully navigated to inbox page")

            cy.cmdLogStep('Select Specific message ' + testData.composeMessage.subject)
            inboxPage.checkSingleMessage(testData.composeMessage.subject)
            cy.cmdLogStep('Click Reply Option')
            inboxPage.getReplyButton().click()
            var params = new replyMessagePage.replyMessageParam()

            params.secureNote = testData.replyMessage.secureNote
            params.attachedFileLocationMyComputer = testData.replyMessage.attachedFileLocationMyComputerForReply

            replyMessagePage.replyMessage(params)
            cy.toastMessageAssert('Message sent')
            cy.cmdLogResult("Message sent successfully")

            cy.cmdLogStep('Log out ')
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult(testData.composeMessage.recipient + ",Succesfully logged out")


            cy.cmdLogStep('Access Message from different recipient and download files For Reply')



            // SENDER SIGN IN
            //cy.visit(tenant).then(function () {
                cy.cmdLogStep('Log in as sender ' + testData.composeMessage.userNameSender)
                cy.login(testData.composeMessage.userNameSender, testData.composeMessage.password)
                cy.url().should('not.include', 'login')
                cy.cmdLogResult(testData.composeMessage.userNameSender + " Succesfully Logged in")
           // })
            cy.cmdLogStep('Go to Inbox page')
            leftNavBar.getInbox().click()
            //cy.url().should('include', 'message/inbox')
            cy.cmdLogResult("Succesfully navigated to inbox page")

            cy.cmdLogStep('Check specific message')

            inboxPage.checkSingleMessage(testData.composeMessage.subject)
            inboxPage.getMoreOptionsButton().click()
            cy.cmdLogStep('Click Download as Zip button')
            cy.download(inboxPage.getDownloadAsZipButton)
            cy.cmdLogResult("Succesfully download as zip")

            cy.cmdLogResult("Log out")
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult(testData.composeMessage.userNameSender + " Succesfully Logged out")

            cy.cmdLogStep("Check message history of Recipient one for Reply ")




            //cy.visit(tenant).then(function () {
                cy.cmdLogStep('Log in as recipient ' + testData.composeMessage.recipient)
                cy.login(testData.composeMessage.recipient, testData.composeMessage.password)
                cy.url().should('not.include', 'login')
                cy.cmdLogResult(testData.composeMessage.recipient + " Succesfully Logged in")
            //})

            leftNavBar.getSentTab().click()
            cy.url().should('include', 'message/sent')
            cy.cmdLogStep('Check specific message')
            sentPage.checkSingleMessage(testData.composeMessage.subject)
            cy.cmdLogStep(" go to history of that delivery")
            sentPage.getHistory()


            // cy.reload()   
            cy.cmdLogStep('Verify message history for' + testData.composeMessage.userNameSender)
            sentPage.getMessageHistoryList().each((value) => {
                var result = value.text()


                if (result.includes(testData.composeMessage.userNameSender + testData.checkMessageHistory.userActivity)) {

                    cy.cmdLogResult('Message history found for '+testData.composeMessage.userNameSender)
                   



                } 
               else  if (result.includes(testData.composeMessage.userNameSender + testData.checkMessageHistory.userActivityReplyWindows)) {

                    cy.cmdLogResult('Message history found  for '+testData.composeMessage.userNameSender)
                    
                    
                   


                }
                else {

                    cy.cmdLogResult('Message history not found ')

                }
            })


            
            


            cy.cmdLogStep("Log out")
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult(testData.composeMessage.recipient + " Succesfully Logged out")


        })




        it('message reply and download file for reply all history', function () {

            cy.reload()

            cy.cmdLogStep('Recipient reply to All from  recipient Two:')

            cy.visit(tenant).then(function () {
                cy.cmdLogStep('Log in as recipient Two ' + testData.composeMessage.recipientTwo)
                cy.login(testData.composeMessage.recipientTwo, testData.composeMessage.password)
                cy.url().should('not.include', 'login')
                cy.cmdLogResult(testData.composeMessage.recipientTwo + " Succesfully Logged in")
            })

            cy.reload()


            cy.cmdLogStep('Go to Inbox page')
            leftNavBar.getInbox().click()
            //cy.url().should('include', 'message/inbox')
            cy.cmdLogResult("Succesfully navigated to inbox page")

            cy.cmdLogStep('Select Specific message ' + testData.composeMessage.subject)
            inboxPage.checkSingleMessage(testData.composeMessage.subject)
            cy.cmdLogStep('Click More Option')
            inboxPage.getMoreOptionsButton().click()
            cy.cmdLogStep('Click Reply All  Option')
            inboxPage.getReplyAllButton().click()
            var params = new replyMessagePage.replyMessageParam()


            params.attachedFileLocationMyComputer = testData.replyMessage.attachedFileLocationMyComputerForReply
            params.secureNote = testData.replyMessage.replyAllSecureNoteRecipient
            params.message = testData.replyMessage.replyAllMessageRecipient


            replyMessagePage.replyMessage(params)
            cy.toastMessageAssert('Message sent')
            cy.cmdLogResult("Message sent successfully")

            cy.cmdLogStep('Log out ')
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult(testData.composeMessage.recipientTwo + "Succesfully logged out")






            cy.cmdLogStep('Access Message from different recipient and download files For Reply All')

            // SENDER SIGN IN
            //cy.visit(tenant).then(function () {
                cy.cmdLogStep('Log in as sender ' + testData.composeMessage.userNameSender)
                cy.login(testData.composeMessage.userNameSender, testData.composeMessage.password)
                cy.url().should('not.include', 'login')
                cy.cmdLogResult(testData.composeMessage.userNameSender + " Succesfully Logged in")
            //})
            cy.cmdLogStep('Go to Inbox page')
            leftNavBar.getInbox().click()
           // cy.url().should('include', 'message/inbox')
            cy.cmdLogResult("Succesfully navigated to inbox page")

            cy.cmdLogStep('Check specific message')

            inboxPage.checkSingleMessage(testData.composeMessage.subject)
            inboxPage.getMoreOptionsButton().click()
            cy.cmdLogStep('Click Download as Zip button')

            cy.download(inboxPage.getDownloadAsZipButton)
            cy.cmdLogResult("Succesfully download as zip")

            cy.cmdLogStep("Log out")
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult(testData.composeMessage.userNameSender + " Succesfully Logged out")



            //cy.visit(tenant).then(function () {
                cy.cmdLogStep('Log in  ' + testData.composeMessage.recipient)
                cy.login(testData.composeMessage.recipient, testData.composeMessage.password)
                cy.url().should('not.include', 'login')
                cy.cmdLogResult(testData.composeMessage.recipient + " Succesfully Logged in")
           // })
            cy.cmdLogStep('Go to Inbox page')
            leftNavBar.getInbox().click()
            //cy.url().should('include', 'message/inbox')
            cy.cmdLogResult("Succesfully navigated to inbox page")

            cy.cmdLogStep('Check specific message')

            inboxPage.checkSingleMessage(testData.composeMessage.subject)
            inboxPage.getMoreOptionsButton().click()
            cy.cmdLogStep('Click Download as Zip button')

            cy.download(inboxPage.getDownloadAsZipButton)
            cy.cmdLogResult("Succesfully download as zip")

            cy.cmdLogStep("Log out")
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult(testData.composeMessage.recipient + " Succesfully Logged out")



            //cy.visit(tenant).then(function () {
                cy.cmdLogStep('Log in ' + testData.composeMessage.recipientTwo)
                cy.login(testData.composeMessage.recipientTwo, testData.composeMessage.password)
                cy.url().should('not.include', 'login')
                cy.cmdLogResult(testData.composeMessage.recipientTwo + " Succesfully Logged in")
          //  })
            cy.cmdLogStep('Go to Inbox page')
            leftNavBar.getInbox().click()
            //cy.url().should('include', 'message/inbox')
            cy.cmdLogResult("Succesfully navigated to inbox page")

            cy.cmdLogStep('Check specific message')

            inboxPage.checkSingleMessage(testData.composeMessage.subject)
            inboxPage.getMoreOptionsButton().click()
            cy.cmdLogStep('Click Download as Zip button')
            cy.download(inboxPage.getDownloadAsZipButton)
            cy.cmdLogResult("Succesfully download as zip")

            cy.cmdLogStep("Log out")
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult(testData.composeMessage.recipientTwo + " Succesfully Logged out")




           // cy.visit(tenant).then(function () {
                cy.cmdLogStep('Log in as recipient ' + testData.composeMessage.recipientThree)
                cy.login(testData.composeMessage.recipientThree, testData.composeMessage.password)
                cy.url().should('not.include', 'login')
                cy.cmdLogResult(testData.composeMessage.recipientThree + " Succesfully Logged in")
          //  })
            cy.cmdLogStep('Go to Inbox page')
            leftNavBar.getInbox().click()
            //cy.url().should('include', 'message/inbox')
            cy.cmdLogResult("Succesfully navigated to inbox page")

            cy.cmdLogStep('Check specific message')

            inboxPage.checkSingleMessage(testData.composeMessage.subject)
            inboxPage.getMoreOptionsButton().click()
            cy.cmdLogStep('Click Download as Zip button')
            cy.download(inboxPage.getDownloadAsZipButton)
            cy.cmdLogResult("Succesfully download as zip")

            cy.cmdLogStep("Log out")
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult(testData.composeMessage.recipientThree + " Succesfully Logged out")



            cy.cmdLogStep("Check Message history of Recipient Two for Reply All")


          //  cy.visit(tenant).then(function () {
                cy.cmdLogStep('Log in as recipient ' + testData.composeMessage.recipientTwo)
                cy.login(testData.composeMessage.recipientTwo, testData.composeMessage.password)
                cy.url().should('not.include', 'login')
                cy.cmdLogResult(testData.composeMessage.recipientTwo + " Succesfully Logged in")

                leftNavBar.getSentTab().click()
                cy.url().should('include', 'message/sent')
                sentPage.checkSingleMessage(testData.composeMessage.subject)
                cy.cmdLogResult(" go to history of that delivery")
                sentPage.getHistory()

           // })
            // cy.reload()   




            cy.cmdLogStep('Verify message history for different recipients')
            

            sentPage.getMessageHistoryList().each((value) => {
                var result = value.text()
                

              //cy.log(result)
                if (result.includes(testData.composeMessage.userNameSender + testData.checkMessageHistory.userActivity)) {

                    cy.cmdLogResult('Message history found  for '+testData.composeMessage.userNameSender)

                    
                 


                } 
               
                

                else if (result.includes(testData.composeMessage.userNameSender + testData.checkMessageHistory.userActivityReplyWindows)) {

                    cy.cmdLogResult('Message history found for ' + testData.composeMessage.userNameSender)



                }
               else if (result.includes(testData.composeMessage.recipient + testData.checkMessageHistory.userActivity)) {

                    cy.cmdLogResult('Message history found for '+testData.composeMessage.recipient)
                    
                         
        
        
                } 
                else if (result.includes(testData.composeMessage.recipient + testData.checkMessageHistory.userActivityReplyWindows)) {

                    cy.cmdLogResult('Message history found for '+testData.composeMessage.recipient)
                    
                         
        
        
                } 
               else  if (result.includes(testData.composeMessage.recipientThree + testData.checkMessageHistory.userActivity)) {

                    cy.cmdLogResult('Message history found for '+testData.composeMessage.recipientThree)
                    
                         
        
        
                } 
                else if (result.includes(testData.composeMessage.recipientThree + testData.checkMessageHistory.userActivityReplyWindows)) {

                    cy.cmdLogResult('Message history found for '+testData.composeMessage.recipientThree)
                    
                         
        
        
                } 
                else {

                    cy.cmdLogResult('Message history  not found')
                }
                cy.log(testData.composeMessage.userNameSender + testData.checkMessageHistory.userActivityReplyWindows)
            })

            

            cy.cmdLogStep("Log out")
            cy.logout()
            cy.url().should('include', 'login')
            cy.cmdLogResult(testData.composeMessage.recipientTwo + " Succesfully Logged out")







        })



    })
});



