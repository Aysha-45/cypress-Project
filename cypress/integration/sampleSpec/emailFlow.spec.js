/// <reference types="Cypress" />
import ComposeMessagePage from "../pageObjects/composeMessagePage.ob"
import LeftNavBar from "../pageObjects/leftNavBar.ob"
import Helper from "../helper/helper"

const leftNavBar = new LeftNavBar()
const composeMessagePage = new ComposeMessagePage()
let testData = null
const baseUrl = Cypress.env('url')
const tenant = baseUrl + Cypress.env('tenantName') + '/'
const help = new Helper()


describe('Email flow spec', function () {
    before(function () {

        cy.fixture('composeMessage').then(function (data) {
            testData = data
        })
        cy.visit(tenant).then(function () {
            cy.cmdLogStep('Log in as sender user ' + testData.userNameSender)
            cy.login(testData.userNameSender, testData.password)
            cy.url().should('not.include', 'login')
            cy.cmdLogResult(testData.userNameSender + " Succesfully Logged in")
        })



    });

    beforeEach(function () {
        Cypress.Cookies.defaults({ preserve: ['SESSION', 'CSRF-TOKEN'] });
    });

    after(function () {
        cy.clearCookies()
        cy.logout()
    });



    it('Clear mail box for sarja2', () => {
        var clientJson = {
            server: '192.168.10.91',
            port: '143',
            username: "sarja2",
            password: "1234"
        }
        cy.task('deleteEmail', clientJson)
    });
    it('Send a delivery to sarja2', () => {
        cy.cmdLogStep('Go to compose message page')
        leftNavBar.getComposeMessage().click()
        cy.url().should('include', 'message/new')
        cy.cmdLogResult("Succesfully navigated to compose message page")

        var params = new composeMessagePage.composeMessageParam()
        params.recipient = 'sarja2@nilavodev.com'
        params.subject = 'Find me and access the delivery from email'
        params.secureNote = testData.secureNote
        params.notificationMessage = testData.message
        composeMessagePage.composeMessage(params)
        cy.toastMessageAssert('Message sent')
        cy.cmdLogResult("Message sent successfully")

        cy.logout()
    });
    it('Access the delivery link from email', function () {
        let finalLink
        var clientJson = {
            server: '192.168.10.91',
            port: '143',
            username: "sarja2",
            password: "1234",
            subject: "Find me and access the delivery from email"
        }
        var pattern = '"' + tenant + 'link/.*?"'
        cy.task('getMailBySubject', clientJson).then(function (emailBody) {
            finalLink = help.extractLinkFromEmail(emailBody, pattern)
            console.log('Link: ' + finalLink)
            cy.visit(finalLink)
        })

        cy.login('sarja2@nilavodev.com', 'Nil@vo2006')


    });

});
