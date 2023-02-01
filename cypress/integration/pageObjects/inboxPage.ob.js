
class InboxPage{

    getMoreOptionsButton() { return cy.get('[aria-label="more"]').first() }

    getMoreOptionsDeleteButton() { return cy.get('[ng-click="goToDelete(); $event.stopPropagation()"]').last() }

    // Delete Confirmation Box -> Delete Button, in case of Single Message Deletion from Checkbox
    getDeleteConfirmationButtonSingleMsgCheckbox() { return cy.get('[ng-click="dialog.hide()"]') }

    // Delete Confirmation Box -> Delete Button, in case of Single Message Deletion hovering Delete Icon
    getDeleteConfirmationButtonSignleMsgDeleteIcon() { return cy.get('[ng-click="vm.confirmDelete()"]') }   

    getMessageList() { return cy.get('[md-virtual-repeat="message in vm.list.items"]') }

    getCheckbox(ele) { return cy.get(ele).children().children('[ng-click="vm.selectItem(message, $event, $index)"]') }

    // getMultipleCheckDeleteButton -> only appears if multiple items are checked
    getMultipleCheckDeleteButton() { return cy.get('[class="link-item"]').contains('Delete') }

    // Delete Confirmation Box -> Delete Button, in case of Multiple Message Deletion from checkbox
    getMultipleCheckDeleteConfirmationButton() { return cy.get('[ng-click="vm.confirmDelete()"]') }

    getHiddenDeleteIcon() { return cy.get('[class="c-checkable-list-item__actions show-always hide-sm hide-xs layout-align-end-start layout-row"]') }

    getMoreIcon(){
        return cy.get('[ng-click="openDownloadAllMenu($mdOpenMenu, $event)"]')
    }


    getDownloadAsZipButton(){return cy.get('[ng-click="downloadAsZIP(folderId)"]')
    }

    getSignInButtonNoSignInPage(){
        return cy.get('a[translate="global.signIn"]')
    }

    getSpecificMessageFocus(){
        return cy.get('[ng-show="message.subject"]')

    }

    getReplyButton(){

        return cy.get('a[class="message-detail-icon md-icon-button md-button show-gt-sm hide"]').first()

    }
    getReplyAllButton(){

        return cy.get('[ui-sref="message.reply-all({id: selectedMessage.id})"]').last()

    }



    getReplyAllButton() { return cy.get('[ui-sref="message.reply-all({id: selectedMessage.id})"]').last() }

    getForwardButton() { return cy.get('[ui-sref="message.forward({id: selectedMessage.id})"]').last() }

    getSaveAllAttachmentsToFilesButton() { return cy.get('[ng-click="copyToMyFiles($event, content, true)"]').last() }

    getSaveFileWindowSelectButton() { return cy.get('[translate="pages.file.explorer.select"]').last() }

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
        this.getMessageList().each(function(ele){
            var text = ele.text()
            cy.log(text)
            if(text.includes(matchText)){
                THIS.getCheckbox(ele).click({ force : true })
                THIS.getMoreOptionsButton().click({ force : true })
                THIS.getMoreOptionsDeleteButton().should('be.visible').click().then(function(){
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
        this.getMessageList().each(function(ele){
            var text = ele.text()
            cy.log(text)
            if(text.includes(matchText)){
                matchIndex = iter
                THIS.getHiddenDeleteIcon().eq(matchIndex).children().children('[aria-label="Trash"]').click({ force : true }).then(function(){
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



    


    getDownloadAsZipButtonNoSignIn(){return cy.get('[ng-click="downloadAsZIP(folderId)"]')
    }
    getDownloadAsZipButton(){return cy.get('[ng-click="downloadAsZIP(selectedMessage.folderId)"]').last()
    }


    getSignInButtonNoSignInPage(){
        return cy.get('a[translate="global.signIn"]')
    }

    getSpecificMessageFocus(){
        return cy.get('[ng-show="message.subject"]')

    }


    
    goToSpecificMessage(messageSubject){
        var THIS = this
        cy.get('h4.c-checkable-list-item__subject.p-l-7 > span').each(function(elem){
            var subject = elem.text()
            
            if(subject === messageSubject){
               elem.click()
              return false
            }
        })
    }





}

export default InboxPage