class StorageSettingsPage {

    getStorageSettingsTab() {
        return cy.contains("Storage Settings")
    }

    getAddDataStorageButton() {
        return cy.contains('Add Data Storage').should('be.visible')
    }

    getStoragePath() {
        return cy.get('[name="path"]').should('be.visible')
    }


    getCapacity() {
        return cy.get('[name="capacity"]').should('be.visible')
    }

    getSaveButton() {
        return cy.get("[type='submit'] > span")
    }

    getUserName() {
        return cy.get('[name="username"]').should('be.visible')
    }
    getPassword() {
        return cy.get('[name="password"]').should('be.visible')
    }

    setStorageType(option) {



        return cy.get('form[name="storageForm"] md-select[ng-model="vm.storage.type"]',{ timeout: 20000 }).click({ multiple: true, force:true }).then(() =>{
            cy.get('md-option')
                 .contains(option)
                 .click()
        })
       
        
    }


    addSambaDataStorage(strogaeType, storagePath, username, password, capcacity) {
        this.getAddDataStorageButton().click()
        this.setStorageType(strogaeType)
        cy.wait(3000)
        this.getUserName().clear()
        this.getUserName().focused().type(username)
        this.getPassword().clear()
        this.getPassword().focused().type(password)
        this.getStoragePath().clear()
        this.getStoragePath().focused().type(storagePath) 
        this.getCapacity().clear()
        this.getCapacity().focused().type(capcacity)
        
        


        this.getSaveButton().click()

    
    }


}

export default StorageSettingsPage