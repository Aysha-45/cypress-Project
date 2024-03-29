// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
// Add Screenshot to Mochawesome Report
import addContext from "mochawesome/addContext";

// Alternatively you can use CommonJS syntax:
// require('./commands')
let isSoftAssertion = false;
let errors = [];

chai.softExpect = function ( ...args ) {
    isSoftAssertion = true;
    return chai.expect(...args);
},
chai.softAssert = function ( ...args ) {
    isSoftAssertion = true;
    return chai.assert(...args);
}


Cypress.on("test:after:run", (test, runnable) => {
    if (test.state === "failed") {
      const screenshot = `assets\\${Cypress.spec.name}\\${runnable.parent.parent.title} -- ${runnable.parent.title} -- ${test.title} (failed).png`;
      console.log(test)
      cy.cmdLogStep(test)
      addContext({ test }, screenshot);
    }
  });

// Cypress.on('window:before:load', function (win) {
//     const original = win.EventTarget.prototype.addEventListener
  
//     win.EventTarget.prototype.addEventListener = function () {
//       if (arguments && arguments[0] === 'beforeunload') {
//         return
//       }
//       return original.apply(this, arguments)
//     }
  
//     Object.defineProperty(win, 'onbeforeunload', {
//       get: function () { },
//       set: function () { }
//     })
//   })


