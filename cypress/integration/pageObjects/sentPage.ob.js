class SentPage {


    getMoreOptionsButton() { return cy.get('[aria-label="more"]').first() }

    getMoreOptionsDeleteButton() { return cy.get('[ng-click="goToDelete(); $event.stopPropagation()"]').last() }

    // Delete Confirmation Box -> Delete Button, in case of Single Message Deletion from Checkbox
    getDeleteConfirmationButtonSingleMsgCheckbox() { return cy.get('[ng-click="dialog.hide()"]') }

    // Delete Confirmation Box -> Delete Button, in case of Single Message Deletion hovering Delete Icon
    getDeleteConfirmationButtonSignleMsgDeleteIcon() { return cy.get('[ng-click="vm.confirmDelete()"]') }

    getMessageList() { return cy.get('[md-virtual-repeat="message in vm.list.items"]') }

    getCheckbox(ele) { return cy.get(ele).children().children('[ng-click="vm.selectItem(message, $event, $index)"]') }
    //tuba
    getHistoryButton() { return cy.get('a[aria-label="History"]').last() }

    // getMultipleCheckDeleteButton -> only appears if multiple items are checked
    getMultipleCheckDeleteButton() { return cy.get('[class="link-item"]').contains('Delete') }

    // Delete Confirmation Box -> Delete Button, in case of Multiple Message Deletion from checkbox
    getMultipleCheckDeleteConfirmationButton() { return cy.get('[class="dialog-btn md-button md-ink-ripple"]').contains('Delete') }

    getHiddenDeleteParentIcon() { return cy.get('[class="c-checkable-list-item__actions show-always hide-sm hide-xs layout-align-end-start layout-row"]') }

    getMessageHistoryList() { return cy.get('[class="layout-gt-sm-row layout-column flex"]') }
    getHistory() {
        this.getMoreOptionsButton().click()
        this.getHistoryButton().click()
    }

    // messageHistoryCheck(userName, userActivity) {
    //     var matchRowText=userName+userActivity
    //     //    var matchFound=0
    //     //    var THIS=this
    //     //    let flag = false
    //     var res

    //      this.getMessageHistoryList().each(function (ele) {
    //         var result = ele.text()
    //         //return ele.text()

    //         if (result.includes(matchRowText)) {

    //             console.log('Match found: ')
    //             //callback(true)
    //             res = true
    //            //return true

    //         } else {
    //             console.log('Match not found')
    //             //res = false
    //         }

    //         // var x = 0
    //         // cy.log('This is my text: '+text)
    //         // cy.log('My text: ' + matchRowText)
    //         // if(text.includes(matchRowText)) {
    //         //     flag = true 
    //         //     return flag
    //         //     //return true
    //         // }


    //     })


    //     //if(THIS.x==1)  THIS.matchFound=1

     
    //     return new Promise((resolve) => {
    //         setTimeout(() => {
    //             resolve(res)
    //         }, 2000)

    //     })

    //}















    checkSingleMessage(matchText) {
        var THIS = this
        this.getMessageList().each(function (ele) {
            var text = ele.text()
            cy.log(text)
            if (text.includes(matchText)) {
                THIS.getCheckbox(ele).click({ force: true })
                return false
            }
        })
    }

    deleteSingleMessageByCheckBox(matchText) {
        var THIS = this
        this.getMessageList().each(function (ele) {
            var text = ele.text()
            if (text.includes(matchText)) {
                THIS.getCheckbox(ele).click({ force: true })
                THIS.getMoreOptionsButton().click({ force: true })
                THIS.getMoreOptionsDeleteButton().should('be.visible').click().then(function () {
                    THIS.getDeleteConfirmationButtonSingleMsgCheckbox().click({ force: true })
                })
                return false
            }
        })
    }

    deleteSingleMessageByHiddenDeleteIcon(matchText) {

        var THIS = this
        var iter = 0
        var matchIndex = 0
        this.getMessageList().each(function (ele) {
            var text = ele.text()
            cy.log(text)
            if (text.includes(matchText)) {
                matchIndex = iter
                THIS.getHiddenDeleteParentIcon().eq(matchIndex).children().last().children('[aria-label="Trash"]').click({ force: true }).then(function () {
                    THIS.getDeleteConfirmationButtonSignleMsgDeleteIcon().should('be.visible').click()
                })
                return false
            }
            iter++;
        })

    }

    multipleMessageParams() {

        this.MatchText1 = null;
        this.MatchText2 = null;
        this.MatchText3 = null;
        this.MatchText4 = null;
        this.MatchText5 = null;

    }

    deleteMultipleMessageByCheckBox(params) {

        var THIS = this
        var text1 = null
        var text2 = null
        var text3 = null
        var text4 = null
        var text5 = null

        if (params.MatchText1) { text1 = params.MatchText1 }
        if (params.MatchText2) { text2 = params.MatchText2 }
        if (params.MatchText3) { text3 = params.MatchText3 }
        if (params.MatchText4) { text4 = params.MatchText4 }
        if (params.MatchText5) { text5 = params.MatchText5 }

        this.getMessageList().each(function (ele) {
            var text = ele.text()
            cy.log(text)
            if (text.includes(text1) || text.includes(text2) || text.includes(text3) || text.includes(text4) || text.includes(text5)) {
                THIS.getCheckbox(ele).click({ force: true })
            }
        })

        this.getMultipleCheckDeleteButton().should('be.visible').click().then(function () {
            THIS.getMultipleCheckDeleteConfirmationButton().click()
        })

    }

    verifyMessage(name) {

        var checker = 0
        this.getMessageList().each(function (ele) {
            var text = ele.text()
            cy.log(text)
            if (text.includes(name)) { checker = 1 }
        })

        return checker

    }

}

export default SentPage