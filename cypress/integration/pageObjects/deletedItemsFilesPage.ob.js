class DeletedItemsFilePage {

    getDeletedMessages() { return cy.get('[ng-click="$mdTabsCtrl.select(tab.getIndex())"]').contains('Messages') }

    getDeletedFiles() { return cy.get('[ng-click="$mdTabsCtrl.select(tab.getIndex())"]').contains('Files') }

    getAllItemsChecked(){ return cy.get('[ng-click="vm.checkAllClicked()"]').last() }

    getFilesList() { return cy.get('[ng-mouseover="vm.viewItem(file)"]') }

    getCheckbox(ele) { return cy.get(ele).children('[ng-click="vm.selectItem(file, false, $event, $index)"]') }

    getRestoreButton() { return cy.get('[ng-click="vm.goToRestore()"]') } // only appears when an item is checked

    getDeletePermanentlyButton() { return cy.get('[ng-click="vm.goToDelete()"]') } // only appears when an item is checked

    getRestoreConfirmationButton() { return cy.get('[ng-click="vm.confirmRestore()"]') }

    getDeletePermanentlyConfirmationButton() { return cy.get('[ng-click="vm.confirmDelete()"]') }

    search(name) { cy.get('[ng-model="vm.search.searchText"]').first().type(name).type('{enter}') }

    restoreSingleItem(name){

        var THIS = this
        var nameMatch = name + ' ' + name

        this.getFilesList().each(function(ele){
            var text = ele.text()
            cy.log(text)

            if(text.includes(nameMatch)){
                THIS.getCheckbox(ele).click({ force : true })
                THIS.getRestoreButton().click({ force : true }).then(function(){
                    THIS.getRestoreConfirmationButton().should('be.visible').click()
                })
                return false
            }

        })
        
    }

    permanentlyDeleteSingleItem(name){
        
        var THIS = this
        var nameMatch = name + ' ' + name

        this.getFilesList().each(function(ele){
            var text = ele.text()
            cy.log(text)

            if(text.includes(nameMatch)){
                THIS.getCheckbox(ele).click({ force : true })
                THIS.getDeletePermanentlyButton().click({ force : true }).then(function(){
                    THIS.getDeletePermanentlyConfirmationButton().should('be.visible').click()
                })
                return false
            }

        })

    }

    verifyItem(name){

        var checker = 0
        var nameMatch = name + ' ' + name
        this.getFilesList().each(function(ele){
            var text = ele.text()
            cy.log(text)
            if(text.includes(nameMatch)) { checker = 1 }
        })

        return checker
    
    }

}

export default DeletedItemsFilePage