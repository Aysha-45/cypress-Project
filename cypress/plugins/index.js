/// <reference types="Cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
const selectTestsWithGrep = require('cypress-select-tests/grep')
const Email = require('../integration/helper/emailModule')
const fs = require('fs');


//const r = require('../plugins/emailModule')
//import emailFunction from "../plugins/emailModule"

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on('task', {
    log(message) {
      console.log(message)
      return null
    }
  })

  on('file:preprocessor', selectTestsWithGrep(config))

  on('task', {
    deleteEmail(json) {
      Email.deleteMailByUser(json)
      return null
    }

  })


  on('task', {
    fileInfo(fileName) {
       return new Promise((done) => {
        fs.stat(fileName, (err, stats) => {
          if (err) {
              console.log(`File doesn't exist.`);
          } else {
              //console.log(stats);
              done(stats);
          }
      });
          
       });
    }
 });

  


  on('task', {
    getMailBySubject(json) {
      return Email.getEmailBySubject(json)
      
    }

  })


  on('task', {
    awaitEmailInSquirrelmailInbox(json){
      return Email.Squirrelmail().awaitEmail(json)
    }
})


// on('before:browser:launch', (browser = {}, args) => {

//   if (browser.name === 'chrome') {
//     args.push('--remote-debugging-port=9222')

//     // whatever you return here becomes the new args
//     return args
//   }

// })

// on('before:browser:launch', (browser, launchOptions) => {

//   if (browser.name === 'chrome') {
//       launchOptions.args.push('--remote-debugging-port=9222')
//       //launchOptions.args.push('--disable-gpu');

//     return launchOptions
//   }
// })

// const webpack = require('@cypress/webpack-preprocessor')
// module.exports = on => {
//   const options = {
//     // send in the options from your webpack.config.js, so it works the same
//     // as your app's code
//     webpackOptions: require('../../webpack.config'),
//     watchOptions: {}
//   }

//   on('file:preprocessor', webpack(options))
// }


}

