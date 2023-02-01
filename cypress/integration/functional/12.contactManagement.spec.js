/// <reference types="Cypress" />

import LeftNavBar from "../pageObjects/leftNavBar.ob"
import ContactPage from "../pageObjects/contactPage.ob"
import UserPage from "../pageObjects/userPage.ob"
import TenantPage from "../pageObjects/tenantPage.ob"
import ComposeMessagePage from "../pageObjects/composeMessagePage.ob"
import ApiInvoke from "../helper/api"

var baseUrl = Cypress.env('url')
var tenant = baseUrl + Cypress.env('tenantName') //+ '/'
const serverId = Cypress.env('mailosaureServerId')
const leftNavBar = new LeftNavBar()
const composeMessagePage = new ComposeMessagePage()
const userPage = new UserPage()
const contactPage = new ContactPage()
const tenantPage = new TenantPage()
const api = new ApiInvoke()
let testData = null

describe('Contact management functionality - ' + Cypress.browser.name, function () {

    before(function () {

        // cy.fixture('contactManagement').then(function (data) {
        //     testData = data
        // })
        // cy.visit(tenant)



        if (Cypress.env('live')) {


            baseUrl = Cypress.env('liveUrl')
            tenant = baseUrl + Cypress.env('liveTenant') //+ '/'



            cy.fixture('contactManagementLive').then(function (data) {
                testData = data
            })
            cy.visit(tenant)



        } else {
            cy.fixture('contactManagement').then(function (data) {
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
        cy.logout()
    });





    describe('contact management functionality  test environment setup - ' + Cypress.browser.name, function () {


        it('Create licensed user', function () {
            cy.visit(tenant).then(function () {
                cy.login(testData.tenantManager.username, testData.tenantManager.password)
                cy.url().should('not.include', 'login')
                cy.task('log', testData.tenantManager.username + " Succesfully Logged in")
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


            // userPage.addUser(
            //     true,
            //     testData.createUser.fname,
            //     testData.createUser.lname,
            //     testData.createUser.user,
            //     testData.createUser.userPassword)


            // cy.toastMessageAssert('was created successfully').then(() => {
            //     cy.cmdLogResult('User "' + testData.createUser.user + '" created successfully')
            //     cy.get('.md-toast-text').should('not.be.visible')
            // })


            cy.logout()
            cy.url().should('include', 'login')

        })

    })

    describe('Contact management operation - ' + Cypress.browser.name, function () {


        it('create contact', function () {

            cy.visit(tenant).then(function () {
                cy.login(testData.createUser.user[0], testData.createUser.userPassword)
                cy.url().should('not.include', 'login')
                cy.task('log', testData.createUser.user[0] + " Succesfully Logged in")
            })

            cy.cmdLogStep('Go to contacts page')
            leftNavBar.getContacts().click()
            cy.url().should('include', 'contact')
            cy.cmdLogResult("Succesfully navigated to contacts page")

            cy.cmdLogStep('create contacts')

            var i
            for (i = 0; i <= (testData.createContacts.email.length - 1); i++) {
                cy.cmdLogStep('Go to Add Contact Page')
                contactPage.getAddContactButton().click()
                cy.url().should('include', 'user/new')
                cy.cmdLogResult("Succesfully navigated to New Contact Page")

                createContacts(i)

            }

            function createContacts(contactNumber) {

                var params = new contactPage.addContactsParam()
                params.firstName = testData.createContacts.firstName
                params.lastName = testData.createContacts.lastName[contactNumber]
                params.email = testData.createContacts.email[contactNumber]
                params.mobile = testData.createContacts.mobile
                contactPage.addContacts(params)


                cy.toastMessageAssert(' created successfully').then(() => {
                    cy.cmdLogResult('User "' + testData.createContacts.firstName + '" created successfully')
                    cy.get('.md-toast-text').should('not.be.visible')
                })


            }
            

        })

        it('edit contact', function () {
            cy.visit(tenant)

            cy.cmdLogStep('Go to contacts page')
            leftNavBar.getContacts().click()
            cy.url().should('include', 'contact')
            cy.cmdLogResult("Succesfully navigated to contacts page")

            cy.cmdLogStep('go to edit contacts page')
            contactPage.editContacts(testData.createContacts.email[0])
            cy.url().should('include', 'edit')
            cy.cmdLogResult("Succesfully navigated to  edit contacts page")

            var params = new contactPage.addContactsParam()
            params.firstName = testData.createContacts.firstName + "Edited"
            params.lastName = testData.createContacts.lastName[0] + "Edited"
            contactPage.addContacts(params)

            cy.toastMessageAssert('updated successfully  ').then(() => {
                cy.cmdLogResult('Contact' + testData.createContacts.email[0] + 'updated successfully  ')
            })


        })

        it('send message to the created contact', function () {

            cy.visit(tenant)
            cy.cmdLogStep('Go to contacts page')
            leftNavBar.getContacts().click()
            cy.url().should('include', 'contact')
            cy.cmdLogResult("Succesfully navigated to contacts page")

            cy.cmdLogStep('Go to compose message page')
            contactPage.composeMessageFromContact(testData.createContacts.email[0])

            cy.url().should('include', 'message/new')
            cy.cmdLogResult("Succesfully navigated to compose message page")

            var params = new composeMessagePage.composeMessageParam()
            params.recipient = " "
            params.subject = testData.composeMessage.subject
            params.secureNote = testData.composeMessage.secureNote
            params.notificationMessage = testData.composeMessage.message
            //  params.attachedFileLocationMyComputer = testData.composeMessage.attachedFileLocationMyComputer
            composeMessagePage.composeMessage(params)

            cy.toastMessageAssert('Message sent')
            cy.cmdLogResult("Message sent successfully")





        })
        it('delete contact', function () {


         
            cy.visit(tenant)

            cy.cmdLogStep('Go to contacts page')
            leftNavBar.getContacts().click()
            cy.url().should('include', 'contact')
            cy.cmdLogResult("Succesfully navigated to contacts page")

            contactPage.deleteContacts(testData.createContacts.email[0])

            cy.toastMessageAssert('deleted successfully  ').then(() => {
                cy.cmdLogResult('Contact' + testData.createContacts.email[0] + 'deleted successfully  ')
            })



            


        })
        it('add a group', function () {
           cy.visit(tenant)

            cy.cmdLogStep('Go to contacts page')
            leftNavBar.getContacts().last().click({force:true})
            cy.url().should('include', 'contact')
            cy.cmdLogResult("Succesfully navigated to contacts page")

            contactPage.addGroup(testData.createGroup.groupName, testData.createGroup.member1, testData.createGroup.member2, testData.createGroup.member3)

            cy.toastMessageAssert('created successfully  ').then(() => {
                cy.cmdLogResult('Contact' + testData.createGroup.groupName + 'created successfully  ')
            })


        });

        it('edit group', function () {

          
            cy.visit(tenant)

            cy.cmdLogStep('Go to contacts page')
            leftNavBar.getContacts().last().click()
            cy.url().should('include', 'contact')
            cy.cmdLogResult("Succesfully navigated to contacts page")
            cy.wait(1000)

            cy.cmdLogStep('go to edit contacts page')
            contactPage.editContactsGroup(testData.createGroup.groupName)
            cy.url().should('include', 'edit')
            cy.cmdLogResult("Succesfully navigated to  edit contacts page")

            contactPage.editGroup(testData.createGroup.groupNameEdit,' ',' ',' ')


            cy.toastMessageAssert('updated successfully  ').then(() => {
                cy.cmdLogResult('Group' + testData.createGroup.groupName + 'updated successfully  ')
            })


        })

        it('Send message to the created group contact', function () {
           

            cy.visit(tenant)
            cy.cmdLogStep('Go to contacts page')
            leftNavBar.getContacts().click()
            cy.url().should('include', 'contact')
            cy.cmdLogResult("Succesfully navigated to contacts page")

            cy.cmdLogStep('Go to compose message page')
            contactPage.composeMessageFromContact(testData.createGroup.groupNameEdit)

            cy.url().should('include', 'message/new')
            cy.cmdLogResult("Succesfully navigated to compose message page")


            cy.wait(3000)
            var params = new composeMessagePage.composeMessageParam()
            //params.recipient = " "
            params.subject = testData.composeMessage.subject1
            params.secureNote = testData.composeMessage.secureNote1
            params.notificationMessage = testData.composeMessage.message1
            //  params.attachedFileLocationMyComputer = testData.composeMessage.attachedFileLocationMyComputer
            composeMessagePage.composeMessage(params)

            cy.toastMessageAssert('Message sent')
            cy.cmdLogResult("Message sent successfully")






        });
        it('should delete contatct group', function () {


        
            cy.visit(tenant)

            cy.cmdLogStep('Go to contacts page')
            leftNavBar.getContacts().click()
            cy.url().should('include', 'contact')
            cy.cmdLogResult("Succesfully navigated to contacts page")

            contactPage.deleteContacts(testData.createGroup.groupNameEdit)

            cy.toastMessageAssert('deleted successfully  ').then(() => {
                cy.cmdLogResult('Contact' + testData.createGroup.groupName + 'deleted successfully  ')
            })


        })

       //TODO verify message from recipients
       //TODO assertion of contact from the list
       //TODO Send message, delte, edit from row icons of a contact


    })



});





