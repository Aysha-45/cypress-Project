class DraftsPage{

    getMessageList() { return  cy.get('[md-virtual-repeat="message in vm.list.items"]') }

    getCheckbox(ele) { return cy.get(ele).children().children('[ng-click="vm.selectItem(message, $event, $index)"]') }

    getDeleteButton() { return cy.get('[ng-click="goToDelete(); $event.stopPropagation()"]') }

    // Delete Confirmation Box -> Delete Button, in case of Single Message Deletion from Checkbox
    getDeleteConfirmationButtonSingleMsgCheckbox() { return cy.get('[ng-click="dialog.hide()"]') }

    // Delete Confirmation Box -> Delete Button, in case of Single Message Deletion hovering Delete Icon
    getDeleteConfirmationButtonSignleMsgDeleteIcon() { return cy.get('[ng-click="vm.confirmDelete()"]') }   

    // getMultipleCheckDeleteButton -> only appears if multiple items are checked
    getMultipleCheckDeleteButton() { return cy.get('[class="link-item"]').contains('Delete') }

    // Delete Confirmation Box -> Delete Button, in case of Multiple Message Deletion from checkbox
    getMultipleCheckDeleteConfirmationButton() { return cy.get('[ng-click="vm.confirmDelete()"]') }

    getHiddenDeleteIconParent() { return cy.get('[class="c-checkable-list-item__actions show-always thread-actions hide show-gt-sm layout-align-end-start layout-row"]') }

    checkSingleMessage(matchText)
    {
        var THIS = this
        this.getMessageList().each(function(ele){
            var text = ele.text()
            cy.log(text)
            if(text.includes(matchText)) {
                THIS.getCheckbox(ele).click({ force : true })
                return false
            }
        })
    }

    deleteSingleMessageByCheckBox(matchText)
    {
        var THIS = this
        cy.get('[md-virtual-repeat="message in vm.list.items"]').each(function(ele){
            var text = ele.text()
            cy.log(text)
            if(text.includes(matchText)) {
                THIS.getCheckbox(ele).click({ force : true })
                THIS.getDeleteButton().should('be.visible').click().then(function(){
                    THIS.getDeleteConfirmationButtonSingleMsgCheckbox().click({ force : true })
                })
                return false
            }
        })
    }

    deleteSingleMessageByHiddenDeleteIcon(matchText)
    {
        var THIS = this
        var iter = 0
        var matchIndex = 0
        cy.get('[md-virtual-repeat="message in vm.list.items"]').each(function(ele){
            var text = ele.text()
            cy.log(text)
            if(text.includes(matchText)){
                matchIndex = iter
                THIS.getHiddenDeleteIconParent().eq(matchIndex).children().children('[aria-label="Trash"]').click({ force : true}).then(function(){
                    THIS.getDeleteConfirmationButtonSignleMsgDeleteIcon().should('be.visible').click()
                })
                return false
            }
            iter++ ; 
        })
    }

    multipleMessageParams() 
    {

        this.MatchText1 = null ;
        this.MatchText2 = null ;
        this.MatchText3 = null ;
        this.MatchText4 = null ;
        this.MatchText5 = null ;

    }

    deleteMultipleMessageByCheckBox(params)
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
        })

        this.getMultipleCheckDeleteButton().should('be.visible').click().then(function(){
            THIS.getMultipleCheckDeleteConfirmationButton().click()
        })

    }

    verifyMessage(name){

        var checker = 0
        this.getMessageList().each(function(ele){
            var text = ele.text()
            cy.log(text)
            if(text.includes(name)) { checker = 1 }
        })

        return checker
    
    }


}

export default DraftsPage