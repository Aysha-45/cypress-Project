
import LeftNavBar from "../pageObjects/leftNavBar.ob"
import MyFilesPage from "../pageObjects/myFilesPage.ob"
import ApiInvoke from "../helper/api"

var baseUrl = Cypress.env('url')
var tenant = baseUrl + Cypress.env('tenantName') //+ '/'
const serverId = Cypress.env('mailosaureServerId')
const leftNavBar = new LeftNavBar()
const myFilesPage = new MyFilesPage()
const api = new ApiInvoke()
let testData = null



describe('My Files functionality - ' + Cypress.browser.name, function () {

    before(function () {


        if (Cypress.env('live')) {


            baseUrl = Cypress.env('liveUrl')
            tenant = baseUrl + Cypress.env('liveTenant') //+ '/'



            cy.fixture('myFilesFunctionalityLive').then(function (data) {
                testData = data
            })

            cy.visit(tenant)
  



        } else {
            cy.fixture('myFilesFunctionality').then(function (data) {
                testData = data
            })
            cy.visit(tenant)
           


        }




    });

    beforeEach(function () {
        Cypress.Cookies.defaults({ preserve: ['SESSION', 'CSRF-TOKEN'] });
    });

    after(function () {
        cy.clearCookies()
        //cy.logout()
    });

    describe('My files functionality test environment setup - ' + Cypress.browser.name, function () {
        it('Create licensed user', function () {
            cy.visit(tenant).then(function () {
                cy.login(testData.tenantManager.username, testData.tenantManager.password)
                cy.url().should('not.include', 'login')
                cy.task('log', testData.tenantManager.username + " Succesfully Logged in")
            })

            let userArr = testData.createUser.user
            cy.getCookie("CSRF-TOKEN").then((csrf) => {
                userArr.forEach((user,index) => {
                    let userObj = {
                        email: user,
                        passwd: testData.createUser.userPassword,
                        role: 'Recipient',
                        licensed: true,
                        fname:testData.createUser.fname[index],
                        lname:testData.createUser.lname[index]
                    }
                    api.createUser(csrf.value, tenant, userObj).then((res) => {
    
                        if (res.status === 200) {
                            console.log(`${user} created sucessfully`)
                        } else if (res.status === 400) {
                            console.error(`${user} already exists`)
                        } else {
                            console.error(`Other error`)
                        }
    
    
                    })
    
                })
    
    
            });


            // leftNavBar.getAdminTab().click()
            // cy.url().should('include', 'admin')
            // cy.cmdLogResult('Navigated to admin page')

            // leftNavBar.getUserLink().should('be.visible').click({ force: true })


            // userPage.addUser(
            //     true,
            //     testData.createUser.fname,
            //     testData.createUser.lname,
            //     testData.createUser.user,
            //     testData.createUser.userPassword)


            // cy.toastMessageAssert('was created successfully').then(() => {
            //     cy.cmdLogResult('User "' + testData.createUser.user + '" created successfully')
            //     cy.get('.md-toast-text').should('not.be.visible')
            // })


            cy.logout()
            cy.url().should('include', 'login')

        })
    })
    describe('My files functionality test - ' + Cypress.browser.name, function () {

        it(' Create folder, sub folder in my files and upload file', function () {

            cy.visit(tenant).then(function () {
                cy.login(testData.createUser.user[0], testData.createUser.userPassword)
                cy.url().should('not.include', 'login')
                cy.task('log', testData.createUser.user[0] + " Succesfully Logged in")
            })

            cy.cmdLogStep('Go to my files page')
            leftNavBar.getMyFilessTab().click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully navigated to my files page")

            //todo -upload folder




            cy.cmdLogStep('Create a folder')
            myFilesPage.createFolder(
                testData.myFilesFileUpload.newFolderName,
                testData.myFilesFileUpload.folderDescription
            )

            cy.toastMessageAssert("successfully created").then(() => {
                cy.cmdLogResult('Folder created Successfully')
            })

            cy.cmdLogStep('Go to that folder')
            myFilesPage.goToSpecificFolder(testData.myFilesFileUpload.newFolderName)
            cy.reload()
            cy.cmdLogStep('Create a sub-folder')
            myFilesPage.createFolder(
                testData.myFilesFileUpload.subFolderName,
                testData.myFilesFileUpload.folderDescription
            )

            cy.cmdLogStep('Upload file into the folder')
            myFilesPage.uploadFile(testData.myFilesFileUpload.attachedFileLocationMyFiles)

            cy.cmdLogStep('Go to my files page')
            leftNavBar.getMyFilessTab().click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully navigated to my files page")

            cy.wait(3000)

            cy.cmdLogStep('Upload file into the myfiles')
            myFilesPage.uploadFile(testData.myFilesFileUpload.attachedFileLocationMyFiles)
            cy.cmdLogStep('Upload file into myfiles')
            myFilesPage.uploadFile(testData.myFilesFileUpload.attachedFileLocationMyComputer)

            cy.cmdLogStep('Upload file into the myfiles')
            myFilesPage.uploadFile(testData.myFilesFileUpload.attachedFileLocationMyComputer1)



            cy.cmdLogStep('Create another folder in my files')
            myFilesPage.createFolder(
                testData.myFilesFileUpload.subFolderName,
                testData.myFilesFileUpload.folderDescription
            )

            cy.toastMessageAssert("successfully created").then(() => {
                cy.cmdLogResult('Folder created Successfully')
                cy.get('.md-toast-text').should('not.exist')
            })




            cy.cmdLogStep('Upload file in my files')
            myFilesPage.uploadFile(testData.myFilesFileUpload.attachedFileLocationMyFiles)



        });

        it(' Download  as zip', function () {


            cy.cmdLogStep('Go to my files page')
            leftNavBar.getMyFilessTab().click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully navigated to my files page")


            cy.wait(1000)

            myFilesPage.checkSingleItem(testData.myFilesFileUpload.subFolderName)
            cy.cmdLogStep(' Download  as zip')

            cy.download(myFilesPage.getDownloadAsZipButton)
            cy.wait(3000)
            cy.cmdLogResult("Succesfully download as zip")





        });

        it(' Copy file/folder to the sub folder', function () {
           



            cy.cmdLogStep('Go to my files page')
            leftNavBar.getMyFilessTab().click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully navigated to my files page")

            cy.wait(3000)



            var x = testData.myFilesFileUpload.attachedFileLocationMyFiles
            var filename = x.substring(x.lastIndexOf("/") + 1, x.length)
            myFilesPage.checkSingleItem(filename)
            myFilesPage.checkSingleItem(testData.myFilesFileUpload.subFolderName)
            cy.cmdLogStep('Copy that folder to the destination folder-folder 1')
            myFilesPage.getCopyButton().click()
            myFilesPage.selectFolderInWindow(testData.myFilesFileUpload.newFolderName)
            cy.toastMessageAssert('Successfully copied').then(() => {
                cy.cmdLogResult('folder  successfully copied to"' + testData.myFilesFileUpload.newFolderName)
                cy.get('.md-toast-text').should('not.be.visible')
                cy.closeAssert()
            })



        });

        it(' should check the copied file/folder in the sub folder', function () {



            cy.cmdLogStep('Go to my files page')
            leftNavBar.getMyFilessTab().click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully navigated to my files page")


            cy.cmdLogStep('Go to specific folder')
            myFilesPage.goToSpecificFolder(testData.myFilesFileUpload.newFolderName)

            var x = testData.myFilesFileUpload.attachedFileLocationMyFiles
            var filename = x.substring(x.lastIndexOf("/") + 1, x.length)


            myFilesPage.getFilesList().each((value) => {
                var result = value.text()




                if (result.includes(testData.myFilesFileUpload.subFolderName + ' (1)')) {

                    cy.cmdLogStep('Folder that has been copied is  found')



                }

                else {

                    cy.cmdLogStep('Folder that has been copied is not found')


                }



                if (result.includes(filename + ' (1)')) {

                    cy.cmdLogStep('File that has been copied is  found')



                } else {

                    cy.cmdLogStep('File that has been copied is not found')


                }
            })






        })

        it(' Move file/folder to the sub folder', function () {

          


            cy.cmdLogStep('Go to my files page')
            leftNavBar.getMyFilessTab().click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully navigated to my files page")




            var x = testData.myFilesFileUpload.attachedFileLocationMyFiles
            var filename = x.substring(x.lastIndexOf("/") + 1, x.length)
            myFilesPage.checkSingleItem(filename)
            myFilesPage.checkSingleItem(testData.myFilesFileUpload.subFolderName)
            cy.cmdLogStep('Move that folder to the destination folder-folder 1')
            myFilesPage.getMoveButton().click()
            myFilesPage.selectFolderInWindow(testData.myFilesFileUpload.newFolderName)
            cy.toastMessageAssert('Successfully moved').then(() => {
                cy.cmdLogResult('folder  successfully moved to"' + testData.myFilesFileUpload.newFolderName)
                cy.get('.md-toast-text').should('not.be.visible')
            })



        });

        it(' Check the moved file/folder in the sub folder', function () {

            cy.cmdLogStep('Go to my files page')
            leftNavBar.getMyFilessTab().click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully navigated to my files page")


            cy.cmdLogStep('Go to specific folder')
            myFilesPage.goToSpecificFolder(testData.myFilesFileUpload.newFolderName)
            var x = testData.myFilesFileUpload.attachedFileLocationMyFiles
            var filename = x.substring(x.lastIndexOf("/") + 1, x.length)


            myFilesPage.getFilesList().each((value) => {
                var result = value.text()



                if (result.includes(testData.myFilesFileUpload.subFolderName + ' (2)')) {

                    cy.cmdLogStep('Folder that has been moved is  found')



                } else {

                    cy.cmdLogStep('Folder that has been moved is not found')

                }





                if (result.includes(filename + ' (2)')) {

                    cy.cmdLogStep('File that has been moved is  found')



                } else {

                    cy.cmdLogStep('File that has been moved is not found')

                }
            })




        })

        it('Edit,restore,delete version of a file', function () {
            


            cy.cmdLogStep('Go to my files page')
            leftNavBar.getMyFilessTab().click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully navigated to my files page")



            cy.cmdLogStep('check specific file')
            var x = testData.myFilesFileUpload.attachedFileLocationMyComputer1
            var filename = x.substring(x.lastIndexOf("/") + 1, x.length)

            myFilesPage.checkSingleItem(filename)
            cy.cmdLogStep('Go to version history')
            myFilesPage.getVersionHistory().click()

            cy.cmdLogStep('Select specific version')
            myFilesPage.checkSpecificVersion(testData.versionHistory.version1)

            cy.cmdLogStep('Download version 1')
            cy.download(myFilesPage.getVersionHistoryDownloadButton)
            cy.wait(1500)


            //todo-download assertion


            cy.cmdLogStep('Select specific version')
            myFilesPage.checkSpecificVersion(testData.versionHistory.version1)

            cy.cmdLogStep('Edit version 1')
            myFilesPage.editVersionDesc(testData.versionHistory.editVersion)
            cy.toastMessageAssert('File version  successfully updated').then(() => {
                cy.cmdLogResult('File version  successfully updated ')
                cy.get('.md-toast-text').should('not.exist')

            })



            cy.cmdLogStep('Select specific version')
            myFilesPage.checkSpecificVersion(testData.versionHistory.version1)
            cy.cmdLogStep('Restore version 1')
            myFilesPage.getVersionHistoryRestoreButton().click()

            cy.cmdLogResult(' File version  successfully restored ')




            cy.cmdLogStep('Delete permanently')
            myFilesPage.getDeleteButton().click()
            myFilesPage.getDeleteButtonInWindows().click()
            cy.toastMessageAssert("deleted").then(() => {
                cy.cmdLogResult(' File version  successfully deleted ')
                cy.get('.md-toast-text').should('not.exist')

            })

            //version 2
            cy.cmdLogStep('Select specific version')
            myFilesPage.checkSpecificVersion(testData.versionHistory.version2)

            cy.cmdLogStep('Edit version 2')
            myFilesPage.editVersionDesc(testData.versionHistory.editVersion)
            cy.toastMessageAssert('File version  successfully updated').then(() => {
                cy.cmdLogResult('File version  successfully updated ')
                cy.get('.md-toast-text').should('not.exist')

            })


            cy.cmdLogStep('Select specific version')
            myFilesPage.checkSpecificVersion(testData.versionHistory.version2)
            cy.cmdLogStep('Restore version 2')
            myFilesPage.getVersionHistoryRestoreButton().click()

            cy.cmdLogResult(' File version  successfully restored ')




            cy.cmdLogStep('Delete permanently')
            myFilesPage.getDeleteButton().click()
            myFilesPage.getDeleteButtonInWindows().click()
            cy.toastMessageAssert("deleted").then(() => {
                cy.cmdLogResult(' File version deleted successfully  ')
                cy.get('.md-toast-text').should('not.exist')

            })








        })

        it('Clear My Files', function () {

            cy.reload()


            cy.cmdLogStep('Go to my files page')
            leftNavBar.getMyFilessTab().click()
            cy.url().should('include', 'fetchOption=ALL')
            cy.cmdLogResult("Succesfully navigated to my files page")


            //cy.wait(1000)
            cy.cmdLogStep('Check all  folder and files')

            myFilesPage.getFilesList().should('be.visible').then(function () {
                myFilesPage.getAllItemsChecked().click({ force: true })
            })


            cy.cmdLogStep('Delete all  folder and files')
            myFilesPage.getDeleteButton().click({ force: true })
            cy.toastMessageAssert("deleted").then(() => {
                cy.cmdLogResult('My files deleted successfully')

            })

        })
    })





})










