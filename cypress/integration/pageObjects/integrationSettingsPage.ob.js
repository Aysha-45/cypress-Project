class IntegrationSettingsPage {

    getIntegrationsSettingsTab() { return cy.contains("Integrations") }
    getDrobBoxCheckBox(){ return cy.get('[aria-label="Dropbox"]') }
    getOneDriveCheckBox(){ return cy.get('[aria-label="Microsoft OneDrive"]') }
    getBoxCheckBox(){ return cy.get('[aria-label="Box"]') }
    getGoogleDriveCheckBox(){ return cy.get('[aria-label="Google Drive"]') }
    getSaveButton(){ return cy.get('[type="submit"] > span') }



    cloudAccounts() {

        this.dropBox = null;
        this.oneDrive = null;
        this.box = null;
        this.googleDrive = null;

    }

    integrateCloudAccounts(params){
        var THIS = this
        if(params.dropBox === true){
            this.getDrobBoxCheckBox().invoke('attr','aria-checked').then(function(result){
                if(result === 'true'){
                    console.log('Account integration is already enabled')
                }else{
                    THIS.getDrobBoxCheckBox().click()
                    THIS.getDrobBoxCheckBox().should('have.attr', 'aria-checked', 'true')
                }
            })
        }else if(params.dropBox === false){
            this.getDrobBoxCheckBox().invoke('attr','aria-checked').then(function(result){
            if(result === 'false'){
                console.log('Account integration is already disabled')
            }else{
                THIS.getDrobBoxCheckBox().click()
                THIS.getDrobBoxCheckBox().should('have.attr', 'aria-checked', 'false')
            }
        })
        }

        if(params.oneDrive === true){
            this.getOneDriveCheckBox().invoke('attr','aria-checked').then(function(result){
                if(result === 'true'){
                    console.log('Account integration is already enabled')
                }else{
                    THIS.getOneDriveCheckBox().click()
                    THIS.getOneDriveCheckBox().should('have.attr', 'aria-checked', 'true')
                }
            })
        }else if(params.oneDrive === false){
            this.getOneDriveCheckBox().invoke('attr','aria-checked').then(function(result){
            if(result === 'false'){
                console.log('Account integration is already disabled')
            }else{
                THIS.getOneDriveCheckBox().click()
                THIS.getOneDriveCheckBox().should('have.attr', 'aria-checked', 'false')
            }
        })
        }

        if(params.box === true){
            this.getBoxCheckBox().invoke('attr','aria-checked').then(function(result){
                if(result === 'true'){
                    console.log('Account integration is already enabled')
                }else{
                    THIS.getBoxCheckBox().click()
                    THIS.getBoxCheckBox().should('have.attr', 'aria-checked', 'true')
                }
            })
        }else if(params.box === false){
            this.getBoxCheckBox().invoke('attr','aria-checked').then(function(result){
            if(result === 'false'){
                console.log('Account integration is already disabled')
            }else{
                THIS.getBoxCheckBox().click()
                THIS.getBoxCheckBox().should('have.attr', 'aria-checked', 'false')
            }
        })
        }

        if(params.googleDrive === true){
            this.getGoogleDriveCheckBox().invoke('attr','aria-checked').then(function(result){
                if(result === 'true'){
                    console.log('Account integration is already enabled')
                }else{
                    THIS.getGoogleDriveCheckBox().click()
                    THIS.getGoogleDriveCheckBox().should('have.attr', 'aria-checked', 'true')
                }
            })
        }else if(params.googleDrive === false){
            this.getGoogleDriveCheckBox().invoke('attr','aria-checked').then(function(result){
            if(result === 'false'){
                console.log('Account integration is already disabled')
            }else{
                THIS.getGoogleDriveCheckBox().click()
                THIS.getGoogleDriveCheckBox().should('have.attr', 'aria-checked', 'false')
            }
        })
        }

        this.getSaveButton().click()



    }

}
export default IntegrationSettingsPage