class SystemActivityPage{

    getSystemActivityTab(){return cy.contains("System Activities")}
    getExportReportButton(){return cy.get('[ui-sref="transactions.export({level:vm.transactionLevel})"]')}
    getExportButton(){return cy.get('[ng-click="vm.export()"]')}



}
export default SystemActivityPage