class DeletedItemsMessagePage{

    getMessageList() { return cy.get('[md-virtual-repeat="message in vm.list.items"]')}

    getHiddenRestoreIcon() { return cy.get('[ng-click="$event.stopPropagation(); vm.goToThreadRestore(message)"]')}

    getHiddenDeleteIcon() { return cy.get('[ng-click="vm.goToThreadDelete(message)"]')}

    getRestoreConfirmationButton() { return cy.get('[ng-click="vm.confirmRestore()"]')}

    getDeleteConfirmationButton() { return cy.get('[ng-click="vm.confirmDelete()"]')}

    getCheckbox(ele) { return cy.get(ele).children().children('[ng-model="message.checked"]')}

    // getMultipleCheckRestoreButton -> only appears if multiple items are checked
    getMultipleCheckRestoreButton() { return cy.get('[class="link-item"]').contains('Restore')}

    // getMultipleCheckPermanentDeleteButton -> only appears if multiple items are checked
    getMultipleCheckPermanentDeleteButton() { return cy.get('[class="link-item"]').contains('Delete permanently')}

    restoreSingleMessageByHiddenRestoreIcon(matchText)
    {
        var THIS = this
        var iter = 0
        var matchIndex = 0

        this.getMessageList().each(function(ele){
            var text = ele.text()
            cy.log(text)
            if(text.includes(matchText)){
                THIS.getHiddenRestoreIcon().eq(matchIndex).click({ force : true})
                return false
            }
            iter++ ; 
        })

        this.getRestoreConfirmationButton().click()

    }

    permanentDeleteSingleMessageByHiddenDeleteIcon(matchText)
    {
        var THIS = this
        var iter = 0
        var matchIndex = 0

        this.getMessageList().each(function(ele){
            var text = ele.text()
            cy.log(text)
            if(text.includes(matchText)){
                THIS.getHiddenDeleteIcon().eq(matchIndex).click({ force : true})
                return false
            }
            iter++ ; 
        })

        this.getDeleteConfirmationButton().click()

    }

    multipleMessageParams() 
    {

        this.MatchText1 = null ;
        this.MatchText2 = null ;
        this.MatchText3 = null ;
        this.MatchText4 = null ;
        this.MatchText5 = null ;

    }

    restoreMultipleMessageByCheckBox(params)
    {

        var THIS = this

        var text1 = null
        var text2 = null
        var text3 = null
        var text4 = null
        var text5 = null

        if(params.MatchText1) { text1 = params.MatchText1}
        if(params.MatchText2) { text2 = params.MatchText2}
        if(params.MatchText3) { text3 = params.MatchText3}
        if(params.MatchText4) { text4 = params.MatchText4}
        if(params.MatchText5) { text5 = params.MatchText5}

        this.getMessageList().each(function(ele){
            var text = ele.text()
            cy.log(text)
            if(text.includes(text1) || text.includes(text2) || text.includes(text3) || text.includes(text4) || text.includes(text5)) { 
                THIS.getCheckbox(ele).click({ force : true })
            }
            cy.wait(1500)
        })

        this.getMultipleCheckRestoreButton().should('be.visible').click().then(function(){
            THIS.getRestoreConfirmationButton().click()
        })

    }

    getCheckboxAll() { return cy.get('[ng-click="vm.checkAllClicked()"]').eq(0) }

    restoreAllMessage(){
        var THIS = this
        this.getCheckboxAll().click({force:true})
        this.getMultipleCheckRestoreButton().should('exist').click({force : true}).then(function(){
            THIS.getRestoreConfirmationButton().click()
        }) 
    }

    permanentlyDeleteAllMessage(){
        var THIS = this
        this.getCheckboxAll().click({force:true})
        this.getMultipleCheckPermanentDeleteButton().should('exist').click({force : true}).then(function(){
            THIS.getDeleteConfirmationButton().click()
        }) 
    }


    permanentDeleteMultipleMessageByCheckBox(params)
    {
        
        var THIS = this
        
        var text1 = null
        var text2 = null
        var text3 = null
        var text4 = null
        var text5 = null

        if(params.MatchText1) { text1 = params.MatchText1}
        if(params.MatchText2) { text2 = params.MatchText2}
        if(params.MatchText3) { text3 = params.MatchText3}
        if(params.MatchText4) { text4 = params.MatchText4}
        if(params.MatchText5) { text5 = params.MatchText5}

        this.getMessageList().each(function(ele){
            var text = ele.text()
            cy.log(text)
            if(text.includes(text1) || text.includes(text2) || text.includes(text3) || text.includes(text4) || text.includes(text5)){
                THIS.getCheckbox(ele).click({ force : true })
            }
        })

        this.getMultipleCheckPermanentDeleteButton().should('be.visible').click().then(function(){
            THIS.getDeleteConfirmationButton().click()
        })

    }

    verifyMessage(name){

        var checker = 0
        this.getMessageList().each(function(ele){
            var text = ele.text()
            cy.log(text)
            if(text.includes(name))
            {
                cy.log("Found")
                checker = 1
            }
        })

        return checker
    
    }

    getDeletedItemsSentTab(){ 
        return cy.get('[ng-click="$mdTabsCtrl.select(tab.getIndex())"]').contains('Sent')
    }

}

export default DeletedItemsMessagePage