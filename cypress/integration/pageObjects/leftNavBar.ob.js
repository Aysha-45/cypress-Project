class LeftNavBar
{
    getAdminTab(){
        return cy.get('[aria-label="admin"]')
    }


    getUserLink(){return cy.get('[ui-sref="tenant-user-management"]')}

    getUserLinkManagerTenant(){
        return cy.get('[ui-sref="user-management"]')
    }

    getMyFilessTab(){
        return cy.get('[aria-label="files"]')
    }

    getComposeMessage(){
        return cy.get('[aria-label="compose"]')
    }

    getInbox(){
        return cy.get('[aria-label="inbox"]')
    }

    getDraftMessage(){
        return cy.get('[aria-label="drafts"]')
    }
    getContacts(){
        return cy.get('[aria-label="contacts"]')
    }

    // Rayeed - Deleted Items
    getDeletedItems(){
        return cy.get('[ui-sref="trash"]').eq(1)
    }

    // Rayeed - Message Deletion
    getInboxTab(){
        return cy.get('[aria-label="inbox"]')
    }
    
    //tuba
    getSentTab(){
        return cy.get('[aria-label="sent"]')
    }


}

export default LeftNavBar