class ApiInvoke {
    getUser(path, token) {
        cy.log(csrfToken);
        return cy
            .request({
                method: "GET",
                url: path + "v1/api/crud/user",
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => {
                let userList = [];

                for (var i = 0; i < res.body.length; i++) {
                    //userList.push(res.body[i].email)
                    userList.push({
                        id: res.body[i].id,
                        email: res.body[i].email,
                    });
                }

                return new Promise((resolve) => {
                    resolve(userList);
                });
            });
    }

    createUserOld(csrfToken, path, userArr) {
        cy.log(csrfToken, userArr);
        cy.request({
            method: "GET",
            url: path + "v1/api/crud/user",
            headers: {
                "X-CSRF-TOKEN": csrfToken,
            },
        }).then(function (res) {
            for (var j = 0; j < userArr.length; j++) {
                let found = false;
                for (var i = 0; i < res.body.length; i++) {
                    //console.log(res.body[i].email)
                    if (res.body[i].email === userArr[j]) {
                        found = true;
                        console.log(userArr[j] + " already exists");
                    }
                }

                if (!found) {
                    cy.request({
                        method: "POST",
                        url:
                            Cypress.env("url") +
                            Cypress.env("tenantName") +
                            "/v1/api/crud/user",

                        headers: {
                            "X-CSRF-TOKEN": csrfToken,
                        },

                        body: {
                            // "id":null,
                            // "login":null,
                            // "firstName":null,
                            // "lastName":null,
                            email: userArr[j],
                            activated: true,
                            // "createdBy":null,
                            // "createdDate":null,
                            generatePassword: false,
                            // "lastModifiedBy":null,
                            // "lastModifiedDate":null,
                            licensedUser: true,
                            requirePasswordChange: false,
                            sendNotificationEmail: true,
                            // "authorities":null,
                            roles: ["Recipient"],
                            password: "Nil@vo2006",
                            confirmPassword: "Nil@vo2006",
                        },
                    });
                }
            }
        });

        cy.task("log", "Added user via POST request successfully");
    }

    createUserNew(token, path, user) {
        if (user.roles === "Licensed") {
            user.licensed = true;
        }

        return cy
            .request({
                method: "POST",
                failOnStatusCode: true,
                url: path + "/v1/rest/api/crud/user?",

                headers: {
                    //'X-CSRF-TOKEN': csrfToken
                    Authorization: token,
                },

                body: {
                    " createdBy": null,
                    createdDate: null,
                    firstName: user.fname,
                    id: null,
                    lastModifiedBy: null,
                    lastModifiedDate: null,
                    lastName: user.lname,
                    login: null,
                    email: user.email,
                    activated: true,
                    generatePassword: false,
                    licensedUser: user.licensed,
                    requirePasswordChange: false,
                    sendNotificationEmail: true,
                    roles: [`${user.role}`],
                    password: user.passwd,
                    confirmPassword: user.passwd,
                },
            })
            .then((res) => {
                return res;
            });

        // cy.request({
        //     method: 'GET',
        //     url: path + 'v1/api/crud/user',
        //     headers: {

        //         'X-CSRF-TOKEN': csrfToken
        //     },

        // }).then(function (res) {

        //     for (var j = 0; j < userArr.length; j++) {
        //         let found = false
        //         for (var i = 0; i < res.body.length; i++) {
        //             //console.log(res.body[i].email)
        //             if (res.body[i].email === userArr[j]) {
        //                 found = true
        //                 console.log(userArr[j] + ' already exists')
        //             }
        //         }

        //         if (!found) {
        //             cy.request({
        //                 method: 'POST',
        //                 url: Cypress.env('url') + Cypress.env('tenantName') + '/v1/api/crud/user',

        //                 headers: {

        //                     'X-CSRF-TOKEN': csrfToken
        //                 },

        //                 body: {
        //                     // "id":null,
        //                     // "login":null,
        //                     // "firstName":null,
        //                     // "lastName":null,
        //                     "email": userArr[j],
        //                     "activated": true,
        //                     // "createdBy":null,
        //                     // "createdDate":null,
        //                     "generatePassword": false,
        //                     // "lastModifiedBy":null,
        //                     // "lastModifiedDate":null,
        //                     "licensedUser": true,
        //                     "requirePasswordChange": false,
        //                     "sendNotificationEmail": true,
        //                     // "authorities":null,
        //                     "roles": [
        //                         "Recipient"
        //                     ],
        //                     "password": "Nil@vo2006",
        //                     "confirmPassword": "Nil@vo2006"
        //                 }

        //             })
        //         }
        //     }

        // })

        cy.task("log", "Added user via POST request successfully");
    }

    createUser(csrfToken, path, user) {
        if (user.roles === "Licensed") {
            user.licensed = true;
        }

        return cy
            .request({
                method: "POST",
                failOnStatusCode: true,
                url: path + "/v1/api/crud/user?",

                headers: {
                    "X-CSRF-TOKEN": csrfToken,
                    //'Authorization': token
                },

                body: {
                    //    " createdBy": null,
                    //     "createdDate": null,
                    firstName: user.fname,
                    // "id": null,
                    // "lastModifiedBy": null,
                    // "lastModifiedDate": null,
                    lastName: user.lname,
                    //"login": null,
                    email: user.email,
                    activated: true,
                    generatePassword: false,
                    licensedUser: user.licensed,
                    requirePasswordChange: false,
                    sendNotificationEmail: true,
                    roles: [`${user.role}`],
                    password: user.passwd,
                    confirmPassword: user.passwd,
                },
            })
            .then((res) => {
                return res;
            });

        // cy.request({
        //     method: 'GET',
        //     url: path + 'v1/api/crud/user',
        //     headers: {

        //         'X-CSRF-TOKEN': csrfToken
        //     },

        // }).then(function (res) {

        //     for (var j = 0; j < userArr.length; j++) {
        //         let found = false
        //         for (var i = 0; i < res.body.length; i++) {
        //             //console.log(res.body[i].email)
        //             if (res.body[i].email === userArr[j]) {
        //                 found = true
        //                 console.log(userArr[j] + ' already exists')
        //             }
        //         }

        //         if (!found) {
        //             cy.request({
        //                 method: 'POST',
        //                 url: Cypress.env('url') + Cypress.env('tenantName') + '/v1/api/crud/user',

        //                 headers: {

        //                     'X-CSRF-TOKEN': csrfToken
        //                 },

        //                 body: {
        //                     // "id":null,
        //                     // "login":null,
        //                     // "firstName":null,
        //                     // "lastName":null,
        //                     "email": userArr[j],
        //                     "activated": true,
        //                     // "createdBy":null,
        //                     // "createdDate":null,
        //                     "generatePassword": false,
        //                     // "lastModifiedBy":null,
        //                     // "lastModifiedDate":null,
        //                     "licensedUser": true,
        //                     "requirePasswordChange": false,
        //                     "sendNotificationEmail": true,
        //                     // "authorities":null,
        //                     "roles": [
        //                         "Recipient"
        //                     ],
        //                     "password": "Nil@vo2006",
        //                     "confirmPassword": "Nil@vo2006"
        //                 }

        //             })
        //         }
        //     }

        // })

        cy.task("log", "Added user via POST request successfully");
    }

    createUserTokenBased(token, path, user) {
        if (user.roles === "Licensed") {
            user.licensed = true;
        }

        return cy
            .request({
                method: "POST",
                failOnStatusCode: false,
                url: path + "/v1/rest/api/crud/user?",

                headers: {
                    //'X-CSRF-TOKEN': csrfToken
                    Authorization: token,
                },

                body: {
                    " createdBy": null,
                    createdDate: null,
                    firstName: user.fname,
                    id: null,
                    lastModifiedBy: null,
                    lastModifiedDate: null,
                    lastName: user.lname,
                    login: null,
                    email: user.email,
                    activated: true,
                    generatePassword: false,
                    licensedUser: user.licensed,
                    requirePasswordChange: false,
                    sendNotificationEmail: true,
                    roles: [`${user.role}`],
                    password: user.passwd,
                    confirmPassword: user.passwd,
                },
            })
            .then((res) => {
                return res;
            });
    }

    getParentFolderId(csrfToken, path) {
        return cy
            .request({
                method: "GET",
                failOnStatusCode: false,
                url: path + "/v1/api/crud/folder/nil",

                headers: {
                    "X-CSRF-TOKEN": csrfToken,
                    //'Auhtorization': csrfToken
                },
            })
            .then((res) => {
                return res;
            });
    }

    addFolder(csrfToken, path, folder) {
        return cy
            .request({
                method: "POST",
                failOnStatusCode: false,
                url: path + "/v1/api/crud/folder",

                headers: {
                    "X-CSRF-TOKEN": csrfToken,
                },

                body: {
                    name: folder.name,
                    description: folder.description,
                    parentFolderId: folder.parentFolderId,
                    renameIfExists: true,
                },
            })
            .then((res) => {
                return res;
            });
    }

    addContactOld(csrfToken, path, contact) {
        return cy
            .request({
                method: "POST",
                failOnStatusCode: true,
                url: path + "/v1/api/crud/contact",

                //https://biscomtransit.com/transit/app/tintin6/v1/rest/api/contact/add

                headers: {
                    "X-CSRF-TOKEN": csrfToken,
                },

                body: {
                    company: contact.company,
                    email: contact.email,
                    firstName: contact.firstName,
                    id: null,
                    lastName: contact.lastName,
                    mobile: contact.mobile,
                    type: contact.type,
                },
            })
            .then((res) => {
                return res;
            });
    }

    cookieAuth(path, uname, passwd) {
        return cy
            .request({
                method: "GET",
                failOnStatusCode: true,
                url: path + "/app-info",
            })
            .then((res) => {
                expect(res.status).to.eq(200);

                cy.getCookie("CSRF-TOKEN").then((csrf1) => {
                    return cy
                        .request({
                            method: "POST",
                            failOnStatusCode: true,
                            url: path + "/v1/api/authentication",

                            headers: {
                                "X-CSRF-TOKEN": csrf1.value,
                                "Content-Type":
                                    "application/x-www-form-urlencoded",
                            },

                            body: {
                                j_username: uname,
                                j_password: passwd,
                                "remember - me": false,
                                submit: "Login",
                            },
                        })
                        .then((res) => {
                            expect(res.status).to.eq(200);
                            debugger;
                            cy.request({
                                method: "GET",
                                failOnStatusCode: true,
                                url: path + "/v1/api/account",

                                headers: {
                                    "X-CSRF-TOKEN": csrf1.value,
                                },
                            }).then((response) => {
                                expect(response.status).to.eq(200);
                                console.log(
                                    "Session created in the browser with proper authentication"
                                );
                            });
                        });
                });
            });
    }

    getUserNew(path, token, userType) {
        return cy.request({
            method: "GET",
            url: path + "/v1/rest/api/crud/user",
            failOnStatusCode: false,
            headers: {
                Authorization: token,
            },

            // qs: {
            //     includePendingUsers: true,
            //     page: 1,
            //     //'roles':,
            //     size: 100,
            //     sort: "displayName, asc",
            //     sort: "id",
            //     userType: userType,
            // },
        });
    }

    deleteUser(path, token, userId) {
        cy.request({
            method: 'DELETE', url: path + '/v1/rest/api/crud/user/'+userId,

            headers: {

                Authorization: token
            },

            //body: [elem.id]
        })
    }

    tokenAuthentication(path, username, passwd) {
        let encodedString = Buffer.from(username + ":" + passwd).toString(
            "base64"
        );
        //finalPath = path + '/v1/rest/api/authenticate'

        return cy.request({
            method: "GET",
            failOnStatusCode: false,
            url: path + "/v1/rest/api/authenticate",

            headers: {
                Authorization: "Custom " + encodedString,
            },
        });
    }

    getAccountInformation(path, token) {
        return cy.request({
            method: "GET",
            failOnStatusCode: false,
            url: path + "/v1/rest/api/account",

            headers: {
                Authorization: token,
            },
        });
    }

    uploadFile(
        path,
        token,
        blob,
        trackingId,
        fileName,
        size,
        contentType,
        parentType,
        filePath
    ) {
        // Content type is not rquired for the request header

        const formData = new FormData();

        formData.set("name", fileName);
        formData.set("size", size);
        formData.set("Content-Type", contentType);
        formData.set("createParentWithType", parentType);
        //formData.set('parentFolderId','x04EEgV')
        formData.set("path", filePath);
        formData.set("file", blob, fileName);

        const xhr = new XMLHttpRequest();
        xhr.open(
            "POST",
            path +
                "/v1/rest/api/file-system-entities/upload?trackingId=" +
                trackingId
        );
        xhr.setRequestHeader("Authorization", token);
        //xhr.setRequestHeader('Content-Type','multipart/form-data')
        xhr.send(formData);

        return new Promise((resolve) => {
            xhr.onloadend = function () {
                if (xhr.readyState == XMLHttpRequest.DONE) {
                    resolve(xhr);
                }
            };
        });
    }

    getFileFolderProperties(path, token, id) {
        return cy.request({
            method: "GET",
            failOnStatusCode: false,
            url: path + "/v1/rest/api/file-system-entities/" + id,

            headers: {
                Authorization: token,
            },
        });
    }

    downloadFile(path, token, id) {
        return cy.request({
            method: "GET",
            failOnStatusCode: false,
            url: path + "/v1/rest/api/file-system-entities/" + id + "/download",

            headers: {
                Authorization: token,
            },
        });
    }

    downloadAsZip(path, token, idList, zipTrackingId) {
        return cy.request({
            method: "POST",
            failOnStatusCode: false,
            url:
                path +
                "/v1/rest/api/file-system-entities/download/zip?zipTrackingId=" +
                zipTrackingId,

            headers: {
                Authorization: token,
            },

            body: {
                ids: idList,
            },
        });
    }

    updateFileFolder(path, token, id, payload) {
        return cy.request({
            method: "POST",
            failOnStatusCode: false,
            url: path + "/v1/rest/api/file-system-entities/" + id + "/update",

            headers: {
                Authorization: token,
            },

            body: payload,
        });
    }

    copyFileFolder(path, token, id, payload) {
        return cy.request({
            method: "POST",
            failOnStatusCode: false,
            url: path + "/v1/rest/api/file-system-entities/" + id + "/copy",

            headers: {
                Authorization: token,
            },

            body: payload,
        });
    }

    moveFileFolder(path, token, id, payload) {
        return cy.request({
            method: "POST",
            failOnStatusCode: false,
            url: path + "/v1/rest/api/file-system-entities/" + id + "/move",

            headers: {
                Authorization: token,
            },

            body: payload,
        });
    }

    delteFileFolder(path, token, uploadId) {
        return cy.request({
            method: "DELETE",
            failOnStatusCode: false,
            url: path + "/v1/rest/api/file-system-entities/"+uploadId,

            headers: {
                Authorization: token,
            },
            //api call changed 
           // body: payload,
        });
    }

    listDeletedItems(path, token) {
        return cy.request({
            method: "GET",
            failOnStatusCode: false,
            url: path + "/v1/rest/api/file-system-entities/deleted-items/items",

            headers: {
                Authorization: token,
            },

            qs: {
                page: 1,
                size: 100,
            },
        });
    }

    deleteFileFolderPermaently(path, token, idFile) {
        return cy.request({
            method: "DELETE",
            failOnStatusCode: false,
            url: path + "/v1/rest/api/file-system-entities/deleted-items/"+idFile,

            headers: {
                Authorization: token,
            },

            //body: payload,
        });
    }

    restoreFileFolder(path, token, payload) {
        return cy.request({
            method: "POST",
            failOnStatusCode: false,
            url:
                path +
                "/v1/rest/api/file-system-entities/deleted-items/restore",

            headers: {
                Authorization: token,
            },

            body: payload,
        });
    }

    listFileVersion(path, token, id) {
        return cy.request({
            method: "GET",
            failOnStatusCode: false,
            url: path + "/v1/rest/api/file-system-entities/" + id + "/version",

            headers: {
                Authorization: token,
            },

            qs: {
                page: 1,
                size: 100,
            },
        });
    }

    listFolder(path, token, id) {
        return cy.request({
            method: "GET",
            failOnStatusCode: false,
            url: path + "/v1/rest/api/file-system-entities/" + id + "/items",

            headers: {
                Authorization: token,
            },

            qs: {
                page: 1,
                size: 100
                
            },
        });
    }

    shareFolder(path, token, id, payload) {
        return cy.request({
            method: "POST",
            failOnStatusCode: false,
            url: path + "/v1/rest/api/file-system-entities/" + id + "/share",

            headers: {
                Authorization: token,
            },

            body: payload,
        });
    }

    listInvitation(path, token) {
        return cy.request({
            method: "GET",
            failOnStatusCode: false,
            url: path + "/v1/rest/api/file-system-entities/invitations",

            headers: {
                Authorization: token,
            },

            qs: {
                page: 1,
                size: 100,
                includesSeen: true,
                includeDelete: true,
            },
        });
    }

    acceptInvitaion(path, token, payload) {
        return cy.request({
            method: "POST",
            failOnStatusCode: false,
            url: path + "/v1/rest/api/file-system-entities/invitations/accept",

            headers: {
                Authorization: token,
            },

            body: payload,
        });
    }

    declineInvitaion(path, token, payload) {
        return cy.request({
            method: "POST",
            failOnStatusCode: false,
            url: path + "/v1/rest/api/file-system-entities/invitations/decline",

            headers: {
                Authorization: token,
            },

            body: payload,
        });
    }

    createMessage(path, token, payload) {
        return cy.request({
            method: "POST",
            failOnStatusCode: false,
            url: path + "/v1/rest/api/messages/create-draft",

            headers: {
                Authorization: token,
            },

            body: payload,
        });
    }

    getDraftMessage(path, token, id) {
        return cy.request({
            method: "GET",
            failOnStatusCode: false,
            url: path + "/v1/rest/api/draft-messages/" + id,

            headers: {
                Authorization: token,
            },
        });
    }

    updateDraftMessage(path, token, payload, id) {
        return cy.request({
            method: "PUT",
            failOnStatusCode: false,
            url: path + "/v1/rest/api/draft-messages/" + id,

            headers: {
                Authorization: token,
            },

            body: payload,
        });
    }

    listContacts(path, token) {
        return cy.request({
            method: "GET",
            failOnStatusCode: false,
            url: path + "/v1/rest/api/contacts",

            headers: {
                Authorization: token,
            },

            qs: {
                page: 1,
                size: 100,
            },
        });
    }

    addContact(path, token, payload) {
        return cy.request({
            method: "POST",
            failOnStatusCode: false,
            url: path + "/v1/rest/api/contacts",

            //https://biscomtransit.com/transit/app/tintin6/v1/rest/api/contact/add

            headers: {
                Authorization: token,
            },

            body: payload,
        });
    }

    deleteContact(path, token, contactId) {
        return cy.request({
            method: "DELETE",
            failOnStatusCode: false,
            url: path + "/v1/rest/api/contacts/"+contactId,

            headers: {
                Authorization: token,
            },

          //  body: contactId,
        });
    }

    getContact(path, token, contactId) {
        return cy.request({
            method: "GET",
            failOnStatusCode: false,
            url: path + "/v1/rest/api/contacts/" + contactId,

            headers: {
                Authorization: token,
            },
        });
    }

    updateContact(path, token, payload, contactId) {
        return cy.request({
            method: "PUT",
            failOnStatusCode: false,
            url: path + "/v1/rest/api/contacts/" + contactId,

            headers: {
                Authorization: token,
            },

            body: payload,
        });
    }

    addContactGroup(path, token, payload) {
        return cy.request({
            method: "POST",
            failOnStatusCode: false,
            url: path + "/v1/rest/api/contacts/groups",

            headers: {
                Authorization: token,
            },

            body: payload,
        });
    }

    getContactGroup(path, token, contactGroupId) {
        return cy.request({
            method: "GET",
            failOnStatusCode: false,
            url: path + "/v1/rest/api/contacts/groups/" + contactGroupId,

            headers: {
                Authorization: token,
            },
        });
    }

    updateContactGroup(path, token, payload, contactGroupId) {
        return cy.request({
            method: "PUT",
            failOnStatusCode: false,
            url: path + "/v1/rest/api/contacts/groups/" + contactGroupId,

            headers: {
                Authorization: token,
            },

            body: payload,
        });
    }

    sendMessage(path, token, payload) {
        return cy.request({
            method: "POST",
            failOnStatusCode: false,
            url: path + "/v1/rest/api/messages/send",

            headers: {
                Authorization: token,
            },

            body: payload,
        });
    }

    listMessageThreads(path, token, type, qs) {
        return cy.request({
            method: "GET",
            failOnStatusCode: false,
            url: path + "/v1/rest/api/messages/threads/" + type,

            headers: {
                Authorization: token,
            },
            

            //qs: qs,
        });
    }

    deleteMessageThreads(path, token, type, payload) {
        return cy.request({
            method: "DELETE",
            failOnStatusCode: false,
            url: path + "/v1/rest/api/messages/threads/" + type+"/"+payload,

            headers: {
                Authorization: token,
            },

            //body: payload,
        });
    }

    deleteMessageThreadsPermanently(path, token, payload) {
        return cy.request({
            method: "DELETE",
            failOnStatusCode: false,
            url: path + "/v1/rest/api/messages/threads/deleted-items"+ "/" + payload,

            headers: {
                Authorization: token,
            },

            //body: payload,
        });
    }

    restoreMessageThread(path, token, payload) {
        return cy.request({
            method: "POST",
            failOnStatusCode: false,
            url: path + "/v1/rest/api/messages/threads/deleted-items/restore",

            headers: {
                Authorization: token,
            },

            body: payload,
        });
    }

    restoreMessage(path, token, payload) {
        return cy.request({
            method: "POST",
            failOnStatusCode: false,
            url: path + "/v1/rest/api/messages/restore",

            headers: {
                Authorization: token,
            },

            body: payload,
        });
    }

    replyMessage(path, token, messageId,payload) {
        return cy.request({
            method: "POST",
            failOnStatusCode: false,
            url: path + "/v1/rest/api/messages/"+messageId+"/create-draft-reply",

            headers: {
                Authorization: token,
            },
            //body: payload

        });
    }

    replyAllMessage(path, token, messageId,payload) {
        return cy.request({
            method: "POST",
            failOnStatusCode: false,
            url: path + "/v1/rest/api/messages/"+messageId+"/create-draft-reply-all",

            headers: {
                Authorization: token,
            },
            //body: payload

        });
    }

    listMessages(path, token, type, threadId,qs) {
        return cy.request({
            method: "GET",
            failOnStatusCode: false,
            url: path + "/v1/rest/api/messages/threads/" + type + "/" + threadId + "/messages",

            headers: {
                Authorization: token,
            },

            //qs: qs
        });
    }

    listMessageActivities(path, token, messageId) {
        return cy.request({
            method: "GET",
            failOnStatusCode: false,
            url: path + "/v1/rest/api/messages/"+ messageId + "/history",

            headers: {
                Authorization: token,
            }

            
        });
    }

    forwardMessage(path, token, messageId,payload) {
        return cy.request({
            method: "POST",
            failOnStatusCode: false,
            url: path + "/v1/rest/api/messages/"+messageId+"/create-draft-forward",

            headers: {
                Authorization: token,
            },
            //body: payload

        });
    }

    deleteMessages(path, token, type, payload) {
        return cy.request({
            method: "DELETE",
            failOnStatusCode: false,
            url: path + "/v1/rest/api/messages/" + type+ "/"+ payload,

            headers: {
                Authorization: token,
            },

           // body: payload,
        });
    }

    deleteMessagesPermanently(path, token, payload) {
        return cy.request({
            method: "DELETE",
            failOnStatusCode: false,
            url: path + "/v1/rest/api/messages/deleted-items"+"/"+ payload,

            headers: {
                Authorization: token,
            },

           // body: payload,
        });
    }

    markMessagesAsRead(path, token, payload) {
        return cy.request({
            method: "POST",
            failOnStatusCode: false,
            url: path + "/v1/rest/api/messages/mark-as-read",

            headers: {
                Authorization: token,
            },

            body: payload,
        });
    }

    generateUUID() {
        // Public Domain/MIT
        var d = new Date().getTime(); //Timestamp
        var d2 =
            (typeof performance !== "undefined" &&
                performance.now &&
                performance.now() * 1000) ||
            0; //Time in microseconds since page-load or 0 if unsupported
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
            /[xy]/g,
            function (c) {
                var r = Math.random() * 16; //random number between 0 and 16
                if (d > 0) {
                    //Use timestamp until depleted
                    r = (d + r) % 16 | 0;
                    d = Math.floor(d / 16);
                } else {
                    //Use microseconds since page-load if supported
                    r = (d2 + r) % 16 | 0;
                    d2 = Math.floor(d2 / 16);
                }
                return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
            }
        );
    }

    findByMatchingProperties(set, properties) {
        return set.filter(function (entry) {
            return Object.keys(properties).every(function (key) {
                return entry[key] === properties[key];
            });
        });
    }

    parseFile(file, callback) {
        var fileSize = file.size;
        var chunkSize = 16 * 327680; // bytes
        var offset = 0;
        var self = this; // we need a reference to the current object
        var chunkReaderBlock = null;

        var readEventHandler = function (evt) {
            if (evt.target.error == null) {
                offset += evt.target.result.length;
                callback(evt.target.result); // callback for handling read chunk
            } else {
                console.log("Read error: " + evt.target.error);
                return;
            }
            if (offset >= fileSize) {
                console.log("Done reading file");
                return;
            }

            // of to the next chunk
            chunkReaderBlock(offset, chunkSize, file);
        };

        chunkReaderBlock = function (_offset, length, _file) {
            var r = new FileReader();
            var blob = _file.slice(_offset, length + _offset);
            r.onload = readEventHandler;
            r.readAsText(blob);
        };

        // now let's start the read with the first block
        chunkReaderBlock(offset, chunkSize, file);
    }
}
export default ApiInvoke;
