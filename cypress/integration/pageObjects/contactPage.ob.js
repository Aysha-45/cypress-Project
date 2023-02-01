``
/// <reference types="Cypress" />

//import { AssertionError } from "chai"

class ContactManagementPage
{   

    getAddContactButton(){
        return cy.get('[ui-sref="contact.newUser()"]').eq(0)
    }

    getComposeButton(){
        return cy.get('.link-item').contains("Compose")
    }

    getEditButton(){
        return cy.get('.link-item').contains("Edit")
        
    }

    getGroupEditButotn(){
        return cy.get('[ui-sref="contact.editGroup({id: vm.list.currentItem.id})"]')
    }
    getDeleteButton(){
        return cy.get('.link-item').contains("Delete")
    }
    getMoreButton(){
        return cy.contains("MORE")
    }

    getAddGroupButton(){
        return cy.contains("Group")
    }
    getEditContactGroupLabel(){
        return cy.get(".c-send-header layout-column flex").contains('Edit Contact Group')
    }

    getAlertWindowDeleteButton(){
        return cy.get('[ng-click="vm.confirmDelete()"]').contains("Delete")
    }
    getImportButton(){
        return cy.contains("Import")
    }
    getFirstNameBox(){
        return cy.get('#firstName')
    }
    getLastNameBox(){
        return cy.get('#lastName')
    }
    getEmailBox(){
        return cy.get('#email')
    }
    getMobileBox(){
        return cy.get('#mobile')
    }
    getOtherPhoneBox() {
       return  cy.get('#otherPhone')
    } 

    getFaxNumberBox() {
        return cy.get('#fax')
    }

   
    getCompanyBox () {
        return cy.get('#company')
    }



    getNotesBox() {
        return cy.get('#notes')
    }

    

    getSaveButton(){
        return cy.get('[translate="bsendApp.contact.save"]')
        
    }

    getContactGroupSaveButton(){
        return cy.get('[ng-click="vm.save()"]')
    }

    getCheckBox(){
        return cy.get('.md-container md-ink-ripple')
    }
    getGroupNameBox(){
        return cy.get('#displayName')
    }
    getMembersBox(){
        return cy.get('[ng-model="vm.group.members"]')
    }
   
    addContactsParam() {

        this.firstName = null;
        this.lastName = null;
        this.email = null;
        this.mobile = null;
        this.otherPhone = null;
        this.faxNumber = null;
        this.company = null;
        this.notes = null;
       

    }

    
    addContacts(params) {

        

        if (params.firstName) {

           
            this.getFirstNameBox().clear().type(params.firstName)

        };
        if (params.lastName) {

            this.getLastNameBox().clear().type(params.lastName)

        };
        if (params.email) {

            this.getEmailBox().clear().type(params.email)
        };
        if (params.mobile) {

            
            this.getMobileBox().clear().type(params.mobile)

        };
        if (params.otherPhone) {

           
            this.getOtherPhoneBox().clear().type(params.otherPhone)


        };
        if (params.faxNumber) {

            
            this.getFaxNumberBox().clear().type(params.faxNumber)

        };
        if (params.company) {

         
            this.getCompanyBox().clear().type(params.company)

        };
        if (params.notes) {

           
            this.getNotesBox().clear().type(params.notes)

        };
           
         

        this.getSaveButton().click()


      


    }

   
    selectSpecificContact(contactEmail){
    
        
       cy.get('[ng-mouseenter="vm.viewContact(contact)"]').each(function(elem){
           var email = elem.text()
            
            if( email.includes(contactEmail) ){
              cy.get(elem).children('[ng-click="vm.selectContact(contact, false, $event, $index)"]').click({force:true})

              return false
              
            
            }
        })
      
    }

    editContacts(contactEmail){
       
        this.selectSpecificContact(contactEmail)  
        this.getEditButton().click()
       

    }

    editContactsGroup(contactEmail){
       
        this.selectSpecificContact(contactEmail)  
        this.getGroupEditButotn().click()
       

    }
    composeMessageFromContact(contactEmail){
       
       this.selectSpecificContact(contactEmail) 
        this.getComposeButton().click()
       
    }

    deleteContacts(contactEmail){
        this.selectSpecificContact(contactEmail) 
        this.getDeleteButton().click()
        this.getAlertWindowDeleteButton().click()
        this.getAlertWindowDeleteButton().should('not.exist')
        

    }

    addGroup(groupName,member1,member2,member3){
        this.getMoreButton().click()
        this.getAddGroupButton().click()
        this.getGroupNameBox().clear().type(groupName)
        this.getMembersBox().type(member1)
        this.getAddGroupButton().click()
        this.getMembersBox().type(member2)
        this.getAddGroupButton().click()
        this.getMembersBox().type(member3)//.type('{enter}')
        this.getMembersBox().click()
        this.getContactGroupSaveButton().click()
       


    }

    editGroup(groupName){
        this.getGroupNameBox().clear().type(groupName)
        this.getContactGroupSaveButton().click()
       


    }
    

    }

    
   











export default ContactManagementPage







