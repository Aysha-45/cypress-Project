class ServerInformationPage
{
    getVersion(){
        return cy.get('div[class="md-list-item-text c-send"]')
    }

}
export default ServerInformationPage