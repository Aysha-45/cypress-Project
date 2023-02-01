class EmailNotificationPage{

    getEmailNotificationTab(){return cy.contains("Email Notification")}
    getResendNotificationButton(){return cy.get('[ui-sref="email-notification.resend"]').contains('Resend failed notifications')}
    getResendButton(){return cy.get('[translate="entity.action.resend"]').contains('Resend')}
    resendEmailNotification(date){
        this.getResendNotificationButton().click()
         cy.get('[class="md-datepicker-input md-input"]')
                .clear({force:true})
                .type(`${date}`)
        cy.wait(2000)
        this.getResendButton().click()
             
        
                
    }
}
export default EmailNotificationPage