
class Helper {


    extractLinkFromEmail(mail,pattern){

        var result
        //var pattern = '"http://192.168.10.245/transit/app/tenant149/link/.*?"';
        var myRegExp = new RegExp(pattern);
        //console.log('my link' + myRegExp);
        var regLink = myRegExp.exec(mail);
        if(regLink != null){
            regLink = regLink.toString().replace(/"/g, '')
            cy.task('log','reg link: ' + regLink);
            result = regLink
            
        }

        return result
    }

}

export default Helper