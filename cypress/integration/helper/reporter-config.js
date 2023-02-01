// Set the reporters configuration using `--reporter-options configFile=reporterConfig.js`.

// In reporterConfig.js
const locale = process.env.SITE_LOCALE;
var browserName
process.argv.forEach((value,index)=>{
  if (value === '--browser' || value === '-b' ){
    browserName = process.argv[index+1]
  }
})
console.log('My browser '+ browserName)

module.exports = {

  

  "reporterEnabled": "mochawesome, mocha-junit-reporter",
  "mochawesomeReporterOptions": {
      "reportDir": `cypress/reports/mocha`,
      "reportFilename":`${browserName}`,
      "quite": true,
      "overwrite": false,
      "html": false,
      "json": true,
      "charts": true
  },

  "mochaJunitReporterReporterOptions": {  
    "mochaFile": `cypress/reports/junit/${browserName}-[hash].xml`
  }

};