class BrandingSettingsPage {

    getBrandingSettingsTab(){return cy.contains("Branding")}
    getFaviconUpload(){ return cy.get('input[ngf-select="vm.uploadFiles(vm.favicon.type, $files)"]')}
    getLogoUpload(){return cy.get('input[ng-model="picFile"]')}
    getLogoUploadButton(){return cy.get(':nth-child(2) > .m-bottom-10 > .flex-35 > .tf-action-upload')}
    getLogoSaveButton() {return cy.get('button [translate="entity.action.save"]')}
    getRemoveFaviconButton(){return cy.get('[ng-class="{\'click-disable\': vm.isDefault(vm.favicon)}"]')}
    getRemoveLogoButton(){return cy.get('[ng-class="{\'click-disable\': vm.isDefault(vm.headerLogo)}"]')}
    getRemoveConfirmButton(){return cy.get('[ng-click="vm.confirmDelete(vm.tenantFile.type)"]')}
}
export default BrandingSettingsPage