class MyFilesPage {

    getAddFolderButton() { return cy.get('a.md-primary > span') }
    getUploadButton(){return cy.get('[ng-show="vm.uploadAvailable()"]')}
    getFilesButton(){return cy.get('[ng-click="showFileExplorer()"]')}
    getSubmitButton(){return cy.get('[ng-click="vm.submit()"]').contains('Upload')}
    getFolderName() { return cy.get('#name') }
    getFolderDescription() { return cy.get('#field_description') }
    getSaveButton() { return cy.get('[type="submit"] > span') }
    getSendOptionSingleFileCheck() { return cy.get('[ng-show="vm.sendAvailable()"]') }

    //getAllItemsChecked() { return cy.get('[ng-model="vm.checkAll"]') }

    getAllItemsChecked(){ return cy.get('[ng-click="vm.checkAllClicked()"]') }
    

    getDeleteButton() { return cy.get('[ng-click="vm.goToDelete()"]').first() }

    getFilesList() { return cy.get('[ng-mouseover="vm.viewItem(file)"]') }
    getVersionsList() { return cy.get('[ ng-mouseenter="vm.viewItem(item)"]') }
    getCheckboxForVersion(ele){ return cy.get(ele).children('[ ng-click="vm.selectItem(item)"]') }
  

    getCheckbox(ele) { return cy.get(ele).children('[ng-click="vm.selectItem(file, false, $event, $index)"]',{timeout:10000}) }
    
    getDownloadAsZipButton() { return cy.get('[ng-click="vm.downloadAsZIP(vm.getItems())"]')}
    //.contains('Download as Zip') 

    getEditDescriptionOption() { return cy.get('[ng-show="vm.editAvailable()"]').contains('Edit Description') }

    getPropertiesOption() { return cy.get('[ng-show="vm.viewPropertiesAvailable()"]') }
    
    
    getCopyButton(){ return cy.get('[ng-click="vm.copy()"]') }
    getMoveButton(){ return cy.get('[ng-click="vm.move()"]') }
    getSelectButtonInWindows(){ return cy.get('[translate="entity.action.move"]') }
    


    getVersionHistory(){ return cy.get('[ng-click="vm.goToVersions()"]') }
    getVersionHistoryDownloadButton(){return cy.get('[ng-click="vm.download(vm.file, vm.list.currentItem)"]')}
    getVersionHistoryRestoreButton(){return cy.get('[ng-click="vm.restoreVersion(vm.list.currentItem)"]')}
    getVersionHistoryEditButton(){return cy.get('[ng-hide="vm.list.totalChecked() > 1"]').last()}
    getEditVersionDescription() { return cy.get('#field_description') }
    getDeleteButtonInWindows(){ return cy.get('[ng-click="vm.confirmDelete()"]')}
        
    
    


    createFolder(folderName, folderDesription) {

        this.getAddFolderButton().click({ timeout: 20000 })
        cy.wait(2000)
        this.getFolderName().click({force:true}).type(folderName)
        this.getFolderDescription().type(folderDesription)
        this.getSaveButton().click()

    }

    goToSpecificFolder(folderName) {
        return cy.get('span[ng-bind-html="file.name | highlight: \'name\':file.$trackingId"]', { timeout: 10000 }).contains(folderName).click({ force : true})
    }
    


    uploadFile(fileName){
        this.getUploadButton().click()
        this.getFilesButton().click()

        cy.cmdLogStep('Attach file')
        cy.upload(fileName)
        cy.attachmentAssert(fileName)
        cy.cmdLogResult('Attached file successfully')
        
        this.getSubmitButton().click()
        cy.uploadAssert('Completed')

        cy.cmdLogResult('File uploaded successfully')
    }

    searchAndGo(folderName) {
        cy.get('[ng-model="vm.search.searchText"]').first().type(folderName).type('{enter}')
    
    
        //Go to that folder and create subfolder
    
        cy.get('[ng-click="vm.clearSearch()"]', { timeout: 10000 }).should('be.visible');
        return cy.get('md-list-item[ng-mouseover="vm.viewItem(file)"]').contains(folderName).click({ force: true })
    }

    searchItem(name) { cy.get('[ng-model="vm.search.searchText"]').first().type(name).type('{enter}') }

    deleteSingleItem(name){

        var THIS = this
        var nameMatch = name + ' ' + name

        this.getFilesList().each(function(ele){
            var text = ele.text()
            cy.log(text)
            if(text.includes(nameMatch)){
                THIS.getCheckbox(ele).click({ force : true })
                THIS.getDeleteButton().click({ force : true })

                return false
            }
        })

    }


    // TO DO - Fix this ...

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
    
    
    

    checkSingleItem(name) {

        var THIS = this
        var nameMatch = name + ' ' + name

        this.getFilesList().each(function(ele){
            var text = ele.text()
            cy.log(text)
            if(text.includes(nameMatch)){
                cy.wait(2000)
                THIS.getCheckbox(ele).click({force:true}).should('have.attr', 'aria-checked', 'true')
                return false
            }
        })

    }
    clickSpecificFolder(name){
        var i=0
        this.getFilesList().each(function(ele){
            var text = ele.text()
            
            cy.log(text)
            if(text.includes(name)){
                cy.get('[ng-show="!file.shareRoot"]').eq(i).click({ force: true })
              //  THIS.cy.get('md-list-item[ng-mouseover="vm.viewItem(file)"]', { timeout: 10000 }).contains(folderName).click({ force: true })
                return false
            }
            i++
        })
    }
    checkSpecificVersion(name) {

        var THIS = this
        //var nameMatch = name + ' ' + name

        this.getVersionsList().each(function(ele){
            var text = ele.text()
            cy.log(text)
            if(text.includes(name)){
                THIS.getCheckboxForVersion(ele).click({ force : true })
                return false
            }
        })

    }
    //for copying folders that are under home folder
    selectFolderInWindow(name){
        cy.get('span[class="name no-selection global-text-title tree-view-text"]').contains(name).click()
       this.getSelectButtonInWindows().click({force:true})

   }
    editVersionDesc(desc){
       this.getVersionHistoryEditButton().click()
       this.getEditVersionDescription().clear().type(desc)
       this.getSaveButton().click()

   }
   
   

   
  


    // Rayeed - Share
    getFolderPath() { return cy.get('[class="breadcrumb-margin layout-align-start-center layout-row"]') }

    // navigate between folders using path
    navigateBetweenFolders(folderName) { this.getFolderPath().children().contains(folderName).click({ force : true}) }

    // TO DO
    shareFolderByHiddenShareIcon(folderName) {}

    shareFolderParams() {
        this.folderName = null ;
        this.recipient1 = null ;
        this.recipient2 = null ;
        this.recipient3 = null ;
        this.recipient4 = null ;
        this.role = null ;
        this.note = null ;
    }
    

    shareFolderByCheckBox(params) {

        this.openShareWindowSpecificFolder(params.folderName)
        this.clearRecipientField()
        if(params.recipient1) { this.setRecipient(params.recipient1) }
        if(params.recipient2) { this.setRecipient(params.recipient2) }
        if(params.recipient3) { this.setRecipient(params.recipient3) }
        if(params.recipient4) { this.setRecipient(params.recipient4) }
        if(params.note) { this.setNote(params.note)}

        if(params.role == "Editor") { this.setRole() }
        this.getShareButton().click({ force : true })

    }

    getShareOptionAfterCheck() { return cy.get('[ng-click="vm.share(vm.list.currentItem, $event)"]') }

    getRecipientEmailFieldShareFolder() { return cy.get('[md-item-text="item.email"]') }

    getRoleSelectButtonShareFolder() { return cy.get('[class="md-select-value"]').children('[class="md-select-icon"]').first() }

    getUserEditorRoleShareFolder() { return cy.get('[value="Editor"]').last().should('be.visible') }

    getNoteFieldShareFolder() { return cy.get('[ng-model="vm.inviteMessage"]') }

    getShareButton() { return cy.get('[ng-click="vm.share()"]').first() }

    clearRecipientField() { return this.getRecipientEmailFieldShareFolder().clear() }

    setRecipient(recipientEmail) { this.getRecipientEmailFieldShareFolder().type(recipientEmail).type('{enter}') }

    setRole() {
        var THIS = this
        this.getRoleSelectButtonShareFolder().click().then(function() {
            THIS.getUserEditorRoleShareFolder().click({ force : true })
        })
    }

    setNote(note) { this.getNoteFieldShareFolder().clear().type(note) }

    getCollaboratorsList() { return cy.get('[ng-repeat="item in vm.list track by $index"]') }

    openShareWindowSpecificFolder(folder) {
        
        var THIS = this
        var nameMatch = folder + ' ' + folder

        this.getFilesList().each(function(ele){
            var text = ele.text()
            cy.log(text)
            if(text.includes(nameMatch)){
                cy.wait(2000)
                THIS.getCheckbox(ele).click({force:true}).should('have.attr', 'aria-checked', 'true')
                THIS.getShareOptionAfterCheck().should('be.visible').click({ force : true })

                return false
            }
        })
    }

    getShareWindowCloseButton() { return cy.get('[translate="bsendApp.share.close"]') }

    verifyFolderShareFromShareWindow(folderName, userName, userRole) {

        this.openShareWindowSpecificFolder(folderName)
        var matchUserRole = 'Owner' + userRole + 'Viewer' + 'Editor'

        this.getCollaboratorsList().each(function(ele) { 
            var text = ele.text()
            cy.log(text)
            if(text.includes(userName) && text.includes(matchUserRole)) { 
                cy.log("Found")
                cy.cmdLogResult("Folder Sharing/Rejoin is Verified for this User")

                return false
            }
        })
        this.getShareWindowCloseButton().should('be.visible').click()

    }

    verifyFolderUnsubscriptionFromShareWindow(folderName, userName, userRole) {

        this.openShareWindowSpecificFolder(folderName)
        var matchUserRole = 'Owner' + userRole + 'Viewer' + 'Editor'

        this.getCollaboratorsList().each(function(ele) { 
            var text = ele.text()
            cy.log(text)
            if(text.includes(userName) && text.includes(matchUserRole) && text.includes("Unsubscribed")) { 
                cy.log("Found")
                cy.cmdLogResult("Folder Unsubscription is Verified for this User")

                return false
            }
        })
        this.getShareWindowCloseButton().should('be.visible').click()

    }

    // checkSingleItem(name) {

    //     var THIS = this
    //     var nameMatch = name + ' ' + name

    //     this.getFilesList().each(function(ele){
    //         var text = ele.text()
    //         cy.log(text)
    //         if(text.includes(nameMatch)){
    //             THIS.getCheckbox(ele).click({ force : true })
    //             return false
    //         }
    //     })

    // }

    getDownloadButtonSingleFileCheck() { return cy.get('[ng-show="vm.downloadAvailable()"]') }

    // getMoveButton() { return cy.get('[ng-click="vm.move()"]') }

    // getCopyButton() { return cy.get('[ng-click="vm.copy()"]') }

    downloadSingleFile(fileName) {
        var THIS = this
        var nameMatch = fileName + ' ' + fileName

        this.getFilesList().each(function(ele){
            var text = ele.text()
            cy.log(text)
            if(text.includes(nameMatch)){
                THIS.getCheckbox(ele).click({ force : true }).then(function(){
                    // THIS.getDownloadButtonSingleFileCheck().should('exist').click({ force : true})
                    cy.download(THIS.getDownloadButtonSingleFileCheck)
                })
                return false
            }
        })
    }

    downloadAsZIPSingleItem(name) {
        var THIS = this
        var nameMatch = name + ' ' + name

        this.getFilesList().each(function(ele){
            var text = ele.text()
            cy.log(text)
            if(text.includes(nameMatch)){
                THIS.getCheckbox(ele).click({ force : true }).then(function(){
                    // THIS.getDownloadButtonSingleFileCheck().should('exist').click({ force : true})
                    cy.download(THIS.getDownloadAsZipButton)
                })
                return false
            }
        })
    }

    getRenameOption() { return cy.get('[ng-show="vm.editAvailable()"]').contains('Rename') }

    getItemNameField() { return cy.get('[ng-model="vm.file.name"]') }

    getNameSaveButton() { return cy.get('[ng-click="vm.save()"]') }

    renameSingleItem(name, newName) { 
        var THIS = this
        this.checkSingleItem(name)
        this.getRenameOption().click({ force : true }).then(function() { 
            THIS.getItemNameField().clear().type(newName)
            THIS.getNameSaveButton().should('be.visible').click()
        })
            
    }

    getUnsubscribeOption() { return cy.get('[ng-click="vm.goToDelete()"]').contains('Unsubscribe')}

    unsubscribeFolder(name)
    {
        this.checkSingleItem(name)
        cy.wait(3000)
        this.getUnsubscribeOption().scrollIntoView().click({force : true })        
    }

    getSharingOption() { return cy.get('[translate="bsendApp.file.manage"]') }

    getUnsubscribedFoldersOptionFromSharing() { return cy.get('[translate="bsendApp.share.menu.unsubscribedFolders"]') }

    getFoldersListFromShareWindow() { return cy.get('[class="dialog-list-item layout-align-start-center layout-row"]') }

    getCheckboxFromShareWindow(ele) { return cy.get(ele).children('[ng-model="item.checked"]') }  

    getRejoinButton() { return cy.get('[ng-click="vm.rejoinUnsubscribedFolders()"]') }

    checkSpecificItemFromShareWindow(name)
    {
        var THIS = this        
        this.getFoldersListFromShareWindow().each(function(ele) { 
            var text = ele.text()
            cy.log(text)
            if(text.includes(name))
            {
                cy.log("X")
                THIS.getCheckboxFromShareWindow(ele).click()
            }
        })        
    }

    rejoinUnsubscribedFolder(name)
    {
        var THIS = this
        this.getSharingOption().should('be.visible').click().then(function() {
            THIS.getUnsubscribedFoldersOptionFromSharing().should('be.visible').click()
        })
        this.checkSpecificItemFromShareWindow(name)
        this.getRejoinButton().should('be.visible').click()
    }

    acceptButtonHomePopup() { return cy.get('[translate="bsendApp.share.accept"]').contains('Accept') }

}

export default MyFilesPage