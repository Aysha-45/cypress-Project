// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
import 'cypress-mailosaur'
//import 'read-chunk'

Cypress.Commands.add("login", (email, password) => {
    cy.title().should('not.have.length', 14).then((val) => {
      if (val.includes('Login')) {
        cy.get('#username').clear()
        cy.get('#username').type(email)
        cy.get('#password').clear()
        cy.get('#password').type(password)
        cy.get('#signinButton').click()
      }else if(val.includes('Registration')){

        cy.get('#username').clear()
        cy.get('#username').type(email)
        cy.get('#password').clear()
        cy.get('#password').type(password)
        cy.get('#signinButton').click()

      
      }else {
  
        cy.logout()
        cy.get('#username').clear()
        cy.get('#username').type(email)
        cy.get('#password').clear()
        cy.get('#password').type(password)
        cy.get('#signinButton').click()
  
      }

     })

  





})

Cypress.Commands.add("logout", () => {
  cy.get('md-toolbar').contains('Sign Out').click({ force: true })
})

Cypress.Commands.add("toastMessageAssert", (message) => {
  cy.get('.md-toast-text').then(function (text) {
    expect(text.text()).to.contain(message)
  })
})

Cypress.Commands.add("closeAssert", () => {
  cy.get('[ng-click="toast.resolve()"]').should('exist').click({ force: true })
})

Cypress.Commands.add("typeEsc", () => {
  cy.get('input').first().type('{esc}')
})


Cypress.Commands.add("cmdLog", (type, message) => {
  cy.task('log', type + ': ' + message)
})

Cypress.Commands.add("cmdLogStep", (message) => {
  cy.task('log', 'Step: ' + message)
})

Cypress.Commands.add("cmdLogResult", (message) => {
  cy.task('log', 'Result: ' + message)
})

Cypress.Commands.add("download", (myFunc) => {
  cy.window().document().then(function (doc) {
    doc.addEventListener('click', () => {
      setTimeout(function () { doc.location.reload() }, 15000)

    })
    myFunc().click({ force : true })
  })

})

Cypress.Commands.add("upload", (filePath) => {
  cy.get('label input[type="file"][href=""][ngf-select="vm.addToUploadQueue($files)"]', { timeout: 20000 }).attachFile({ filePath: filePath })
})

Cypress.Commands.add("uploadAssert", (message) => {
  cy.get('[translate="bsendApp.file.upload.completed"]', { timeout: 30000 }).then(param => {
    expect(param.text()).to.contain(message)
  })
})

Cypress.Commands.add("attachmentAssert", (fileName) => {

  var str = fileName
  var fileNameFromMyFiles = str.substring(str.lastIndexOf("/") + 1, str.length)
  cy.get('div[aria-label="' + fileNameFromMyFiles + '\"]').should('be.visible')
})


//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
Cypress.Commands.add(
  'attach_file',
  {
    prevSubject: 'element',
  },
  (input, fileName, fileType) => {
    cy.fixture(fileName, 'base64')
      .then(content => Cypress.Blob.base64StringToBlob(content, fileType))
      .then(blob => {
        const testFile = new File([blob], fileName);
        const dataTransfer = new DataTransfer();

        dataTransfer.items.add(testFile);
        input[0].files = dataTransfer.files;
        return input;
      })
  }
)

// Performs an XMLHttpRequest instead of a cy.request (able to send data as FormData - multipart/form-data)
Cypress.Commands.add('form_request', (method, url, formData, done) => {
  const xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.onload = function () {
      done(xhr);
  };
  xhr.onerror = function () {
      done(xhr);
  };
  xhr.send(formData);
})
import 'cypress-file-upload'