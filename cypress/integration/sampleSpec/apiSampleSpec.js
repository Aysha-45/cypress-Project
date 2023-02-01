/// <reference types="Cypress" />

import ApiInvoke from "../helper/api";
var baseUrl = Cypress.env("url");
var tenant = baseUrl + Cypress.env("tenantName");
var baseUrlLive = Cypress.env("liveUrl");
var tenantLive = baseUrlLive + Cypress.env("liveTenant");
const serverId = Cypress.env("mailosaureServerId");

const api = new ApiInvoke();
let testData = null;

//import testData from "../../fixtures/composeMessage.json"

describe("Transit API test", function () {
    before(function () {
        cy.fixture("apiTest").then(function (data) {
            testData = data;
        });
    });

    describe.skip("Example", () => {
        it("Get user list", () => {
            cy.getCookie("CSRF-TOKEN").then((csrf) => {
                api.getUser(csrf.value, tenant).then((m) => {
                    console.log("User list " + JSON.stringify(m));

                    // for (var key in m[0]){
                    //     console.log( key + ": " + m[0][key]);
                    // }
                    for (var i in m) {
                        console.log(m[i].email);
                        for (var key in m[i]) {
                            console.log(key + ": " + m[i][key]);
                        }
                    }
                });
            });
        });
        it("Create user if exists continue", () => {
            let userArr = [
                testData.recipient,
                testData.recipientTwo,
                // testData.recipientTwo,
                // testData.recipientThree,
                // testData.recipientFour
            ];

            cy.getCookie("CSRF-TOKEN").then((csrf) => {
                userArr.forEach((user) => {
                    let userObj = {
                        email: user,
                        passwd: testData.password,
                        role: "Recipient",
                        licensed: false,
                    };
                    api.createUser(csrf.value, tenant, userObj).then((res) => {
                        if (res.status === 200) {
                            console.log(`${user} created sucessfully`);
                        } else if (res.status === 400) {
                            console.error(`${user} already exists`);
                        } else {
                            console.error(`Other error`);
                        }
                    });
                });
            });
        });

        it("Create folder and upload file", () => {
            cy.getCookie("CSRF-TOKEN").then((csrf) => {
                api.getParentFolderId(csrf.value, tenant)
                    .then((res) => {
                        expect(res.status).to.eq(200);
                        console.log("ParentFolderID: " + res.body.id);
                        return res.body.id;
                    })
                    .then((pFid) => {
                        let folderObj = {
                            name: "API-Folder",
                            description: "Folder created via api call",
                            parentFolderId: pFid,
                        };

                        api.addFolder(csrf.value, tenant, folderObj).then(
                            (res) => {
                                expect(res.status).to.eq(200);
                                console.log("folder created");
                            }
                        );
                    });
            });
        });

        it("Add contact", () => {
            cy.getCookie("CSRF-TOKEN").then((csrf) => {
                let payload = {
                    company: "contac",
                    email: "sarja10@nilavo.com",
                    firstName: "Asif",
                    id: null,
                    lastName: "Sarja",
                    mobile: "01726 369769",
                    type: "ContactUser",
                };
                api.addContactOld(csrf.value, tenant, payload).then((res) => {
                    if (res.status === 200) {
                        console.log(`${payload.email} added sucessfully`);
                    } else if (res.status === 400) {
                        console.error(`${payload.email} already exists`);
                    } else {
                        console.error(`Other error`);
                    }
                });
            });
        });

        it("session auth", () => {
            api.cookieAuth(tenant, "sarja2@nilavodev.com", "Nil@vo2006").then(
                (res) => {
                    console.log("mewao");
                    console.log("hahah " + res.headers.value);

                    cy.getCookie("CSRF-TOKEN").then((csrf) => {
                        let payload = {
                            company: "contac",
                            email: "sarja12340@nilavo.com",
                            firstName: "Asif",
                            id: null,
                            lastName: "Sarja",
                            mobile: "01726 369769",
                            type: "ContactUser",
                        };
                        api.addContact(csrf.value, tenant, payload).then(
                            (res) => {
                                if (res.status === 200) {
                                    console.log(
                                        `${payload.email} added sucessfully`
                                    );
                                } else if (res.status === 400) {
                                    console.error(
                                        `${payload.email} already exists`
                                    );
                                } else {
                                    console.error(`Other error`);
                                }
                            }
                        );
                    });

                    //cy.getCookie("CSRF-TOKEN").then(val=>console.log('csrf ' + val.value))
                }
            );
        });

        it("auth", () => {
            api.cookieAuth(tenant, "sarja2@nilavodev.com", "Nil@vo2006");
        });

        it("Delete user", () => {
            var userId = [];

            cy.visit(tenant).then(function () {
                //cy.cmdLogStep('Log in as sender user ' + testData.userNameSender)
                cy.login("sarja2@nilavodev.com", "Nil@vo2006");
                cy.url().should("not.include", "login");
                // cy.cmdLogResult(testData.userNameSender + " Succesfully Logged in")
            });

            //api.cookieAuth(tenant, 'sarja2@nilavodev.com', 'Nil@vo2006').then(()=>{
            cy.getCookie("CSRF-TOKEN").then((csrf) => {
                console.log("hahahah" + csrf.value);
                cy.request({
                    method: "GET",
                    url: tenant + "/v1/api/crud/user?",

                    headers: {
                        "X-CSRF-TOKEN": csrf.value,
                    },

                    qs: {
                        includePendingUsers: true,
                        page: 1,
                        //'roles':,
                        size: 100,
                        sort: "displayName, asc",
                        sort: "id",
                        userType: "Licensed",
                    },
                }).then((response) => {
                    console.log("wait");

                    response.body.forEach((elem) => {
                        if (elem.email != "sarja1@nilavodev.com") {
                            cy.request({
                                method: "POST",
                                url: tenant + "/v1/api/crud/user/delete?",

                                headers: {
                                    "X-CSRF-TOKEN": csrf.value,
                                },

                                body: [elem.id],
                            });
                        }
                    });
                });

                // });
            });

            cy.getCookie("CSRF-TOKEN").then((csrf) => {
                console.log("hahahah" + csrf.value);
                cy.request({
                    method: "GET",
                    url: tenant + "/v1/api/crud/user?",

                    headers: {
                        "X-CSRF-TOKEN": csrf.value,
                    },

                    qs: {
                        includePendingUsers: true,
                        //'roles':,
                        size: 100,
                        sort: "displayName, asc",
                        sort: "id",
                        userType: "External",
                    },
                }).then((response) => {
                    console.log("wait");

                    response.body.forEach((elem) => {
                        if (elem.email != "sarja1@nilavodev.com") {
                            cy.request({
                                method: "POST",
                                url: tenant + "/v1/api/crud/user/delete?",

                                headers: {
                                    "X-CSRF-TOKEN": csrf.value,
                                },

                                body: [elem.id],
                            });
                        }
                    });
                });

                // });
            });

            //cy.getCookie("CSRF-TOKEN").then(val=>console.log('csrf ' + val.value))
        });

        it("Delete user live account", () => {
            var userId = [];

            cy.visit(tenantLive).then(function () {
                //cy.cmdLogStep('Log in as sender user ' + testData.userNameSender)
                cy.login("sarja1.wxcydow8@mailosaur.io", "Nil@vo2006");
                cy.url().should("not.include", "login");
                // cy.cmdLogResult(testData.userNameSender + " Succesfully Logged in")
            });

            //api.cookieAuth(tenant, 'sarja2@nilavodev.com', 'Nil@vo2006').then(()=>{
            cy.getCookie("CSRF-TOKEN").then((csrf) => {
                console.log("hahahah" + csrf.value);
                cy.request({
                    method: "GET",
                    url: tenantLive + "/v1/api/crud/user?",

                    headers: {
                        "X-CSRF-TOKEN": csrf.value,
                    },

                    qs: {
                        includePendingUsers: true,
                        page: 1,
                        //'roles':,
                        size: 100,
                        sort: "displayName, asc",
                        sort: "id",
                        userType: "Licensed",
                    },
                }).then((response) => {
                    console.log("wait");
                    var x = 0;
                    response.body.forEach((elem) => {
                        if (
                            elem.email != "sarja@nilavo.com" &&
                            elem.email != "abir@nilavo.com" &&
                            elem.email != "arman@nilavo.com" &&
                            elem.email != "porag@nilavo.com" &&
                            elem.email != "rayeed@nilavo.com" &&
                            elem.email != "tuba@nilavo.com" &&
                            elem.email != "srahman@biscom.com" &&
                            elem.email != "aemery@biscom.com" &&
                            elem.email != "sarja1.wxcydow8@mailosaur.io"
                        ) {
                            x = x + 1;
                            cy.log(x);
                            cy.request({
                                method: "POST",
                                url: tenantLive + "/v1/api/crud/user/delete?",

                                headers: {
                                    "X-CSRF-TOKEN": csrf.value,
                                },

                                body: [elem.id],
                            });
                        }
                    });
                });

                // });
            });

            cy.getCookie("CSRF-TOKEN").then((csrf) => {
                console.log("hahahah" + csrf.value);
                cy.request({
                    method: "GET",
                    url: tenantLive + "/v1/api/crud/user?",

                    headers: {
                        "X-CSRF-TOKEN": csrf.value,
                    },

                    qs: {
                        includePendingUsers: true,
                        page: 1,
                        //'roles':,
                        size: 100,
                        sort: "displayName, asc",
                        sort: "id",
                        userType: "External",
                    },
                }).then((response) => {
                    console.log("wait");
                    var y = 0;
                    response.body.forEach((elem) => {
                        if (
                            elem.email != "sarja@nilavo.com" &&
                            elem.email != "abir@nilavo.com" &&
                            elem.email != "arman@nilavo.com" &&
                            elem.email != "porag@nilavo.com" &&
                            elem.email != "rayeed@nilavo.com" &&
                            elem.email != "tuba@nilavo.com" &&
                            elem.email != "srahman@biscom.com" &&
                            elem.email != "aemery@biscom.com" &&
                            elem.email != "sarja1.wxcydow8@mailosaur.io"
                        ) {
                            y = y + 1;
                            cy.log(y);
                            cy.request({
                                method: "POST",
                                url: tenantLive + "/v1/api/crud/user/delete?",

                                headers: {
                                    "X-CSRF-TOKEN": csrf.value,
                                },

                                body: [elem.id],
                            });
                        }
                    });
                });

                // });
            });

            //cy.getCookie("CSRF-TOKEN").then(val=>console.log('csrf ' + val.value))
        });

        it("Create user ", () => {
            api.tokenAuthentication(
                "sarja2@nilavodev.com",
                "Nil@vo2006",
                tenant
            ).then((token) => {
                let userArr = testData.createUser.user;
                let userRoles = testData.createUser.roles;
                userArr.forEach((user, index) => {
                    let userObj = {
                        email: user,
                        passwd: testData.passwd,
                        role: userRoles[index],
                        licensed: true,
                    };
                    api.createUser(token, tenant, userObj).then((res) => {
                        if (res.status === 200) {
                            console.log(`${user} created sucessfully`);
                        } else if (res.status === 400) {
                            console.error(`${user} already exists`);
                        } else {
                            console.error(`Other error`);
                        }
                    });
                });
            });
        });
        it("Delete licensed and external user except sarja2@nilavodev.com", () => {
            api.tokenAuthentication(
                "sarja2@nilavodev.com",
                "Nil@vo2006",
                tenant
            ).then((token) => {
                console.log("Bearer token: " + token);
                api.getUser(tenant, token, "Licensed").then((userList) => {
                    userList.body.forEach((elem) => {
                        if (elem.email != "sarja2@nilavodev.com") {
                            api.deleteUser(tenant, token, elem.id);
                        }
                    });
                });
                api.getUser(tenant, token, "External").then((userList) => {
                    userList.body.forEach((elem) => {
                        if (elem.email != "sarja2@nilavodev.com") {
                            api.deleteUser(tenant, token, elem.id);
                        }
                    });
                });
            });
        });

        it("Delete user live except sarja2@nilavodev.com", () => {
            api.tokenAuthentication(
                "sarja2@nilavodev.com",
                "Nil@vo2006",
                tenant
            ).then((token) => {
                console.log("Bearer token: " + token);
                api.getUser(tenant, token, "Licensed").then((userList) => {
                    userList.body.forEach((elem) => {
                        if (elem.email != "sarja2@nilavodev.com") {
                            api.deleteUser(tenant, token, elem.id);
                        }
                    });
                });
            });
        });
    });

    describe("Preapre env", () => {
        it.skip("Delte all contact", () => {
            let payload = {
                company: "company",
                email: "sarja11@nilavo.com",
                firstName: "Asif",
                lastName: "Sarja",
                mobile: "01726 369769",
            };

            api.tokenAuthentication(
                tenant,
                testData.tenantManager,
                testData.password
            )
                .then((response) => {
                    expect(response.status).eq(200);
                    let bearerToken = response.headers.authorization;
                    console.log(bearerToken);
                    return bearerToken;
                })
                .then((token) => {
                    api.listContacts(tenant, token)
                        .then((response) => {
                            expect(response.status).eq(200);
                            expect(response.headers["content-type"]).eq(
                                "application/json"
                            );

                            cy.log(response);
                        })
                        .then((response) => {
                            let contactListId = [];
                            for (
                                var i = 0;
                                i <= response.body.length - 1;
                                i++
                            ) {
                                contactListId.push(response.body[i].id);
                                //cy.log(response.body[i].id)
                            }

                            api.deleteContact(
                                tenant,
                                token,
                                contactListId
                            ).then((response) => {
                                cy.log(response);
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(
                                    response.body.operationSucceeded
                                ).to.be.a("Array");
                                cy.log(response);
                            });
                        });
                });
        });
        it("Delete all user token auth", () => {
            var userId = [];

            api.tokenAuthentication(
                tenant,
                "sarja1@nilavodev.com",
                testData.password
            )
                .then((response) => {
                    // return bearer token
                    expect(response.status).eq(200);
                    let bearerToken = response.headers.authorization;
                    console.log(bearerToken);
                    return bearerToken;
                })
                .then((token) => {
                    api.getUserNew(tenant, token, "Licensed").then(
                        (response) => {
                            response.body.forEach((elem) => {
                                if (elem.email != "sarja1@nilavodev.com") {
                                    api.deleteUser(tenant, token, elem.id);
                                }
                            });
                        }
                    );
                });

        });

        it("Create user", () => {
            let userArr = testData.createUser.user;

            api.tokenAuthentication(
                tenant,
                "sarja1@nilavodev.com",
                testData.password
            )
                .then((response) => {
                    expect(response.status).eq(200);
                    let bearerToken = response.headers.authorization;
                    console.log(bearerToken);
                    return bearerToken;
                })
                .then((token) => {
                    userArr.forEach((user, index) => {
                        let userObj = {
                            email: user,
                            passwd: testData.createUser.passwd,
                            role: "Recipient",
                            licensed: true,
                            fname: testData.createUser.fname[index],
                            lname: testData.createUser.lname[index],
                        };

                        api.createUserTokenBased(token, tenant, userObj).then(
                            (res) => {
                                if (res.status === 200) {
                                    console.log(`${user} created sucessfully`);
                                } else if (res.status === 400) {
                                    console.error(`${user} already exists`);
                                } else {
                                    console.error(`Other error`);
                                }
                            }
                        );
                    });
                });
        });
    });

    describe("User", () => {
        it("Authenticate - API", () => {
            //Generate authentication token
            api.tokenAuthentication(
                tenant,
                testData.tenantManager,
                testData.password
            ).then((response) => {
                // return bearer token
                expect(response.status).eq(200);
                let bearerToken = response.headers.authorization;
                console.log(bearerToken);
                return bearerToken;
            });
        });

        it("Get accoount information - API - Success", () => {
            //Generate auth token
            api.tokenAuthentication(
                tenant,
                testData.tenantManager,
                testData.password
            )
                .then((response) => {
                    expect(response.status).eq(200);
                    let bearerToken = response.headers.authorization;
                    console.log(bearerToken);
                    return bearerToken;
                }) //return bearar token
                .then((token) => {
                    //Get account information
                    api.getAccountInformation(tenant, token);
                }) // Get account information
                .then((response) => {
                    //Assert response from account information
                    expect(response.status).eq(200);
                    expect(response.body.email).eq(testData.tenantManager);
                    expect(response.body.login).eq(testData.tenantManager);
                    cy.log(response);
                }); // Assert response from the request
        });

        it("Get accoount information - API - Unauthorized - Invalid token", () => {
            api.tokenAuthentication(
                tenant,
                testData.tenantManager,
                testData.password
            )
                .then((response) => {
                    expect(response.status).eq(200);
                    let bearerToken = response.headers.authorization;
                    console.log(bearerToken);
                    return bearerToken;
                }) // return bearar token
                .then((token) => {
                    api.getAccountInformation(tenant, "token" + token);
                }) //Tries to get account info with invalid token
                .then((response) => {
                    expect(response.status).eq(401);
                    expect(response.statusText).eq("Unauthorized");
                    cy.log(response);
                }); // Assert response
        });

        it.skip("Get accoount information - API - Bad request", () => {
            api.tokenAuthentication(
                tenant,
                testData.tenantManager,
                testData.password
            )
                .then((response) => {
                    expect(response.status).eq(200);
                    let bearerToken = response.headers.authorization;
                    console.log(bearerToken);
                    return bearerToken;
                }) // return bearer token
                .then((token) => {
                    api.getAccountInformation(tenant, "token" + token);
                }) // Makes a bad request for acc info
                .then((response) => {
                    expect(response.status).eq(400);
                    expect(response.statusText).eq("Unauthorized");
                    cy.log(response);
                }); //Assert response
        });
    });

    describe("Contacts", () => {

        describe("Success response", () => {
            it("List Contacts - API - Success", () => {
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    }) // Return bearer token
                    .then((token) => {
                        api.listContacts(tenant, token);
                    }) // List contacts request
                    .then((response) => {
                        expect(response.status).eq(200);
                        expect(response.headers["content-type"]).eq(
                            "application/json"
                        );
                        expect(response.body).to.be.a('Array')
                        cy.log(response);
                    }); // assert response
            });
            it("Add Contact - API - Success", () => {
                let payload = {
                    company: "company",
                    email: "sarja10@nilavo.com",
                    firstName: "Asif",
                    lastName: "Sarja",
                    mobile: "01726 369769",
                };

                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    }) // Return bearer token
                    .then((token) => {
                        api.addContact(tenant, token, payload);
                    }) // Add contact request
                    .then((response) => {
                        expect(response.status).eq(200);
                        expect(response.headers["content-type"]).eq(
                            "application/json"
                        );
                        expect(response.body.email).eq(payload.email);
                        expect(response.body.firstName).eq(payload.firstName);
                        cy.log(response);
                    }); // Assert response
            });

            it("Delete Contact - API - Success", () => {
                let payload = {
                    company: "company",
                    email: "sarja11@nilavo.com",
                    firstName: "Asif",
                    lastName: "Sarja",
                    mobile: "01726 369769",
                };

                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        api.addContact(tenant, token, payload)
                            .then((response) => {
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.email).eq(payload.email);
                                expect(response.body.firstName).eq(
                                    payload.firstName
                                );
                                cy.log(response);
                            })
                            .then((response) => {
                                let contactId = response.body.id;
                                api.deleteContact(tenant, token, [
                                    contactId,
                                ]).then((response) => {
                                    expect(response.status).eq(200);
                                    expect(response.headers["content-type"]).eq(
                                        "application/json"
                                    );
                                    expect(
                                        response.body.operationSucceeded
                                    ).to.be.a("Array");
                                    cy.log(response);
                                });
                            });
                    });
            });

            it("Get Contact - API - Success", () => {
                let payload = {
                    company: "company",
                    email: "sarja13@nilavo.com",
                    firstName: "Asif",
                    lastName: "Sarja",
                    mobile: "01726 369769",
                };

                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        api.addContact(tenant, token, payload)
                            .then((response) => {
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.email).eq(payload.email);
                                expect(response.body.firstName).eq(
                                    payload.firstName
                                );
                                cy.log(response);
                            })
                            .then((response) => {
                                let contactId = response.body.id;
                                api.getContact(tenant, token, contactId).then(
                                    (response) => {
                                        expect(response.status).eq(200);
                                        expect(
                                            response.headers["content-type"]
                                        ).eq("application/json");
                                        expect(response.body.id).eq(contactId);
                                        expect(response.body.email).eq(
                                            payload.email
                                        );
                                        expect(response.body.firstName).eq(
                                            payload.firstName
                                        );

                                        cy.log(response);
                                    }
                                );
                            });
                    });
            });
            it("Update Contact - API - Success", () => {
                let payload = {
                    company: "company",
                    email: "sarja114@nilavo.com",
                    firstName: "Asif",
                    lastName: "Sarja",
                    mobile: "01726 369769",
                };

                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        api.addContact(tenant, token, payload)
                            .then((response) => {
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.email).eq(payload.email);
                                expect(response.body.firstName).eq(
                                    payload.firstName
                                );
                                cy.log(response);
                            })
                            .then((response) => {
                                let contactId = response.body.id;
                                let payloadNew = {
                                    email: "updatedsarja114@nilavo.com",
                                    firstName: "Updated Asif",
                                    lastName: "UpdatedSarja",
                                    company: "Updated company",
                                };
                                api.updateContact(
                                    tenant,
                                    token,
                                    payloadNew,
                                    contactId
                                ).then((response) => {
                                    expect(response.status).eq(200);
                                    expect(response.headers["content-type"]).eq(
                                        "application/json"
                                    );
                                    expect(response.body.email).eq(
                                        payloadNew.email
                                    );
                                    expect(response.body.firstName).eq(
                                        payloadNew.firstName
                                    );
                                    expect(response.body.company).eq(
                                        payloadNew.company
                                    );
                                    cy.log(response);
                                });
                            });
                    });
            });
            it("Add Contact Group - API - Success", () => {
                let payload = {
                    displayName: "Group one",
                    members: [
                        { email: "member1@nilavodev.com" },
                        { email: "member2@nilavodev.com" },
                    ],
                };

                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        api.addContactGroup(tenant, token, payload).then(
                            (response) => {
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.members).to.be.a("Array");
                                expect(response.body.members[0].email).eq(
                                    payload.members[0].email
                                );
                                expect(response.body.members[1].email).eq(
                                    payload.members[1].email
                                );
                                cy.log(response);
                            }
                        );
                    });
            });
            it("Get Contact Group - API - Success", () => {
                let payload = {
                    displayName: "Group Two",
                    members: [
                        { email: "member3@nilavodev.com" },
                        { email: "member4@nilavodev.com" },
                    ],
                };

                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        api.addContactGroup(tenant, token, payload)
                            .then((response) => {
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.members).to.be.a("Array");

                                expect(
                                    response.body.members[0].email
                                ).to.be.oneOf([
                                    payload.members[0].email,
                                    payload.members[1].email,
                                ]);
                                expect(
                                    response.body.members[1].email
                                ).to.be.oneOf([
                                    payload.members[0].email,
                                    payload.members[1].email,
                                ]);
                                cy.log(response);
                            })
                            .then((response) => {
                                let contactGroupId = response.body.id;
                                api.getContactGroup(
                                    tenant,
                                    token,
                                    contactGroupId
                                ).then((response) => {
                                    cy.log(response);
                                    expect(response.status).eq(200);
                                    expect(response.headers["content-type"]).eq(
                                        "application/json"
                                    );
                                    expect(response.body.id).eq(contactGroupId);
                                    expect(response.body.members).to.be.a(
                                        "Array"
                                    );
                                    expect(
                                        response.body.members[0].email
                                    ).to.be.oneOf([
                                        payload.members[0].email,
                                        payload.members[1].email,
                                    ]);
                                    expect(
                                        response.body.members[1].email
                                    ).to.be.oneOf([
                                        payload.members[0].email,
                                        payload.members[1].email,
                                    ]);
                                });
                            });
                    });
            });
            it("Update Contact Group - API - Success", () => {
                let payload = {
                    displayName: "Group Three",
                    members: [
                        { email: "member5@nilavodev.com" },
                        { email: "member6@nilavodev.com" },
                    ],
                };

                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        api.addContactGroup(tenant, token, payload)
                            .then((response) => {
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.members).to.be.a("Array");

                                expect(
                                    response.body.members[0].email
                                ).to.be.oneOf([
                                    payload.members[0].email,
                                    payload.members[1].email,
                                ]);
                                expect(
                                    response.body.members[1].email
                                ).to.be.oneOf([
                                    payload.members[0].email,
                                    payload.members[1].email,
                                ]);
                                cy.log(response);
                            })
                            .then((response) => {
                                let contactGroupId = response.body.id;
                                let payload = {
                                    displayName: "Updated Group Three",
                                    members: [
                                        {
                                            email: "updatedmember5@nilavodev.com",
                                        },
                                        {
                                            email: "updatedmember6@nilavodev.com",
                                        },
                                    ],
                                };
                                api.updateContactGroup(
                                    tenant,
                                    token,
                                    payload,
                                    contactGroupId
                                ).then((response) => {
                                    cy.log(response);
                                    expect(response.status).eq(200);
                                    expect(response.headers["content-type"]).eq(
                                        "application/json"
                                    );
                                    expect(response.body.id).eq(contactGroupId);
                                    expect(response.body.members).to.be.a(
                                        "Array"
                                    );
                                    expect(
                                        response.body.members[0].email
                                    ).to.be.oneOf([
                                        payload.members[0].email,
                                        payload.members[1].email,
                                    ]);
                                    expect(
                                        response.body.members[1].email
                                    ).to.be.oneOf([
                                        payload.members[0].email,
                                        payload.members[1].email,
                                    ]);
                                });
                            });
                    });
            });
        });

        describe("Unauthorized response", () => {
            it("List Contacts - API - Unauthorized - Invalid token", () => {
                api.listContacts(tenant, "token").then((response) => {
                    expect(response.status).eq(401);
                    //expect(response.headers['content-type']).eq('application/json')
                    cy.log(response);
                });
            });
            it("Add Contact - API - Unauthorized - Invalid token", () => {
                let payload = {
                    company: "company",
                    email: "sarja10@nilavo.com",
                    firstName: "Asif",
                    lastName: "Sarja",
                    mobile: "01726 369769",
                };

                api.addContact(tenant, "token", payload).then((response) => {
                    expect(response.status).eq(401);
                    expect(response.headers["content-type"]).eq(
                        "application/json"
                    );
                    cy.log(response);
                });
            });
            it("Delete Contact - API - Unauthorized - Invalid token", () => {
                let payload = {
                    company: "company",
                    email: "sarja12@nilavo.com",
                    firstName: "Asif",
                    lastName: "Sarja",
                    mobile: "01726 369769",
                };

                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        api.addContact(tenant, token, payload)
                            .then((response) => {
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.email).eq(payload.email);
                                expect(response.body.firstName).eq(
                                    payload.firstName
                                );
                                cy.log(response);
                            })
                            .then((response) => {
                                let contactId = response.body.id;
                                api.deleteContact(
                                    tenant,
                                    "token",
                                    contactId
                                ).then((response) => {
                                    expect(response.status).eq(401);
                                    expect(response.headers["content-type"]).eq(
                                        "application/json"
                                    );
                                    cy.log(response);
                                });
                            });
                    });
            });
            it("Get Contact - API - Unauthorized - Invalid token", () => {
                let payload = {
                    company: "company",
                    email: "sarja13@nilavo.com",
                    firstName: "Asif",
                    lastName: "Sarja",
                    mobile: "01726 369769",
                };

                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        api.addContact(tenant, token, payload)
                            .then((response) => {
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.email).eq(payload.email);
                                expect(response.body.firstName).eq(
                                    payload.firstName
                                );
                                cy.log(response);
                            })
                            .then((response) => {
                                let contactId = response.body.id;
                                api.getContact(tenant, "token", contactId).then(
                                    (response) => {
                                        expect(response.status).eq(401);
                                        expect(
                                            response.headers["content-type"]
                                        ).eq("application/json");
                                        // expect(response.body.id).eq(contactId)
                                        // expect(response.body.email).eq(payload.email)
                                        // expect(response.body.firstName).eq(payload.firstName)

                                        cy.log(response);
                                    }
                                );
                            });
                    });
            });
            it("Update Contact - API - Unauthorized - Invalid token - Invalid token", () => {
                let payload = {
                    company: "company",
                    email: "sarja114@nilavo.com",
                    firstName: "Asif",
                    lastName: "Sarja",
                    mobile: "01726 369769",
                };

                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        api.addContact(tenant, token, payload)
                            .then((response) => {
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.email).eq(payload.email);
                                expect(response.body.firstName).eq(
                                    payload.firstName
                                );
                                cy.log(response);
                            })
                            .then((response) => {
                                let contactId = response.body.id;
                                let payloadNew = {
                                    email: "updatedsarja114@nilavo.com",
                                    firstName: "Updated Asif",
                                    lastName: "UpdatedSarja",
                                    company: "Updated company",
                                };
                                api.updateContact(
                                    tenant,
                                    "token",
                                    payloadNew,
                                    contactId
                                ).then((response) => {
                                    expect(response.status).eq(401);
                                    expect(response.headers["content-type"]).eq(
                                        "application/json"
                                    );
                                    // expect(response.body.email).eq(payloadNew.email)
                                    // expect(response.body.firstName).eq(payloadNew.firstName)
                                    // expect(response.body.company).eq(payloadNew.company)
                                    cy.log(response);
                                });
                            });
                    });
            });
            it("Add Contact Group - API - Unauthorized - Invalid token", () => {
                let payload = {
                    displayName: "Group one",
                    members: [
                        { email: "member1@nilavodev.com" },
                        { email: "member1@nilavodev.com" },
                    ],
                };

                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        api.addContactGroup(tenant, "token", payload).then(
                            (response) => {
                                expect(response.status).eq(401);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                cy.log(response);
                            }
                        );
                    });
            });
            it("Get Contact Group - API - Unauthorized - Invalid token", () => {
                let payload = {
                    displayName: "Group Two",
                    members: [
                        { email: "member3@nilavodev.com" },
                        { email: "member4@nilavodev.com" },
                    ],
                };

                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        api.addContactGroup(tenant, token, payload)
                            .then((response) => {
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.members).to.be.a("Array");

                                expect(
                                    response.body.members[0].email
                                ).to.be.oneOf([
                                    payload.members[0].email,
                                    payload.members[1].email,
                                ]);
                                expect(
                                    response.body.members[1].email
                                ).to.be.oneOf([
                                    payload.members[0].email,
                                    payload.members[1].email,
                                ]);
                                cy.log(response);
                            })
                            .then((response) => {
                                let contactGroupId = response.body.id;
                                api.getContactGroup(
                                    tenant,
                                    "token",
                                    contactGroupId
                                ).then((response) => {
                                    cy.log(response);
                                    expect(response.status).eq(401);
                                    expect(response.headers["content-type"]).eq(
                                        "application/json"
                                    );
                                });
                            });
                    });
            });
            it("Update Contact Group - API - Unauthorized - Invalid token", () => {
                let payload = {
                    displayName: "Group Three",
                    members: [
                        { email: "member5@nilavodev.com" },
                        { email: "member6@nilavodev.com" },
                    ],
                };

                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        api.addContactGroup(tenant, token, payload)
                            .then((response) => {
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.members).to.be.a("Array");

                                expect(
                                    response.body.members[0].email
                                ).to.be.oneOf([
                                    payload.members[0].email,
                                    payload.members[1].email,
                                ]);
                                expect(
                                    response.body.members[1].email
                                ).to.be.oneOf([
                                    payload.members[0].email,
                                    payload.members[1].email,
                                ]);
                                cy.log(response);
                            })
                            .then((response) => {
                                let contactGroupId = response.body.id;
                                let payload = {
                                    name: "Updated Group Three",
                                    memberOne: "updatedmember5@nilavodev.com",
                                    memberTwo: "updatedmember6@nilavodev.com",
                                };
                                api.updateContactGroup(
                                    tenant,
                                    "token",
                                    payload,
                                    contactGroupId
                                ).then((response) => {
                                    cy.log(response);
                                    expect(response.status).eq(401);
                                    expect(response.headers["content-type"]).eq(
                                        "application/json"
                                    );
                                });
                            });
                    });
            });
        });

        describe("Bad request", () => {
            it.skip("List Contacts - API - Bad request", () => {
                api.listContacts(tenant, "token").then((response) => {
                    expect(response.status).eq(401);
                    //expect(response.headers['content-type']).eq('application/json')
                    cy.log(response);
                });
            });

            it.skip("Add Contact - API - Bad request", () => {
                // bad request case implemented
                let payload = {
                    company: "company",
                    email: "sarja10@nilavo.com",
                    firstName: "Asif",
                    lastName: "Sarja",
                    mobile: "01726 369769",
                };

                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        api.addContact(tenant, token, payload).then(
                            (response) => {
                                cy.log(response);
                                expect(response.status).eq(400);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                            }
                        );
                    });
            });

            it.skip("Delete Contact - API - Bad request", () => {
                //response code is supposed to be 400 according to documentation
                let payload = {
                    company: "company",
                    email: "sarja13@nilavo.com",
                    firstName: "Asif",
                    lastName: "Sarja",
                    mobile: "01726 369769",
                };

                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        api.addContact(tenant, token, payload)
                            .then((response) => {
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.email).eq(payload.email);
                                expect(response.body.firstName).eq(
                                    payload.firstName
                                );
                                cy.log(response);
                            })
                            .then((response) => {
                                let contactId = response.body.id;
                                api.deleteContact(tenant, token, ["1234"]).then(
                                    (response) => {
                                        cy.log(response);
                                        expect(response.status).eq(400);
                                        //expect(response.body.operationFailed).to.be.a('Array')
                                        //expect(response.headers['content-type']).eq('application/json')
                                    }
                                );
                            });
                    });
            });

            it.skip("Get Contact - API - Bad request", () => {
                // returning status code 404 instead of 400 according to documentation
                let payload = {
                    company: "company",
                    email: "sarja13@nilavo.com",
                    firstName: "Asif",
                    lastName: "Sarja",
                    mobile: "01726 369769",
                };

                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        api.addContact(tenant, token, payload)
                            .then((response) => {
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.email).eq(payload.email);
                                expect(response.body.firstName).eq(
                                    payload.firstName
                                );
                                cy.log(response);
                            })
                            .then((response) => {
                                let contactId = response.body.id;
                                api.getContact(tenant, token, "contactId").then(
                                    (response) => {
                                        expect(response.status).eq(400);
                                        expect(
                                            response.headers["content-type"]
                                        ).eq("application/json");
                                        // expect(response.body.id).eq(contactId)
                                        // expect(response.body.email).eq(payload.email)
                                        // expect(response.body.firstName).eq(payload.firstName)

                                        cy.log(response);
                                    }
                                );
                            });
                    });
            });

            it("Update Contact - API - Bad request", () => {
                let payload = {
                    company: "company",
                    email: "sarja114@nilavo.com",
                    firstName: "Asif",
                    lastName: "Sarja",
                    mobile: "01726 369769",
                };

                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        api.addContact(tenant, token, payload)
                            .then((response) => {
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.email).eq(payload.email);
                                expect(response.body.firstName).eq(
                                    payload.firstName
                                );
                                cy.log(response);
                            })
                            .then((response) => {
                                let contactId = response.body.id;
                                let payloadNew = {
                                    email: "updatedsarja114@nilavo.com",
                                    firstName: "Updated Asif",
                                    lastName: "UpdatedSarja",
                                    company: "Updated company",
                                };
                                api.updateContact(
                                    tenant,
                                    token,
                                    payloadNew,
                                    "contactId"
                                ).then((response) => {
                                    expect(response.status).eq(400);
                                    expect(response.headers["x-api-error"]).eq(
                                        "entity.notFound"
                                    );

                                    cy.log(response);
                                });
                            });
                    });
            });

            it.skip("Add Contact Group - API - Bad request", () => {
                //will be implemented later
                let payload = {
                    displayName: "Group one",
                    members: [
                        { email: "member1@nilavodev.com" },
                        { email: "member1@nilavodev.com" },
                    ],
                };

                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        api.addContactGroup(tenant, "token", payload).then(
                            (response) => {
                                expect(response.status).eq(401);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                cy.log(response);
                            }
                        );
                    });
            });

            it.skip("Get Contact Group - API - Bad request", () => {
                //will be implemented later
                let payload = {
                    displayName: "Group Two",
                    members: [
                        { email: "member3@nilavodev.com" },
                        { email: "member4@nilavodev.com" },
                    ],
                };

                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        api.addContactGroup(tenant, token, payload)
                            .then((response) => {
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.members).to.be.a("Array");

                                expect(
                                    response.body.members[0].email
                                ).to.be.oneOf([
                                    payload.members[0].email,
                                    payload.members[1].email,
                                ]);
                                expect(
                                    response.body.members[1].email
                                ).to.be.oneOf([
                                    payload.members[0].email,
                                    payload.members[1].email,
                                ]);
                                cy.log(response);
                            })
                            .then((response) => {
                                let contactGroupId = 'response.body.id';
                                api.getContactGroup(
                                    tenant,
                                    token,
                                    contactGroupId
                                ).then((response) => {
                                    cy.log(response);
                                    expect(response.status).eq(400);
                                    expect(response.headers["content-type"]).eq(
                                        "application/json"
                                    );
                                });
                            });
                    });
            });

            it("Update Contact Group - API - Bad request", () => {
                let payload = {
                    displayName: "Group Three",
                    members: [
                        { email: "member5@nilavodev.com" },
                        { email: "member6@nilavodev.com" },
                    ],
                };

                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        api.addContactGroup(tenant, token, payload)
                            .then((response) => {
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.members).to.be.a("Array");

                                expect(
                                    response.body.members[0].email
                                ).to.be.oneOf([
                                    payload.members[0].email,
                                    payload.members[1].email,
                                ]);
                                expect(
                                    response.body.members[1].email
                                ).to.be.oneOf([
                                    payload.members[0].email,
                                    payload.members[1].email,
                                ]);
                                cy.log(response);
                            })
                            .then((response) => {
                                let contactGroupId = response.body.id;
                                let payload = {
                                    name: "Updated Group Three",
                                    memberOne: "updatedmember5@nilavodev.com",
                                    memberTwo: "updatedmember6@nilavodev.com",
                                };
                                api.updateContactGroup(
                                    tenant,
                                    token,
                                    payload,
                                    "contactGroupId"
                                ).then((response) => {
                                    cy.log(response);
                                    expect(response.status).eq(400);
                                });
                            });
                    });
            });
        });
    });

    describe("File-System Entities", () => {

        describe("Success response", () => {
            it("Upload File - API - Success - Single Upload", () => {
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        cy.fixture("data/apiTest.txt").then((file) => {
                            let blob = Cypress.Blob.binaryStringToBlob(
                                file,
                                "text/plain"
                            );
                            cy.wrap(
                                api
                                    .uploadFile(
                                        tenant,
                                        token,
                                        blob,
                                        api.generateUUID(),
                                        "apiTest.txt",
                                        "148",
                                        "text/plain",
                                        "Drive",
                                        ""
                                    )
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        expect(JSON.parse(response.response).name).eq('apiTest.txt')
                                        console.log(response);
                                        console.log(
                                            JSON.parse(response.response).id
                                        );
                                        console.log(
                                            JSON.parse(response.response)
                                                .parentFolderId
                                        );
                                    })
                            );
                        });
                    });
            });

            it("Upload File - API - Success - Chunk  Upload", () => {
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        cy.fixture("data/sarja2.txt").then((file) => {
                            var trackingID = api.generateUUID();
                            let blob = Cypress.Blob.binaryStringToBlob(
                                file,
                                "text/plain"
                            );
                            cy.wrap(
                                api.parseFile(blob, (result) => {
                                    let newBlob =
                                        Cypress.Blob.binaryStringToBlob(
                                            result,
                                            "text/plain"
                                        );

                                    api.uploadFile(
                                        tenant,
                                        token,
                                        newBlob,
                                        trackingID,
                                        "sarja2.txt",
                                        "23879424",
                                        "text/plain",
                                        "Drive",
                                        ""
                                    ).then((response) => {
                                        expect(response.status).eq(200);
                                        expect(JSON.parse(response.response).name).eq('sarja2.txt')
                                        console.log(response);
                                    });
                                })
                            );
                        });
                    });

                cy.wait(5000);
            });
            it("Get File/Folder Properties - API - Success", () => {
                //File also uploaded in path

                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        cy.fixture("data/apiTest.txt").then((file) => {
                            let blob = Cypress.Blob.binaryStringToBlob(
                                file,
                                "text/plain"
                            );
                            cy.wrap(
                                api
                                    .uploadFile(
                                        tenant,
                                        token,
                                        blob,
                                        api.generateUUID(),
                                        "apiTest.txt",
                                        "148",
                                        "text/plain",
                                        "Drive",
                                        "/Test/Folder"
                                    )
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        console.log(response);
                                        console.log(
                                            JSON.parse(response.response).id
                                        );
                                        console.log(
                                            JSON.parse(response.response)
                                                .parentFolderId
                                        );
                                        return JSON.parse(response.response);
                                    })
                            ).then((uploadResponse) => {
                                api.getFileFolderProperties(
                                    tenant,
                                    token,
                                    uploadResponse.id
                                ).then((response) => {
                                    expect(response.status).eq(200);
                                    expect(response.body.id).eq(
                                        uploadResponse.id
                                    );
                                    expect(response.body.parentFolderId).eq(
                                        uploadResponse.parentFolderId
                                    );
                                });
                            });
                        });
                    });
            });
            it("Download File - API - Success", () => {
                //File also uploaded in path

                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        cy.fixture("data/apiTest.txt").then((file) => {
                            let blob = Cypress.Blob.binaryStringToBlob(
                                file,
                                "text/plain"
                            );
                            cy.wrap(
                                api
                                    .uploadFile(
                                        tenant,
                                        token,
                                        blob,
                                        api.generateUUID(),
                                        "apiTest.txt",
                                        "148",
                                        "text/plain",
                                        "Drive",
                                        "/Test/Folder"
                                    )
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        console.log(response);
                                        console.log(
                                            JSON.parse(response.response).id
                                        );
                                        console.log(
                                            JSON.parse(response.response)
                                                .parentFolderId
                                        );
                                        return JSON.parse(response.response);
                                    })
                            ).then((uploadResponse) => {
                                api.downloadFile(
                                    tenant,
                                    token,
                                    uploadResponse.id
                                )
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        console.log(response);
                                    })
                                    .then((response) => {
                                        cy.writeFile(
                                            "cypress/downloads/apiTest.txt",
                                            response.body,
                                            "binary"
                                        );
                                    });
                            });
                        });
                    });
            });
            it("Download As Zip - API - Success", () => {
                //File downlod not confirmed from location, only response type and status asserted

                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        cy.fixture("data/apiTest.txt").then((file) => {
                            let blob = Cypress.Blob.binaryStringToBlob(
                                file,
                                "text/plain"
                            );
                            cy.wrap(
                                api
                                    .uploadFile(
                                        tenant,
                                        token,
                                        blob,
                                        api.generateUUID(),
                                        "apiTest.txt",
                                        "148",
                                        "text/plain",
                                        "Drive",
                                        ""
                                    )
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        console.log(response);
                                        console.log(
                                            JSON.parse(response.response).id
                                        );
                                        console.log(
                                            JSON.parse(response.response)
                                                .parentFolderId
                                        );
                                        return JSON.parse(response.response);
                                    })
                            ).then((uploadResponse) => {
                                api.downloadAsZip(
                                    tenant,
                                    token,
                                    [uploadResponse.id],
                                    api.generateUUID()
                                ).then((response) => {
                                    console.log(response);
                                    expect(response.status).eq(200);
                                    expect(
                                        response.headers["content-type"]
                                    ).to.contain("application/octet-stream");
                                });
                            });
                        });
                    });
            });
            it("Update File/Folder - API - Success - File/Folder both update", () => {
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        cy.fixture("data/apiTest.txt").then((file) => {
                            let blob = Cypress.Blob.binaryStringToBlob(
                                file,
                                "text/plain"
                            );
                            cy.wrap(
                                api
                                    .uploadFile(
                                        tenant,
                                        token,
                                        blob,
                                        api.generateUUID(),
                                        "apiTest.txt",
                                        "148",
                                        "text/plain",
                                        "Drive",
                                        "/folderOne"
                                    )
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        console.log(response);
                                        console.log(
                                            JSON.parse(response.response).id
                                        );
                                        console.log(
                                            JSON.parse(response.response)
                                                .parentFolderId
                                        );
                                        return JSON.parse(response.response);
                                    })
                            ).then((uploadResponse) => {
                                let payloadFile = {
                                    name: "newname.txt",
                                    description: "new description file",
                                };

                                let payloadFolder = {
                                    name: "newname",
                                    description: "new description folder",
                                };
                                api.updateFileFolder(
                                    tenant,
                                    token,
                                    uploadResponse.id,
                                    payloadFile
                                ).then((response) => {
                                    console.log(response);
                                    expect(response.status).eq(200);
                                    expect(response.body.id).eq(
                                        uploadResponse.id
                                    );
                                    expect(response.body.parentFolderId).eq(
                                        uploadResponse.parentFolderId
                                    );
                                    expect(response.body.name).eq(
                                        payloadFile.name
                                    );
                                    expect(response.body.description).eq(
                                        payloadFile.description
                                    );
                                });
                                api.updateFileFolder(
                                    tenant,
                                    token,
                                    uploadResponse.parentFolderId,
                                    payloadFolder
                                ).then((response) => {
                                    console.log(response);
                                    expect(response.status).eq(200);
                                    expect(response.body.id).eq(
                                        uploadResponse.parentFolderId
                                    );
                                    expect(response.body.name).eq(
                                        payloadFolder.name
                                    );
                                    expect(response.body.description).eq(
                                        payloadFolder.description
                                    );
                                });
                            });
                        });
                    });
            });
            it("Copy File/Folder - API - Success - File/Folder both copy", () => {
                //Folder copy reponse issue

                let fileId = null;
                let folderId = null;
                let destinationFolderId = null;

                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        cy.fixture("data/apiTest.txt").then((file) => {
                            let blob = Cypress.Blob.binaryStringToBlob(
                                file,
                                "text/plain"
                            );
                            cy.wrap(
                                api
                                    .uploadFile(
                                        tenant,
                                        token,
                                        blob,
                                        api.generateUUID(),
                                        "apiTest.txt",
                                        "148",
                                        "text/plain",
                                        "Drive",
                                        "/folderTwo"
                                    )
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        console.log(response);
                                        console.log(
                                            JSON.parse(response.response).id
                                        );
                                        console.log(
                                            JSON.parse(response.response)
                                                .parentFolderId
                                        );
                                        fileId = JSON.parse(
                                            response.response
                                        ).id;
                                        folderId = JSON.parse(
                                            response.response
                                        ).parentFolderId;
                                        return JSON.parse(response.response);
                                    })
                            )
                                .then(() => {
                                    cy.fixture("data/dragAndDrop.txt").then(
                                        (file) => {
                                            let blob =
                                                Cypress.Blob.binaryStringToBlob(
                                                    file,
                                                    "text/plain"
                                                );

                                            cy.wrap(
                                                api
                                                    .uploadFile(
                                                        tenant,
                                                        token,
                                                        blob,
                                                        api.generateUUID(),
                                                        "dragAndDrop.txt",
                                                        "104",
                                                        "text/plain",
                                                        "Drive",
                                                        "/folderThree"
                                                    )
                                                    .then((response) => {
                                                        expect(
                                                            response.status
                                                        ).eq(200);
                                                        console.log(response);
                                                        console.log(
                                                            JSON.parse(
                                                                response.response
                                                            ).id
                                                        );
                                                        console.log(
                                                            JSON.parse(
                                                                response.response
                                                            ).parentFolderId
                                                        );
                                                        destinationFolderId =
                                                            JSON.parse(
                                                                response.response
                                                            ).parentFolderId;
                                                        return JSON.parse(
                                                            response.response
                                                        );
                                                    })
                                            );
                                        }
                                    );
                                })
                                .then(() => {
                                    let payload = {
                                        destination: destinationFolderId,
                                    };

                                    api.copyFileFolder(
                                        tenant,
                                        token,
                                        fileId,
                                        payload
                                    )
                                        .then((response) => {
                                            expect(response.status).eq(200);
                                            expect(
                                                response.body.parentFolderId
                                            ).eq(destinationFolderId);
                                        })
                                        .then(() => {
                                            api.copyFileFolder(
                                                tenant,
                                                token,
                                                folderId,
                                                payload
                                            ).then((response) => {
                                                console.log(response);
                                                expect(response.status).eq(200);
                                                
                                                //expect(response.body.parentFolderId).eq(destinationFolderId)
                                            });
                                        });
                                });
                        });
                    });
            });
            it("Move File/Folder - API - Success - File/Folder both copy", () => {
                //Folder copy reponse issue

                let fileId = null;
                let folderId = null;
                let destinationFolderId = null;

                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        cy.fixture("data/apiTest.txt").then((file) => {
                            let blob = Cypress.Blob.binaryStringToBlob(
                                file,
                                "text/plain"
                            );
                            cy.wrap(
                                api
                                    .uploadFile(
                                        tenant,
                                        token,
                                        blob,
                                        api.generateUUID(),
                                        "apiTest.txt",
                                        "148",
                                        "text/plain",
                                        "Drive",
                                        "/folderFour"
                                    )
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        console.log(response);
                                        console.log(
                                            JSON.parse(response.response).id
                                        );
                                        console.log(
                                            JSON.parse(response.response)
                                                .parentFolderId
                                        );
                                        fileId = JSON.parse(
                                            response.response
                                        ).id;
                                        folderId = JSON.parse(
                                            response.response
                                        ).parentFolderId;
                                        return JSON.parse(response.response);
                                    })
                            )
                                .then(() => {
                                    cy.fixture("data/dragAndDrop.txt").then(
                                        (file) => {
                                            let blob =
                                                Cypress.Blob.binaryStringToBlob(
                                                    file,
                                                    "text/plain"
                                                );

                                            cy.wrap(
                                                api
                                                    .uploadFile(
                                                        tenant,
                                                        token,
                                                        blob,
                                                        api.generateUUID(),
                                                        "dragAndDrop.txt",
                                                        "104",
                                                        "text/plain",
                                                        "Drive",
                                                        "/folderFive"
                                                    )
                                                    .then((response) => {
                                                        expect(
                                                            response.status
                                                        ).eq(200);
                                                        console.log(response);
                                                        console.log(
                                                            JSON.parse(
                                                                response.response
                                                            ).id
                                                        );
                                                        console.log(
                                                            JSON.parse(
                                                                response.response
                                                            ).parentFolderId
                                                        );
                                                        destinationFolderId =
                                                            JSON.parse(
                                                                response.response
                                                            ).parentFolderId;
                                                        return JSON.parse(
                                                            response.response
                                                        );
                                                    })
                                            );
                                        }
                                    );
                                })
                                .then(() => {
                                    let payload = {
                                        destination: destinationFolderId,
                                    };

                                    api.moveFileFolder(
                                        tenant,
                                        token,
                                        fileId,
                                        payload
                                    )
                                        .then((response) => {
                                            expect(response.status).eq(200);
                                            expect(
                                                response.body.parentFolderId
                                            ).eq(destinationFolderId);
                                        })
                                        .then(() => {
                                            api.moveFileFolder(
                                                tenant,
                                                token,
                                                folderId,
                                                payload
                                            ).then((response) => {
                                                console.log(response);
                                                expect(response.status).eq(200);
                                                //expect(response.body.parentFolderId).eq(destinationFolderId)
                                            });
                                        });
                                });
                        });
                    });
            });
            it("Delete File/Folder - API - Success - File/Folder both delete", () => {
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        cy.fixture("data/apiTest.txt").then((file) => {
                            let blob = Cypress.Blob.binaryStringToBlob(
                                file,
                                "text/plain"
                            );
                            cy.wrap(
                                api
                                    .uploadFile(
                                        tenant,
                                        token,
                                        blob,
                                        api.generateUUID(),
                                        "apiTest.txt",
                                        "148",
                                        "text/plain",
                                        "Drive",
                                        ""
                                    )
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        console.log(response);
                                        console.log(
                                            JSON.parse(response.response).id
                                        );
                                        console.log(
                                            JSON.parse(response.response)
                                                .parentFolderId
                                        );
                                        return JSON.parse(response.response);
                                    })
                            ).then((uploadResponse) => {
                                api.delteFileFolder(tenant, token, [
                                    uploadResponse.id,
                                ]).then((response) => {
                                    expect(response.status).eq(200);
                                    expect(
                                        response.body.operationSucceeded
                                    ).to.be.a("Array");
                                    expect(
                                        response.body.operationSucceeded
                                    ).to.contain(uploadResponse.id);
                                });
                            });

                            cy.wrap(
                                api
                                    .uploadFile(
                                        tenant,
                                        token,
                                        blob,
                                        api.generateUUID(),
                                        "apiTest.txt",
                                        "148",
                                        "text/plain",
                                        "Drive",
                                        "/deleteThisFolder"
                                    )
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        console.log(response);
                                        console.log(
                                            JSON.parse(response.response).id
                                        );
                                        console.log(
                                            JSON.parse(response.response)
                                                .parentFolderId
                                        );

                                        return JSON.parse(response.response);
                                    })
                            ).then((uploadResponse) => {
                                api.delteFileFolder(tenant, token, [
                                    uploadResponse.parentFolderId,
                                ]).then((response) => {
                                    expect(response.status).eq(200);
                                    expect(
                                        response.body.operationSucceeded
                                    ).to.be.a("Array");
                                    expect(
                                        response.body.operationSucceeded
                                    ).to.contain(uploadResponse.parentFolderId);
                                });
                            });
                        });
                    });
            });
            it("List Deleted Items - API - Success", () => {
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let idOne = null;
                        let idTwo = null;
                        cy.fixture("data/apiTest.txt")
                            .then((file) => {
                                let blob = Cypress.Blob.binaryStringToBlob(
                                    file,
                                    "text/plain"
                                );
                                cy.wrap(
                                    api
                                        .uploadFile(
                                            tenant,
                                            token,
                                            blob,
                                            api.generateUUID(),
                                            "apiTest.txt",
                                            "148",
                                            "text/plain",
                                            "Drive",
                                            ""
                                        )
                                        .then((response) => {
                                            expect(response.status).eq(200);
                                            console.log(response);
                                            console.log(
                                                JSON.parse(response.response).id
                                            );
                                            console.log(
                                                JSON.parse(response.response)
                                                    .parentFolderId
                                            );
                                            return JSON.parse(
                                                response.response
                                            );
                                        })
                                ).then((uploadResponse) => {
                                    api.delteFileFolder(tenant, token, [
                                        uploadResponse.id,
                                    ]).then((response) => {
                                        expect(response.status).eq(200);
                                        expect(
                                            response.body.operationSucceeded
                                        ).to.be.a("Array");
                                        expect(
                                            response.body.operationSucceeded
                                        ).to.contain(uploadResponse.id);
                                        idOne = uploadResponse.id;
                                    });
                                });

                                cy.wrap(
                                    api
                                        .uploadFile(
                                            tenant,
                                            token,
                                            blob,
                                            api.generateUUID(),
                                            "apiTest.txt",
                                            "148",
                                            "text/plain",
                                            "Drive",
                                            "/deleteThisFolder"
                                        )
                                        .then((response) => {
                                            expect(response.status).eq(200);
                                            console.log(response);
                                            console.log(
                                                JSON.parse(response.response).id
                                            );
                                            console.log(
                                                JSON.parse(response.response)
                                                    .parentFolderId
                                            );

                                            return JSON.parse(
                                                response.response
                                            );
                                        })
                                ).then((uploadResponse) => {
                                    api.delteFileFolder(tenant, token, [
                                        uploadResponse.parentFolderId,
                                    ]).then((response) => {
                                        expect(response.status).eq(200);
                                        expect(
                                            response.body.operationSucceeded
                                        ).to.be.a("Array");
                                        expect(
                                            response.body.operationSucceeded
                                        ).to.contain(
                                            uploadResponse.parentFolderId
                                        );
                                        idTwo = uploadResponse.parentFolderId;
                                    });
                                });
                            })
                            .then(() => {
                                api.listDeletedItems(tenant, token).then(
                                    (response) => {
                                        console.log(response);
                                        expect(response.status).eq(200);
                                        expect(
                                            response.headers["content-type"]
                                        ).eq("application/json");
                                        expect(response.body).to.be.a("Array");

                                        let result = false;
                                        let resultTwo = false;

                                        let match1 = response.body.find(
                                            (o) => o.id === idOne
                                        );
                                        let match2 = response.body.find(
                                            (o) => o.id === idTwo
                                        );
                                        if (match1) {
                                            result = true;
                                        }
                                        if (match2) {
                                            resultTwo = true;
                                        }

                                        expect(result).to.be.true;
                                        expect(resultTwo).to.be.true;
                                    }
                                );
                            });
                    });
            });
            it("Delete Files/Folders Permanently - API - Success", () => {
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let idOne = null;
                        let idTwo = null;
                        cy.fixture("data/apiTest.txt")
                            .then((file) => {
                                let blob = Cypress.Blob.binaryStringToBlob(
                                    file,
                                    "text/plain"
                                );
                                cy.wrap(
                                    api
                                        .uploadFile(
                                            tenant,
                                            token,
                                            blob,
                                            api.generateUUID(),
                                            "apiTest.txt",
                                            "148",
                                            "text/plain",
                                            "Drive",
                                            ""
                                        )
                                        .then((response) => {
                                            expect(response.status).eq(200);
                                            console.log(response);
                                            console.log(
                                                JSON.parse(response.response).id
                                            );
                                            console.log(
                                                JSON.parse(response.response)
                                                    .parentFolderId
                                            );
                                            return JSON.parse(
                                                response.response
                                            );
                                        })
                                ).then((uploadResponse) => {
                                    api.delteFileFolder(tenant, token, [
                                        uploadResponse.id,
                                    ]).then((response) => {
                                        expect(response.status).eq(200);
                                        expect(
                                            response.body.operationSucceeded
                                        ).to.be.a("Array");
                                        expect(
                                            response.body.operationSucceeded
                                        ).to.contain(uploadResponse.id);
                                        idOne = uploadResponse.id;
                                    });
                                });

                                cy.wrap(
                                    api
                                        .uploadFile(
                                            tenant,
                                            token,
                                            blob,
                                            api.generateUUID(),
                                            "apiTest.txt",
                                            "148",
                                            "text/plain",
                                            "Drive",
                                            "/deleteThisFolder"
                                        )
                                        .then((response) => {
                                            expect(response.status).eq(200);
                                            console.log(response);
                                            console.log(
                                                JSON.parse(response.response).id
                                            );
                                            console.log(
                                                JSON.parse(response.response)
                                                    .parentFolderId
                                            );

                                            return JSON.parse(
                                                response.response
                                            );
                                        })
                                ).then((uploadResponse) => {
                                    api.delteFileFolder(tenant, token, [
                                        uploadResponse.parentFolderId,
                                    ]).then((response) => {
                                        expect(response.status).eq(200);
                                        expect(
                                            response.body.operationSucceeded
                                        ).to.be.a("Array");
                                        expect(
                                            response.body.operationSucceeded
                                        ).to.contain(
                                            uploadResponse.parentFolderId
                                        );
                                        idTwo = uploadResponse.parentFolderId;
                                    });
                                });
                            })
                            .then(() => {
                                api.deleteFileFolderPermaently(tenant, token, [
                                    idOne,
                                    idTwo,
                                ]).then((response) => {
                                    console.log(response);
                                    expect(response.status).eq(200);
                                    expect(response.headers["content-type"]).eq(
                                        "application/json"
                                    );
                                    expect(
                                        response.body.operationSucceeded
                                    ).to.be.a("Array");
                                    expect(
                                        response.body.operationSucceeded
                                    ).to.include.members([idOne, idTwo]);
                                });
                            });
                    });
            });
            it("Restore Files/Folders - API - Success", () => {
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let idOne = null;
                        let idTwo = null;
                        cy.fixture("data/apiTest.txt")
                            .then((file) => {
                                let blob = Cypress.Blob.binaryStringToBlob(
                                    file,
                                    "text/plain"
                                );
                                cy.wrap(
                                    api
                                        .uploadFile(
                                            tenant,
                                            token,
                                            blob,
                                            api.generateUUID(),
                                            "apiTest.txt",
                                            "148",
                                            "text/plain",
                                            "Drive",
                                            ""
                                        )
                                        .then((response) => {
                                            expect(response.status).eq(200);
                                            console.log(response);
                                            console.log(
                                                JSON.parse(response.response).id
                                            );
                                            console.log(
                                                JSON.parse(response.response)
                                                    .parentFolderId
                                            );
                                            return JSON.parse(
                                                response.response
                                            );
                                        })
                                ).then((uploadResponse) => {
                                    api.delteFileFolder(tenant, token, [
                                        uploadResponse.id,
                                    ]).then((response) => {
                                        expect(response.status).eq(200);
                                        expect(
                                            response.body.operationSucceeded
                                        ).to.be.a("Array");
                                        expect(
                                            response.body.operationSucceeded
                                        ).to.contain(uploadResponse.id);
                                        idOne = uploadResponse.id;
                                    });
                                });

                                cy.wrap(
                                    api
                                        .uploadFile(
                                            tenant,
                                            token,
                                            blob,
                                            api.generateUUID(),
                                            "apiTest.txt",
                                            "148",
                                            "text/plain",
                                            "Drive",
                                            "/deleteThisFolder"
                                        )
                                        .then((response) => {
                                            expect(response.status).eq(200);
                                            console.log(response);
                                            console.log(
                                                JSON.parse(response.response).id
                                            );
                                            console.log(
                                                JSON.parse(response.response)
                                                    .parentFolderId
                                            );

                                            return JSON.parse(
                                                response.response
                                            );
                                        })
                                ).then((uploadResponse) => {
                                    api.delteFileFolder(tenant, token, [
                                        uploadResponse.parentFolderId,
                                    ]).then((response) => {
                                        expect(response.status).eq(200);
                                        expect(
                                            response.body.operationSucceeded
                                        ).to.be.a("Array");
                                        expect(
                                            response.body.operationSucceeded
                                        ).to.contain(
                                            uploadResponse.parentFolderId
                                        );
                                        idTwo = uploadResponse.parentFolderId;
                                    });
                                });
                            })
                            .then(() => {
                                api.restoreFileFolder(tenant, token, [
                                    idOne,
                                    idTwo,
                                ]).then((response) => {
                                    console.log(response);
                                    expect(response.status).eq(200);
                                    expect(response.headers["content-type"]).eq(
                                        "application/json"
                                    );
                                    expect(
                                        response.body.operationSucceeded
                                    ).to.be.a("Array");
                                    expect(
                                        response.body.operationSucceeded
                                    ).to.include.members([idOne, idTwo]);
                                });
                            });
                    });
            });
            it("List File Version - API - Success", () => {
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let fileId = null;

                        cy.fixture("data/apiTestVersion.txt").then((file) => {
                            let blob = Cypress.Blob.binaryStringToBlob(
                                file,
                                "text/plain"
                            );
                            cy.wrap(
                                api
                                    .uploadFile(
                                        tenant,
                                        token,
                                        blob,
                                        api.generateUUID(),
                                        "apiTestVersion.txt",
                                        "148",
                                        "text/plain",
                                        "Drive",
                                        ""
                                    )
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        console.log(response);
                                        console.log(
                                            JSON.parse(response.response).id
                                        );
                                        console.log(
                                            JSON.parse(response.response)
                                                .parentFolderId
                                        );
                                        return JSON.parse(response.response);
                                    })
                            ).then((uploadResponse) => {
                                fileId = uploadResponse.id;
                            });
                        });

                        cy.fixture("data/version/apiTestVersion.txt")
                            .then((file) => {
                                let blob = Cypress.Blob.binaryStringToBlob(
                                    file,
                                    "text/plain"
                                );
                                cy.wrap(
                                    api
                                        .uploadFile(
                                            tenant,
                                            token,
                                            blob,
                                            api.generateUUID(),
                                            "apiTestVersion.txt",
                                            "158",
                                            "text/plain",
                                            "Drive",
                                            ""
                                        )
                                        .then((response) => {
                                            expect(response.status).eq(200);
                                            console.log(response);
                                            console.log(
                                                JSON.parse(response.response).id
                                            );
                                            console.log(
                                                JSON.parse(response.response)
                                                    .parentFolderId
                                            );
                                            return JSON.parse(
                                                response.response
                                            );
                                        })
                                ).then((uploadResponse) => {
                                    fileId = uploadResponse.id;
                                });
                            })
                            .then(() => {
                                api.listFileVersion(tenant, token, fileId).then(
                                    (response) => {
                                        expect(response.status).eq(200);
                                        expect(
                                            response.headers["content-type"]
                                        ).eq("application/json");
                                        expect(response.body).to.be.a("Array");
                                        expect(response.body[0].version).eq(1);
                                        expect(response.body[1].version).eq(2);
                                    }
                                );
                            })
                            
                    });
            });
            it("List Folder - API - Success", () => {
                //File also uploaded in path

                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let folderId = null;
                        cy.fixture("data/apiTest.txt").then((file) => {
                            let blob = Cypress.Blob.binaryStringToBlob(
                                file,
                                "text/plain"
                            );
                            cy.wrap(
                                api
                                    .uploadFile(
                                        tenant,
                                        token,
                                        blob,
                                        api.generateUUID(),
                                        "apiTest.txt",
                                        "148",
                                        "text/plain",
                                        "Drive",
                                        "/Test/Folder/N"
                                    )
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        console.log(response);
                                        console.log(
                                            JSON.parse(response.response).id
                                        );
                                        console.log(
                                            JSON.parse(response.response)
                                                .parentFolderId
                                        );
                                        folderId = JSON.parse(
                                            response.response
                                        ).parentFolderId;
                                        return JSON.parse(response.response);
                                    })
                            );
                        });
                        cy.fixture("data/apiTestVersion.txt")
                            .then((file) => {
                                let blob = Cypress.Blob.binaryStringToBlob(
                                    file,
                                    "text/plain"
                                );
                                cy.wrap(
                                    api
                                        .uploadFile(
                                            tenant,
                                            token,
                                            blob,
                                            api.generateUUID(),
                                            "apiTestVersion.txt",
                                            "148",
                                            "text/plain",
                                            "Drive",
                                            "/Test/Folder/N/A"
                                        )
                                        .then((response) => {
                                            expect(response.status).eq(200);
                                            console.log(response);
                                            console.log(
                                                JSON.parse(response.response).id
                                            );
                                            console.log(
                                                JSON.parse(response.response)
                                                    .parentFolderId
                                            );
                                            return JSON.parse(
                                                response.response
                                            );
                                        })
                                );
                            })
                            .then(() => {
                                api.listFolder(tenant, token, folderId).then(
                                    (response) => {
                                        expect(response.status).eq(200);
                                        expect(
                                            response.headers["content-type"]
                                        ).eq("application/json");
                                        expect(response.body).to.be.a("Array");
                                        expect(
                                            response.body[0].parentFolderId
                                        ).eq(folderId);
                                        expect(
                                            response.body[1].parentFolderId
                                        ).eq(folderId);
                                        expect(response.body[0].kind).eq(
                                            "folder"
                                        );
                                        expect(response.body[1].kind).eq(
                                            "file"
                                        );
                                        expect(response.body[0].name).eq("A");
                                        expect(response.body[1].name).eq(
                                            "apiTest.txt"
                                        );
                                    }
                                );
                            });
                    });
            });
            it("Share Folder - API - Success", () => {
                //Response code not correct
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let folderId = null;
                        cy.fixture("data/apiTest.txt").then((file) => {
                            let blob = Cypress.Blob.binaryStringToBlob(
                                file,
                                "text/plain"
                            );
                            cy.wrap(
                                api
                                    .uploadFile(
                                        tenant,
                                        token,
                                        blob,
                                        api.generateUUID(),
                                        "apiTest.txt",
                                        "148",
                                        "text/plain",
                                        "Drive",
                                        "/Test/Folder"
                                    )
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        console.log(response);
                                        console.log(
                                            JSON.parse(response.response).id
                                        );
                                        console.log(
                                            JSON.parse(response.response)
                                                .parentFolderId
                                        );
                                        folderId = JSON.parse(
                                            response.response
                                        ).parentFolderId;
                                        return JSON.parse(response.response);
                                    })
                            ).then(() => {
                                let payload = {
                                    emails: ["sarja3@nilavodev.com"],
                                    inviteMessages: "share this",
                                    role: "Editor",
                                };

                                api.shareFolder(
                                    tenant,
                                    token,
                                    folderId,
                                    payload
                                ).then((response) => {
                                    console.log(response);
                                    expect(response.status).eq(200);
                                    expect(response.headers["content-type"]).eq(
                                        "application/json"
                                    );
                                    expect(response.body.owner.email).eq(
                                        testData.tenantManager
                                    );
                                    expect(response.body.users[0].email).eq(
                                        "sarja2@nilavodev.com"
                                    );
                                    expect(response.body.users[0].role).eq(
                                        "Owner"
                                    );
                                    expect(response.body.users[1].email).eq(
                                        "sarja3@nilavodev.com"
                                    );
                                    expect(response.body.users[1].role).eq(
                                        "Editor"
                                    );
                                });
                            });
                        });
                    });
            });
            it("List Invitations - API - Success", () => {
                //Response code not correct
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let folderId = null;
                        cy.fixture("data/apiTest.txt").then((file) => {
                            let blob = Cypress.Blob.binaryStringToBlob(
                                file,
                                "text/plain"
                            );
                            cy.wrap(
                                api
                                    .uploadFile(
                                        tenant,
                                        token,
                                        blob,
                                        api.generateUUID(),
                                        "apiTest.txt",
                                        "148",
                                        "text/plain",
                                        "Drive",
                                        "/Test/ShareThis"
                                    )
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        console.log(response);
                                        console.log(
                                            JSON.parse(response.response).id
                                        );
                                        console.log(
                                            JSON.parse(response.response)
                                                .parentFolderId
                                        );
                                        folderId = JSON.parse(
                                            response.response
                                        ).parentFolderId;
                                        return JSON.parse(response.response);
                                    })
                            ).then(() => {
                                let payload = {
                                    emails: ["sarja3@nilavodev.com"],
                                    inviteMessages: "share this",
                                    role: "Editor",
                                };
                                api.shareFolder(
                                    tenant,
                                    token,
                                    folderId,
                                    payload
                                ).then((response) => {
                                    console.log(response);
                                    expect(response.status).eq(200);
                                    expect(response.body.owner.email).eq(
                                        testData.tenantManager
                                    );
                                    expect(response.body.users[0].email).eq(
                                        "sarja2@nilavodev.com"
                                    );
                                    expect(response.body.users[0].role).eq(
                                        "Owner"
                                    );
                                    expect(response.body.users[1].email).eq(
                                        "sarja3@nilavodev.com"
                                    );
                                    expect(response.body.users[1].role).eq(
                                        "Editor"
                                    );
                                });
                            });
                        });
                    })
                    .then(() => {
                        api.tokenAuthentication(
                            tenant,
                            testData.recipientUser,
                            testData.password
                        )
                            .then((response) => {
                                expect(response.status).eq(200);
                                let bearerToken =
                                    response.headers.authorization;
                                console.log(bearerToken);
                                return bearerToken;
                            })
                            .then((token) => {
                                api.listInvitation(tenant, token).then(
                                    (response) => {
                                        expect(response.status).eq(200);
                                        expect(
                                            response.headers["content-type"]
                                        ).eq("application/json");
                                        expect(response.body[0].type).eq(
                                            "ShareInvite"
                                        );
                                    }
                                );
                            });
                    });
            });
            it("Accept Invitations - API - Success", () => {
                let shareFolderId = null;
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let folderId = null;

                        cy.fixture("data/apiTest.txt").then((file) => {
                            let blob = Cypress.Blob.binaryStringToBlob(
                                file,
                                "text/plain"
                            );
                            cy.wrap(
                                api
                                    .uploadFile(
                                        tenant,
                                        token,
                                        blob,
                                        api.generateUUID(),
                                        "apiTest.txt",
                                        "148",
                                        "text/plain",
                                        "Drive",
                                        "/Test/ShareThis"
                                    )
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        console.log(response);
                                        console.log(
                                            JSON.parse(response.response).id
                                        );
                                        console.log(
                                            JSON.parse(response.response)
                                                .parentFolderId
                                        );
                                        folderId = JSON.parse(
                                            response.response
                                        ).parentFolderId;
                                        return JSON.parse(response.response);
                                    })
                            ).then(() => {
                                let payload = {
                                    emails: ["sarja3@nilavodev.com"],
                                    inviteMessages: "share this",
                                    role: "Editor",
                                };
                                api.shareFolder(
                                    tenant,
                                    token,
                                    folderId,
                                    payload
                                ).then((response) => {
                                    console.log(response);
                                    expect(response.status).eq(200);
                                    expect(response.body.owner.email).eq(
                                        testData.tenantManager
                                    );
                                    expect(response.body.users[0].email).eq(
                                        "sarja2@nilavodev.com"
                                    );
                                    expect(response.body.users[0].role).eq(
                                        "Owner"
                                    );
                                    expect(response.body.users[1].email).eq(
                                        "sarja3@nilavodev.com"
                                    );
                                    expect(response.body.users[1].role).eq(
                                        "Editor"
                                    );
                                    shareFolderId = response.body.id;
                                });
                            });
                        });
                    })
                    .then(() => {
                        api.tokenAuthentication(
                            tenant,
                            testData.recipientUser,
                            testData.password
                        )
                            .then((response) => {
                                expect(response.status).eq(200);
                                let bearerToken =
                                    response.headers.authorization;
                                console.log(bearerToken);
                                return bearerToken;
                            })
                            .then((token) => {
                                let payload = {
                                    shareIds: [shareFolderId],
                                };

                                api.acceptInvitaion(
                                    tenant,
                                    token,
                                    payload
                                ).then((response) => {
                                    console.log(response);
                                    expect(response.status).eq(200);
                                    expect(response.headers["content-type"]).eq(
                                        "application/json"
                                    );
                                    expect(response.body.linkIds).to.be.a(
                                        "Array"
                                    );
                                    expect(
                                        response.body.subscribedShareIds
                                    ).to.be.a("Array"); //expect(response.body[0].type).eq('ShareInvite')

                                    expect(response.body.subscribedShareIds[0]).eq(shareFolderId);
                                });
                            });
                    });
            });
            it("Decline Invitations - API - Success", () => {
                let shareFolderId = null;
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let folderId = null;

                        cy.fixture("data/apiTest.txt").then((file) => {
                            let blob = Cypress.Blob.binaryStringToBlob(
                                file,
                                "text/plain"
                            );
                            cy.wrap(
                                api
                                    .uploadFile(
                                        tenant,
                                        token,
                                        blob,
                                        api.generateUUID(),
                                        "apiTest.txt",
                                        "148",
                                        "text/plain",
                                        "Drive",
                                        "/Test2/ShareThis"
                                    )
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        console.log(response);
                                        console.log(
                                            JSON.parse(response.response).id
                                        );
                                        console.log(
                                            JSON.parse(response.response)
                                                .parentFolderId
                                        );
                                        folderId = JSON.parse(
                                            response.response
                                        ).parentFolderId;
                                        return JSON.parse(response.response);
                                    })
                            ).then(() => {
                                let payload = {
                                    emails: ["sarja3@nilavodev.com"],
                                    inviteMessages: "share this",
                                    role: "Editor",
                                };
                                api.shareFolder(
                                    tenant,
                                    token,
                                    folderId,
                                    payload
                                ).then((response) => {
                                    console.log(response);
                                    expect(response.status).eq(200);
                                    expect(response.body.owner.email).eq(
                                        testData.tenantManager
                                    );
                                    expect(response.body.users[0].email).eq(
                                        "sarja2@nilavodev.com"
                                    );
                                    expect(response.body.users[0].role).eq(
                                        "Owner"
                                    );
                                    expect(response.body.users[1].email).eq(
                                        "sarja3@nilavodev.com"
                                    );
                                    expect(response.body.users[1].role).eq(
                                        "Editor"
                                    );
                                    shareFolderId = response.body.id;
                                });
                            });
                        });
                    })
                    .then(() => {
                        api.tokenAuthentication(
                            tenant,
                            testData.recipientUser,
                            testData.password
                        )
                            .then((response) => {
                                expect(response.status).eq(200);
                                let bearerToken =
                                    response.headers.authorization;
                                console.log(bearerToken);
                                return bearerToken;
                            })
                            .then((token) => {
                                let payload = {
                                    shareIds: [shareFolderId],
                                };

                                api.declineInvitaion(
                                    tenant,
                                    token,
                                    payload
                                ).then((response) => {
                                    console.log(response);
                                    expect(response.status).eq(200);
                                    expect(response.headers["content-type"]).eq(
                                        "application/json"
                                    );
                                    expect(
                                        response.body.declinedShareIds
                                    ).to.include(shareFolderId);
                                });
                            });
                    });
            });
        });

        describe("Unauthorized response", () => {
            it("Upload File - API - Unauthorized  - Invalid token given", () => {
                cy.fixture("data/apiTest.txt").then((file) => {
                    let blob = Cypress.Blob.binaryStringToBlob(
                        file,
                        "text/plain"
                    );
                    cy.wrap(
                        api
                            .uploadFile(
                                tenant,
                                "token",
                                blob,
                                " ",
                                "apiTest.txt",
                                "148",
                                "text/plain",
                                "Drive",
                                ""
                            )
                            .then((response) => {
                                expect(response.status).eq(401);
                                console.log(response);
                            })
                    );
                });
            });

            it("Get File/Folder Properties - API - Unauthorized", () => {
                //File also uploaded in path

                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        cy.fixture("data/apiTest.txt").then((file) => {
                            let blob = Cypress.Blob.binaryStringToBlob(
                                file,
                                "text/plain"
                            );
                            cy.wrap(
                                api
                                    .uploadFile(
                                        tenant,
                                        token,
                                        blob,
                                        api.generateUUID(),
                                        "apiTest.txt",
                                        "148",
                                        "text/plain",
                                        "Drive",
                                        "/Test/Folder"
                                    )
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        console.log(response);
                                        console.log(
                                            JSON.parse(response.response).id
                                        );
                                        console.log(
                                            JSON.parse(response.response)
                                                .parentFolderId
                                        );
                                        return JSON.parse(response.response);
                                    })
                            ).then((uploadResponse) => {
                                api.getFileFolderProperties(
                                    tenant,
                                    "token",
                                    uploadResponse.id
                                ).then((response) => {
                                    expect(response.body.status).eq(401);
                                });
                            });
                        });
                    });
            });
            it("Download File - API - Unauthorized", () => {
                //File also uploaded in path

                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        cy.fixture("data/apiTest.txt").then((file) => {
                            let blob = Cypress.Blob.binaryStringToBlob(
                                file,
                                "text/plain"
                            );
                            cy.wrap(
                                api
                                    .uploadFile(
                                        tenant,
                                        token,
                                        blob,
                                        api.generateUUID(),
                                        "apiTest.txt",
                                        "148",
                                        "text/plain",
                                        "Drive",
                                        "/Test/Folder"
                                    )
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        console.log(response);
                                        console.log(
                                            JSON.parse(response.response).id
                                        );
                                        console.log(
                                            JSON.parse(response.response)
                                                .parentFolderId
                                        );
                                        return JSON.parse(response.response);
                                    })
                            ).then((uploadResponse) => {
                                api.downloadFile(
                                    tenant,
                                    "token",
                                    uploadResponse.id
                                ).then((response) => {
                                    expect(response.status).eq(401);
                                    console.log(response);
                                });
                            });
                        });
                    });
            });
            it("Download As Zip - API - Unauthorized", () => {
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        cy.fixture("data/apiTest.txt").then((file) => {
                            let blob = Cypress.Blob.binaryStringToBlob(
                                file,
                                "text/plain"
                            );
                            cy.wrap(
                                api
                                    .uploadFile(
                                        tenant,
                                        token,
                                        blob,
                                        api.generateUUID(),
                                        "apiTest.txt",
                                        "148",
                                        "text/plain",
                                        "Drive",
                                        ""
                                    )
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        console.log(response);
                                        console.log(
                                            JSON.parse(response.response).id
                                        );
                                        console.log(
                                            JSON.parse(response.response)
                                                .parentFolderId
                                        );
                                        return JSON.parse(response.response);
                                    })
                            ).then((uploadResponse) => {
                                api.downloadAsZip(
                                    tenant,
                                    "token",
                                    [uploadResponse.id],
                                    api.generateUUID()
                                ).then((response) => {
                                    console.log(response);
                                    expect(response.status).eq(401);
                                });
                            });
                        });
                    });
            });
            it("Update File/Folder - API - Unauthorized - File/Folder both update", () => {
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        cy.fixture("data/apiTest.txt").then((file) => {
                            let blob = Cypress.Blob.binaryStringToBlob(
                                file,
                                "text/plain"
                            );
                            cy.wrap(
                                api
                                    .uploadFile(
                                        tenant,
                                        token,
                                        blob,
                                        api.generateUUID(),
                                        "apiTest.txt",
                                        "148",
                                        "text/plain",
                                        "Drive",
                                        "/folderOne"
                                    )
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        console.log(response);
                                        console.log(
                                            JSON.parse(response.response).id
                                        );
                                        console.log(
                                            JSON.parse(response.response)
                                                .parentFolderId
                                        );
                                        return JSON.parse(response.response);
                                    })
                            ).then((uploadResponse) => {
                                let payloadFile = {
                                    name: "newname.txt",
                                    description: "new description file",
                                };

                                let payloadFolder = {
                                    name: "newname",
                                    description: "new description folder",
                                };
                                api.updateFileFolder(
                                    tenant,
                                    "token",
                                    uploadResponse.id,
                                    payloadFile
                                ).then((response) => {
                                    console.log(response);
                                    expect(response.status).eq(401);
                                });
                                api.updateFileFolder(
                                    tenant,
                                    "token",
                                    uploadResponse.parentFolderId,
                                    payloadFolder
                                ).then((response) => {
                                    console.log(response);
                                    expect(response.status).eq(401);
                                });
                            });
                        });
                    });
            });
            it("Copy File/Folder - API - Unauthorized - File/Folder both copy", () => {
                //Folder copy reponse issue

                let fileId = null;
                let folderId = null;
                let destinationFolderId = null;

                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        cy.fixture("data/apiTest.txt").then((file) => {
                            let blob = Cypress.Blob.binaryStringToBlob(
                                file,
                                "text/plain"
                            );
                            cy.wrap(
                                api
                                    .uploadFile(
                                        tenant,
                                        token,
                                        blob,
                                        api.generateUUID(),
                                        "apiTest.txt",
                                        "148",
                                        "text/plain",
                                        "Drive",
                                        "/folderTwo"
                                    )
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        console.log(response);
                                        console.log(
                                            JSON.parse(response.response).id
                                        );
                                        console.log(
                                            JSON.parse(response.response)
                                                .parentFolderId
                                        );
                                        fileId = JSON.parse(
                                            response.response
                                        ).id;
                                        folderId = JSON.parse(
                                            response.response
                                        ).parentFolderId;
                                        return JSON.parse(response.response);
                                    })
                            )
                                .then(() => {
                                    cy.fixture("data/dragAndDrop.txt").then(
                                        (file) => {
                                            let blob =
                                                Cypress.Blob.binaryStringToBlob(
                                                    file,
                                                    "text/plain"
                                                );

                                            cy.wrap(
                                                api
                                                    .uploadFile(
                                                        tenant,
                                                        token,
                                                        blob,
                                                        api.generateUUID(),
                                                        "dragAndDrop.txt",
                                                        "104",
                                                        "text/plain",
                                                        "Drive",
                                                        "/folderThree"
                                                    )
                                                    .then((response) => {
                                                        expect(
                                                            response.status
                                                        ).eq(200);
                                                        console.log(response);
                                                        console.log(
                                                            JSON.parse(
                                                                response.response
                                                            ).id
                                                        );
                                                        console.log(
                                                            JSON.parse(
                                                                response.response
                                                            ).parentFolderId
                                                        );
                                                        destinationFolderId =
                                                            JSON.parse(
                                                                response.response
                                                            ).parentFolderId;
                                                        return JSON.parse(
                                                            response.response
                                                        );
                                                    })
                                            );
                                        }
                                    );
                                })
                                .then(() => {
                                    let payload = {
                                        destination: destinationFolderId,
                                    };

                                    api.copyFileFolder(
                                        tenant,
                                        "token",
                                        fileId,
                                        payload
                                    )
                                        .then((response) => {
                                            expect(response.status).eq(401);
                                            //expect(response.body.parentFolderId).eq(destinationFolderId)
                                        })
                                        .then(() => {
                                            api.copyFileFolder(
                                                tenant,
                                                "token",
                                                folderId,
                                                payload
                                            ).then((response) => {
                                                console.log(response);
                                                expect(response.status).eq(401);
                                                //expect(response.body.parentFolderId).eq(destinationFolderId)
                                            });
                                        });
                                });
                        });
                    });
            });
            it("Move File/Folder - API - Unauthorized - File/Folder both move", () => {
                //Folder copy reponse issue

                let fileId = null;
                let folderId = null;
                let destinationFolderId = null;

                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        cy.fixture("data/apiTest.txt").then((file) => {
                            let blob = Cypress.Blob.binaryStringToBlob(
                                file,
                                "text/plain"
                            );
                            cy.wrap(
                                api
                                    .uploadFile(
                                        tenant,
                                        token,
                                        blob,
                                        api.generateUUID(),
                                        "apiTest.txt",
                                        "148",
                                        "text/plain",
                                        "Drive",
                                        "/folderTwo"
                                    )
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        console.log(response);
                                        console.log(
                                            JSON.parse(response.response).id
                                        );
                                        console.log(
                                            JSON.parse(response.response)
                                                .parentFolderId
                                        );
                                        fileId = JSON.parse(
                                            response.response
                                        ).id;
                                        folderId = JSON.parse(
                                            response.response
                                        ).parentFolderId;
                                        return JSON.parse(response.response);
                                    })
                            )
                                .then(() => {
                                    cy.fixture("data/dragAndDrop.txt").then(
                                        (file) => {
                                            let blob =
                                                Cypress.Blob.binaryStringToBlob(
                                                    file,
                                                    "text/plain"
                                                );

                                            cy.wrap(
                                                api
                                                    .uploadFile(
                                                        tenant,
                                                        token,
                                                        blob,
                                                        api.generateUUID(),
                                                        "dragAndDrop.txt",
                                                        "104",
                                                        "text/plain",
                                                        "Drive",
                                                        "/folderThree"
                                                    )
                                                    .then((response) => {
                                                        expect(
                                                            response.status
                                                        ).eq(200);
                                                        console.log(response);
                                                        console.log(
                                                            JSON.parse(
                                                                response.response
                                                            ).id
                                                        );
                                                        console.log(
                                                            JSON.parse(
                                                                response.response
                                                            ).parentFolderId
                                                        );
                                                        destinationFolderId =
                                                            JSON.parse(
                                                                response.response
                                                            ).parentFolderId;
                                                        return JSON.parse(
                                                            response.response
                                                        );
                                                    })
                                            );
                                        }
                                    );
                                })
                                .then(() => {
                                    let payload = {
                                        destination: destinationFolderId,
                                    };

                                    api.moveFileFolder(
                                        tenant,
                                        "token",
                                        fileId,
                                        payload
                                    )
                                        .then((response) => {
                                            expect(response.status).eq(401);
                                            //expect(response.body.parentFolderId).eq(destinationFolderId)
                                        })
                                        .then(() => {
                                            api.moveFileFolder(
                                                tenant,
                                                "token",
                                                folderId,
                                                payload
                                            ).then((response) => {
                                                console.log(response);
                                                expect(response.status).eq(401);
                                                //expect(response.body.parentFolderId).eq(destinationFolderId)
                                            });
                                        });
                                });
                        });
                    });
            });
            it("Delete File/Folder - API - Unauthorized - File/Folder both delete", () => {
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        cy.fixture("data/apiTest.txt").then((file) => {
                            let blob = Cypress.Blob.binaryStringToBlob(
                                file,
                                "text/plain"
                            );
                            cy.wrap(
                                api
                                    .uploadFile(
                                        tenant,
                                        token,
                                        blob,
                                        api.generateUUID(),
                                        "apiTest.txt",
                                        "148",
                                        "text/plain",
                                        "Drive",
                                        ""
                                    )
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        console.log(response);
                                        console.log(
                                            JSON.parse(response.response).id
                                        );
                                        console.log(
                                            JSON.parse(response.response)
                                                .parentFolderId
                                        );

                                        return JSON.parse(response.response);
                                    })
                            ).then((uploadResponse) => {
                                api.delteFileFolder(tenant, "token", [
                                    uploadResponse.id,
                                ]).then((response) => {
                                    expect(response.status).eq(401);
                                });
                            });

                            cy.wrap(
                                api
                                    .uploadFile(
                                        tenant,
                                        token,
                                        blob,
                                        api.generateUUID(),
                                        "apiTest.txt",
                                        "148",
                                        "text/plain",
                                        "Drive",
                                        "/deleteThisFolder"
                                    )
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        console.log(response);
                                        console.log(
                                            JSON.parse(response.response).id
                                        );
                                        console.log(
                                            JSON.parse(response.response)
                                                .parentFolderId
                                        );
                                        return JSON.parse(response.response);
                                    })
                            ).then((uploadResponse) => {
                                api.delteFileFolder(tenant, "token", [
                                    uploadResponse.parentFolderId,
                                ]).then((response) => {
                                    expect(response.status).eq(401);
                                });
                            });
                        });
                    });
            });
            it("List Deleted Items - API - Unauthorized", () => {
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let idOne = null;
                        let idTwo = null;
                        cy.fixture("data/apiTest.txt")
                            .then((file) => {
                                let blob = Cypress.Blob.binaryStringToBlob(
                                    file,
                                    "text/plain"
                                );
                                cy.wrap(
                                    api
                                        .uploadFile(
                                            tenant,
                                            token,
                                            blob,
                                            api.generateUUID(),
                                            "apiTest.txt",
                                            "148",
                                            "text/plain",
                                            "Drive",
                                            ""
                                        )
                                        .then((response) => {
                                            expect(response.status).eq(200);
                                            console.log(response);
                                            console.log(
                                                JSON.parse(response.response).id
                                            );
                                            console.log(
                                                JSON.parse(response.response)
                                                    .parentFolderId
                                            );
                                            return JSON.parse(
                                                response.response
                                            );
                                        })
                                ).then((uploadResponse) => {
                                    api.delteFileFolder(tenant, token, [
                                        uploadResponse.id,
                                    ]).then((response) => {
                                        expect(response.status).eq(200);
                                        expect(
                                            response.body.operationSucceeded
                                        ).to.be.a("Array");
                                        expect(
                                            response.body.operationSucceeded
                                        ).to.contain(uploadResponse.id);
                                        idOne = uploadResponse.id;
                                    });
                                });

                                cy.wrap(
                                    api
                                        .uploadFile(
                                            tenant,
                                            token,
                                            blob,
                                            api.generateUUID(),
                                            "apiTest.txt",
                                            "148",
                                            "text/plain",
                                            "Drive",
                                            "/deleteThisFolder"
                                        )
                                        .then((response) => {
                                            expect(response.status).eq(200);
                                            console.log(response);
                                            console.log(
                                                JSON.parse(response.response).id
                                            );
                                            console.log(
                                                JSON.parse(response.response)
                                                    .parentFolderId
                                            );

                                            return JSON.parse(
                                                response.response
                                            );
                                        })
                                ).then((uploadResponse) => {
                                    api.delteFileFolder(tenant, token, [
                                        uploadResponse.parentFolderId,
                                    ]).then((response) => {
                                        expect(response.status).eq(200);
                                        expect(
                                            response.body.operationSucceeded
                                        ).to.be.a("Array");
                                        expect(
                                            response.body.operationSucceeded
                                        ).to.contain(
                                            uploadResponse.parentFolderId
                                        );
                                        idTwo = uploadResponse.parentFolderId;
                                    });
                                });
                            })
                            .then(() => {
                                api.listDeletedItems(tenant, "token").then(
                                    (response) => {
                                        console.log(response);
                                        expect(response.status).eq(401);
                                    }
                                );
                            });
                    });
            });
            it("Delete Files/Folders Permanently - API - Unauthorized", () => {
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let idOne = null;
                        let idTwo = null;
                        cy.fixture("data/apiTest.txt")
                            .then((file) => {
                                let blob = Cypress.Blob.binaryStringToBlob(
                                    file,
                                    "text/plain"
                                );
                                cy.wrap(
                                    api
                                        .uploadFile(
                                            tenant,
                                            token,
                                            blob,
                                            api.generateUUID(),
                                            "apiTest.txt",
                                            "148",
                                            "text/plain",
                                            "Drive",
                                            ""
                                        )
                                        .then((response) => {
                                            expect(response.status).eq(200);
                                            console.log(response);
                                            console.log(
                                                JSON.parse(response.response).id
                                            );
                                            console.log(
                                                JSON.parse(response.response)
                                                    .parentFolderId
                                            );
                                            return JSON.parse(
                                                response.response
                                            );
                                        })
                                ).then((uploadResponse) => {
                                    api.delteFileFolder(tenant, token, [
                                        uploadResponse.id,
                                    ]).then((response) => {
                                        expect(response.status).eq(200);
                                        expect(
                                            response.body.operationSucceeded
                                        ).to.be.a("Array");
                                        expect(
                                            response.body.operationSucceeded
                                        ).to.contain(uploadResponse.id);
                                        idOne = uploadResponse.id;
                                    });
                                });

                                cy.wrap(
                                    api
                                        .uploadFile(
                                            tenant,
                                            token,
                                            blob,
                                            api.generateUUID(),
                                            "apiTest.txt",
                                            "148",
                                            "text/plain",
                                            "Drive",
                                            "/deleteThisFolder"
                                        )
                                        .then((response) => {
                                            expect(response.status).eq(200);
                                            console.log(response);
                                            console.log(
                                                JSON.parse(response.response).id
                                            );
                                            console.log(
                                                JSON.parse(response.response)
                                                    .parentFolderId
                                            );

                                            return JSON.parse(
                                                response.response
                                            );
                                        })
                                ).then((uploadResponse) => {
                                    api.delteFileFolder(tenant, token, [
                                        uploadResponse.parentFolderId,
                                    ]).then((response) => {
                                        expect(response.status).eq(200);
                                        expect(
                                            response.body.operationSucceeded
                                        ).to.be.a("Array");
                                        expect(
                                            response.body.operationSucceeded
                                        ).to.contain(
                                            uploadResponse.parentFolderId
                                        );
                                        idTwo = uploadResponse.parentFolderId;
                                    });
                                });
                            })
                            .then(() => {
                                api.deleteFileFolderPermaently(
                                    tenant,
                                    "token",
                                    [idOne, idTwo]
                                ).then((response) => {
                                    console.log(response);
                                    expect(response.status).eq(401);
                                    expect(response.headers["content-type"]).eq(
                                        "application/json"
                                    );
                                    // expect(response.body.opertaionFailed).to.be.a('Array')
                                    // expect(response.body.opertaionFailed).to.include.members([idOne,idTwo])
                                });
                            });
                    });
            });
            it("Restore Files/Folders - API - Unauthorized", () => {
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let idOne = null;
                        let idTwo = null;
                        cy.fixture("data/apiTest.txt")
                            .then((file) => {
                                let blob = Cypress.Blob.binaryStringToBlob(
                                    file,
                                    "text/plain"
                                );
                                cy.wrap(
                                    api
                                        .uploadFile(
                                            tenant,
                                            token,
                                            blob,
                                            api.generateUUID(),
                                            "apiTest.txt",
                                            "148",
                                            "text/plain",
                                            "Drive",
                                            ""
                                        )
                                        .then((response) => {
                                            expect(response.status).eq(200);
                                            console.log(response);
                                            console.log(
                                                JSON.parse(response.response).id
                                            );
                                            console.log(
                                                JSON.parse(response.response)
                                                    .parentFolderId
                                            );
                                            return JSON.parse(
                                                response.response
                                            );
                                        })
                                ).then((uploadResponse) => {
                                    api.delteFileFolder(tenant, token, [
                                        uploadResponse.id,
                                    ]).then((response) => {
                                        expect(response.status).eq(200);
                                        expect(
                                            response.body.operationSucceeded
                                        ).to.be.a("Array");
                                        expect(
                                            response.body.operationSucceeded
                                        ).to.contain(uploadResponse.id);
                                        idOne = uploadResponse.id;
                                    });
                                });

                                cy.wrap(
                                    api
                                        .uploadFile(
                                            tenant,
                                            token,
                                            blob,
                                            api.generateUUID(),
                                            "apiTest.txt",
                                            "148",
                                            "text/plain",
                                            "Drive",
                                            "/deleteThisFolder"
                                        )
                                        .then((response) => {
                                            expect(response.status).eq(200);
                                            console.log(response);
                                            console.log(
                                                JSON.parse(response.response).id
                                            );
                                            console.log(
                                                JSON.parse(response.response)
                                                    .parentFolderId
                                            );

                                            return JSON.parse(
                                                response.response
                                            );
                                        })
                                ).then((uploadResponse) => {
                                    api.delteFileFolder(tenant, token, [
                                        uploadResponse.parentFolderId,
                                    ]).then((response) => {
                                        expect(response.status).eq(200);
                                        expect(
                                            response.body.operationSucceeded
                                        ).to.be.a("Array");
                                        expect(
                                            response.body.operationSucceeded
                                        ).to.contain(
                                            uploadResponse.parentFolderId
                                        );
                                        idTwo = uploadResponse.parentFolderId;
                                    });
                                });
                            })
                            .then(() => {
                                api.restoreFileFolder(tenant, "token", [
                                    idOne,
                                    idTwo,
                                ]).then((response) => {
                                    console.log(response);
                                    expect(response.status).eq(401);
                                    expect(response.headers["content-type"]).eq(
                                        "application/json"
                                    );
                                    // expect(response.body.operationSucceeded).to.be.a('Array')
                                    // expect(response.body.operationSucceeded).to.include.members([idOne,idTwo])
                                });
                            });
                    });
            });
            it("List File Version - API - Unauthorized", () => {
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let fileId = null;

                        cy.fixture("data/apiTest.txt").then((file) => {
                            let blob = Cypress.Blob.binaryStringToBlob(
                                file,
                                "text/plain"
                            );
                            cy.wrap(
                                api
                                    .uploadFile(
                                        tenant,
                                        token,
                                        blob,
                                        api.generateUUID(),
                                        "apiTesttxt",
                                        "148",
                                        "text/plain",
                                        "Drive",
                                        ""
                                    )
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        console.log(response);
                                        console.log(
                                            JSON.parse(response.response).id
                                        );
                                        console.log(
                                            JSON.parse(response.response)
                                                .parentFolderId
                                        );
                                        return JSON.parse(response.response);
                                    })
                            ).then((uploadResponse) => {
                                fileId = uploadResponse.id;
                            });
                        });

                        cy.fixture("data/version/apiTest.txt")
                            .then((file) => {
                                let blob = Cypress.Blob.binaryStringToBlob(
                                    file,
                                    "text/plain"
                                );
                                cy.wrap(
                                    api
                                        .uploadFile(
                                            tenant,
                                            token,
                                            blob,
                                            api.generateUUID(),
                                            "apiTest.txt",
                                            "158",
                                            "text/plain",
                                            "Drive",
                                            ""
                                        )
                                        .then((response) => {
                                            expect(response.status).eq(200);
                                            console.log(response);
                                            console.log(
                                                JSON.parse(response.response).id
                                            );
                                            console.log(
                                                JSON.parse(response.response)
                                                    .parentFolderId
                                            );
                                            return JSON.parse(
                                                response.response
                                            );
                                        })
                                ).then((uploadResponse) => {
                                    fileId = uploadResponse.id;
                                });
                            })
                            .then(() => {
                                api.listFileVersion(
                                    tenant,
                                    "token",
                                    fileId
                                ).then((response) => {
                                    expect(response.status).eq(401);
                                    expect(response.headers["content-type"]).eq(
                                        "application/json"
                                    );
                                });
                            });
                    });
            });
            it("List Folder - API - Unauthorized", () => {
                //File also uploaded in path

                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let folderId = null;
                        cy.fixture("data/apiTest.txt").then((file) => {
                            let blob = Cypress.Blob.binaryStringToBlob(
                                file,
                                "text/plain"
                            );
                            cy.wrap(
                                api
                                    .uploadFile(
                                        tenant,
                                        token,
                                        blob,
                                        api.generateUUID(),
                                        "apiTest.txt",
                                        "148",
                                        "text/plain",
                                        "Drive",
                                        "/Test/Folder"
                                    )
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        console.log(response);
                                        console.log(
                                            JSON.parse(response.response).id
                                        );
                                        console.log(
                                            JSON.parse(response.response)
                                                .parentFolderId
                                        );
                                        folderId = JSON.parse(
                                            response.response
                                        ).parentFolderId;
                                        return JSON.parse(response.response);
                                    })
                            );
                        });
                        cy.fixture("data/apiTestVersion.txt")
                            .then((file) => {
                                let blob = Cypress.Blob.binaryStringToBlob(
                                    file,
                                    "text/plain"
                                );
                                cy.wrap(
                                    api
                                        .uploadFile(
                                            tenant,
                                            token,
                                            blob,
                                            api.generateUUID(),
                                            "apiTestVersion.txt",
                                            "148",
                                            "text/plain",
                                            "Drive",
                                            "/Test/Folder/A"
                                        )
                                        .then((response) => {
                                            expect(response.status).eq(200);
                                            console.log(response);
                                            console.log(
                                                JSON.parse(response.response).id
                                            );
                                            console.log(
                                                JSON.parse(response.response)
                                                    .parentFolderId
                                            );
                                            return JSON.parse(
                                                response.response
                                            );
                                        })
                                );
                            })
                            .then(() => {
                                api.listFolder(tenant, "token", folderId).then(
                                    (response) => {
                                        expect(response.status).eq(401);
                                        expect(
                                            response.headers["content-type"]
                                        ).eq("application/json");
                                    }
                                );
                            });
                    });
            });
            it("Share Folder - API - Unauthorized", () => {
                //Response code not correct
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let folderId = null;
                        cy.fixture("data/apiTest.txt").then((file) => {
                            let blob = Cypress.Blob.binaryStringToBlob(
                                file,
                                "text/plain"
                            );
                            cy.wrap(
                                api
                                    .uploadFile(
                                        tenant,
                                        token,
                                        blob,
                                        api.generateUUID(),
                                        "apiTest.txt",
                                        "148",
                                        "text/plain",
                                        "Drive",
                                        "/Test/Folder"
                                    )
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        console.log(response);
                                        console.log(
                                            JSON.parse(response.response).id
                                        );
                                        console.log(
                                            JSON.parse(response.response)
                                                .parentFolderId
                                        );
                                        folderId = JSON.parse(
                                            response.response
                                        ).parentFolderId;
                                        return JSON.parse(response.response);
                                    })
                            ).then(() => {
                                let payload = {
                                    emails: ["sarja3@nilavodev.com"],
                                    inviteMessages: "share this",
                                    role: "Editor",
                                };
                                api.shareFolder(
                                    tenant,
                                    "token",
                                    folderId,
                                    payload
                                ).then((response) => {
                                    console.log(response);
                                    expect(response.status).eq(401);
                                });
                            });
                        });
                    });
            });
            it("List Invitations - API - Unauthorized", () => {
                //Response code not correct
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let folderId = null;
                        cy.fixture("data/apiTest.txt").then((file) => {
                            let blob = Cypress.Blob.binaryStringToBlob(
                                file,
                                "text/plain"
                            );
                            cy.wrap(
                                api
                                    .uploadFile(
                                        tenant,
                                        token,
                                        blob,
                                        api.generateUUID(),
                                        "apiTest.txt",
                                        "148",
                                        "text/plain",
                                        "Drive",
                                        "/Test/ShareThis"
                                    )
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        console.log(response);
                                        console.log(
                                            JSON.parse(response.response).id
                                        );
                                        console.log(
                                            JSON.parse(response.response)
                                                .parentFolderId
                                        );
                                        folderId = JSON.parse(
                                            response.response
                                        ).parentFolderId;
                                        return JSON.parse(response.response);
                                    })
                            ).then(() => {
                                let payload = {
                                    emails: ["sarja3@nilavodev.com"],
                                    inviteMessages: "share this",
                                    role: "Editor",
                                };
                                api.shareFolder(
                                    tenant,
                                    token,
                                    folderId,
                                    payload
                                ).then((response) => {
                                    console.log(response);
                                    expect(response.status).eq(200);
                                    expect(response.body.owner.email).eq(
                                        testData.tenantManager
                                    );
                                    expect(response.body.users[0].email).eq(
                                        "sarja2@nilavodev.com"
                                    );
                                    expect(response.body.users[0].role).eq(
                                        "Owner"
                                    );
                                    expect(response.body.users[1].email).eq(
                                        "sarja3@nilavodev.com"
                                    );
                                    expect(response.body.users[1].role).eq(
                                        "Editor"
                                    );
                                });
                            });
                        });
                    })
                    .then(() => {
                        api.tokenAuthentication(
                            tenant,
                            testData.recipientUser,
                            testData.password
                        )
                            .then((response) => {
                                expect(response.status).eq(200);
                                let bearerToken =
                                    response.headers.authorization;
                                console.log(bearerToken);
                                return bearerToken;
                            })
                            .then((token) => {
                                api.listInvitation(tenant, "token").then(
                                    (response) => {
                                        expect(response.status).eq(401);
                                    }
                                );
                            });
                    });
            });
            it("Accept Invitations - API - Unauthorized", () => {
                let shareFolderId = null;
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let folderId = null;

                        cy.fixture("data/apiTest.txt").then((file) => {
                            let blob = Cypress.Blob.binaryStringToBlob(
                                file,
                                "text/plain"
                            );
                            cy.wrap(
                                api
                                    .uploadFile(
                                        tenant,
                                        token,
                                        blob,
                                        api.generateUUID(),
                                        "apiTest.txt",
                                        "148",
                                        "text/plain",
                                        "Drive",
                                        "/Test/ShareThis"
                                    )
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        console.log(response);
                                        console.log(
                                            JSON.parse(response.response).id
                                        );
                                        console.log(
                                            JSON.parse(response.response)
                                                .parentFolderId
                                        );
                                        folderId = JSON.parse(
                                            response.response
                                        ).parentFolderId;
                                        return JSON.parse(response.response);
                                    })
                            ).then(() => {
                                let payload = {
                                    emails: ["sarja3@nilavodev.com"],
                                    inviteMessages: "share this",
                                    role: "Editor",
                                };
                                api.shareFolder(
                                    tenant,
                                    token,
                                    folderId,
                                    payload
                                ).then((response) => {
                                    console.log(response);
                                    expect(response.status).eq(200);
                                    expect(response.body.owner.email).eq(
                                        testData.tenantManager
                                    );
                                    expect(response.body.users[0].email).eq(
                                        "sarja2@nilavodev.com"
                                    );
                                    expect(response.body.users[0].role).eq(
                                        "Owner"
                                    );
                                    expect(response.body.users[1].email).eq(
                                        "sarja3@nilavodev.com"
                                    );
                                    expect(response.body.users[1].role).eq(
                                        "Editor"
                                    );
                                    shareFolderId = response.body.id;
                                });
                            });
                        });
                    })
                    .then(() => {
                        api.tokenAuthentication(
                            tenant,
                            testData.recipientUser,
                            testData.password
                        )
                            .then((response) => {
                                expect(response.status).eq(200);
                                let bearerToken =
                                    response.headers.authorization;
                                console.log(bearerToken);
                                return bearerToken;
                            })
                            .then((token) => {
                                let payload = {
                                    shareIds: [shareFolderId],
                                };

                                api.acceptInvitaion(
                                    tenant,
                                    "token",
                                    payload
                                ).then((response) => {
                                    console.log(response);
                                    expect(response.status).eq(401);
                                });
                            });
                    });
            });
            it("Decline Invitations - API - Unauthorized", () => {
                let shareFolderId = null;
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let folderId = null;

                        cy.fixture("data/apiTest.txt").then((file) => {
                            let blob = Cypress.Blob.binaryStringToBlob(
                                file,
                                "text/plain"
                            );
                            cy.wrap(
                                api
                                    .uploadFile(
                                        tenant,
                                        token,
                                        blob,
                                        api.generateUUID(),
                                        "apiTest.txt",
                                        "148",
                                        "text/plain",
                                        "Drive",
                                        "/Test2/ShareThis"
                                    )
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        console.log(response);
                                        console.log(
                                            JSON.parse(response.response).id
                                        );
                                        console.log(
                                            JSON.parse(response.response)
                                                .parentFolderId
                                        );
                                        folderId = JSON.parse(
                                            response.response
                                        ).parentFolderId;
                                        return JSON.parse(response.response);
                                    })
                            ).then(() => {
                                let payload = {
                                    emails: ["sarja3@nilavodev.com"],
                                    inviteMessages: "share this",
                                    role: "Editor",
                                };
                                api.shareFolder(
                                    tenant,
                                    token,
                                    folderId,
                                    payload
                                ).then((response) => {
                                    console.log(response);
                                    expect(response.status).eq(200);
                                    expect(response.body.owner.email).eq(
                                        testData.tenantManager
                                    );
                                    expect(response.body.users[0].email).eq(
                                        "sarja2@nilavodev.com"
                                    );
                                    expect(response.body.users[0].role).eq(
                                        "Owner"
                                    );
                                    expect(response.body.users[1].email).eq(
                                        "sarja3@nilavodev.com"
                                    );
                                    expect(response.body.users[1].role).eq(
                                        "Editor"
                                    );
                                    shareFolderId = response.body.id;
                                });
                            });
                        });
                    })
                    .then(() => {
                        api.tokenAuthentication(
                            tenant,
                            testData.recipientUser,
                            testData.password
                        )
                            .then((response) => {
                                expect(response.status).eq(200);
                                let bearerToken =
                                    response.headers.authorization;
                                console.log(bearerToken);
                                return bearerToken;
                            })
                            .then((token) => {
                                let payload = {
                                    shareIds: [shareFolderId],
                                };

                                api.declineInvitaion(
                                    tenant,
                                    "token",
                                    payload
                                ).then((response) => {
                                    console.log(response);
                                    expect(response.status).eq(401);
                                });
                            });
                    });
            });
        });

        describe("Bad request", () => {
            it("Upload File - API - Bad Request - Tracking id empty", () => {
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        cy.fixture("data/apiTest.txt").then((file) => {
                            let blob = Cypress.Blob.binaryStringToBlob(
                                file,
                                "text/plain"
                            );
                            cy.wrap(
                                api
                                    .uploadFile(
                                        tenant,
                                        token,
                                        blob,
                                        " ",
                                        "apiTest.txt",
                                        "148",
                                        "text/plain",
                                        "Drive",
                                        ""
                                    )
                                    .then((response) => {
                                        expect(response.status).eq(400);
                                        console.log(response);
                                    })
                            );
                        });
                    });
            });

            it("Get File/Folder Properties - API - Bad request", () => {
                //File also uploaded in path

                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        cy.fixture("data/apiTest.txt").then((file) => {
                            let blob = Cypress.Blob.binaryStringToBlob(
                                file,
                                "text/plain"
                            );
                            cy.wrap(
                                api
                                    .uploadFile(
                                        tenant,
                                        token,
                                        blob,
                                        api.generateUUID(),
                                        "apiTest.txt",
                                        "148",
                                        "text/plain",
                                        "Drive",
                                        "/Test/Folder"
                                    )
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        console.log(response);
                                        console.log(
                                            JSON.parse(response.response).id
                                        );
                                        console.log(
                                            JSON.parse(response.response)
                                                .parentFolderId
                                        );
                                        return JSON.parse(response.response);
                                    })
                            ).then((uploadResponse) => {
                                api.getFileFolderProperties(
                                    tenant,
                                    token,
                                    "asd"
                                ).then((response) => {
                                    expect(response.status).eq(400);
                                    expect(response.headers["x-api-error"]).eq(
                                        "entity.notFound"
                                    );
                                });
                            });
                        });
                    });
            });

            it.skip("Download File - API - Bad request", () => {
                //File also uploaded in path

                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        cy.fixture("data/apiTest.txt").then((file) => {
                            let blob = Cypress.Blob.binaryStringToBlob(
                                file,
                                "text/plain"
                            );
                            cy.wrap(
                                api
                                    .uploadFile(
                                        tenant,
                                        token,
                                        blob,
                                        api.generateUUID(),
                                        "apiTest.txt",
                                        "148",
                                        "text/plain",
                                        "Drive",
                                        "/Test/Folder"
                                    )
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        console.log(response);
                                        console.log(
                                            JSON.parse(response.response).id
                                        );
                                        console.log(
                                            JSON.parse(response.response)
                                                .parentFolderId
                                        );
                                        return JSON.parse(response.response);
                                    })
                            ).then((uploadResponse) => {
                                api.downloadFile(
                                    tenant,
                                    token,
                                    "uploadResponse.id"
                                ).then((response) => {
                                    expect(response.status).eq(400);
                                    console.log(response);
                                });
                            });
                        });
                    });
            });

            it.skip("Download As Zip - API - Bad request", () => {
                //will be implemented later

                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        cy.fixture("data/apiTest.txt").then((file) => {
                            let blob = Cypress.Blob.binaryStringToBlob(
                                file,
                                "text/plain"
                            );
                            cy.wrap(
                                api
                                    .uploadFile(
                                        tenant,
                                        token,
                                        blob,
                                        api.generateUUID(),
                                        "apiTest.txt",
                                        "148",
                                        "text/plain",
                                        "Drive",
                                        ""
                                    )
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        console.log(response);
                                        console.log(
                                            JSON.parse(response.response).id
                                        );
                                        console.log(
                                            JSON.parse(response.response)
                                                .parentFolderId
                                        );
                                        return JSON.parse(response.response);
                                    })
                            ).then((uploadResponse) => {
                                api.downloadAsZip(
                                    tenant,
                                    token,
                                    "[uploadResponse.id]",
                                    api.generateUUID()
                                ).then((response) => {
                                    console.log(response);
                                    expect(response.status).eq(400);
                                });
                            });
                        });
                    });
            });

            it("Update File/Folder - API - Bad request - File/Folder both update", () => {
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        cy.fixture("data/apiTest.txt").then((file) => {
                            let blob = Cypress.Blob.binaryStringToBlob(
                                file,
                                "text/plain"
                            );
                            cy.wrap(
                                api
                                    .uploadFile(
                                        tenant,
                                        token,
                                        blob,
                                        api.generateUUID(),
                                        "apiTest.txt",
                                        "148",
                                        "text/plain",
                                        "Drive",
                                        "/folderOne"
                                    )
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        console.log(response);
                                        console.log(
                                            JSON.parse(response.response).id
                                        );
                                        console.log(
                                            JSON.parse(response.response)
                                                .parentFolderId
                                        );
                                        return JSON.parse(response.response);
                                    })
                            ).then((uploadResponse) => {
                                let payloadFile = {
                                    name: "newname.txt",
                                    description: "new description file",
                                };

                                let payloadFolder = {
                                    name: "newname",
                                    description: "new description folder",
                                };
                                api.updateFileFolder(
                                    tenant,
                                    token,
                                    "uploadResponse.id",
                                    payloadFile
                                ).then((response) => {
                                    console.log(response);
                                    expect(response.status).eq(400);
                                    expect(response.headers["x-api-error"]).eq(
                                        "entity.notFound"
                                    );
                                });
                                api.updateFileFolder(
                                    tenant,
                                    token,
                                    "uploadResponse.parentFolderId",
                                    payloadFolder
                                ).then((response) => {
                                    console.log(response);
                                    expect(response.status).eq(400);
                                    expect(response.headers["x-api-error"]).eq(
                                        "entity.notFound"
                                    );
                                });
                            });
                        });
                    });
            });

            it("Copy File/Folder - API - Bad request - File/Folder both copy", () => {
                //Folder copy reponse issue

                let fileId = null;
                let folderId = null;
                let destinationFolderId = null;

                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        cy.fixture("data/apiTest.txt").then((file) => {
                            let blob = Cypress.Blob.binaryStringToBlob(
                                file,
                                "text/plain"
                            );
                            cy.wrap(
                                api
                                    .uploadFile(
                                        tenant,
                                        token,
                                        blob,
                                        api.generateUUID(),
                                        "apiTest.txt",
                                        "148",
                                        "text/plain",
                                        "Drive",
                                        "/folderTwo"
                                    )
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        console.log(response);
                                        console.log(
                                            JSON.parse(response.response).id
                                        );
                                        console.log(
                                            JSON.parse(response.response)
                                                .parentFolderId
                                        );
                                        fileId = JSON.parse(
                                            response.response
                                        ).id;
                                        folderId = JSON.parse(
                                            response.response
                                        ).parentFolderId;
                                        return JSON.parse(response.response);
                                    })
                            )
                                .then(() => {
                                    cy.fixture("data/dragAndDrop.txt").then(
                                        (file) => {
                                            let blob =
                                                Cypress.Blob.binaryStringToBlob(
                                                    file,
                                                    "text/plain"
                                                );

                                            cy.wrap(
                                                api
                                                    .uploadFile(
                                                        tenant,
                                                        token,
                                                        blob,
                                                        api.generateUUID(),
                                                        "dragAndDrop.txt",
                                                        "104",
                                                        "text/plain",
                                                        "Drive",
                                                        "/folderThree"
                                                    )
                                                    .then((response) => {
                                                        expect(
                                                            response.status
                                                        ).eq(200);
                                                        console.log(response);
                                                        console.log(
                                                            JSON.parse(
                                                                response.response
                                                            ).id
                                                        );
                                                        console.log(
                                                            JSON.parse(
                                                                response.response
                                                            ).parentFolderId
                                                        );
                                                        destinationFolderId =
                                                            JSON.parse(
                                                                response.response
                                                            ).parentFolderId;
                                                        return JSON.parse(
                                                            response.response
                                                        );
                                                    })
                                            );
                                        }
                                    );
                                })
                                .then(() => {
                                    let payload = {
                                        destination: "destinationFolderId",
                                    };

                                    api.copyFileFolder(
                                        tenant,
                                        token,
                                        fileId,
                                        payload
                                    )
                                        .then((response) => {
                                            expect(response.status).eq(400);
                                            expect(
                                                response.headers["x-api-error"]
                                            ).to.contain("destination.invalid");
                                            //expect(response.body.parentFolderId).eq(destinationFolderId)
                                        })
                                        .then(() => {
                                            let payload = {
                                                destination:
                                                    destinationFolderId,
                                            };
                                            api.copyFileFolder(
                                                tenant,
                                                token,
                                                "folderId",
                                                payload
                                            ).then((response) => {
                                                console.log(response);
                                                expect(response.status).eq(400);
                                                expect(
                                                    response.headers[
                                                        "x-api-error"
                                                    ]
                                                ).eq("entity.notFound");
                                                //expect(response.body.parentFolderId).eq(destinationFolderId)
                                            });
                                        });
                                });
                        });
                    });
            });

            it("Move File/Folder - API - Bad request - File/Folder both move", () => {
                //Folder copy reponse issue

                let fileId = null;
                let folderId = null;
                let destinationFolderId = null;

                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        cy.fixture("data/apiTest.txt").then((file) => {
                            let blob = Cypress.Blob.binaryStringToBlob(
                                file,
                                "text/plain"
                            );
                            cy.wrap(
                                api
                                    .uploadFile(
                                        tenant,
                                        token,
                                        blob,
                                        api.generateUUID(),
                                        "apiTest.txt",
                                        "148",
                                        "text/plain",
                                        "Drive",
                                        "/folderTwo"
                                    )
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        console.log(response);
                                        console.log(
                                            JSON.parse(response.response).id
                                        );
                                        console.log(
                                            JSON.parse(response.response)
                                                .parentFolderId
                                        );
                                        fileId = JSON.parse(
                                            response.response
                                        ).id;
                                        folderId = JSON.parse(
                                            response.response
                                        ).parentFolderId;
                                        return JSON.parse(response.response);
                                    })
                            )
                                .then(() => {
                                    cy.fixture("data/dragAndDrop.txt").then(
                                        (file) => {
                                            let blob =
                                                Cypress.Blob.binaryStringToBlob(
                                                    file,
                                                    "text/plain"
                                                );

                                            cy.wrap(
                                                api
                                                    .uploadFile(
                                                        tenant,
                                                        token,
                                                        blob,
                                                        api.generateUUID(),
                                                        "dragAndDrop.txt",
                                                        "104",
                                                        "text/plain",
                                                        "Drive",
                                                        "/folderThree"
                                                    )
                                                    .then((response) => {
                                                        expect(
                                                            response.status
                                                        ).eq(200);
                                                        console.log(response);
                                                        console.log(
                                                            JSON.parse(
                                                                response.response
                                                            ).id
                                                        );
                                                        console.log(
                                                            JSON.parse(
                                                                response.response
                                                            ).parentFolderId
                                                        );
                                                        destinationFolderId =
                                                            JSON.parse(
                                                                response.response
                                                            ).parentFolderId;
                                                        return JSON.parse(
                                                            response.response
                                                        );
                                                    })
                                            );
                                        }
                                    );
                                })
                                .then(() => {
                                    let payload = {
                                        destination: "destinationFolderId",
                                    };

                                    api.moveFileFolder(
                                        tenant,
                                        token,
                                        fileId,
                                        payload
                                    )
                                        .then((response) => {
                                            expect(response.status).eq(400);
                                            expect(
                                                response.headers["x-api-error"]
                                            ).to.contain("destination.invalid");
                                            //expect(response.body.parentFolderId).eq(destinationFolderId)
                                        })
                                        .then(() => {
                                            let payload = {
                                                destination:
                                                    destinationFolderId,
                                            };
                                            api.moveFileFolder(
                                                tenant,
                                                token,
                                                "folderId",
                                                payload
                                            ).then((response) => {
                                                console.log(response);
                                                expect(response.status).eq(400);
                                                expect(
                                                    response.headers[
                                                        "x-api-error"
                                                    ]
                                                ).eq("entity.notFound");
                                                //expect(response.body.parentFolderId).eq(destinationFolderId)
                                            });
                                        });
                                });
                        });
                    });
            });

            it.skip("Delete File/Folder - API - Bad request - File/Folder both delete", () => {
                //File/Folder copy reponse issue

                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        cy.fixture("data/apiTest.txt").then((file) => {
                            let blob = Cypress.Blob.binaryStringToBlob(
                                file,
                                "text/plain"
                            );
                            cy.wrap(
                                api
                                    .uploadFile(
                                        tenant,
                                        token,
                                        blob,
                                        api.generateUUID(),
                                        "apiTest.txt",
                                        "148",
                                        "text/plain",
                                        "Drive",
                                        ""
                                    )
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        console.log(response);
                                        console.log(
                                            JSON.parse(response.response).id
                                        );
                                        console.log(
                                            JSON.parse(response.response)
                                                .parentFolderId
                                        );

                                        return JSON.parse(response.response);
                                    })
                            ).then((uploadResponse) => {
                                api.delteFileFolder(tenant, token, [
                                    "uploadResponse.id",
                                ]).then((response) => {
                                    console.log(uploadResponse);
                                    expect(response.status).eq(400);
                                });
                            });

                            cy.wrap(
                                api
                                    .uploadFile(
                                        tenant,
                                        token,
                                        blob,
                                        api.generateUUID(),
                                        "apiTest.txt",
                                        "148",
                                        "text/plain",
                                        "Drive",
                                        "/deleteThisFolder"
                                    )
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        console.log(response);
                                        console.log(
                                            JSON.parse(response.response).id
                                        );
                                        console.log(
                                            JSON.parse(response.response)
                                                .parentFolderId
                                        );

                                        return JSON.parse(response.response);
                                    })
                            ).then((uploadResponse) => {
                                api.delteFileFolder(tenant, token, [
                                    "uploadResponse.parentFolderId",
                                ]).then((response) => {
                                    console.log(uploadResponse);
                                    expect(response.status).eq(400);
                                });
                            });
                        });
                    });
            });

            it.skip("List Deleted Items - API - Bad request", () => {
                //will be implemented later
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let idOne = null;
                        let idTwo = null;
                        cy.fixture("data/apiTest.txt")
                            .then((file) => {
                                let blob = Cypress.Blob.binaryStringToBlob(
                                    file,
                                    "text/plain"
                                );
                                cy.wrap(
                                    api
                                        .uploadFile(
                                            tenant,
                                            token,
                                            blob,
                                            api.generateUUID(),
                                            "apiTest.txt",
                                            "148",
                                            "text/plain",
                                            "Drive",
                                            ""
                                        )
                                        .then((response) => {
                                            expect(response.status).eq(200);
                                            console.log(response);
                                            console.log(
                                                JSON.parse(response.response).id
                                            );
                                            console.log(
                                                JSON.parse(response.response)
                                                    .parentFolderId
                                            );
                                            return JSON.parse(
                                                response.response
                                            );
                                        })
                                ).then((uploadResponse) => {
                                    api.delteFileFolder(tenant, token, [
                                        uploadResponse.id,
                                    ]).then((response) => {
                                        expect(response.status).eq(200);
                                        expect(
                                            response.body.operationSucceeded
                                        ).to.be.a("Array");
                                        expect(
                                            response.body.operationSucceeded
                                        ).to.contain(uploadResponse.id);
                                        idOne = uploadResponse.id;
                                    });
                                });

                                cy.wrap(
                                    api
                                        .uploadFile(
                                            tenant,
                                            token,
                                            blob,
                                            api.generateUUID(),
                                            "apiTest.txt",
                                            "148",
                                            "text/plain",
                                            "Drive",
                                            "/deleteThisFolder"
                                        )
                                        .then((response) => {
                                            expect(response.status).eq(200);
                                            console.log(response);
                                            console.log(
                                                JSON.parse(response.response).id
                                            );
                                            console.log(
                                                JSON.parse(response.response)
                                                    .parentFolderId
                                            );

                                            return JSON.parse(
                                                response.response
                                            );
                                        })
                                ).then((uploadResponse) => {
                                    api.delteFileFolder(tenant, token, [
                                        uploadResponse.parentFolderId,
                                    ]).then((response) => {
                                        expect(response.status).eq(200);
                                        expect(
                                            response.body.operationSucceeded
                                        ).to.be.a("Array");
                                        expect(
                                            response.body.operationSucceeded
                                        ).to.contain(
                                            uploadResponse.parentFolderId
                                        );
                                        idTwo = uploadResponse.parentFolderId;
                                    });
                                });
                            })
                            .then(() => {
                                api.listDeletedItems(tenant, token).then(
                                    (response) => {
                                        console.log(response);
                                        expect(response.status).eq(200);
                                        expect(
                                            response.headers["content-type"]
                                        ).eq("application/json");
                                        expect(response.body).to.be.a("Array");

                                        let result = false;
                                        let resultTwo = false;

                                        let match1 = response.body.find(
                                            (o) => o.id === idOne
                                        );
                                        let match2 = response.body.find(
                                            (o) => o.id === idTwo
                                        );
                                        if (match1) {
                                            result = true;
                                        }
                                        if (match2) {
                                            resultTwo = true;
                                        }

                                        expect(result).to.be.true;
                                        expect(resultTwo).to.be.true;
                                    }
                                );
                            });
                    });
            });

            it.skip("Delete Files/Folders Permanently - API - Bad request", () => {
                //response code not correct
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let idOne = null;
                        let idTwo = null;
                        cy.fixture("data/apiTest.txt")
                            .then((file) => {
                                let blob = Cypress.Blob.binaryStringToBlob(
                                    file,
                                    "text/plain"
                                );
                                cy.wrap(
                                    api
                                        .uploadFile(
                                            tenant,
                                            token,
                                            blob,
                                            api.generateUUID(),
                                            "apiTest.txt",
                                            "148",
                                            "text/plain",
                                            "Drive",
                                            ""
                                        )
                                        .then((response) => {
                                            expect(response.status).eq(200);
                                            console.log(response);
                                            console.log(
                                                JSON.parse(response.response).id
                                            );
                                            console.log(
                                                JSON.parse(response.response)
                                                    .parentFolderId
                                            );
                                            return JSON.parse(
                                                response.response
                                            );
                                        })
                                ).then((uploadResponse) => {
                                    api.delteFileFolder(tenant, token, [
                                        uploadResponse.id,
                                    ]).then((response) => {
                                        expect(response.status).eq(200);
                                        expect(
                                            response.body.operationSucceeded
                                        ).to.be.a("Array");
                                        expect(
                                            response.body.operationSucceeded
                                        ).to.contain(uploadResponse.id);
                                        idOne = uploadResponse.id;
                                    });
                                });

                                cy.wrap(
                                    api
                                        .uploadFile(
                                            tenant,
                                            token,
                                            blob,
                                            api.generateUUID(),
                                            "apiTest.txt",
                                            "148",
                                            "text/plain",
                                            "Drive",
                                            "/deleteThisFolder"
                                        )
                                        .then((response) => {
                                            expect(response.status).eq(200);
                                            console.log(response);
                                            console.log(
                                                JSON.parse(response.response).id
                                            );
                                            console.log(
                                                JSON.parse(response.response)
                                                    .parentFolderId
                                            );

                                            return JSON.parse(
                                                response.response
                                            );
                                        })
                                ).then((uploadResponse) => {
                                    api.delteFileFolder(tenant, token, [
                                        uploadResponse.parentFolderId,
                                    ]).then((response) => {
                                        expect(response.status).eq(200);
                                        expect(
                                            response.body.operationSucceeded
                                        ).to.be.a("Array");
                                        expect(
                                            response.body.operationSucceeded
                                        ).to.contain(
                                            uploadResponse.parentFolderId
                                        );
                                        idTwo = uploadResponse.parentFolderId;
                                    });
                                });
                            })
                            .then(() => {
                                api.deleteFileFolderPermaently(tenant, token, [
                                    "idOne",
                                    "idTwo",
                                ]).then((response) => {
                                    console.log(response);
                                    //expect(response.status).eq(400)
                                    expect(response.headers["content-type"]).eq(
                                        "application/json"
                                    );
                                    expect(
                                        response.body.operationFailed
                                    ).to.be.a("Array");
                                    expect(
                                        response.body.operationFailed
                                    ).to.include.members(["idOne", "idTwo"]);
                                });
                            });
                    });
            });

            it.skip("Restore Files/Folders - API - Bad request", () => {
                //response code is not configured properly

                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        //expect(response.status).eq(200)
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let idOne = null;
                        let idTwo = null;
                        cy.fixture("data/apiTest.txt")
                            .then((file) => {
                                let blob = Cypress.Blob.binaryStringToBlob(
                                    file,
                                    "text/plain"
                                );
                                cy.wrap(
                                    api
                                        .uploadFile(
                                            tenant,
                                            token,
                                            blob,
                                            api.generateUUID(),
                                            "apiTest.txt",
                                            "148",
                                            "text/plain",
                                            "Drive",
                                            ""
                                        )
                                        .then((response) => {
                                            expect(response.status).eq(200);
                                            console.log(response);
                                            console.log(
                                                JSON.parse(response.response).id
                                            );
                                            console.log(
                                                JSON.parse(response.response)
                                                    .parentFolderId
                                            );
                                            return JSON.parse(
                                                response.response
                                            );
                                        })
                                ).then((uploadResponse) => {
                                    api.delteFileFolder(tenant, token, [
                                        uploadResponse.id,
                                    ]).then((response) => {
                                        expect(response.status).eq(200);
                                        expect(
                                            response.body.operationSucceeded
                                        ).to.be.a("Array");
                                        expect(
                                            response.body.operationSucceeded
                                        ).to.contain(uploadResponse.id);
                                        idOne = uploadResponse.id;
                                    });
                                });

                                cy.wrap(
                                    api
                                        .uploadFile(
                                            tenant,
                                            token,
                                            blob,
                                            api.generateUUID(),
                                            "apiTest.txt",
                                            "148",
                                            "text/plain",
                                            "Drive",
                                            "/deleteThisFolder"
                                        )
                                        .then((response) => {
                                            expect(response.status).eq(200);
                                            console.log(response);
                                            console.log(
                                                JSON.parse(response.response).id
                                            );
                                            console.log(
                                                JSON.parse(response.response)
                                                    .parentFolderId
                                            );

                                            return JSON.parse(
                                                response.response
                                            );
                                        })
                                ).then((uploadResponse) => {
                                    api.delteFileFolder(tenant, token, [
                                        uploadResponse.parentFolderId,
                                    ]).then((response) => {
                                        expect(response.status).eq(200);
                                        expect(
                                            response.body.operationSucceeded
                                        ).to.be.a("Array");
                                        expect(
                                            response.body.operationSucceeded
                                        ).to.contain(
                                            uploadResponse.parentFolderId
                                        );
                                        idTwo = uploadResponse.parentFolderId;
                                    });
                                });
                            })
                            .then(() => {
                                api.restoreFileFolder(tenant, token, [
                                    "idOne",
                                    "idTwo",
                                ]).then((response) => {
                                    console.log(response);
                                    expect(response.status).eq(400);
                                    expect(response.headers["content-type"]).eq(
                                        "application/json"
                                    );
                                    expect(
                                        response.body.operationFailed
                                    ).to.be.a("Array");
                                    expect(
                                        response.body.operationFailed
                                    ).to.include.members(["idOne", "idTwo"]);
                                });
                            });
                    });
            });

            it("List File Version - API - Bad request", () => {
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let fileId = null;

                        cy.fixture("data/apiTest.txt").then((file) => {
                            let blob = Cypress.Blob.binaryStringToBlob(
                                file,
                                "text/plain"
                            );
                            cy.wrap(
                                api
                                    .uploadFile(
                                        tenant,
                                        token,
                                        blob,
                                        api.generateUUID(),
                                        "apiTesttxt",
                                        "148",
                                        "text/plain",
                                        "Drive",
                                        ""
                                    )
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        console.log(response);
                                        console.log(
                                            JSON.parse(response.response).id
                                        );
                                        console.log(
                                            JSON.parse(response.response)
                                                .parentFolderId
                                        );
                                        return JSON.parse(response.response);
                                    })
                            ).then((uploadResponse) => {
                                fileId = uploadResponse.id;
                            });
                        });

                        cy.fixture("data/version/apiTest.txt")
                            .then((file) => {
                                let blob = Cypress.Blob.binaryStringToBlob(
                                    file,
                                    "text/plain"
                                );
                                cy.wrap(
                                    api
                                        .uploadFile(
                                            tenant,
                                            token,
                                            blob,
                                            api.generateUUID(),
                                            "apiTest.txt",
                                            "158",
                                            "text/plain",
                                            "Drive",
                                            ""
                                        )
                                        .then((response) => {
                                            expect(response.status).eq(200);
                                            console.log(response);
                                            console.log(
                                                JSON.parse(response.response).id
                                            );
                                            console.log(
                                                JSON.parse(response.response)
                                                    .parentFolderId
                                            );
                                            return JSON.parse(
                                                response.response
                                            );
                                        })
                                ).then((uploadResponse) => {
                                    fileId = uploadResponse.id;
                                });
                            })
                            .then(() => {
                                api.listFileVersion(
                                    tenant,
                                    token,
                                    "fileId"
                                ).then((response) => {
                                    expect(response.status).eq(400);
                                    expect(response.headers["x-api-error"]).eq(
                                        "entity.notFound"
                                    );
                                    //expect(response.headers['content-type']).eq('application/json')
                                });
                            });
                    });
            });

            it.skip("List Folder - API - Bad request", () => {
                //Response code not correct
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let folderId = null;
                        cy.fixture("data/apiTest.txt").then((file) => {
                            let blob = Cypress.Blob.binaryStringToBlob(
                                file,
                                "text/plain"
                            );
                            cy.wrap(
                                api
                                    .uploadFile(
                                        tenant,
                                        token,
                                        blob,
                                        api.generateUUID(),
                                        "apiTest.txt",
                                        "148",
                                        "text/plain",
                                        "Drive",
                                        "/Test/Folder"
                                    )
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        console.log(response);
                                        console.log(
                                            JSON.parse(response.response).id
                                        );
                                        console.log(
                                            JSON.parse(response.response)
                                                .parentFolderId
                                        );
                                        folderId = JSON.parse(
                                            response.response
                                        ).parentFolderId;
                                        return JSON.parse(response.response);
                                    })
                            );
                        });
                        cy.fixture("data/apiTestVersion.txt")
                            .then((file) => {
                                let blob = Cypress.Blob.binaryStringToBlob(
                                    file,
                                    "text/plain"
                                );
                                cy.wrap(
                                    api
                                        .uploadFile(
                                            tenant,
                                            token,
                                            blob,
                                            api.generateUUID(),
                                            "apiTestVersion.txt",
                                            "148",
                                            "text/plain",
                                            "Drive",
                                            "/Test/Folder/A"
                                        )
                                        .then((response) => {
                                            expect(response.status).eq(200);
                                            console.log(response);
                                            console.log(
                                                JSON.parse(response.response).id
                                            );
                                            console.log(
                                                JSON.parse(response.response)
                                                    .parentFolderId
                                            );
                                            return JSON.parse(
                                                response.response
                                            );
                                        })
                                );
                            })
                            .then(() => {
                                api.listFolder(tenant, token, "folderId").then(
                                    (response) => {
                                        expect(response.status).eq(400);
                                        expect(
                                            response.headers["content-type"]
                                        ).eq("application/json");
                                    }
                                );
                            });
                    });
            });

            it("Share Folder - API - Bad request", () => {
                //Response code not correct
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let folderId = null;
                        cy.fixture("data/apiTest.txt").then((file) => {
                            let blob = Cypress.Blob.binaryStringToBlob(
                                file,
                                "text/plain"
                            );
                            cy.wrap(
                                api
                                    .uploadFile(
                                        tenant,
                                        token,
                                        blob,
                                        api.generateUUID(),
                                        "apiTest.txt",
                                        "148",
                                        "text/plain",
                                        "Drive",
                                        "/Test/Folder"
                                    )
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        console.log(response);
                                        console.log(
                                            JSON.parse(response.response).id
                                        );
                                        console.log(
                                            JSON.parse(response.response)
                                                .parentFolderId
                                        );
                                        folderId = JSON.parse(
                                            response.response
                                        ).parentFolderId;
                                        return JSON.parse(response.response);
                                    })
                            ).then(() => {
                                let payload = {
                                    emails: ["sarja3@nilavodev.com"],
                                    inviteMessages: "share this",
                                    role: "Editor",
                                };

                                api.shareFolder(
                                    tenant,
                                    token,
                                    "folderId",
                                    payload
                                ).then((response) => {
                                    console.log(response);
                                    expect(response.status).eq(400);
                                    expect(response.headers["x-api-error"]).eq(
                                        "entity.notFound"
                                    );
                                });
                            });
                        });
                    });
            });

            it.skip("List Invitations - API - Bad request", () => {
                //wll be implemented later
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let folderId = null;
                        cy.fixture("data/apiTest.txt").then((file) => {
                            let blob = Cypress.Blob.binaryStringToBlob(
                                file,
                                "text/plain"
                            );
                            cy.wrap(
                                api
                                    .uploadFile(
                                        tenant,
                                        token,
                                        blob,
                                        api.generateUUID(),
                                        "apiTest.txt",
                                        "148",
                                        "text/plain",
                                        "Drive",
                                        "/Test/ShareThis"
                                    )
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        console.log(response);
                                        console.log(
                                            JSON.parse(response.response).id
                                        );
                                        console.log(
                                            JSON.parse(response.response)
                                                .parentFolderId
                                        );
                                        folderId = JSON.parse(
                                            response.response
                                        ).parentFolderId;
                                        return JSON.parse(response.response);
                                    })
                            ).then(() => {
                                let payload = {
                                    emails: ["sarja3@nilavodev.com"],
                                    inviteMessages: "share this",
                                    role: "Editor",
                                };
                                api.shareFolder(
                                    tenant,
                                    token,
                                    folderId,
                                    payload
                                ).then((response) => {
                                    console.log(response);
                                    expect(response.status).eq(200);
                                    expect(response.body.owner.email).eq(
                                        testData.tenantManager
                                    );
                                    expect(response.body.users[0].email).eq(
                                        "sarja2@nilavodev.com"
                                    );
                                    expect(response.body.users[0].role).eq(
                                        "Owner"
                                    );
                                    expect(response.body.users[1].email).eq(
                                        "sarja3@nilavodev.com"
                                    );
                                    expect(response.body.users[1].role).eq(
                                        "Editor"
                                    );
                                });
                            });
                        });
                    })
                    .then(() => {
                        api.tokenAuthentication(
                            tenant,
                            testData.recipientUser,
                            testData.password
                        )
                            .then((response) => {
                                expect(response.status).eq(200);
                                let bearerToken =
                                    response.headers.authorization;
                                console.log(bearerToken);
                                return bearerToken;
                            })
                            .then((token) => {
                                api.listInvitation(tenant, token).then(
                                    (response) => {
                                        expect(response.status).eq(400);
                                    }
                                );
                            });
                    });
            });

            it.skip("Accept Invitations - API - Bad request", () => {
                let shareFolderId = null;
                //Response code not correct
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let folderId = null;

                        cy.fixture("data/apiTest.txt").then((file) => {
                            let blob = Cypress.Blob.binaryStringToBlob(
                                file,
                                "text/plain"
                            );
                            cy.wrap(
                                api
                                    .uploadFile(
                                        tenant,
                                        token,
                                        blob,
                                        api.generateUUID(),
                                        "apiTest.txt",
                                        "148",
                                        "text/plain",
                                        "Drive",
                                        "/Test/ShareThis"
                                    )
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        console.log(response);
                                        console.log(
                                            JSON.parse(response.response).id
                                        );
                                        console.log(
                                            JSON.parse(response.response)
                                                .parentFolderId
                                        );
                                        folderId = JSON.parse(
                                            response.response
                                        ).parentFolderId;
                                        return JSON.parse(response.response);
                                    })
                            ).then(() => {
                                let payload = {
                                    emails: ["sarja3@nilavodev.com"],
                                    inviteMessages: "share this",
                                    role: "Editor",
                                };
                                api.shareFolder(
                                    tenant,
                                    token,
                                    folderId,
                                    payload
                                ).then((response) => {
                                    console.log(response);
                                    expect(response.status).eq(200);
                                    expect(response.body.owner.email).eq(
                                        testData.tenantManager
                                    );
                                    expect(response.body.users[0].email).eq(
                                        "sarja2@nilavodev.com"
                                    );
                                    expect(response.body.users[0].role).eq(
                                        "Owner"
                                    );
                                    expect(response.body.users[1].email).eq(
                                        "sarja3@nilavodev.com"
                                    );
                                    expect(response.body.users[1].role).eq(
                                        "Editor"
                                    );
                                    shareFolderId = response.body.id;
                                });
                            });
                        });
                    })
                    .then(() => {
                        api.tokenAuthentication(
                            tenant,
                            testData.recipientUser,
                            testData.password
                        )
                            .then((response) => {
                                expect(response.status).eq(200);
                                let bearerToken =
                                    response.headers.authorization;
                                console.log(bearerToken);
                                return bearerToken;
                            })
                            .then((token) => {
                                let payload = {
                                    shareIds: ['shareFolderId'],
                                };

                                api.acceptInvitaion(
                                    tenant,
                                    token,
                                    payload
                                ).then((response) => {
                                    console.log(response);
                                    expect(response.status).eq(400);
                                    expect(response.headers["x-api-error"]).eq(
                                        "entity.notFound"
                                    );
                                });
                            });
                    });
            });

            it.skip("Decline Invitations - API - Bad request", () => {
                //response code not correct
                let shareFolderId = null;
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let folderId = null;

                        cy.fixture("data/apiTest.txt").then((file) => {
                            let blob = Cypress.Blob.binaryStringToBlob(
                                file,
                                "text/plain"
                            );
                            cy.wrap(
                                api
                                    .uploadFile(
                                        tenant,
                                        token,
                                        blob,
                                        api.generateUUID(),
                                        "apiTest.txt",
                                        "148",
                                        "text/plain",
                                        "Drive",
                                        "/Test2/ShareThis"
                                    )
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        console.log(response);
                                        console.log(
                                            JSON.parse(response.response).id
                                        );
                                        console.log(
                                            JSON.parse(response.response)
                                                .parentFolderId
                                        );
                                        folderId = JSON.parse(
                                            response.response
                                        ).parentFolderId;
                                        return JSON.parse(response.response);
                                    })
                            ).then(() => {
                                let payload = {
                                    emails: ["sarja3@nilavodev.com"],
                                    inviteMessages: "share this",
                                    role: "Editor",
                                };
                                api.shareFolder(
                                    tenant,
                                    token,
                                    folderId,
                                    payload
                                ).then((response) => {
                                    console.log(response);
                                    expect(response.status).eq(200);
                                    expect(response.body.owner.email).eq(
                                        testData.tenantManager
                                    );
                                    expect(response.body.users[0].email).eq(
                                        "sarja2@nilavodev.com"
                                    );
                                    expect(response.body.users[0].role).eq(
                                        "Owner"
                                    );
                                    expect(response.body.users[1].email).eq(
                                        "sarja3@nilavodev.com"
                                    );
                                    expect(response.body.users[1].role).eq(
                                        "Editor"
                                    );
                                    shareFolderId = response.body.id;
                                });
                            });
                        });
                    })
                    .then(() => {
                        api.tokenAuthentication(
                            tenant,
                            testData.recipientUser,
                            testData.password
                        )
                            .then((response) => {
                                expect(response.status).eq(200);
                                let bearerToken =
                                    response.headers.authorization;
                                console.log(bearerToken);
                                return bearerToken;
                            })
                            .then((token) => {
                                let payload = {
                                    shareIds: ['shareFolderId'],
                                };

                                api.declineInvitaion(
                                    tenant,
                                    token,
                                    payload
                                ).then((response) => {
                                    console.log(response);
                                    expect(response.status).eq(400);
                                    expect(response.headers["x-api-error"]).eq(
                                        "entity.notFound"
                                    );
                                });
                            });
                    });
            });
        });
    });

    describe("Messages", () => {

        describe("Success response", () => {
            it("Create Message - API - Success", () => {
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let date = new Date();
                        date.setDate(date.getDate() + 3);

                        let payload = {
                            to: [
                                {
                                    displayName: "Sarja One",
                                    email: "sarja3@nilavodev.com",
                                },
                            ],
                            cc: [
                                {
                                    displayName: "Sarja Four",
                                    email: "sarja4@nilavodev.com",
                                },
                            ],
                            bcc: [
                                {
                                    displayName: "Sarja Five",
                                    email: "sarja5@nilavodev.com",
                                },
                            ],
                            subject: "Message from sarja1",
                            secureMessage: "<p> This secure </p>",
                            notificationMessage:
                                "<p> This is notification </p>",
                            dateExpires: date,
                            requireSignIn: true,
                        };

                        api.createMessage(tenant, token, payload).then(
                            (response) => {
                                console.log(response);
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.subject).eq(
                                    payload.subject
                                );
                            }
                        );
                    });
            });

            it("Get Draft Message - API - Success", () => {
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let date = new Date();
                        date.setDate(date.getDate() + 3);

                        let payload = {
                            to: [
                                {
                                    displayName: "Sarja One",
                                    email: "sarja3@nilavodev.com",
                                },
                            ],
                            cc: [
                                {
                                    displayName: "Sarja Four",
                                    email: "sarja4@nilavodev.com",
                                },
                            ],
                            bcc: [
                                {
                                    displayName: "Sarja Five",
                                    email: "sarja5@nilavodev.com",
                                },
                            ],
                            subject: "Message from sarja1",
                            secureMessage: "<p> This secure </p>",
                            notificationMessage:
                                "<p> This is notification </p>",
                            dateExpires: date,
                            requireSignIn: true,
                        };

                        api.createMessage(tenant, token, payload).then(
                            (response) => {
                                console.log(response);
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.subject).eq(
                                    payload.subject
                                );

                                api.getDraftMessage(
                                    tenant,
                                    token,
                                    response.body.id
                                ).then((r) => {
                                    expect(r.status).eq(200);
                                    expect(r.body.id).eq(response.body.id);
                                    expect(r.body.subject).eq(payload.subject);
                                });
                            }
                        );
                    });
            });
            it("Update Draft Message - API - Success", () => {
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let date = new Date();
                        date.setDate(date.getDate() + 3);

                        let payload = {
                            to: [
                                {
                                    displayName: "Sarja One",
                                    email: "sarja3@nilavodev.com",
                                },
                            ],
                            cc: [
                                {
                                    displayName: "Sarja Four",
                                    email: "sarja4@nilavodev.com",
                                },
                            ],
                            bcc: [
                                {
                                    displayName: "Sarja Five",
                                    email: "sarja5@nilavodev.com",
                                },
                            ],
                            subject: "Message from sarja1",
                            secureMessage: "<p> This secure </p>",
                            notificationMessage:
                                "<p> This is notification </p>",
                            dateExpires: date,
                            requireSignIn: true,
                        };

                        api.createMessage(tenant, token, payload).then(
                            (response) => {
                                console.log(response);
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.subject).eq(
                                    payload.subject
                                );

                                let payloadDraft = {
                                    subject: "Update from draft1",
                                };

                                api.updateDraftMessage(
                                    tenant,
                                    token,
                                    payloadDraft,
                                    response.body.id
                                ).then((r) => {
                                    expect(r.status).eq(200);
                                    expect(r.body.id).eq(response.body.id);
                                    expect(r.body.subject).eq(
                                        payloadDraft.subject
                                    );
                                });
                            }
                        );
                    });
            });
            it("Send Message - API - Success", () => {
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let date = new Date();
                        date.setDate(date.getDate() + 3);

                        let payload = {
                            to: [
                                {
                                    displayName: "Sarja One",
                                    email: "sarja3@nilavodev.com",
                                },
                            ],
                            cc: [
                                {
                                    displayName: "Sarja Four",
                                    email: "sarja4@nilavodev.com",
                                },
                            ],
                            bcc: [
                                {
                                    displayName: "Sarja Five",
                                    email: "sarja5@nilavodev.com",
                                },
                            ],
                            subject: "Message from sarja1",
                            secureMessage: "<p> This secure </p>",
                            notificationMessage:
                                "<p> This is notification </p>",
                            dateExpires: date,
                            requireSignIn: true,
                        };

                        api.createMessage(tenant, token, payload).then(
                            (response) => {
                                console.log(response);
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.subject).eq(
                                    payload.subject
                                );

                                let payloadSendMessage = {
                                    id: response.body.id,
                                    to: [
                                        {
                                            displayName: "Sarja One",
                                            email: "sarja3@nilavodev.com",
                                        },
                                    ],
                                    cc: [
                                        {
                                            displayName: "Sarja Two",
                                            email: "sarja4@nilavodev.com",
                                        },
                                    ],
                                    bcc: [
                                        {
                                            displayName: "Sarja Three",
                                            email: "sarja5@nilavodev.com",
                                        },
                                    ],
                                    subject: "Message from sarja1",
                                    secureMessage: "<p> This secure </p>",
                                    notificationMessage:
                                        "<p> This is notification </p>",
                                    dateExpires: date,
                                    requireSignIn: true,
                                };

                                api.sendMessage(
                                    tenant,
                                    token,
                                    payloadSendMessage
                                ).then((r) => {
                                    expect(r.status).eq(200);
                                    expect(r.body.id).eq(payloadSendMessage.id);
                                    expect(r.body.subject).eq(
                                        payloadSendMessage.subject
                                    );
                                });
                            }
                        );
                    });
            });
            it("List Message Threads - API - Success", () => {
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let date = new Date();
                        date.setDate(date.getDate() + 3);

                        let payload = {
                            to: [
                                {
                                    displayName: "Sarja One",
                                    email: "sarja3@nilavodev.com",
                                },
                            ],
                            cc: [
                                {
                                    displayName: "Sarja Four",
                                    email: "sarja4@nilavodev.com",
                                },
                            ],
                            bcc: [
                                {
                                    displayName: "Sarja Five",
                                    email: "sarja5@nilavodev.com",
                                },
                            ],
                            subject: "Message from sarja1",
                            secureMessage: "<p> This secure </p>",
                            notificationMessage:
                                "<p> This is notification </p>",
                            dateExpires: date,
                            requireSignIn: true,
                        };

                        api.createMessage(tenant, token, payload)
                            .then((response) => {
                                console.log(response);
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.subject).eq(
                                    payload.subject
                                );

                                let payloadSendMessage = {
                                    id: response.body.id,
                                    to: [
                                        {
                                            displayName: "Sarja One",
                                            email: "sarja3@nilavodev.com",
                                        },
                                    ],
                                    cc: [
                                        {
                                            displayName: "Sarja Two",
                                            email: "sarja4@nilavodev.com",
                                        },
                                    ],
                                    bcc: [
                                        {
                                            displayName: "Sarja Three",
                                            email: "sarja5@nilavodev.com",
                                        },
                                    ],
                                    subject: "Message from sarja1",
                                    secureMessage: "<p> This secure </p>",
                                    notificationMessage:
                                        "<p> This is notification </p>",
                                    dateExpires: date,
                                    requireSignIn: true,
                                };

                                api.sendMessage(
                                    tenant,
                                    token,
                                    payloadSendMessage
                                ).then((r) => {
                                    expect(r.status).eq(200);
                                    expect(r.body.id).eq(payloadSendMessage.id);
                                    expect(r.body.subject).eq(
                                        payloadSendMessage.subject
                                    );

                                    return r.body;
                                });
                            })
                            .then((res) => {
                                let bool = false;

                                let qs = {
                                    //read: false, 
                                    page: 1,
                                    size: 100,
                                };
                                cy.wait(200)
                                        api.listMessageThreads(
                                    tenant,
                                    token,
                                    "sent",
                                    qs
                                ).then((r) => {
                                    expect(r.status).eq(200);
                                    expect(r.body).to.be.a("Array");

                                    let match = r.body.find(
                                        (o) =>
                                            o.subject === "Message from sarja1"
                                    );
                                    if (match) {
                                        bool = true;
                                    } else {
                                        expect(true).to.be.false;
                                    }

                                    expect(bool).to.be.true;
                                });
                            });
                    });
            });
            it("Delete Message Threads - API - Success", () => {
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let date = new Date();
                        date.setDate(date.getDate() + 3);

                        let payload = {
                            to: [
                                {
                                    displayName: "Sarja One",
                                    email: "sarja3@nilavodev.com",
                                },
                            ],
                            cc: [
                                {
                                    displayName: "Sarja Four",
                                    email: "sarja4@nilavodev.com",
                                },
                            ],
                            bcc: [
                                {
                                    displayName: "Sarja Five",
                                    email: "sarja5@nilavodev.com",
                                },
                            ],
                            subject: "Delete2 message thread",
                            secureMessage: "<p> This secure </p>",
                            notificationMessage:
                                "<p> This is notification </p>",
                            dateExpires: date,
                            requireSignIn: true,
                        };

                        api.createMessage(tenant, token, payload)
                            .then((response) => {
                                console.log(response);
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.subject).eq(
                                    payload.subject
                                );

                                let payloadSendMessage = {
                                    id: response.body.id,
                                    to: [
                                        {
                                            displayName: "Sarja One",
                                            email: "sarja3@nilavodev.com",
                                        },
                                    ],
                                    cc: [
                                        {
                                            displayName: "Sarja Two",
                                            email: "sarja4@nilavodev.com",
                                        },
                                    ],
                                    bcc: [
                                        {
                                            displayName: "Sarja Three",
                                            email: "sarja5@nilavodev.com",
                                        },
                                    ],
                                    subject: "Delete2 message thread",
                                    secureMessage: "<p> This secure </p>",
                                    notificationMessage:
                                        "<p> This is notification </p>",
                                    dateExpires: date,
                                    requireSignIn: true,
                                };

                                api.sendMessage(
                                    tenant,
                                    token,
                                    payloadSendMessage
                                ).then((r) => {
                                    expect(r.status).eq(200);
                                    expect(r.body.id).eq(payloadSendMessage.id);
                                    expect(r.body.subject).eq(
                                        payloadSendMessage.subject
                                    );

                                    return r.body;
                                });
                            })
                            .then((res) => {
                                let payload = {
                                    read: false,
                                    page: 1,
                                    size: 100,
                                };
                                cy.wait(200)
                                        api.listMessageThreads(
                                    tenant,
                                    token,
                                    "sent",
                                    payload
                                ).then((r) => {
                                    expect(r.status).eq(200);
                                    expect(r.body).to.be.a("Array");

                                    let match = r.body.find(
                                        (o) =>
                                            o.subject ===
                                            "Delete2 message thread"
                                    );
                                    if (match) {
                                        let payload = [match.id];
                                        api.deleteMessageThreads(
                                            tenant,
                                            token,
                                            "sent",
                                            payload
                                        ).then((response) => {
                                            expect(response.status).eq(200);
                                            expect(
                                                response.body.operationSucceeded
                                            ).to.contain(match.id);
                                        });
                                    } else {
                                        expect(true).to.be.false;
                                    }
                                });
                            });
                    });
            });
            it("List Messages - API - Success", () => {
                let token2 = null;
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let date = new Date();
                        date.setDate(date.getDate() + 3);

                        let payload = {
                            to: [
                                {
                                    displayName: "Sarja One",
                                    email: "sarja3@nilavodev.com",
                                },
                            ],
                            cc: [
                                {
                                    displayName: "Sarja Four",
                                    email: "sarja4@nilavodev.com",
                                },
                            ],
                            bcc: [
                                {
                                    displayName: "Sarja Five",
                                    email: "sarja5@nilavodev.com",
                                },
                            ],
                            subject: "Message from sarja1",
                            secureMessage: "<p> This secure </p>",
                            notificationMessage:
                                "<p> This is notification </p>",
                            dateExpires: date,
                            requireSignIn: true,
                        };

                        api.createMessage(tenant, token, payload).then(
                            (response) => {
                                console.log(response);
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.subject).eq(
                                    payload.subject
                                );

                                let payloadSendMessage = {
                                    id: response.body.id,
                                    to: [
                                        {
                                            displayName: "Sarja One",
                                            email: "sarja3@nilavodev.com",
                                        },
                                    ],
                                    cc: [
                                        {
                                            displayName: "Sarja Two",
                                            email: "sarja4@nilavodev.com",
                                        },
                                    ],
                                    bcc: [
                                        {
                                            displayName: "Sarja Three",
                                            email: "sarja5@nilavodev.com",
                                        },
                                    ],
                                    subject: "Message from sarja1",
                                    secureMessage: "<p> This secure </p>",
                                    notificationMessage:
                                        "<p> This is notification </p>",
                                    dateExpires: date,
                                    requireSignIn: true,
                                };

                                api.sendMessage(
                                    tenant,
                                    token,
                                    payloadSendMessage
                                )
                                    .then((r) => {
                                        expect(r.status).eq(200);
                                        expect(r.body.id).eq(
                                            payloadSendMessage.id
                                        );
                                        expect(r.body.subject).eq(
                                            payloadSendMessage.subject
                                        );

                                        return r.body;
                                    })
                                    .then(() => {
                                        api.tokenAuthentication(
                                            tenant,
                                            "sarja3@nilavodev.com",
                                            testData.password
                                        );
                                    })
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        let bearerToken2 =
                                            response.headers.authorization;
                                        console.log(bearerToken2);
                                        token2 = bearerToken2;
                                        return bearerToken2;
                                    })
                                    .then(() => {
                                        let qs = {
                                            read: false,
                                            page: 1,
                                            size: 100,
                                        };
                                        cy.wait(200)
                                        api.listMessageThreads(
                                            tenant,
                                            token2,
                                            "inbox",
                                            qs
                                        );
                                    })
                                    .then((r) => {
                                        let bool = false;
                                        let id = null;
                                        expect(r.status).eq(200);
                                        expect(r.body).to.be.a("Array");

                                        let match = r.body.find(
                                            (o) =>
                                                o.subject ===
                                                "Message from sarja1"
                                        );

                                        if (match) {
                                            bool = true;

                                            return match.id;
                                        } else {
                                            expect(true).to.be.false;
                                        }
                                    })
                                    .then((threadId) => {
                                        let qs = {
                                            page: 1,
                                            size: 100,
                                        };

                                        return api.listMessages(
                                            tenant,
                                            token2,
                                            "inbox",
                                            threadId,
                                            qs
                                        );
                                    })
                                    .then((response) => {
                                        let bool = false;
                                        expect(response.status).eq(200);
                                        let match = response.body.find(
                                            (o) =>
                                                o.subject ===
                                                "Message from sarja1"
                                        );

                                        if (match) {
                                            bool = true;
                                        } else {
                                            expect(true).to.be.false;
                                        }
                                        expect(bool).to.be.true;
                                    });
                            }
                        );
                    });
            });
            it("Reply Messages and Send - API - Success", () => {
                let token2 = null;
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let date = new Date();
                        date.setDate(date.getDate() + 3);

                        let payload = {
                            to: [
                                {
                                    displayName: "Sarja One",
                                    email: "sarja3@nilavodev.com",
                                },
                            ],
                            cc: [
                                {
                                    displayName: "Sarja Four",
                                    email: "sarja4@nilavodev.com",
                                },
                            ],
                            bcc: [
                                {
                                    displayName: "Sarja Five",
                                    email: "sarja5@nilavodev.com",
                                },
                            ],
                            subject: "Reply from sarja1",
                            secureMessage: "<p> This secure </p>",
                            notificationMessage:
                                "<p> This is notification </p>",
                            dateExpires: date,
                            requireSignIn: true,
                        };

                        api.createMessage(tenant, token, payload).then(
                            (response) => {
                                console.log(response);
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.subject).eq(
                                    payload.subject
                                );

                                let payloadSendMessage = {
                                    id: response.body.id,
                                    to: [
                                        {
                                            displayName: "Sarja Three",
                                            email: "sarja3@nilavodev.com",
                                        },
                                    ],
                                    subject: "Reply from sarja1",
                                    secureMessage: "<p> This secure </p>",
                                    notificationMessage:
                                        "<p> This is notification </p>",
                                    dateExpires: date,
                                    requireSignIn: true,
                                };

                                api.sendMessage(
                                    tenant,
                                    token,
                                    payloadSendMessage
                                )
                                    .then((r) => {
                                        expect(r.status).eq(200);
                                        expect(r.body.id).eq(
                                            payloadSendMessage.id
                                        );
                                        expect(r.body.subject).eq(
                                            payloadSendMessage.subject
                                        );

                                        return r.body;
                                    })
                                    .then(() => {
                                        api.tokenAuthentication(
                                            tenant,
                                            "sarja3@nilavodev.com",
                                            "Nil@vo2006"
                                        );
                                    })
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        let bearerToken2 =
                                            response.headers.authorization;
                                        console.log(bearerToken2);
                                        token2 = bearerToken2;
                                        return bearerToken2;
                                    })
                                    .then(() => {
                                        debugger;
                                        let qs = {
                                            read: false,
                                            page: 1,
                                            size: 100,
                                        };
                                        
                                        cy.wait(200)
                                        api.listMessageThreads(
                                            tenant,
                                            token2,
                                            "inbox",
                                            qs
                                        );
                                    })
                                    .then((r) => {
                                        let bool = false;
                                        let id = null;
                                        expect(r.status).eq(200);
                                        expect(r.body).to.be.a("Array");

                                        let match = r.body.find(
                                            (o) =>
                                                o.subject ===
                                                "Reply from sarja1"
                                        );

                                        if (match) {
                                            bool = true;

                                            return match.id;
                                        } else {
                                            expect(true).to.be.false;
                                        }
                                    })
                                    .then((threadId) => {
                                        let qs = {
                                            page: 1,
                                            size: 100,
                                        };

                                        return api.listMessages(
                                            tenant,
                                            token2,
                                            "inbox",
                                            threadId,
                                            qs
                                        );
                                    })
                                    .then((res) => {
                                        expect(res.status).eq(200);
                                        let payload = {
                                            secureMessage:
                                                "<p> Reply This secure </p>",
                                            notificationMessage:
                                                "<p> reply is notification </p>",
                                            dateExpires: date,
                                            requireSignIn: true,
                                        };
                                        console.log("L2 " + res.body[0].id);

                                        api.replyMessage(
                                            tenant,
                                            token2,
                                            res.body[0].id,
                                            payload
                                        );
                                    })
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        expect(response.body.subject).eq(
                                            "Reply from sarja1"
                                        );
                                        return response;
                                    })
                                    .then((response) => {
                                        let payloadSendMessage3 = {
                                            id: response.body.id,

                                            to: [
                                                {
                                                    displayName: "Sarja Two",
                                                    email: "sarja2@nilavodev.com",
                                                },
                                            ],

                                            secureMessage:
                                                "<p> Reply This secure </p>",
                                            notificationMessage:
                                                "<p> reply is notification </p>",
                                            dateExpires: date,
                                            requireSignIn: true,
                                        };

                                        api.sendMessage(
                                            tenant,
                                            token2,
                                            payloadSendMessage3
                                        );
                                    })
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        expect(response.body.subject).eq(
                                            "Reply from sarja1"
                                        );
                                    });
                            }
                        );
                    });
            });
            it("Reply Messages and Update draft - API - Success", () => {
                let token2 = null;
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let date = new Date();
                        date.setDate(date.getDate() + 3);

                        let payload = {
                            to: [
                                {
                                    displayName: "Sarja One",
                                    email: "sarja3@nilavodev.com",
                                },
                            ],
                            cc: [
                                {
                                    displayName: "Sarja Four",
                                    email: "sarja4@nilavodev.com",
                                },
                            ],
                            bcc: [
                                {
                                    displayName: "Sarja Five",
                                    email: "sarja5@nilavodev.com",
                                },
                            ],
                            subject: "Message from sarja1",
                            secureMessage: "<p> This secure </p>",
                            notificationMessage:
                                "<p> This is notification </p>",
                            dateExpires: date,
                            requireSignIn: true,
                        };

                        api.createMessage(tenant, token, payload).then(
                            (response) => {
                                console.log(response);
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.subject).eq(
                                    payload.subject
                                );

                                let payloadSendMessage = {
                                    id: response.body.id,
                                    to: [
                                        {
                                            displayName: "Sarja Three",
                                            email: "sarja3@nilavodev.com",
                                        },
                                    ],
                                    subject: "Reply from sarja1",
                                    secureMessage: "<p> This secure </p>",
                                    notificationMessage:
                                        "<p> This is notification </p>",
                                    dateExpires: date,
                                    requireSignIn: true,
                                };

                                api.sendMessage(
                                    tenant,
                                    token,
                                    payloadSendMessage
                                )
                                    .then((r) => {
                                        expect(r.status).eq(200);
                                        expect(r.body.id).eq(
                                            payloadSendMessage.id
                                        );
                                        expect(r.body.subject).eq(
                                            payloadSendMessage.subject
                                        );

                                        return r.body;
                                    })
                                    .then(() => {
                                        api.tokenAuthentication(
                                            tenant,
                                            "sarja3@nilavodev.com",
                                            "Nil@vo2006"
                                        );
                                    })
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        let bearerToken2 =
                                            response.headers.authorization;
                                        console.log(bearerToken2);
                                        token2 = bearerToken2;
                                        return bearerToken2;
                                    })
                                    .then(() => {
                                        debugger;
                                        let qs = {
                                            read: false,
                                            page: 1,
                                            size: 100,
                                        };
                                        cy.wait(200)
                                        api.listMessageThreads(
                                            tenant,
                                            token2,
                                            "inbox",
                                            qs
                                        );
                                    })
                                    .then((r) => {
                                        let bool = false;
                                        let id = null;
                                        expect(r.status).eq(200);
                                        expect(r.body).to.be.a("Array");

                                        let match = r.body.find(
                                            (o) =>
                                                o.subject ===
                                                "Reply from sarja1"
                                        );

                                        if (match) {
                                            bool = true;

                                            return match.id;
                                        } else {
                                            expect(true).to.be.false;
                                        }
                                    })
                                    .then((threadId) => {
                                        let qs = {
                                            page: 1,
                                            size: 100,
                                        };

                                        return api.listMessages(
                                            tenant,
                                            token2,
                                            "inbox",
                                            threadId,
                                            qs
                                        );
                                    })
                                    .then((res) => {
                                        expect(res.status).eq(200);
                                        let payload = {
                                            secureMessage:
                                                "<p> Reply This secure </p>",
                                            notificationMessage:
                                                "<p> reply is notification </p>",
                                            dateExpires: date,
                                            requireSignIn: true,
                                        };
                                        console.log("L2 " + res.body[0].id);

                                        api.replyMessage(
                                            tenant,
                                            token2,
                                            res.body[0].id,
                                            payload
                                        );
                                    })
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        expect(response.body.subject).eq(
                                            "Reply from sarja1"
                                        );
                                        return response;
                                    })
                                    .then((response) => {
                                        let payloadSendMessage3 = {
                                            //id: response.body.id,

                                            to: [
                                                {
                                                    displayName: "Sarja Two",
                                                    email: "sarja2@nilavodev.com",
                                                },
                                            ],

                                            secureMessage:
                                                "<p> Reply This secure </p>",
                                            notificationMessage:
                                                "<p> reply is notification </p>",
                                            dateExpires: date,
                                            requireSignIn: true,
                                        };

                                        api.updateDraftMessage(
                                            tenant,
                                            token2,
                                            payloadSendMessage3,
                                            response.body.id
                                        );
                                    })
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        expect(response.body.subject).eq(
                                            "Reply from sarja1"
                                        );
                                    });
                            }
                        );
                    });
            });

            it("Reply All Messages and Send - API - Success", () => {
                let token2 = null;
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let date = new Date();
                        date.setDate(date.getDate() + 3);

                        let payload = {
                            to: [
                                {
                                    displayName: "Sarja One",
                                    email: "sarja3@nilavodev.com",
                                },
                            ],
                            cc: [
                                {
                                    displayName: "Sarja Three",
                                    email: "sarja4@nilavodev.com",
                                },
                            ],
                            bcc: [
                                {
                                    displayName: "Sarja Five",
                                    email: "sarja5@nilavodev.com",
                                },
                            ],
                            subject: "Message from sarja1",
                            secureMessage: "<p> This secure </p>",
                            notificationMessage:
                                "<p> This is notification </p>",
                            dateExpires: date,
                            requireSignIn: true,
                        };

                        api.createMessage(tenant, token, payload).then(
                            (response) => {
                                console.log(response);
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.subject).eq(
                                    payload.subject
                                );

                                let payloadSendMessage = {
                                    id: response.body.id,
                                    to: [
                                        {
                                            displayName: "Sarja Three",
                                            email: "sarja3@nilavodev.com",
                                        },
                                    ],
                                    cc: [
                                        {
                                            displayName: "Sarja Four",
                                            email: "sarja4@nilavodev.com",
                                        },
                                    ],
                                    bcc: [
                                        {
                                            displayName: "Sarja Five",
                                            email: "sarja5@nilavodev.com",
                                        },
                                    ],
                                    subject: "Reply from sarja1",
                                    secureMessage: "<p> This secure </p>",
                                    notificationMessage:
                                        "<p> This is notification </p>",
                                    dateExpires: date,
                                    requireSignIn: true,
                                };

                                api.sendMessage(
                                    tenant,
                                    token,
                                    payloadSendMessage
                                )
                                    .then((r) => {
                                        expect(r.status).eq(200);
                                        expect(r.body.id).eq(
                                            payloadSendMessage.id
                                        );
                                        expect(r.body.subject).eq(
                                            payloadSendMessage.subject
                                        );

                                        return r.body;
                                    })
                                    .then(() => {
                                        api.tokenAuthentication(
                                            tenant,
                                            "sarja3@nilavodev.com",
                                            "Nil@vo2006"
                                        );
                                    })
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        let bearerToken2 =
                                            response.headers.authorization;
                                        console.log(bearerToken2);
                                        token2 = bearerToken2;
                                        return bearerToken2;
                                    })
                                    .then(() => {
                                        debugger;
                                        let qs = {
                                            read: false,
                                            page: 1,
                                            size: 100,
                                        };
                                        cy.wait(200)
                                        api.listMessageThreads(
                                            tenant,
                                            token2,
                                            "inbox",
                                            qs
                                        );
                                    })
                                    .then((r) => {
                                        let bool = false;
                                        let id = null;
                                        expect(r.status).eq(200);
                                        expect(r.body).to.be.a("Array");

                                        let match = r.body.find(
                                            (o) =>
                                                o.subject ===
                                                "Reply from sarja1"
                                        );

                                        if (match) {
                                            bool = true;

                                            return match.id;
                                        } else {
                                            expect(true).to.be.false;
                                        }
                                    })
                                    .then((threadId) => {
                                        let qs = {
                                            page: 1,
                                            size: 100,
                                        };

                                        return api.listMessages(
                                            tenant,
                                            token2,
                                            "inbox",
                                            threadId,
                                            qs
                                        );
                                    })
                                    .then((res) => {
                                        expect(res.status).eq(200);
                                        let payload = {
                                            secureMessage:
                                                "<p> Reply This secure </p>",
                                            notificationMessage:
                                                "<p> reply is notification </p>",
                                            dateExpires: date,
                                            requireSignIn: true,
                                        };
                                        console.log("L2 " + res.body[0].id);

                                        api.replyAllMessage(
                                            tenant,
                                            token2,
                                            res.body[0].id,
                                            payload
                                        );
                                    })
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        expect(response.body.subject).eq(
                                            "Reply from sarja1"
                                        );
                                        return response;
                                    })
                                    .then((response) => {
                                        let payloadSendMessage3 = {
                                            id: response.body.id,

                                            to: [
                                                {
                                                    displayName: "Sarja Two",
                                                    email: "sarja2@nilavodev.com",
                                                },
                                            ],
                                            cc: [
                                                {
                                                    displayName: "Sarja Four",
                                                    email: "sarja4@nilavodev.com",
                                                },
                                            ],
                                            bcc: [
                                                {
                                                    displayName: "Sarja Five",
                                                    email: "sarja5@nilavodev.com",
                                                },
                                            ],

                                            secureMessage:
                                                "<p> Reply This secure </p>",
                                            notificationMessage:
                                                "<p> reply is notification </p>",
                                            dateExpires: date,
                                            requireSignIn: true,
                                        };

                                        api.sendMessage(
                                            tenant,
                                            token2,
                                            payloadSendMessage3
                                        );
                                    })
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        expect(response.body.subject).eq(
                                            "Reply from sarja1"
                                        );
                                    });
                            }
                        );
                    });
            });

            it("Reply All Messages and Update draft - API - Success", () => {
                let token2 = null;
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let date = new Date();
                        date.setDate(date.getDate() + 3);

                        let payload = {
                            to: [
                                {
                                    displayName: "Sarja One",
                                    email: "sarja3@nilavodev.com",
                                },
                            ],
                            cc: [
                                {
                                    displayName: "Sarja Three",
                                    email: "sarja4@nilavodev.com",
                                },
                            ],
                            bcc: [
                                {
                                    displayName: "Sarja Five",
                                    email: "sarja5@nilavodev.com",
                                },
                            ],
                            subject: "Message from sarja1",
                            secureMessage: "<p> This secure </p>",
                            notificationMessage:
                                "<p> This is notification </p>",
                            dateExpires: date,
                            requireSignIn: true,
                        };

                        api.createMessage(tenant, token, payload).then(
                            (response) => {
                                console.log(response);
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.subject).eq(
                                    payload.subject
                                );

                                let payloadSendMessage = {
                                    id: response.body.id,
                                    to: [
                                        {
                                            displayName: "Sarja Three",
                                            email: "sarja3@nilavodev.com",
                                        },
                                    ],
                                    cc: [
                                        {
                                            displayName: "Sarja Four",
                                            email: "sarja4@nilavodev.com",
                                        },
                                    ],
                                    bcc: [
                                        {
                                            displayName: "Sarja Five",
                                            email: "sarja5@nilavodev.com",
                                        },
                                    ],
                                    subject: "Reply from sarja1",
                                    secureMessage: "<p> This secure </p>",
                                    notificationMessage:
                                        "<p> This is notification </p>",
                                    dateExpires: date,
                                    requireSignIn: true,
                                };

                                api.sendMessage(
                                    tenant,
                                    token,
                                    payloadSendMessage
                                )
                                    .then((r) => {
                                        expect(r.status).eq(200);
                                        expect(r.body.id).eq(
                                            payloadSendMessage.id
                                        );
                                        expect(r.body.subject).eq(
                                            payloadSendMessage.subject
                                        );

                                        return r.body;
                                    })
                                    .then(() => {
                                        api.tokenAuthentication(
                                            tenant,
                                            "sarja3@nilavodev.com",
                                            "Nil@vo2006"
                                        );
                                    })
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        let bearerToken2 =
                                            response.headers.authorization;
                                        console.log(bearerToken2);
                                        token2 = bearerToken2;
                                        return bearerToken2;
                                    })
                                    .then(() => {
                                        debugger;
                                        let qs = {
                                            read: false,
                                            page: 1,
                                            size: 100,
                                        };
                                        cy.wait(200)
                                        api.listMessageThreads(
                                            tenant,
                                            token2,
                                            "inbox",
                                            qs
                                        );
                                    })
                                    .then((r) => {
                                        let bool = false;
                                        let id = null;
                                        expect(r.status).eq(200);
                                        expect(r.body).to.be.a("Array");

                                        let match = r.body.find(
                                            (o) =>
                                                o.subject ===
                                                "Reply from sarja1"
                                        );

                                        if (match) {
                                            bool = true;

                                            return match.id;
                                        }
                                    })
                                    .then((threadId) => {
                                        let qs = {
                                            page: 1,
                                            size: 100,
                                        };

                                        return api.listMessages(
                                            tenant,
                                            token2,
                                            "inbox",
                                            threadId,
                                            qs
                                        );
                                    })
                                    .then((res) => {
                                        expect(res.status).eq(200);
                                        let payload = {
                                            secureMessage:
                                                "<p> Reply This secure </p>",
                                            notificationMessage:
                                                "<p> reply is notification </p>",
                                            dateExpires: date,
                                            requireSignIn: true,
                                        };
                                        console.log("L2 " + res.body[0].id);

                                        api.replyAllMessage(
                                            tenant,
                                            token2,
                                            res.body[0].id,
                                            payload
                                        );
                                    })
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        expect(response.body.subject).eq(
                                            "Reply from sarja1"
                                        );
                                        return response;
                                    })
                                    .then((response) => {
                                        let payloadSendMessage3 = {
                                            //id: response.body.id,

                                            to: [
                                                {
                                                    displayName: "Sarja Two",
                                                    email: "sarja2@nilavodev.com",
                                                },
                                            ],
                                            cc: [
                                                {
                                                    displayName: "Sarja Four",
                                                    email: "sarja4@nilavodev.com",
                                                },
                                            ],
                                            bcc: [
                                                {
                                                    displayName: "Sarja Five",
                                                    email: "sarja5@nilavodev.com",
                                                },
                                            ],

                                            secureMessage:
                                                "<p> Reply This secure </p>",
                                            notificationMessage:
                                                "<p> reply is notification </p>",
                                            dateExpires: date,
                                            requireSignIn: true,
                                        };

                                        api.updateDraftMessage(
                                            tenant,
                                            token2,
                                            payloadSendMessage3,
                                            response.body.id
                                        );
                                    })
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        expect(response.body.subject).eq(
                                            "Reply from sarja1"
                                        );
                                    });
                            }
                        );
                    });
            });

            it("Forward Message and Send - API - Success", () => {
                let token2 = null;
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let date = new Date();
                        date.setDate(date.getDate() + 3);

                        let payload = {
                            to: [
                                {
                                    displayName: "Sarja One",
                                    email: "sarja3@nilavodev.com",
                                },
                            ],
                            subject: "Forward message from sarja1",
                            secureMessage: "<p> This secure </p>",
                            notificationMessage:
                                "<p> This is notification </p>",
                            dateExpires: date,
                            requireSignIn: true,
                        };

                        api.createMessage(tenant, token, payload).then(
                            (response) => {
                                console.log(response);
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.subject).eq(
                                    payload.subject
                                );

                                let payloadSendMessage = {
                                    id: response.body.id,
                                    to: [
                                        {
                                            displayName: "Sarja Three",
                                            email: "sarja3@nilavodev.com",
                                        },
                                    ],
                                    subject: "Forward message from sarja1",
                                    secureMessage: "<p> This secure </p>",
                                    notificationMessage:
                                        "<p> This is notification </p>",
                                    dateExpires: date,
                                    requireSignIn: true,
                                };

                                api.sendMessage(
                                    tenant,
                                    token,
                                    payloadSendMessage
                                )
                                    .then((r) => {
                                        expect(r.status).eq(200);
                                        expect(r.body.id).eq(
                                            payloadSendMessage.id
                                        );
                                        expect(r.body.subject).eq(
                                            payloadSendMessage.subject
                                        );

                                        return r.body;
                                    })
                                    .then(() => {
                                        api.tokenAuthentication(
                                            tenant,
                                            "sarja3@nilavodev.com",
                                            "Nil@vo2006"
                                        );
                                    })
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        let bearerToken2 =
                                            response.headers.authorization;
                                        console.log(bearerToken2);
                                        token2 = bearerToken2;
                                        return bearerToken2;
                                    })
                                    .then(() => {
                                        debugger;
                                        let qs = {
                                            read: false,
                                            page: 1,
                                            size: 100,
                                        };
                                        cy.wait(200)
                                        api.listMessageThreads(
                                            tenant,
                                            token2,
                                            "inbox",
                                            qs
                                        );
                                    })
                                    .then((r) => {
                                        let bool = false;
                                        let id = null;
                                        expect(r.status).eq(200);
                                        expect(r.body).to.be.a("Array");

                                        let match = r.body.find(
                                            (o) =>
                                                o.subject ===
                                                "Forward message from sarja1"
                                        );

                                        if (match) {
                                            bool = true;

                                            return match.id;
                                        } else {
                                            expect(true).to.be.false;
                                        }
                                    })
                                    .then((threadId) => {
                                        let qs = {
                                            page: 1,
                                            size: 100,
                                        };

                                        return api.listMessages(
                                            tenant,
                                            token2,
                                            "inbox",
                                            threadId,
                                            qs
                                        );
                                    })
                                    .then((res) => {
                                        expect(res.status).eq(200);
                                        let payload = {
                                            secureMessage:
                                                "<p> Forward This secure </p>",
                                            notificationMessage:
                                                "<p> Forward is notification </p>",
                                            dateExpires: date,
                                            requireSignIn: true,
                                        };
                                        console.log("L2 " + res.body[0].id);

                                        api.forwardMessage(
                                            tenant,
                                            token2,
                                            res.body[0].id,
                                            payload
                                        );
                                    })
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        expect(response.body.subject).eq(
                                            "Fwd: Forward message from sarja1"
                                        );
                                        return response;
                                    })
                                    .then((response) => {
                                        let payloadSendMessage3 = {
                                            id: response.body.id,

                                            to: [
                                                {
                                                    displayName: "Sarja Four",
                                                    email: "sarja4@nilavodev.com",
                                                },
                                            ],

                                            secureMessage:
                                                "<p> Forward This secure </p>",
                                            notificationMessage:
                                                "<p> Forward is notification </p>",
                                            dateExpires: date,
                                            requireSignIn: true,
                                        };

                                        api.sendMessage(
                                            tenant,
                                            token2,
                                            payloadSendMessage3
                                        );
                                    })
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        expect(response.body.subject).eq(
                                            "Fwd: Forward message from sarja1"
                                        );
                                    });
                            }
                        );
                    });
            });

            it("Forward Message and Update draft - API - Success", () => {
                let token2 = null;
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let date = new Date();
                        date.setDate(date.getDate() + 3);

                        let payload = {
                            to: [
                                {
                                    displayName: "Sarja One",
                                    email: "sarja3@nilavodev.com",
                                },
                            ],
                            subject: "Forward message from sarja1",
                            secureMessage: "<p> This secure </p>",
                            notificationMessage:
                                "<p> This is notification </p>",
                            dateExpires: date,
                            requireSignIn: true,
                        };

                        api.createMessage(tenant, token, payload).then(
                            (response) => {
                                console.log(response);
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.subject).eq(
                                    payload.subject
                                );

                                let payloadSendMessage = {
                                    id: response.body.id,
                                    to: [
                                        {
                                            displayName: "Sarja Three",
                                            email: "sarja3@nilavodev.com",
                                        },
                                    ],
                                    subject: "Forward message from sarja1",
                                    secureMessage: "<p> This secure </p>",
                                    notificationMessage:
                                        "<p> This is notification </p>",
                                    dateExpires: date,
                                    requireSignIn: true,
                                };

                                api.sendMessage(
                                    tenant,
                                    token,
                                    payloadSendMessage
                                )
                                    .then((r) => {
                                        expect(r.status).eq(200);
                                        expect(r.body.id).eq(
                                            payloadSendMessage.id
                                        );
                                        expect(r.body.subject).eq(
                                            payloadSendMessage.subject
                                        );

                                        return r.body;
                                    })
                                    .then(() => {
                                        api.tokenAuthentication(
                                            tenant,
                                            "sarja3@nilavodev.com",
                                            "Nil@vo2006"
                                        );
                                    })
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        let bearerToken2 =
                                            response.headers.authorization;
                                        console.log(bearerToken2);
                                        token2 = bearerToken2;
                                        return bearerToken2;
                                    })
                                    .then(() => {
                                        debugger;
                                        let qs = {
                                            read: false,
                                            page: 1,
                                            size: 100,
                                        };
                                        cy.wait(200)
                                        api.listMessageThreads(
                                            tenant,
                                            token2,
                                            "inbox",
                                            qs
                                        );
                                    })
                                    .then((r) => {
                                        let bool = false;
                                        let id = null;
                                        expect(r.status).eq(200);
                                        expect(r.body).to.be.a("Array");

                                        let match = r.body.find(
                                            (o) =>
                                                o.subject ===
                                                "Forward message from sarja1"
                                        );

                                        if (match) {
                                            bool = true;

                                            return match.id;
                                        } else {
                                            expect(true).to.be.false;
                                        }
                                    })
                                    .then((threadId) => {
                                        let qs = {
                                            page: 1,
                                            size: 100,
                                        };

                                        return api.listMessages(
                                            tenant,
                                            token2,
                                            "inbox",
                                            threadId,
                                            qs
                                        );
                                    })
                                    .then((res) => {
                                        expect(res.status).eq(200);
                                        let payload = {
                                            secureMessage:
                                                "<p> Forward This secure </p>",
                                            notificationMessage:
                                                "<p> Forward is notification </p>",
                                            dateExpires: date,
                                            requireSignIn: true,
                                        };
                                        console.log("L2 " + res.body[0].id);

                                        api.forwardMessage(
                                            tenant,
                                            token2,
                                            res.body[0].id,
                                            payload
                                        );
                                    })
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        expect(response.body.subject).eq(
                                            "Fwd: Forward message from sarja1"
                                        );
                                        return response;
                                    })
                                    .then((response) => {
                                        let payloadSendMessage3 = {
                                            // id: response.body.id,

                                            to: [
                                                {
                                                    displayName: "Sarja Four",
                                                    email: "sarja4@nilavodev.com",
                                                },
                                            ],

                                            secureMessage:
                                                "<p> Forward This secure </p>",
                                            notificationMessage:
                                                "<p> Forward is notification </p>",
                                            dateExpires: date,
                                            requireSignIn: true,
                                        };

                                        api.updateDraftMessage(
                                            tenant,
                                            token2,
                                            payloadSendMessage3,
                                            response.body.id
                                        );
                                    })
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        expect(response.body.subject).eq(
                                            "Fwd: Forward message from sarja1"
                                        );
                                    });
                            }
                        );
                    });
            });

            it("Delete Message Threads Permanently - API - Success", () => {
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let date = new Date();
                        date.setDate(date.getDate() + 3);

                        let payload = {
                            to: [
                                {
                                    displayName: "Sarja One",
                                    email: "sarja3@nilavodev.com",
                                },
                            ],
                            cc: [
                                {
                                    displayName: "Sarja Four",
                                    email: "sarja4@nilavodev.com",
                                },
                            ],
                            bcc: [
                                {
                                    displayName: "Sarja Five",
                                    email: "sarja5@nilavodev.com",
                                },
                            ],
                            subject: "Message from sarja1",
                            secureMessage: "<p> This secure </p>",
                            notificationMessage:
                                "<p> This is notification </p>",
                            dateExpires: date,
                            requireSignIn: true,
                        };

                        api.createMessage(tenant, token, payload)
                            .then((response) => {
                                console.log(response);
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.subject).eq(
                                    payload.subject
                                );

                                let payloadSendMessage = {
                                    id: response.body.id,
                                    to: [
                                        {
                                            displayName: "Sarja One",
                                            email: "sarja3@nilavodev.com",
                                        },
                                    ],
                                    cc: [
                                        {
                                            displayName: "Sarja Two",
                                            email: "sarja4@nilavodev.com",
                                        },
                                    ],
                                    bcc: [
                                        {
                                            displayName: "Sarja Three",
                                            email: "sarja5@nilavodev.com",
                                        },
                                    ],
                                    subject: "Delete2 message thread",
                                    secureMessage: "<p> This secure </p>",
                                    notificationMessage:
                                        "<p> This is notification </p>",
                                    dateExpires: date,
                                    requireSignIn: true,
                                };

                                api.sendMessage(
                                    tenant,
                                    token,
                                    payloadSendMessage
                                ).then((r) => {
                                    expect(r.status).eq(200);
                                    expect(r.body.id).eq(payloadSendMessage.id);
                                    expect(r.body.subject).eq(
                                        payloadSendMessage.subject
                                    );

                                    return r.body;
                                });
                            })
                            .then((res) => {
                                let payload = {
                                    read: false,
                                    page: 1,
                                    size: 100,
                                };
                                cy.wait(200)
                                        api.listMessageThreads(
                                    tenant,
                                    token,
                                    "sent",
                                    payload
                                ).then((r) => {
                                    expect(r.status).eq(200);
                                    expect(r.body).to.be.a("Array");

                                    let match = r.body.find(
                                        (o) =>
                                            o.subject ===
                                            "Delete2 message thread"
                                    );
                                    if (match) {
                                        let payload = [match.id];
                                        api.deleteMessageThreads(
                                            tenant,
                                            token,
                                            "sent",
                                            payload
                                        )
                                            .then((response) => {
                                                expect(response.status).eq(200);
                                                expect(
                                                    response.body
                                                        .operationSucceeded
                                                ).to.contain(match.id);
                                            })
                                            .then(() => {
                                                let payload = [match.id];
                                                api.deleteMessageThreadsPermanently(
                                                    tenant,
                                                    token,
                                                    payload
                                                ).then((response) => {
                                                    expect(response.status).eq(
                                                        200
                                                    );
                                                    expect(
                                                        response.body
                                                            .operationSucceeded
                                                    ).to.contain(match.id);
                                                });
                                            });
                                    } else {
                                        expect(true).to.be.false;
                                    }
                                });
                            });
                    });
            });

            it("Restore Message Threads - API - Success", () => {
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let date = new Date();
                        date.setDate(date.getDate() + 3);

                        let payload = {
                            to: [
                                {
                                    displayName: "Sarja One",
                                    email: "sarja3@nilavodev.com",
                                },
                            ],
                            cc: [
                                {
                                    displayName: "Sarja Four",
                                    email: "sarja4@nilavodev.com",
                                },
                            ],
                            bcc: [
                                {
                                    displayName: "Sarja Five",
                                    email: "sarja5@nilavodev.com",
                                },
                            ],
                            subject: "Message from sarja1",
                            secureMessage: "<p> This secure </p>",
                            notificationMessage:
                                "<p> This is notification </p>",
                            dateExpires: date,
                            requireSignIn: true,
                        };

                        api.createMessage(tenant, token, payload)
                            .then((response) => {
                                console.log(response);
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.subject).eq(
                                    payload.subject
                                );

                                let payloadSendMessage = {
                                    id: response.body.id,
                                    to: [
                                        {
                                            displayName: "Sarja One",
                                            email: "sarja3@nilavodev.com",
                                        },
                                    ],
                                    cc: [
                                        {
                                            displayName: "Sarja Two",
                                            email: "sarja4@nilavodev.com",
                                        },
                                    ],
                                    bcc: [
                                        {
                                            displayName: "Sarja Three",
                                            email: "sarja5@nilavodev.com",
                                        },
                                    ],
                                    subject: "Delete2 message thread",
                                    secureMessage: "<p> This secure </p>",
                                    notificationMessage:
                                        "<p> This is notification </p>",
                                    dateExpires: date,
                                    requireSignIn: true,
                                };

                                api.sendMessage(
                                    tenant,
                                    token,
                                    payloadSendMessage
                                ).then((r) => {
                                    expect(r.status).eq(200);
                                    expect(r.body.id).eq(payloadSendMessage.id);
                                    expect(r.body.subject).eq(
                                        payloadSendMessage.subject
                                    );

                                    return r.body;
                                });
                            })
                            .then((res) => {
                                let payload = {
                                    read: false,
                                    page: 1,
                                    size: 100,
                                };
                                cy.wait(200)
                                        api.listMessageThreads(
                                    tenant,
                                    token,
                                    "sent",
                                    payload
                                ).then((r) => {
                                    expect(r.status).eq(200);
                                    expect(r.body).to.be.a("Array");

                                    let match = r.body.find(
                                        (o) =>
                                            o.subject ===
                                            "Delete2 message thread"
                                    );
                                    if (match) {
                                        let payload = [match.id];
                                        api.deleteMessageThreads(
                                            tenant,
                                            token,
                                            "sent",
                                            payload
                                        )
                                            .then((response) => {
                                                expect(response.status).eq(200);
                                                expect(
                                                    response.body
                                                        .operationSucceeded
                                                ).to.contain(match.id);
                                            })
                                            .then(() => {
                                                let payload = [match.id];
                                                api.restoreMessageThread(
                                                    tenant,
                                                    token,
                                                    payload
                                                ).then((response) => {
                                                    expect(response.status).eq(
                                                        200
                                                    );
                                                    expect(
                                                        response.body
                                                            .operationSucceeded
                                                    ).to.contain(match.id);
                                                });
                                            });
                                    } else {
                                        expect(true).to.be.false;
                                    }
                                });
                            });
                    });
            });

            it("Delete Messages - API - Success", () => {
                let token2 = null;
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let date = new Date();
                        date.setDate(date.getDate() + 3);

                        let payload = {
                            to: [
                                {
                                    displayName: "Sarja One",
                                    email: "sarja3@nilavodev.com",
                                },
                            ],
                            cc: [
                                {
                                    displayName: "Sarja Four",
                                    email: "sarja4@nilavodev.com",
                                },
                            ],
                            bcc: [
                                {
                                    displayName: "Sarja Five",
                                    email: "sarja5@nilavodev.com",
                                },
                            ],
                            subject: "Message from sarja1",
                            secureMessage: "<p> This secure </p>",
                            notificationMessage:
                                "<p> This is notification </p>",
                            dateExpires: date,
                            requireSignIn: true,
                        };

                        api.createMessage(tenant, token, payload).then(
                            (response) => {
                                console.log(response);
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.subject).eq(
                                    payload.subject
                                );

                                let payloadSendMessage = {
                                    id: response.body.id,
                                    to: [
                                        {
                                            displayName: "Sarja One",
                                            email: "sarja3@nilavodev.com",
                                        },
                                    ],
                                    cc: [
                                        {
                                            displayName: "Sarja Two",
                                            email: "sarja4@nilavodev.com",
                                        },
                                    ],
                                    bcc: [
                                        {
                                            displayName: "Sarja Three",
                                            email: "sarja5@nilavodev.com",
                                        },
                                    ],
                                    subject: "Message from sarja1",
                                    secureMessage: "<p> This secure </p>",
                                    notificationMessage:
                                        "<p> This is notification </p>",
                                    dateExpires: date,
                                    requireSignIn: true,
                                };

                                api.sendMessage(
                                    tenant,
                                    token,
                                    payloadSendMessage
                                )
                                    .then((r) => {
                                        expect(r.status).eq(200);
                                        expect(r.body.id).eq(
                                            payloadSendMessage.id
                                        );
                                        expect(r.body.subject).eq(
                                            payloadSendMessage.subject
                                        );

                                        return r.body;
                                    })
                                    .then(() => {
                                        api.tokenAuthentication(
                                            tenant,
                                            "sarja3@nilavodev.com",
                                            testData.password
                                        );
                                    })
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        let bearerToken2 =
                                            response.headers.authorization;
                                        console.log(bearerToken2);
                                        token2 = bearerToken2;
                                        return bearerToken2;
                                    })
                                    .then(() => {
                                        let qs = {
                                            read: false,
                                            page: 1,
                                            size: 100,
                                        };
                                        cy.wait(200)
                                        api.listMessageThreads(
                                            tenant,
                                            token2,
                                            "inbox",
                                            qs
                                        );
                                    })
                                    .then((r) => {
                                        let bool = false;
                                        let id = null;
                                        expect(r.status).eq(200);
                                        expect(r.body).to.be.a("Array");

                                        let match = r.body.find(
                                            (o) =>
                                                o.subject ===
                                                "Message from sarja1"
                                        );

                                        if (match) {
                                            bool = true;

                                            return match.id;
                                        } else {
                                            expect(true).to.be.false;
                                        }
                                    })
                                    .then((threadId) => {
                                        let qs = {
                                            page: 1,
                                            size: 100,
                                        };

                                        return api.listMessages(
                                            tenant,
                                            token2,
                                            "inbox",
                                            threadId,
                                            qs
                                        );
                                    })
                                    .then((response) => {
                                        let bool = false;
                                        expect(response.status).eq(200);
                                        let match = response.body.find(
                                            (o) =>
                                                o.subject ===
                                                "Message from sarja1"
                                        );

                                        if (match) {
                                            bool = true;
                                            payload=[match.id]
                                            api.deleteMessages(tenant,token2,'inbox',payload)
                                            .then((response)=>{
                                                expect(response.status).eq(200)
                                                expect(response.body.operationSucceeded).to.contain(match.id);

                                            })
                                        } else {
                                            expect(true).to.be.false;
                                        }
                                        expect(bool).to.be.true;
                                    });
                            }
                        );
                    });
            });

            it("Delete Messages Permanentlty - API - Success", () => {
                let token2 = null;
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let date = new Date();
                        date.setDate(date.getDate() + 3);

                        let payload = {
                            to: [
                                {
                                    displayName: "Sarja One",
                                    email: "sarja3@nilavodev.com",
                                },
                            ],
                            cc: [
                                {
                                    displayName: "Sarja Four",
                                    email: "sarja4@nilavodev.com",
                                },
                            ],
                            bcc: [
                                {
                                    displayName: "Sarja Five",
                                    email: "sarja5@nilavodev.com",
                                },
                            ],
                            subject: "Message from sarja1",
                            secureMessage: "<p> This secure </p>",
                            notificationMessage:
                                "<p> This is notification </p>",
                            dateExpires: date,
                            requireSignIn: true,
                        };

                        api.createMessage(tenant, token, payload).then(
                            (response) => {
                                console.log(response);
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.subject).eq(
                                    payload.subject
                                );

                                let payloadSendMessage = {
                                    id: response.body.id,
                                    to: [
                                        {
                                            displayName: "Sarja One",
                                            email: "sarja3@nilavodev.com",
                                        },
                                    ],
                                    cc: [
                                        {
                                            displayName: "Sarja Two",
                                            email: "sarja4@nilavodev.com",
                                        },
                                    ],
                                    bcc: [
                                        {
                                            displayName: "Sarja Three",
                                            email: "sarja5@nilavodev.com",
                                        },
                                    ],
                                    subject: "Message from sarja1",
                                    secureMessage: "<p> This secure </p>",
                                    notificationMessage:
                                        "<p> This is notification </p>",
                                    dateExpires: date,
                                    requireSignIn: true,
                                };

                                api.sendMessage(
                                    tenant,
                                    token,
                                    payloadSendMessage
                                )
                                    .then((r) => {
                                        expect(r.status).eq(200);
                                        expect(r.body.id).eq(
                                            payloadSendMessage.id
                                        );
                                        expect(r.body.subject).eq(
                                            payloadSendMessage.subject
                                        );

                                        return r.body;
                                    })
                                    .then(() => {
                                        api.tokenAuthentication(
                                            tenant,
                                            "sarja3@nilavodev.com",
                                            testData.password
                                        );
                                    })
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        let bearerToken2 =
                                            response.headers.authorization;
                                        console.log(bearerToken2);
                                        token2 = bearerToken2;
                                        return bearerToken2;
                                    })
                                    .then(() => {
                                        let qs = {
                                            read: false,
                                            page: 1,
                                            size: 100,
                                        };
                                        cy.wait(200)
                                        api.listMessageThreads(
                                            tenant,
                                            token2,
                                            "inbox",
                                            qs
                                        );
                                    })
                                    .then((r) => {
                                        let bool = false;
                                        let id = null;
                                        expect(r.status).eq(200);
                                        expect(r.body).to.be.a("Array");

                                        let match = r.body.find(
                                            (o) =>
                                                o.subject ===
                                                "Message from sarja1"
                                        );

                                        if (match) {
                                            bool = true;

                                            return match.id;
                                        } else {
                                            expect(true).to.be.false;
                                        }
                                    })
                                    .then((threadId) => {
                                        let qs = {
                                            page: 1,
                                            size: 100,
                                        };

                                        return api.listMessages(
                                            tenant,
                                            token2,
                                            "inbox",
                                            threadId,
                                            qs
                                        );
                                    })
                                    .then((response) => {
                                        let bool = false;
                                        expect(response.status).eq(200);
                                        let match = response.body.find(
                                            (o) =>
                                                o.subject ===
                                                "Message from sarja1"
                                        );

                                        if (match) {
                                            bool = true;
                                            payload=[match.id]
                                            api.deleteMessages(tenant,token2,'inbox',payload)
                                            .then((response)=>{
                                                expect(response.status).eq(200)
                                                expect(response.body.operationSucceeded).to.contain(match.id);

                                            })
                                            .then(()=>{
                                                 let payload = [match.id];
                                                api.deleteMessagesPermanently(tenant,token2,payload)
                                                .then((response)=>{
                                                    expect(response.status).eq(200)
                                                    expect(response.body.operationSucceeded).to.contain(match.id);

                                                })
                                            })
                                        } else {
                                            expect(true).to.be.false;
                                        }
                                        expect(bool).to.be.true;
                                    });
                            }
                        );
                    });
            });

            it("Restore Messages - API - Success", () => {
                let token2 = null;
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let date = new Date();
                        date.setDate(date.getDate() + 3);

                        let payload = {
                            to: [
                                {
                                    displayName: "Sarja One",
                                    email: "sarja3@nilavodev.com",
                                },
                            ],
                            cc: [
                                {
                                    displayName: "Sarja Four",
                                    email: "sarja4@nilavodev.com",
                                },
                            ],
                            bcc: [
                                {
                                    displayName: "Sarja Five",
                                    email: "sarja5@nilavodev.com",
                                },
                            ],
                            subject: "Message from sarja1",
                            secureMessage: "<p> This secure </p>",
                            notificationMessage:
                                "<p> This is notification </p>",
                            dateExpires: date,
                            requireSignIn: true,
                        };

                        api.createMessage(tenant, token, payload).then(
                            (response) => {
                                console.log(response);
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.subject).eq(
                                    payload.subject
                                );

                                let payloadSendMessage = {
                                    id: response.body.id,
                                    to: [
                                        {
                                            displayName: "Sarja One",
                                            email: "sarja3@nilavodev.com",
                                        },
                                    ],
                                    cc: [
                                        {
                                            displayName: "Sarja Two",
                                            email: "sarja4@nilavodev.com",
                                        },
                                    ],
                                    bcc: [
                                        {
                                            displayName: "Sarja Three",
                                            email: "sarja5@nilavodev.com",
                                        },
                                    ],
                                    subject: "Message from sarja1",
                                    secureMessage: "<p> This secure </p>",
                                    notificationMessage:
                                        "<p> This is notification </p>",
                                    dateExpires: date,
                                    requireSignIn: true,
                                };

                                api.sendMessage(
                                    tenant,
                                    token,
                                    payloadSendMessage
                                )
                                    .then((r) => {
                                        expect(r.status).eq(200);
                                        expect(r.body.id).eq(
                                            payloadSendMessage.id
                                        );
                                        expect(r.body.subject).eq(
                                            payloadSendMessage.subject
                                        );

                                        return r.body;
                                    })
                                    .then(() => {
                                        api.tokenAuthentication(
                                            tenant,
                                            "sarja3@nilavodev.com",
                                            testData.password
                                        );
                                    })
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        let bearerToken2 =
                                            response.headers.authorization;
                                        console.log(bearerToken2);
                                        token2 = bearerToken2;
                                        return bearerToken2;
                                    })
                                    .then(() => {
                                        let qs = {
                                            read: false,
                                            page: 1,
                                            size: 100,
                                        };
                                        cy.wait(200)
                                        api.listMessageThreads(
                                            tenant,
                                            token2,
                                            "inbox",
                                            qs
                                        );
                                    })
                                    .then((r) => {
                                        let bool = false;
                                        let id = null;
                                        expect(r.status).eq(200);
                                        expect(r.body).to.be.a("Array");

                                        let match = r.body.find(
                                            (o) =>
                                                o.subject ===
                                                "Message from sarja1"
                                        );

                                        if (match) {
                                            bool = true;

                                            return match.id;
                                        } else {
                                            expect(true).to.be.false;
                                        }
                                    })
                                    .then((threadId) => {
                                        let qs = {
                                            page: 1,
                                            size: 100,
                                        };

                                        return api.listMessages(
                                            tenant,
                                            token2,
                                            "inbox",
                                            threadId,
                                            qs
                                        );
                                    })
                                    .then((response) => {
                                        let bool = false;
                                        expect(response.status).eq(200);
                                        let match = response.body.find(
                                            (o) =>
                                                o.subject ===
                                                "Message from sarja1"
                                        );

                                        if (match) {
                                            bool = true;
                                            payload=[match.id]
                                            api.deleteMessages(tenant,token2,'inbox',payload)
                                            .then((response)=>{
                                                expect(response.status).eq(200)
                                                expect(response.body.operationSucceeded).to.contain(match.id);

                                            }).then(() => {
                                                let payload = [match.id];
                                                api.restoreMessage(
                                                    tenant,
                                                    token2,
                                                    payload
                                                ).then((response) => {
                                                    expect(response.status).eq(
                                                        200
                                                    );
                                                    expect(
                                                        response.body
                                                            .operationSucceeded
                                                    ).to.contain(match.id);
                                                });
                                            });
                                        } else {
                                            expect(true).to.be.false;
                                        }
                                        expect(bool).to.be.true;
                                    });
                            }
                        );
                    });
            });

            it("List Message Activities - API - Success", () => {
                let token2 = null;
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let date = new Date();
                        date.setDate(date.getDate() + 3);

                        let payload = {
                            to: [
                                {
                                    displayName: "Sarja One",
                                    email: "sarja3@nilavodev.com",
                                },
                            ],
                            cc: [
                                {
                                    displayName: "Sarja Four",
                                    email: "sarja4@nilavodev.com",
                                },
                            ],
                            bcc: [
                                {
                                    displayName: "Sarja Five",
                                    email: "sarja5@nilavodev.com",
                                },
                            ],
                            subject: "Message from sarja1",
                            secureMessage: "<p> This secure </p>",
                            notificationMessage:
                                "<p> This is notification </p>",
                            dateExpires: date,
                            requireSignIn: true,
                        };

                        api.createMessage(tenant, token, payload).then(
                            (response) => {
                                console.log(response);
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.subject).eq(
                                    payload.subject
                                );

                                let payloadSendMessage = {
                                    id: response.body.id,
                                    to: [
                                        {
                                            displayName: "Sarja One",
                                            email: "sarja3@nilavodev.com",
                                        },
                                    ],
                                    cc: [
                                        {
                                            displayName: "Sarja Two",
                                            email: "sarja4@nilavodev.com",
                                        },
                                    ],
                                    bcc: [
                                        {
                                            displayName: "Sarja Three",
                                            email: "sarja5@nilavodev.com",
                                        },
                                    ],
                                    subject: "Message from sarja1",
                                    secureMessage: "<p> This secure </p>",
                                    notificationMessage:
                                        "<p> This is notification </p>",
                                    dateExpires: date,
                                    requireSignIn: true,
                                };

                                api.sendMessage(
                                    tenant,
                                    token,
                                    payloadSendMessage
                                )
                                    .then((r) => {
                                        expect(r.status).eq(200);
                                        expect(r.body.id).eq(
                                            payloadSendMessage.id
                                        );
                                        expect(r.body.subject).eq(
                                            payloadSendMessage.subject
                                        );

                                        return r.body;
                                    })
                                    .then(() => {
                                        let qs = {
                                            read: false,
                                            page: 1,
                                            size: 100,
                                        };
                                        cy.wait(200)
                                        api.listMessageThreads(
                                            tenant,
                                            token,
                                            "sent",
                                            qs
                                        );
                                    })
                                    .then((r) => {
                                        let bool = false;
                                        let id = null;
                                        expect(r.status).eq(200);
                                        expect(r.body).to.be.a("Array");

                                        let match = r.body.find(
                                            (o) =>
                                                o.subject ===
                                                "Message from sarja1"
                                        );

                                        if (match) {
                                            bool = true;

                                            return match.id;
                                        } else {
                                            expect(true).to.be.false;
                                        }
                                    })
                                    .then((threadId) => {
                                        let qs = {
                                            page: 1,
                                            size: 100,
                                        };

                                        return api.listMessages(
                                            tenant,
                                            token,
                                            "sent",
                                            threadId,
                                            qs
                                        );
                                    })
                                    .then((response) => {
                                        let bool = false;
                                        expect(response.status).eq(200);
                                        let match = response.body.find(
                                            (o) =>
                                                o.subject ===
                                                "Message from sarja1"
                                        );

                                        if (match) {
                                            bool = true;
                                            api.listMessageActivities(tenant,token,match.id)
                                            .then((response)=>{
                                                expect(response.status).eq(200)
                                                expect(response.body[0].type).eq('MessageSent')
                                            })
                                        } else {
                                            expect(true).to.be.false;
                                        }
                                        expect(bool).to.be.true;
                                    });
                            }
                        );
                    });
            });

            it("Mark Messages as Read - API - Success", () => {
                let token2 = null;
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let date = new Date();
                        date.setDate(date.getDate() + 3);

                        let payload = {
                            to: [
                                {
                                    displayName: "Sarja One",
                                    email: "sarja3@nilavodev.com",
                                },
                            ],
                            cc: [
                                {
                                    displayName: "Sarja Four",
                                    email: "sarja4@nilavodev.com",
                                },
                            ],
                            bcc: [
                                {
                                    displayName: "Sarja Five",
                                    email: "sarja5@nilavodev.com",
                                },
                            ],
                            subject: "Message from sarja1",
                            secureMessage: "<p> This secure </p>",
                            notificationMessage:
                                "<p> This is notification </p>",
                            dateExpires: date,
                            requireSignIn: true,
                        };

                        api.createMessage(tenant, token, payload).then(
                            (response) => {
                                console.log(response);
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.subject).eq(
                                    payload.subject
                                );

                                let payloadSendMessage = {
                                    id: response.body.id,
                                    to: [
                                        {
                                            displayName: "Sarja One",
                                            email: "sarja3@nilavodev.com",
                                        },
                                    ],
                                    cc: [
                                        {
                                            displayName: "Sarja Two",
                                            email: "sarja4@nilavodev.com",
                                        },
                                    ],
                                    bcc: [
                                        {
                                            displayName: "Sarja Three",
                                            email: "sarja5@nilavodev.com",
                                        },
                                    ],
                                    subject: "Message from sarja1",
                                    secureMessage: "<p> This secure </p>",
                                    notificationMessage:
                                        "<p> This is notification </p>",
                                    dateExpires: date,
                                    requireSignIn: true,
                                };

                                api.sendMessage(
                                    tenant,
                                    token,
                                    payloadSendMessage
                                )
                                    .then((r) => {
                                        expect(r.status).eq(200);
                                        expect(r.body.id).eq(
                                            payloadSendMessage.id
                                        );
                                        expect(r.body.subject).eq(
                                            payloadSendMessage.subject
                                        );

                                        return r.body;
                                    })
                                    .then(() => {
                                        api.tokenAuthentication(
                                            tenant,
                                            "sarja3@nilavodev.com",
                                            testData.password
                                        );
                                    })
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        let bearerToken2 =
                                            response.headers.authorization;
                                        console.log(bearerToken2);
                                        token2 = bearerToken2;
                                        return bearerToken2;
                                    })
                                    .then(() => {
                                        let qs = {
                                            read: false,
                                            page: 1,
                                            size: 100,
                                        };
                                        cy.wait(200)
                                        api.listMessageThreads(
                                            tenant,
                                            token2,
                                            "inbox",
                                            qs
                                        );
                                    })
                                    .then((r) => {
                                        let bool = false;
                                        let id = null;
                                        expect(r.status).eq(200);
                                        expect(r.body).to.be.a("Array");

                                        let match = r.body.find(
                                            (o) =>
                                                o.subject ===
                                                "Message from sarja1"
                                        );

                                        if (match) {
                                            bool = true;

                                            return match.id;
                                        } else {
                                            expect(true).to.be.false;
                                        }
                                    })
                                    .then((threadId) => {
                                        let qs = {
                                            page: 1,
                                            size: 100,
                                        };

                                        return api.listMessages(
                                            tenant,
                                            token2,
                                            "inbox",
                                            threadId,
                                            qs
                                        );
                                    })
                                    .then((response) => {
                                        let bool = false;
                                        expect(response.status).eq(200);
                                        let match = response.body.find(
                                            (o) =>
                                                o.subject ===
                                                "Message from sarja1"
                                        );

                                        if (match) {
                                            bool = true;
                                            api.markMessagesAsRead(tenant,token2,[match.id])
                                            .then((response)=>{
                                                expect(response.status).eq(200)
                                                expect(
                                                    response.body
                                                        .operationSucceeded
                                                ).to.contain(match.id);
                                            })
                                        } else {
                                            expect(true).to.be.false;
                                        }
                                        expect(bool).to.be.true;
                                    });
                            }
                        );
                    });
            });

        });

        describe("Unauthorized response", () => {

            it("Create Message - API - Unathorized", () => {
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let date = new Date();
                        date.setDate(date.getDate() + 3);

                        let payload = {
                            to: [
                                {
                                    displayName: "Sarja One",
                                    email: "sarja3@nilavodev.com",
                                },
                            ],
                            cc: [
                                {
                                    displayName: "Sarja Four",
                                    email: "sarja4@nilavodev.com",
                                },
                            ],
                            bcc: [
                                {
                                    displayName: "Sarja Five",
                                    email: "sarja5@nilavodev.com",
                                },
                            ],
                            subject: "Message from sarja1",
                            secureMessage: "<p> This secure </p>",
                            notificationMessage:
                                "<p> This is notification </p>",
                            dateExpires: date,
                            requireSignIn: true,
                        };

                        api.createMessage(tenant, "token", payload).then(
                            (response) => {
                                console.log(response);
                                expect(response.status).eq(401);
                            }
                        );
                    });
            });


            it("Get Draft Message - API - Unauthorized", () => {
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let date = new Date();
                        date.setDate(date.getDate() + 3);

                        let payload = {
                            to: [
                                {
                                    displayName: "Sarja One",
                                    email: "sarja3@nilavodev.com",
                                },
                            ],
                            cc: [
                                {
                                    displayName: "Sarja Four",
                                    email: "sarja4@nilavodev.com",
                                },
                            ],
                            bcc: [
                                {
                                    displayName: "Sarja Five",
                                    email: "sarja5@nilavodev.com",
                                },
                            ],
                            subject: "Message from sarja1",
                            secureMessage: "<p> This secure </p>",
                            notificationMessage:
                                "<p> This is notification </p>",
                            dateExpires: date,
                            requireSignIn: true,
                        };

                        api.createMessage(tenant, token, payload).then(
                            (response) => {
                                console.log(response);
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.subject).eq(
                                    payload.subject
                                );

                                api.getDraftMessage(
                                    tenant,
                                    "token",
                                    response.body.id
                                ).then((r) => {
                                    expect(r.status).eq(401);
                                });
                            }
                        );
                    });
            });
            it("Update Draft Message - API - Unauthorized", () => {
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let date = new Date();
                        date.setDate(date.getDate() + 3);

                        let payload = {
                            to: [
                                {
                                    displayName: "Sarja One",
                                    email: "sarja3@nilavodev.com",
                                },
                            ],
                            cc: [
                                {
                                    displayName: "Sarja Four",
                                    email: "sarja4@nilavodev.com",
                                },
                            ],
                            bcc: [
                                {
                                    displayName: "Sarja Five",
                                    email: "sarja5@nilavodev.com",
                                },
                            ],
                            subject: "Message from sarja1",
                            secureMessage: "<p> This secure </p>",
                            notificationMessage:
                                "<p> This is notification </p>",
                            dateExpires: date,
                            requireSignIn: true,
                        };

                        api.createMessage(tenant, token, payload).then(
                            (response) => {
                                console.log(response);
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.subject).eq(
                                    payload.subject
                                );

                                let payloadDraft = {
                                    subject: "Update from draft1",
                                };

                                api.updateDraftMessage(
                                    tenant,
                                    "token",
                                    payloadDraft,
                                    response.body.id
                                ).then((r) => {
                                    expect(r.status).eq(401);
                                });
                            }
                        );
                    });
            });
            it("Send Message - API - Unauthorized", () => {
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let date = new Date();
                        date.setDate(date.getDate() + 3);

                        let payload = {
                            to: [
                                {
                                    displayName: "Sarja One",
                                    email: "sarja3@nilavodev.com",
                                },
                            ],
                            cc: [
                                {
                                    displayName: "Sarja Four",
                                    email: "sarja4@nilavodev.com",
                                },
                            ],
                            bcc: [
                                {
                                    displayName: "Sarja Five",
                                    email: "sarja5@nilavodev.com",
                                },
                            ],
                            subject: "Message from sarja1",
                            secureMessage: "<p> This secure </p>",
                            notificationMessage:
                                "<p> This is notification </p>",
                            dateExpires: date,
                            requireSignIn: true,
                        };

                        api.createMessage(tenant, token, payload).then(
                            (response) => {
                                console.log(response);
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.subject).eq(
                                    payload.subject
                                );

                                let payloadSendMessage = {
                                    id: response.body.id,
                                    to: [
                                        {
                                            displayName: "Sarja One",
                                            email: "sarja3@nilavodev.com",
                                        },
                                    ],
                                    cc: [
                                        {
                                            displayName: "Sarja Two",
                                            email: "sarja4@nilavodev.com",
                                        },
                                    ],
                                    bcc: [
                                        {
                                            displayName: "Sarja Three",
                                            email: "sarja5@nilavodev.com",
                                        },
                                    ],
                                    subject: "Message from sarja1",
                                    secureMessage: "<p> This secure </p>",
                                    notificationMessage:
                                        "<p> This is notification </p>",
                                    dateExpires: date,
                                    requireSignIn: true,
                                };

                                api.sendMessage(
                                    tenant,
                                    "token",
                                    payloadSendMessage
                                ).then((r) => {
                                    expect(r.status).eq(401);
                                });
                            }
                        );
                    });
            });
            it("List Message Threads - API - Unauthorized", () => {
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let date = new Date();
                        date.setDate(date.getDate() + 3);

                        let payload = {
                            to: [
                                {
                                    displayName: "Sarja One",
                                    email: "sarja3@nilavodev.com",
                                },
                            ],
                            cc: [
                                {
                                    displayName: "Sarja Four",
                                    email: "sarja4@nilavodev.com",
                                },
                            ],
                            bcc: [
                                {
                                    displayName: "Sarja Five",
                                    email: "sarja5@nilavodev.com",
                                },
                            ],
                            subject: "Message from sarja1",
                            secureMessage: "<p> This secure </p>",
                            notificationMessage:
                                "<p> This is notification </p>",
                            dateExpires: date,
                            requireSignIn: true,
                        };

                        api.createMessage(tenant, token, payload)
                            .then((response) => {
                                console.log(response);
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.subject).eq(
                                    payload.subject
                                );

                                let payloadSendMessage = {
                                    id: response.body.id,
                                    to: [
                                        {
                                            displayName: "Sarja One",
                                            email: "sarja3@nilavodev.com",
                                        },
                                    ],
                                    cc: [
                                        {
                                            displayName: "Sarja Two",
                                            email: "sarja4@nilavodev.com",
                                        },
                                    ],
                                    bcc: [
                                        {
                                            displayName: "Sarja Three",
                                            email: "sarja5@nilavodev.com",
                                        },
                                    ],
                                    subject: "Message from sarja1",
                                    secureMessage: "<p> This secure </p>",
                                    notificationMessage:
                                        "<p> This is notification </p>",
                                    dateExpires: date,
                                    requireSignIn: true,
                                };

                                api.sendMessage(
                                    tenant,
                                    token,
                                    payloadSendMessage
                                ).then((r) => {
                                    expect(r.status).eq(200);
                                    expect(r.body.id).eq(payloadSendMessage.id);
                                    expect(r.body.subject).eq(
                                        payloadSendMessage.subject
                                    );

                                    return r.body;
                                });
                            })
                            .then((res) => {
                                let bool = false;

                                let payload = {
                                    read: false,
                                    page: 1,
                                    size: 100,
                                };
                                cy.wait(200)
                                        api.listMessageThreads(
                                    tenant,
                                    "token",
                                    "sent",
                                    payload
                                ).then((r) => {
                                    expect(r.status).eq(401);
                                });
                            });
                    });
            });
            it("Delete Message Threads - API - Unauthorized", () => {
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let date = new Date();
                        date.setDate(date.getDate() + 3);

                        let payload = {
                            to: [
                                {
                                    displayName: "Sarja One",
                                    email: "sarja3@nilavodev.com",
                                },
                            ],
                            cc: [
                                {
                                    displayName: "Sarja Four",
                                    email: "sarja4@nilavodev.com",
                                },
                            ],
                            bcc: [
                                {
                                    displayName: "Sarja Five",
                                    email: "sarja5@nilavodev.com",
                                },
                            ],
                            subject: "Message from sarja1",
                            secureMessage: "<p> This secure </p>",
                            notificationMessage:
                                "<p> This is notification </p>",
                            dateExpires: date,
                            requireSignIn: true,
                        };

                        api.createMessage(tenant, token, payload)
                            .then((response) => {
                                console.log(response);
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.subject).eq(
                                    payload.subject
                                );

                                let payloadSendMessage = {
                                    id: response.body.id,
                                    to: [
                                        {
                                            displayName: "Sarja One",
                                            email: "sarja3@nilavodev.com",
                                        },
                                    ],
                                    cc: [
                                        {
                                            displayName: "Sarja Two",
                                            email: "sarja4@nilavodev.com",
                                        },
                                    ],
                                    bcc: [
                                        {
                                            displayName: "Sarja Three",
                                            email: "sarja5@nilavodev.com",
                                        },
                                    ],
                                    subject: "Delete message thread",
                                    secureMessage: "<p> This secure </p>",
                                    notificationMessage:
                                        "<p> This is notification </p>",
                                    dateExpires: date,
                                    requireSignIn: true,
                                };

                                api.sendMessage(
                                    tenant,
                                    token,
                                    payloadSendMessage
                                ).then((r) => {
                                    expect(r.status).eq(200);
                                    expect(r.body.id).eq(payloadSendMessage.id);
                                    expect(r.body.subject).eq(
                                        payloadSendMessage.subject
                                    );

                                    return r.body;
                                });
                            })
                            .then((res) => {
                                let payload = {
                                    read: false,
                                    page: 1,
                                    size: 100,
                                };
                                cy.wait(200)
                                        api.listMessageThreads(
                                    tenant,
                                    token,
                                    "sent",
                                    payload
                                ).then((r) => {
                                    expect(r.status).eq(200);
                                    expect(r.body).to.be.a("Array");

                                    let match = r.body.find(
                                        (o) =>
                                            o.subject ===
                                            "Delete message thread"
                                    );
                                    if (match) {
                                        let payload = [match.id];
                                        api.deleteMessageThreads(
                                            tenant,
                                            "token",
                                            "sent",
                                            payload
                                        ).then((response) => {
                                            expect(response.status).eq(401);
                                        });
                                    } else {
                                        expect(true).to.be.false;
                                    }
                                });
                            });
                    });
            });

            it("List Messages - API - Unaauthorized", () => {
                let token2 = null;
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let date = new Date();
                        date.setDate(date.getDate() + 3);

                        let payload = {
                            to: [
                                {
                                    displayName: "Sarja One",
                                    email: "sarja3@nilavodev.com",
                                },
                            ],
                            cc: [
                                {
                                    displayName: "Sarja Four",
                                    email: "sarja4@nilavodev.com",
                                },
                            ],
                            bcc: [
                                {
                                    displayName: "Sarja Five",
                                    email: "sarja5@nilavodev.com",
                                },
                            ],
                            subject: "Message from sarja1",
                            secureMessage: "<p> This secure </p>",
                            notificationMessage:
                                "<p> This is notification </p>",
                            dateExpires: date,
                            requireSignIn: true,
                        };

                        api.createMessage(tenant, token, payload).then(
                            (response) => {
                                console.log(response);
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.subject).eq(
                                    payload.subject
                                );

                                let payloadSendMessage = {
                                    id: response.body.id,
                                    to: [
                                        {
                                            displayName: "Sarja One",
                                            email: "sarja3@nilavodev.com",
                                        },
                                    ],
                                    cc: [
                                        {
                                            displayName: "Sarja Two",
                                            email: "sarja4@nilavodev.com",
                                        },
                                    ],
                                    bcc: [
                                        {
                                            displayName: "Sarja Three",
                                            email: "sarja5@nilavodev.com",
                                        },
                                    ],
                                    subject: "Message from sarja1",
                                    secureMessage: "<p> This secure </p>",
                                    notificationMessage:
                                        "<p> This is notification </p>",
                                    dateExpires: date,
                                    requireSignIn: true,
                                };

                                api.sendMessage(
                                    tenant,
                                    token,
                                    payloadSendMessage
                                )
                                    .then((r) => {
                                        expect(r.status).eq(200);
                                        expect(r.body.id).eq(
                                            payloadSendMessage.id
                                        );
                                        expect(r.body.subject).eq(
                                            payloadSendMessage.subject
                                        );

                                        return r.body;
                                    })
                                    .then(() => {
                                        api.tokenAuthentication(
                                            tenant,
                                            "sarja3@nilavodev.com",
                                            testData.password
                                        );
                                    })
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        let bearerToken2 =
                                            response.headers.authorization;
                                        console.log(bearerToken2);
                                        token2 = bearerToken2;
                                        return bearerToken2;
                                    })
                                    .then(() => {
                                        let qs = {
                                            read: false,
                                            page: 1,
                                            size: 100,
                                        };
                                        cy.wait(200)
                                        api.listMessageThreads(
                                            tenant,
                                            "token2",
                                            "inbox",
                                            qs
                                        );
                                    })
                                    .then((r) => {
                                        let bool = false;
                                        let id = null;
                                        expect(r.status).eq(401);
                                    });
                            }
                        );
                    });
            });
            it("Reply Messages  - API - Unauthorized", () => {
                let token2 = null;
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let date = new Date();
                        date.setDate(date.getDate() + 3);

                        let payload = {
                            to: [
                                {
                                    displayName: "Sarja One",
                                    email: "sarja3@nilavodev.com",
                                },
                            ],
                            cc: [
                                {
                                    displayName: "Sarja Four",
                                    email: "sarja4@nilavodev.com",
                                },
                            ],
                            bcc: [
                                {
                                    displayName: "Sarja Five",
                                    email: "sarja5@nilavodev.com",
                                },
                            ],
                            subject: "Message from sarja1",
                            secureMessage: "<p> This secure </p>",
                            notificationMessage:
                                "<p> This is notification </p>",
                            dateExpires: date,
                            requireSignIn: true,
                        };

                        api.createMessage(tenant, token, payload).then(
                            (response) => {
                                console.log(response);
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.subject).eq(
                                    payload.subject
                                );

                                let payloadSendMessage = {
                                    id: response.body.id,
                                    to: [
                                        {
                                            displayName: "Sarja Three",
                                            email: "sarja3@nilavodev.com",
                                        },
                                    ],
                                    subject: "Reply from sarja1",
                                    secureMessage: "<p> This secure </p>",
                                    notificationMessage:
                                        "<p> This is notification </p>",
                                    dateExpires: date,
                                    requireSignIn: true,
                                };

                                api.sendMessage(
                                    tenant,
                                    token,
                                    payloadSendMessage
                                )
                                    .then((r) => {
                                        expect(r.status).eq(200);
                                        expect(r.body.id).eq(
                                            payloadSendMessage.id
                                        );
                                        expect(r.body.subject).eq(
                                            payloadSendMessage.subject
                                        );

                                        return r.body;
                                    })
                                    .then(() => {
                                        api.tokenAuthentication(
                                            tenant,
                                            "sarja3@nilavodev.com",
                                            "Nil@vo2006"
                                        );
                                    })
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        let bearerToken2 =
                                            response.headers.authorization;
                                        console.log(bearerToken2);
                                        token2 = bearerToken2;
                                        return bearerToken2;
                                    })
                                    .then(() => {
                                        debugger;
                                        let qs = {
                                            read: false,
                                            page: 1,
                                            size: 100,
                                        };
                                        cy.wait(200)
                                        api.listMessageThreads(
                                            tenant,
                                            token2,
                                            "inbox",
                                            qs
                                        );
                                    })
                                    .then((r) => {
                                        let bool = false;
                                        let id = null;
                                        expect(r.status).eq(200);
                                        expect(r.body).to.be.a("Array");

                                        let match = r.body.find(
                                            (o) =>
                                                o.subject ===
                                                "Reply from sarja1"
                                        );

                                        if (match) {
                                            bool = true;

                                            return match.id;
                                        } else {
                                            expect(true).to.be.false;
                                        }
                                    })
                                    .then((threadId) => {
                                        let qs = {
                                            page: 1,
                                            size: 100,
                                        };

                                        return api.listMessages(
                                            tenant,
                                            token2,
                                            "inbox",
                                            threadId,
                                            qs
                                        );
                                    })
                                    .then((res) => {
                                        expect(res.status).eq(200);
                                        let payload = {
                                            secureMessage:
                                                "<p> Reply This secure </p>",
                                            notificationMessage:
                                                "<p> reply is notification </p>",
                                            dateExpires: date,
                                            requireSignIn: true,
                                        };
                                        console.log("L2 " + res.body[0].id);

                                        api.replyMessage(
                                            tenant,
                                            "token2",
                                            res.body[0].id,
                                            payload
                                        );
                                    })
                                    .then((response) => {
                                        expect(response.status).eq(401);
                                    });
                            }
                        );
                    });
            });

            it("Reply All Messages- API - Unauthorized", () => {
                let token2 = null;
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let date = new Date();
                        date.setDate(date.getDate() + 3);

                        let payload = {
                            to: [
                                {
                                    displayName: "Sarja One",
                                    email: "sarja3@nilavodev.com",
                                },
                            ],
                            cc: [
                                {
                                    displayName: "Sarja Three",
                                    email: "sarja4@nilavodev.com",
                                },
                            ],
                            bcc: [
                                {
                                    displayName: "Sarja Five",
                                    email: "sarja5@nilavodev.com",
                                },
                            ],
                            subject: "Message from sarja1",
                            secureMessage: "<p> This secure </p>",
                            notificationMessage:
                                "<p> This is notification </p>",
                            dateExpires: date,
                            requireSignIn: true,
                        };

                        api.createMessage(tenant, token, payload).then(
                            (response) => {
                                console.log(response);
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.subject).eq(
                                    payload.subject
                                );

                                let payloadSendMessage = {
                                    id: response.body.id,
                                    to: [
                                        {
                                            displayName: "Sarja Three",
                                            email: "sarja3@nilavodev.com",
                                        },
                                    ],
                                    cc: [
                                        {
                                            displayName: "Sarja Four",
                                            email: "sarja4@nilavodev.com",
                                        },
                                    ],
                                    bcc: [
                                        {
                                            displayName: "Sarja Five",
                                            email: "sarja5@nilavodev.com",
                                        },
                                    ],
                                    subject: "Reply from sarja1",
                                    secureMessage: "<p> This secure </p>",
                                    notificationMessage:
                                        "<p> This is notification </p>",
                                    dateExpires: date,
                                    requireSignIn: true,
                                };

                                api.sendMessage(
                                    tenant,
                                    token,
                                    payloadSendMessage
                                )
                                    .then((r) => {
                                        expect(r.status).eq(200);
                                        expect(r.body.id).eq(
                                            payloadSendMessage.id
                                        );
                                        expect(r.body.subject).eq(
                                            payloadSendMessage.subject
                                        );

                                        return r.body;
                                    })
                                    .then(() => {
                                        api.tokenAuthentication(
                                            tenant,
                                            "sarja3@nilavodev.com",
                                            "Nil@vo2006"
                                        );
                                    })
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        let bearerToken2 =
                                            response.headers.authorization;
                                        console.log(bearerToken2);
                                        token2 = bearerToken2;
                                        return bearerToken2;
                                    })
                                    .then(() => {
                                        debugger;
                                        let qs = {
                                            read: false,
                                            page: 1,
                                            size: 100,
                                        };
                                        cy.wait(200)
                                        api.listMessageThreads(
                                            tenant,
                                            token2,
                                            "inbox",
                                            qs
                                        );
                                    })
                                    .then((r) => {
                                        let bool = false;
                                        let id = null;
                                        expect(r.status).eq(200);
                                        expect(r.body).to.be.a("Array");

                                        let match = r.body.find(
                                            (o) =>
                                                o.subject ===
                                                "Reply from sarja1"
                                        );

                                        if (match) {
                                            bool = true;

                                            return match.id;
                                        } else {
                                            expect(true).to.be.false;
                                        }
                                    })
                                    .then((threadId) => {
                                        let qs = {
                                            page: 1,
                                            size: 100,
                                        };

                                        return api.listMessages(
                                            tenant,
                                            token2,
                                            "inbox",
                                            threadId,
                                            qs
                                        );
                                    })
                                    .then((res) => {
                                        expect(res.status).eq(200);
                                        let payload = {
                                            secureMessage:
                                                "<p> Reply This secure </p>",
                                            notificationMessage:
                                                "<p> reply is notification </p>",
                                            dateExpires: date,
                                            requireSignIn: true,
                                        };
                                        console.log("L2 " + res.body[0].id);

                                        api.replyAllMessage(
                                            tenant,
                                            "token2",
                                            res.body[0].id,
                                            payload
                                        );
                                    })
                                    .then((response) => {
                                        expect(response.status).eq(401);
                                    });
                            }
                        );
                    });
            });

            it("Forward Message and Send - API - Unauthorized", () => {
                let token2 = null;
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let date = new Date();
                        date.setDate(date.getDate() + 3);

                        let payload = {
                            to: [
                                {
                                    displayName: "Sarja One",
                                    email: "sarja3@nilavodev.com",
                                },
                            ],
                            subject: "Forward message from sarja1",
                            secureMessage: "<p> This secure </p>",
                            notificationMessage:
                                "<p> This is notification </p>",
                            dateExpires: date,
                            requireSignIn: true,
                        };

                        api.createMessage(tenant, token, payload).then(
                            (response) => {
                                console.log(response);
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.subject).eq(
                                    payload.subject
                                );

                                let payloadSendMessage = {
                                    id: response.body.id,
                                    to: [
                                        {
                                            displayName: "Sarja Three",
                                            email: "sarja3@nilavodev.com",
                                        },
                                    ],
                                    subject: "Forward message from sarja1",
                                    secureMessage: "<p> This secure </p>",
                                    notificationMessage:
                                        "<p> This is notification </p>",
                                    dateExpires: date,
                                    requireSignIn: true,
                                };

                                api.sendMessage(
                                    tenant,
                                    token,
                                    payloadSendMessage
                                )
                                    .then((r) => {
                                        expect(r.status).eq(200);
                                        expect(r.body.id).eq(
                                            payloadSendMessage.id
                                        );
                                        expect(r.body.subject).eq(
                                            payloadSendMessage.subject
                                        );

                                        return r.body;
                                    })
                                    .then(() => {
                                        api.tokenAuthentication(
                                            tenant,
                                            "sarja3@nilavodev.com",
                                            "Nil@vo2006"
                                        );
                                    })
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        let bearerToken2 =
                                            response.headers.authorization;
                                        console.log(bearerToken2);
                                        token2 = bearerToken2;
                                        return bearerToken2;
                                    })
                                    .then(() => {
                                        debugger;
                                        let qs = {
                                            read: false,
                                            page: 1,
                                            size: 100,
                                        };
                                        cy.wait(200)
                                        api.listMessageThreads(
                                            tenant,
                                            token2,
                                            "inbox",
                                            qs
                                        );
                                    })
                                    .then((r) => {
                                        let bool = false;
                                        let id = null;
                                        expect(r.status).eq(200);
                                        expect(r.body).to.be.a("Array");

                                        let match = r.body.find(
                                            (o) =>
                                                o.subject ===
                                                "Forward message from sarja1"
                                        );

                                        if (match) {
                                            bool = true;

                                            return match.id;
                                        } else {
                                            expect(true).to.be.false;
                                        }
                                    })
                                    .then((threadId) => {
                                        let qs = {
                                            page: 1,
                                            size: 100,
                                        };

                                        return api.listMessages(
                                            tenant,
                                            token2,
                                            "inbox",
                                            threadId,
                                            qs
                                        );
                                    })
                                    .then((res) => {
                                        expect(res.status).eq(200);
                                        let payload = {
                                            secureMessage:
                                                "<p> Forward This secure </p>",
                                            notificationMessage:
                                                "<p> Forward is notification </p>",
                                            dateExpires: date,
                                            requireSignIn: true,
                                        };
                                        console.log("L2 " + res.body[0].id);

                                        api.forwardMessage(
                                            tenant,
                                            "token2",
                                            res.body[0].id,
                                            payload
                                        );
                                    })
                                    .then((response) => {
                                        expect(response.status).eq(401);
                                    });
                            }
                        );
                    });
            });

            it("Delete Message Threads Permanently - API - Unauthorized", () => {
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let date = new Date();
                        date.setDate(date.getDate() + 3);

                        let payload = {
                            to: [
                                {
                                    displayName: "Sarja One",
                                    email: "sarja3@nilavodev.com",
                                },
                            ],
                            cc: [
                                {
                                    displayName: "Sarja Four",
                                    email: "sarja4@nilavodev.com",
                                },
                            ],
                            bcc: [
                                {
                                    displayName: "Sarja Five",
                                    email: "sarja5@nilavodev.com",
                                },
                            ],
                            subject: "Message from sarja1",
                            secureMessage: "<p> This secure </p>",
                            notificationMessage:
                                "<p> This is notification </p>",
                            dateExpires: date,
                            requireSignIn: true,
                        };

                        api.createMessage(tenant, token, payload)
                            .then((response) => {
                                console.log(response);
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.subject).eq(
                                    payload.subject
                                );

                                let payloadSendMessage = {
                                    id: response.body.id,
                                    to: [
                                        {
                                            displayName: "Sarja One",
                                            email: "sarja3@nilavodev.com",
                                        },
                                    ],
                                    cc: [
                                        {
                                            displayName: "Sarja Two",
                                            email: "sarja4@nilavodev.com",
                                        },
                                    ],
                                    bcc: [
                                        {
                                            displayName: "Sarja Three",
                                            email: "sarja5@nilavodev.com",
                                        },
                                    ],
                                    subject: "Delete2 message thread",
                                    secureMessage: "<p> This secure </p>",
                                    notificationMessage:
                                        "<p> This is notification </p>",
                                    dateExpires: date,
                                    requireSignIn: true,
                                };

                                api.sendMessage(
                                    tenant,
                                    token,
                                    payloadSendMessage
                                ).then((r) => {
                                    expect(r.status).eq(200);
                                    expect(r.body.id).eq(payloadSendMessage.id);
                                    expect(r.body.subject).eq(
                                        payloadSendMessage.subject
                                    );

                                    return r.body;
                                });
                            })
                            .then((res) => {
                                let payload = {
                                    read: false,
                                    page: 1,
                                    size: 100,
                                };
                                cy.wait(200)
                                        api.listMessageThreads(
                                    tenant,
                                    token,
                                    "sent",
                                    payload
                                ).then((r) => {
                                    expect(r.status).eq(200);
                                    expect(r.body).to.be.a("Array");

                                    let match = r.body.find(
                                        (o) =>
                                            o.subject ===
                                            "Delete2 message thread"
                                    );
                                    if (match) {
                                        let payload = [match.id];
                                        api.deleteMessageThreads(
                                            tenant,
                                            token,
                                            "sent",
                                            payload
                                        )
                                            .then((response) => {
                                                expect(response.status).eq(200);
                                                expect(
                                                    response.body
                                                        .operationSucceeded
                                                ).to.contain(match.id);
                                            })
                                            .then(() => {
                                                let payload = [match.id];
                                                api.deleteMessageThreadsPermanently(
                                                    tenant,
                                                    "token",
                                                    payload
                                                ).then((response) => {
                                                    expect(response.status).eq(
                                                        401
                                                    );
                                                });
                                            });
                                    } else {
                                        expect(true).to.be.false;
                                    }
                                });
                            });
                    });
            });

            it("Restore Message Threads - API - Unauthorized", () => {
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let date = new Date();
                        date.setDate(date.getDate() + 3);

                        let payload = {
                            to: [
                                {
                                    displayName: "Sarja One",
                                    email: "sarja3@nilavodev.com",
                                },
                            ],
                            cc: [
                                {
                                    displayName: "Sarja Four",
                                    email: "sarja4@nilavodev.com",
                                },
                            ],
                            bcc: [
                                {
                                    displayName: "Sarja Five",
                                    email: "sarja5@nilavodev.com",
                                },
                            ],
                            subject: "Message from sarja1",
                            secureMessage: "<p> This secure </p>",
                            notificationMessage:
                                "<p> This is notification </p>",
                            dateExpires: date,
                            requireSignIn: true,
                        };

                        api.createMessage(tenant, token, payload)
                            .then((response) => {
                                console.log(response);
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.subject).eq(
                                    payload.subject
                                );

                                let payloadSendMessage = {
                                    id: response.body.id,
                                    to: [
                                        {
                                            displayName: "Sarja One",
                                            email: "sarja3@nilavodev.com",
                                        },
                                    ],
                                    cc: [
                                        {
                                            displayName: "Sarja Two",
                                            email: "sarja4@nilavodev.com",
                                        },
                                    ],
                                    bcc: [
                                        {
                                            displayName: "Sarja Three",
                                            email: "sarja5@nilavodev.com",
                                        },
                                    ],
                                    subject: "Delete2 message thread",
                                    secureMessage: "<p> This secure </p>",
                                    notificationMessage:
                                        "<p> This is notification </p>",
                                    dateExpires: date,
                                    requireSignIn: true,
                                };

                                api.sendMessage(
                                    tenant,
                                    token,
                                    payloadSendMessage
                                ).then((r) => {
                                    expect(r.status).eq(200);
                                    expect(r.body.id).eq(payloadSendMessage.id);
                                    expect(r.body.subject).eq(
                                        payloadSendMessage.subject
                                    );

                                    return r.body;
                                });
                            })
                            .then((res) => {
                                let payload = {
                                    read: false,
                                    page: 1,
                                    size: 100,
                                };
                                cy.wait(200)
                                        api.listMessageThreads(
                                    tenant,
                                    token,
                                    "sent",
                                    payload
                                ).then((r) => {
                                    expect(r.status).eq(200);
                                    expect(r.body).to.be.a("Array");

                                    let match = r.body.find(
                                        (o) =>
                                            o.subject ===
                                            "Delete2 message thread"
                                    );
                                    if (match) {
                                        let payload = [match.id];
                                        api.deleteMessageThreads(
                                            tenant,
                                            token,
                                            "sent",
                                            payload
                                        )
                                            .then((response) => {
                                                expect(response.status).eq(200);
                                                expect(
                                                    response.body
                                                        .operationSucceeded
                                                ).to.contain(match.id);
                                            })
                                            .then(() => {
                                                let payload = [match.id];
                                                api.restoreMessageThread(
                                                    tenant,
                                                    'token',
                                                    payload
                                                ).then((response) => {
                                                    expect(response.status).eq(401);
                                                    
                                                });
                                            });
                                    } else {
                                        expect(true).to.be.false;
                                    }
                                });
                            });
                    });
            });

            it("Delete Messages - API - Unauthorized", () => {
                let token2 = null;
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let date = new Date();
                        date.setDate(date.getDate() + 3);

                        let payload = {
                            to: [
                                {
                                    displayName: "Sarja One",
                                    email: "sarja3@nilavodev.com",
                                },
                            ],
                            cc: [
                                {
                                    displayName: "Sarja Four",
                                    email: "sarja4@nilavodev.com",
                                },
                            ],
                            bcc: [
                                {
                                    displayName: "Sarja Five",
                                    email: "sarja5@nilavodev.com",
                                },
                            ],
                            subject: "Message from sarja1",
                            secureMessage: "<p> This secure </p>",
                            notificationMessage:
                                "<p> This is notification </p>",
                            dateExpires: date,
                            requireSignIn: true,
                        };

                        api.createMessage(tenant, token, payload).then(
                            (response) => {
                                console.log(response);
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.subject).eq(
                                    payload.subject
                                );

                                let payloadSendMessage = {
                                    id: response.body.id,
                                    to: [
                                        {
                                            displayName: "Sarja One",
                                            email: "sarja3@nilavodev.com",
                                        },
                                    ],
                                    cc: [
                                        {
                                            displayName: "Sarja Two",
                                            email: "sarja4@nilavodev.com",
                                        },
                                    ],
                                    bcc: [
                                        {
                                            displayName: "Sarja Three",
                                            email: "sarja5@nilavodev.com",
                                        },
                                    ],
                                    subject: "Message from sarja1",
                                    secureMessage: "<p> This secure </p>",
                                    notificationMessage:
                                        "<p> This is notification </p>",
                                    dateExpires: date,
                                    requireSignIn: true,
                                };

                                api.sendMessage(
                                    tenant,
                                    token,
                                    payloadSendMessage
                                )
                                    .then((r) => {
                                        expect(r.status).eq(200);
                                        expect(r.body.id).eq(
                                            payloadSendMessage.id
                                        );
                                        expect(r.body.subject).eq(
                                            payloadSendMessage.subject
                                        );

                                        return r.body;
                                    })
                                    .then(() => {
                                        api.tokenAuthentication(
                                            tenant,
                                            "sarja3@nilavodev.com",
                                            testData.password
                                        );
                                    })
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        let bearerToken2 =
                                            response.headers.authorization;
                                        console.log(bearerToken2);
                                        token2 = bearerToken2;
                                        return bearerToken2;
                                    })
                                    .then(() => {
                                        let qs = {
                                            read: false,
                                            page: 1,
                                            size: 100,
                                        };
                                        cy.wait(200)
                                        api.listMessageThreads(
                                            tenant,
                                            token2,
                                            "inbox",
                                            qs
                                        );
                                    })
                                    .then((r) => {
                                        let bool = false;
                                        let id = null;
                                        expect(r.status).eq(200);
                                        expect(r.body).to.be.a("Array");

                                        let match = r.body.find(
                                            (o) =>
                                                o.subject ===
                                                "Message from sarja1"
                                        );

                                        if (match) {
                                            bool = true;

                                            return match.id;
                                        } else {
                                            expect(true).to.be.false;
                                        }
                                    })
                                    .then((threadId) => {
                                        let qs = {
                                            page: 1,
                                            size: 100,
                                        };

                                        return api.listMessages(
                                            tenant,
                                            token2,
                                            "inbox",
                                            threadId,
                                            qs
                                        );
                                    })
                                    .then((response) => {
                                        let bool = false;
                                        expect(response.status).eq(200);
                                        let match = response.body.find(
                                            (o) =>
                                                o.subject ===
                                                "Message from sarja1"
                                        );

                                        if (match) {
                                            bool = true;
                                            payload=[match.id]
                                            api.deleteMessages(tenant,'token2','inbox',payload)
                                            .then((response)=>{
                                                expect(response.status).eq(401)
                                            
                                            })
                                        } else {
                                            expect(true).to.be.false;
                                        }
                                        expect(bool).to.be.true;
                                    });
                            }
                        );
                    });
            });

            it("Delete Messages Permanentlty - API - Unauthorized", () => {
                let token2 = null;
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let date = new Date();
                        date.setDate(date.getDate() + 3);

                        let payload = {
                            to: [
                                {
                                    displayName: "Sarja One",
                                    email: "sarja3@nilavodev.com",
                                },
                            ],
                            cc: [
                                {
                                    displayName: "Sarja Four",
                                    email: "sarja4@nilavodev.com",
                                },
                            ],
                            bcc: [
                                {
                                    displayName: "Sarja Five",
                                    email: "sarja5@nilavodev.com",
                                },
                            ],
                            subject: "Message from sarja1",
                            secureMessage: "<p> This secure </p>",
                            notificationMessage:
                                "<p> This is notification </p>",
                            dateExpires: date,
                            requireSignIn: true,
                        };

                        api.createMessage(tenant, token, payload).then(
                            (response) => {
                                console.log(response);
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.subject).eq(
                                    payload.subject
                                );

                                let payloadSendMessage = {
                                    id: response.body.id,
                                    to: [
                                        {
                                            displayName: "Sarja One",
                                            email: "sarja3@nilavodev.com",
                                        },
                                    ],
                                    cc: [
                                        {
                                            displayName: "Sarja Two",
                                            email: "sarja4@nilavodev.com",
                                        },
                                    ],
                                    bcc: [
                                        {
                                            displayName: "Sarja Three",
                                            email: "sarja5@nilavodev.com",
                                        },
                                    ],
                                    subject: "Message from sarja1",
                                    secureMessage: "<p> This secure </p>",
                                    notificationMessage:
                                        "<p> This is notification </p>",
                                    dateExpires: date,
                                    requireSignIn: true,
                                };

                                api.sendMessage(
                                    tenant,
                                    token,
                                    payloadSendMessage
                                )
                                    .then((r) => {
                                        expect(r.status).eq(200);
                                        expect(r.body.id).eq(
                                            payloadSendMessage.id
                                        );
                                        expect(r.body.subject).eq(
                                            payloadSendMessage.subject
                                        );

                                        return r.body;
                                    })
                                    .then(() => {
                                        api.tokenAuthentication(
                                            tenant,
                                            "sarja3@nilavodev.com",
                                            testData.password
                                        );
                                    })
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        let bearerToken2 =
                                            response.headers.authorization;
                                        console.log(bearerToken2);
                                        token2 = bearerToken2;
                                        return bearerToken2;
                                    })
                                    .then(() => {
                                        let qs = {
                                            read: false,
                                            page: 1,
                                            size: 100,
                                        };
                                        cy.wait(200)
                                        api.listMessageThreads(
                                            tenant,
                                            token2,
                                            "inbox",
                                            qs
                                        );
                                    })
                                    .then((r) => {
                                        let bool = false;
                                        let id = null;
                                        expect(r.status).eq(200);
                                        expect(r.body).to.be.a("Array");

                                        let match = r.body.find(
                                            (o) =>
                                                o.subject ===
                                                "Message from sarja1"
                                        );

                                        if (match) {
                                            bool = true;

                                            return match.id;
                                        } else {
                                            expect(true).to.be.false;
                                        }
                                    })
                                    .then((threadId) => {
                                        let qs = {
                                            page: 1,
                                            size: 100,
                                        };

                                        return api.listMessages(
                                            tenant,
                                            token2,
                                            "inbox",
                                            threadId,
                                            qs
                                        );
                                    })
                                    .then((response) => {
                                        let bool = false;
                                        expect(response.status).eq(200);
                                        let match = response.body.find(
                                            (o) =>
                                                o.subject ===
                                                "Message from sarja1"
                                        );

                                        if (match) {
                                            bool = true;
                                            payload=[match.id]
                                            api.deleteMessages(tenant,token2,'inbox',payload)
                                            .then((response)=>{
                                                expect(response.status).eq(200)
                                                expect(response.body.operationSucceeded).to.contain(match.id);

                                            })
                                            .then(()=>{
                                                 let payload = [match.id];
                                                api.deleteMessagesPermanently(tenant,'token2',payload)
                                                .then((response)=>{
                                                    expect(response.status).eq(401)
                                                    

                                                })
                                            })
                                        } else {
                                            expect(true).to.be.false;
                                        }
                                        expect(bool).to.be.true;
                                    });
                            }
                        );
                    });
            });

            it("Restore Messages - API - Unauthorized", () => {
                let token2 = null;
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let date = new Date();
                        date.setDate(date.getDate() + 3);

                        let payload = {
                            to: [
                                {
                                    displayName: "Sarja One",
                                    email: "sarja3@nilavodev.com",
                                },
                            ],
                            cc: [
                                {
                                    displayName: "Sarja Four",
                                    email: "sarja4@nilavodev.com",
                                },
                            ],
                            bcc: [
                                {
                                    displayName: "Sarja Five",
                                    email: "sarja5@nilavodev.com",
                                },
                            ],
                            subject: "Message from sarja1",
                            secureMessage: "<p> This secure </p>",
                            notificationMessage:
                                "<p> This is notification </p>",
                            dateExpires: date,
                            requireSignIn: true,
                        };

                        api.createMessage(tenant, token, payload).then(
                            (response) => {
                                console.log(response);
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.subject).eq(
                                    payload.subject
                                );

                                let payloadSendMessage = {
                                    id: response.body.id,
                                    to: [
                                        {
                                            displayName: "Sarja One",
                                            email: "sarja3@nilavodev.com",
                                        },
                                    ],
                                    cc: [
                                        {
                                            displayName: "Sarja Two",
                                            email: "sarja4@nilavodev.com",
                                        },
                                    ],
                                    bcc: [
                                        {
                                            displayName: "Sarja Three",
                                            email: "sarja5@nilavodev.com",
                                        },
                                    ],
                                    subject: "Message from sarja1",
                                    secureMessage: "<p> This secure </p>",
                                    notificationMessage:
                                        "<p> This is notification </p>",
                                    dateExpires: date,
                                    requireSignIn: true,
                                };

                                api.sendMessage(
                                    tenant,
                                    token,
                                    payloadSendMessage
                                )
                                    .then((r) => {
                                        expect(r.status).eq(200);
                                        expect(r.body.id).eq(
                                            payloadSendMessage.id
                                        );
                                        expect(r.body.subject).eq(
                                            payloadSendMessage.subject
                                        );

                                        return r.body;
                                    })
                                    .then(() => {
                                        api.tokenAuthentication(
                                            tenant,
                                            "sarja3@nilavodev.com",
                                            testData.password
                                        );
                                    })
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        let bearerToken2 =
                                            response.headers.authorization;
                                        console.log(bearerToken2);
                                        token2 = bearerToken2;
                                        return bearerToken2;
                                    })
                                    .then(() => {
                                        let qs = {
                                            read: false,
                                            page: 1,
                                            size: 100,
                                        };
                                        cy.wait(200)
                                        api.listMessageThreads(
                                            tenant,
                                            token2,
                                            "inbox",
                                            qs
                                        );
                                    })
                                    .then((r) => {
                                        let bool = false;
                                        let id = null;
                                        expect(r.status).eq(200);
                                        expect(r.body).to.be.a("Array");

                                        let match = r.body.find(
                                            (o) =>
                                                o.subject ===
                                                "Message from sarja1"
                                        );

                                        if (match) {
                                            bool = true;

                                            return match.id;
                                        } else {
                                            expect(true).to.be.false;
                                        }
                                    })
                                    .then((threadId) => {
                                        let qs = {
                                            page: 1,
                                            size: 100,
                                        };

                                        return api.listMessages(
                                            tenant,
                                            token2,
                                            "inbox",
                                            threadId,
                                            qs
                                        );
                                    })
                                    .then((response) => {
                                        let bool = false;
                                        expect(response.status).eq(200);
                                        let match = response.body.find(
                                            (o) =>
                                                o.subject ===
                                                "Message from sarja1"
                                        );

                                        if (match) {
                                            bool = true;
                                            payload=[match.id]
                                            api.deleteMessages(tenant,token2,'inbox',payload)
                                            .then((response)=>{
                                                expect(response.status).eq(200)
                                                expect(response.body.operationSucceeded).to.contain(match.id);

                                            }).then(() => {
                                                let payload = [match.id];
                                                api.restoreMessage(
                                                    tenant,
                                                    'token2',
                                                    payload
                                                ).then((response) => {
                                                    expect(response.status).eq(
                                                        401
                                                    );
                                                    
                                                });
                                            });
                                        } else {
                                            expect(true).to.be.false;
                                        }
                                        expect(bool).to.be.true;
                                    });
                            }
                        );
                    });
            });

            it("List Message Activities - API - Unauthorized", () => {
                let token2 = null;
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let date = new Date();
                        date.setDate(date.getDate() + 3);

                        let payload = {
                            to: [
                                {
                                    displayName: "Sarja One",
                                    email: "sarja3@nilavodev.com",
                                },
                            ],
                            cc: [
                                {
                                    displayName: "Sarja Four",
                                    email: "sarja4@nilavodev.com",
                                },
                            ],
                            bcc: [
                                {
                                    displayName: "Sarja Five",
                                    email: "sarja5@nilavodev.com",
                                },
                            ],
                            subject: "Message from sarja1",
                            secureMessage: "<p> This secure </p>",
                            notificationMessage:
                                "<p> This is notification </p>",
                            dateExpires: date,
                            requireSignIn: true,
                        };

                        api.createMessage(tenant, token, payload).then(
                            (response) => {
                                console.log(response);
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.subject).eq(
                                    payload.subject
                                );

                                let payloadSendMessage = {
                                    id: response.body.id,
                                    to: [
                                        {
                                            displayName: "Sarja One",
                                            email: "sarja3@nilavodev.com",
                                        },
                                    ],
                                    cc: [
                                        {
                                            displayName: "Sarja Two",
                                            email: "sarja4@nilavodev.com",
                                        },
                                    ],
                                    bcc: [
                                        {
                                            displayName: "Sarja Three",
                                            email: "sarja5@nilavodev.com",
                                        },
                                    ],
                                    subject: "Message from sarja1",
                                    secureMessage: "<p> This secure </p>",
                                    notificationMessage:
                                        "<p> This is notification </p>",
                                    dateExpires: date,
                                    requireSignIn: true,
                                };

                                api.sendMessage(
                                    tenant,
                                    token,
                                    payloadSendMessage
                                )
                                    .then((r) => {
                                        expect(r.status).eq(200);
                                        expect(r.body.id).eq(
                                            payloadSendMessage.id
                                        );
                                        expect(r.body.subject).eq(
                                            payloadSendMessage.subject
                                        );

                                        return r.body;
                                    })
                                    .then(() => {
                                        let qs = {
                                            read: false,
                                            page: 1,
                                            size: 100,
                                        };
                                        cy.wait(200)
                                        api.listMessageThreads(
                                            tenant,
                                            token,
                                            "sent",
                                            qs
                                        );
                                    })
                                    .then((r) => {
                                        let bool = false;
                                        let id = null;
                                        expect(r.status).eq(200);
                                        expect(r.body).to.be.a("Array");

                                        let match = r.body.find(
                                            (o) =>
                                                o.subject ===
                                                "Message from sarja1"
                                        );

                                        if (match) {
                                            bool = true;

                                            return match.id;
                                        } else {
                                            expect(true).to.be.false;
                                        }
                                    })
                                    .then((threadId) => {
                                        let qs = {
                                            page: 1,
                                            size: 100,
                                        };

                                        return api.listMessages(
                                            tenant,
                                            token,
                                            "sent",
                                            threadId,
                                            qs
                                        );
                                    })
                                    .then((response) => {
                                        let bool = false;
                                        expect(response.status).eq(200);
                                        let match = response.body.find(
                                            (o) =>
                                                o.subject ===
                                                "Message from sarja1"
                                        );

                                        if (match) {
                                            bool = true;
                                            api.listMessageActivities(tenant,'token',match.id)
                                            .then((response)=>{
                                                expect(response.status).eq(401) 
                                            })
                                        } else {
                                            expect(true).to.be.false;
                                        }
                                        expect(bool).to.be.true;
                                    });
                            }
                        );
                    });
            });


            it("Mark Messages as Read - API - Unauthorized", () => {
                let token2 = null;
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let date = new Date();
                        date.setDate(date.getDate() + 3);

                        let payload = {
                            to: [
                                {
                                    displayName: "Sarja One",
                                    email: "sarja3@nilavodev.com",
                                },
                            ],
                            cc: [
                                {
                                    displayName: "Sarja Four",
                                    email: "sarja4@nilavodev.com",
                                },
                            ],
                            bcc: [
                                {
                                    displayName: "Sarja Five",
                                    email: "sarja5@nilavodev.com",
                                },
                            ],
                            subject: "Message from sarja1",
                            secureMessage: "<p> This secure </p>",
                            notificationMessage:
                                "<p> This is notification </p>",
                            dateExpires: date,
                            requireSignIn: true,
                        };

                        api.createMessage(tenant, token, payload).then(
                            (response) => {
                                console.log(response);
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.subject).eq(
                                    payload.subject
                                );

                                let payloadSendMessage = {
                                    id: response.body.id,
                                    to: [
                                        {
                                            displayName: "Sarja One",
                                            email: "sarja3@nilavodev.com",
                                        },
                                    ],
                                    cc: [
                                        {
                                            displayName: "Sarja Two",
                                            email: "sarja4@nilavodev.com",
                                        },
                                    ],
                                    bcc: [
                                        {
                                            displayName: "Sarja Three",
                                            email: "sarja5@nilavodev.com",
                                        },
                                    ],
                                    subject: "Message from sarja1",
                                    secureMessage: "<p> This secure </p>",
                                    notificationMessage:
                                        "<p> This is notification </p>",
                                    dateExpires: date,
                                    requireSignIn: true,
                                };

                                api.sendMessage(
                                    tenant,
                                    token,
                                    payloadSendMessage
                                )
                                    .then((r) => {
                                        expect(r.status).eq(200);
                                        expect(r.body.id).eq(
                                            payloadSendMessage.id
                                        );
                                        expect(r.body.subject).eq(
                                            payloadSendMessage.subject
                                        );

                                        return r.body;
                                    })
                                    .then(() => {
                                        api.tokenAuthentication(
                                            tenant,
                                            "sarja3@nilavodev.com",
                                            testData.password
                                        );
                                    })
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        let bearerToken2 =
                                            response.headers.authorization;
                                        console.log(bearerToken2);
                                        token2 = bearerToken2;
                                        return bearerToken2;
                                    })
                                    .then(() => {
                                        let qs = {
                                            read: false,
                                            page: 1,
                                            size: 100,
                                        };
                                        cy.wait(200)
                                        api.listMessageThreads(
                                            tenant,
                                            token2,
                                            "inbox",
                                            qs
                                        );
                                    })
                                    .then((r) => {
                                        let bool = false;
                                        let id = null;
                                        expect(r.status).eq(200);
                                        expect(r.body).to.be.a("Array");

                                        let match = r.body.find(
                                            (o) =>
                                                o.subject ===
                                                "Message from sarja1"
                                        );

                                        if (match) {
                                            bool = true;

                                            return match.id;
                                        } else {
                                            expect(true).to.be.false;
                                        }
                                    })
                                    .then((threadId) => {
                                        let qs = {
                                            page: 1,
                                            size: 100,
                                        };

                                        return api.listMessages(
                                            tenant,
                                            token2,
                                            "inbox",
                                            threadId,
                                            qs
                                        );
                                    })
                                    .then((response) => {
                                        let bool = false;
                                        expect(response.status).eq(200);
                                        let match = response.body.find(
                                            (o) =>
                                                o.subject ===
                                                "Message from sarja1"
                                        );

                                        if (match) {
                                            bool = true;
                                            api.markMessagesAsRead(tenant,'token2',[match.id])
                                            .then((response)=>{
                                                expect(response.status).eq(401)
                                                
                                            })
                                        } else {
                                            expect(true).to.be.false;
                                        }
                                        expect(bool).to.be.true;
                                    });
                            }
                        );
                    });
            });
            
        });

        describe("Bad request", () => {
            

            it.skip("Create Message - API - Bad request", () => {
                // will be implemented later
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let date = new Date();
                        date.setDate(date.getDate() + 3);

                        let payload = {
                            to: [
                                {
                                    displayName: "Sarja One",
                                    email: "sarja3asdsad",
                                },
                            ],
                            cc: [
                                {
                                    displayName: "Sarja Two",
                                    email: "asd",
                                },
                            ],
                            bcc: [
                                {
                                    displayName: "Sarja Three",
                                    email: "sasd",
                                },
                            ],
                            subject: "Message from sarja1",
                            secureMessage: "<p> This secure </p>",
                            notificationMessage:
                                "<p> This is notification </p>",
                            dateExpires: date,
                            requireSignIn: true,
                        };

                        api.createMessage(tenant, token, payload).then(
                            (response) => {
                                console.log(response);
                                expect(response.status).eq(400);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.headers["x-api-error"]).eq(
                                    "email.invalid"
                                );
                                //expect(response.body.subject).eq(payload.subject)
                            }
                        );
                    });
            });

            it.skip("Get Draft Message - API - Bad request", () => {
                //response code is not correct
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let date = new Date();
                        date.setDate(date.getDate() + 3);

                        let payload = {
                            to: [
                                {
                                    displayName: "Sarja One",
                                    email: "sarja3@nilavodev.com",
                                },
                            ],
                            cc: [
                                {
                                    displayName: "Sarja Four",
                                    email: "sarja4@nilavodev.com",
                                },
                            ],
                            bcc: [
                                {
                                    displayName: "Sarja Five",
                                    email: "sarja5@nilavodev.com",
                                },
                            ],
                            subject: "Message from sarja1",
                            secureMessage: "<p> This secure </p>",
                            notificationMessage:
                                "<p> This is notification </p>",
                            dateExpires: date,
                            requireSignIn: true,
                        };

                        api.createMessage(tenant, token, payload).then(
                            (response) => {
                                console.log(response);
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.subject).eq(
                                    payload.subject
                                );

                                api.getDraftMessage(
                                    tenant,
                                    token,
                                    "response.body.id"
                                ).then((r) => {
                                    expect(r.status).eq(400);
                                });
                            }
                        );
                    });
            });

            it("Update Draft Message - API - Bad request", () => {
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let date = new Date();
                        date.setDate(date.getDate() + 3);

                        let payload = {
                            to: [
                                {
                                    displayName: "Sarja One",
                                    email: "sarja3@nilavodev.com",
                                },
                            ],
                            cc: [
                                {
                                    displayName: "Sarja Four",
                                    email: "sarja4@nilavodev.com",
                                },
                            ],
                            bcc: [
                                {
                                    displayName: "Sarja Five",
                                    email: "sarja5@nilavodev.com",
                                },
                            ],
                            subject: "Message from sarja1",
                            secureMessage: "<p> This secure </p>",
                            notificationMessage:
                                "<p> This is notification </p>",
                            dateExpires: date,
                            requireSignIn: true,
                        };

                        api.createMessage(tenant, token, payload).then(
                            (response) => {
                                console.log(response);
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.subject).eq(
                                    payload.subject
                                );

                                let payloadDraft = {
                                    subject: "Update from draft1",
                                };

                                api.updateDraftMessage(
                                    tenant,
                                    token,
                                    payloadDraft,
                                    "response.body.id"
                                ).then((r) => {
                                    expect(r.status).eq(400);
                                    expect(r.headers["x-api-error"]).eq(
                                        "entity.notFound"
                                    );
                                });
                            }
                        );
                    });
            });

            it("Send Message - API - Bad request", () => {
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let date = new Date();
                        date.setDate(date.getDate() + 3);

                        let payload = {
                            to: [
                                {
                                    displayName: "Sarja One",
                                    email: "sarja3@nilavodev.com",
                                },
                            ],
                            cc: [
                                {
                                    displayName: "Sarja Four",
                                    email: "sarja4@nilavodev.com",
                                },
                            ],
                            bcc: [
                                {
                                    displayName: "Sarja Five",
                                    email: "sarja5@nilavodev.com",
                                },
                            ],
                            subject: "Message from sarja1",
                            secureMessage: "<p> This secure </p>",
                            notificationMessage:
                                "<p> This is notification </p>",
                            dateExpires: date,
                            requireSignIn: true,
                        };

                        api.createMessage(tenant, token, payload).then(
                            (response) => {
                                console.log(response);
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.subject).eq(
                                    payload.subject
                                );

                                let payloadSendMessage = {
                                    id: response.body.id,
                                    to: [{}],
                                    cc: [{}],
                                    bcc: [{}],
                                    subject: "Message from sarja1",
                                    secureMessage: "<p> This secure </p>",
                                    notificationMessage:
                                        "<p> This is notification </p>",
                                    dateExpires: date,
                                    requireSignIn: true,
                                };

                                api.sendMessage(
                                    tenant,
                                    token,
                                    payloadSendMessage
                                ).then((r) => {
                                    expect(r.status).eq(400);
                                    expect(r.headers["x-api-error"]).eq(
                                        "message.recipient.invalid"
                                    );
                                });
                            }
                        );
                    });
            });

            it.skip("List Message Threads - API - Bad request", () => {
                //will be implemented later
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let date = new Date();
                        date.setDate(date.getDate() + 3);

                        let payload = {
                            to: [
                                {
                                    displayName: "Sarja One",
                                    email: "sarja3@nilavodev.com",
                                },
                            ],
                            cc: [
                                {
                                    displayName: "Sarja Four",
                                    email: "sarja4@nilavodev.com",
                                },
                            ],
                            bcc: [
                                {
                                    displayName: "Sarja Five",
                                    email: "sarja5@nilavodev.com",
                                },
                            ],
                            subject: "Message from sarja1",
                            secureMessage: "<p> This secure </p>",
                            notificationMessage:
                                "<p> This is notification </p>",
                            dateExpires: date,
                            requireSignIn: true,
                        };

                        api.createMessage(tenant, token, payload)
                            .then((response) => {
                                console.log(response);
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.subject).eq(
                                    payload.subject
                                );

                                let payloadSendMessage = {
                                    id: response.body.id,
                                    to: [
                                        {
                                            displayName: "Sarja One",
                                            email: "sarja3@nilavodev.com",
                                        },
                                    ],
                                    cc: [
                                        {
                                            displayName: "Sarja Two",
                                            email: "sarja4@nilavodev.com",
                                        },
                                    ],
                                    bcc: [
                                        {
                                            displayName: "Sarja Three",
                                            email: "sarja5@nilavodev.com",
                                        },
                                    ],
                                    subject: "Message from sarja1",
                                    secureMessage: "<p> This secure </p>",
                                    notificationMessage:
                                        "<p> This is notification </p>",
                                    dateExpires: date,
                                    requireSignIn: true,
                                };

                                api.sendMessage(
                                    tenant,
                                    token,
                                    payloadSendMessage
                                ).then((r) => {
                                    expect(r.status).eq(200);
                                    expect(r.body.id).eq(payloadSendMessage.id);
                                    expect(r.body.subject).eq(
                                        payloadSendMessage.subject
                                    );

                                    return r.body;
                                });
                            })
                            .then((res) => {
                                let bool = false;

                                let payload = {
                                    read: false,
                                    page: 1,
                                    size: 100,
                                };
                                cy.wait(200)
                                        api.listMessageThreads(
                                    tenant,
                                    token,
                                    "sent",
                                    payload
                                ).then((r) => {
                                    expect(r.status).eq(400);
                                });
                            });
                    });
            });

            it.skip("Delete Message Threads - API - Bad request", () => {
                //Response code is incorrect
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let date = new Date();
                        date.setDate(date.getDate() + 3);

                        let payload = {
                            to: [
                                {
                                    displayName: "Sarja One",
                                    email: "sarja3@nilavodev.com",
                                },
                            ],
                            cc: [
                                {
                                    displayName: "Sarja Four",
                                    email: "sarja4@nilavodev.com",
                                },
                            ],
                            bcc: [
                                {
                                    displayName: "Sarja Five",
                                    email: "sarja5@nilavodev.com",
                                },
                            ],
                            subject: "Message from sarja1",
                            secureMessage: "<p> This secure </p>",
                            notificationMessage:
                                "<p> This is notification </p>",
                            dateExpires: date,
                            requireSignIn: true,
                        };

                        api.createMessage(tenant, token, payload)
                            .then((response) => {
                                console.log(response);
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.subject).eq(
                                    payload.subject
                                );

                                let payloadSendMessage = {
                                    id: response.body.id,
                                    to: [
                                        {
                                            displayName: "Sarja One",
                                            email: "sarja3@nilavodev.com",
                                        },
                                    ],
                                    cc: [
                                        {
                                            displayName: "Sarja Two",
                                            email: "sarja4@nilavodev.com",
                                        },
                                    ],
                                    bcc: [
                                        {
                                            displayName: "Sarja Three",
                                            email: "sarja5@nilavodev.com",
                                        },
                                    ],
                                    subject: "Delete message thread",
                                    secureMessage: "<p> This secure </p>",
                                    notificationMessage:
                                        "<p> This is notification </p>",
                                    dateExpires: date,
                                    requireSignIn: true,
                                };

                                api.sendMessage(
                                    tenant,
                                    token,
                                    payloadSendMessage
                                ).then((r) => {
                                    expect(r.status).eq(200);
                                    expect(r.body.id).eq(payloadSendMessage.id);
                                    expect(r.body.subject).eq(
                                        payloadSendMessage.subject
                                    );

                                    return r.body;
                                });
                            })
                            .then((res) => {
                                let payload = {
                                    read: false,
                                    page: 1,
                                    size: 100,
                                };
                                cy.wait(200)
                                        api.listMessageThreads(
                                    tenant,
                                    token,
                                    "sent",
                                    payload
                                ).then((r) => {
                                    expect(r.status).eq(200);
                                    expect(r.body).to.be.a("Array");

                                    let match = r.body.find(
                                        (o) =>
                                            o.subject ===
                                            "Delete message thread"
                                    );
                                    if (match) {
                                        let payload = ["match.id"];
                                        api.deleteMessageThreads(
                                            tenant,
                                            token,
                                            "sent",
                                            payload
                                        ).then((response) => {
                                            expect(response.status).eq(400);
                                        });
                                    } else {
                                        expect(true).to.be.false;
                                    }
                                });
                            });
                    });
            });

            it("Reply Messages  - API - Bad request", () => {
                let token2 = null;
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let date = new Date();
                        date.setDate(date.getDate() + 3);

                        let payload = {
                            to: [
                                {
                                    displayName: "Sarja One",
                                    email: "sarja3@nilavodev.com",
                                },
                            ],
                            cc: [
                                {
                                    displayName: "Sarja Four",
                                    email: "sarja4@nilavodev.com",
                                },
                            ],
                            bcc: [
                                {
                                    displayName: "Sarja Five",
                                    email: "sarja5@nilavodev.com",
                                },
                            ],
                            subject: "Message from sarja1",
                            secureMessage: "<p> This secure </p>",
                            notificationMessage:
                                "<p> This is notification </p>",
                            dateExpires: date,
                            requireSignIn: true,
                        };

                        api.createMessage(tenant, token, payload).then(
                            (response) => {
                                console.log(response);
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.subject).eq(
                                    payload.subject
                                );

                                let payloadSendMessage = {
                                    id: response.body.id,
                                    to: [
                                        {
                                            displayName: "Sarja Three",
                                            email: "sarja3@nilavodev.com",
                                        },
                                    ],
                                    subject: "Reply from sarja1",
                                    secureMessage: "<p> This secure </p>",
                                    notificationMessage:
                                        "<p> This is notification </p>",
                                    dateExpires: date,
                                    requireSignIn: true,
                                };

                                api.sendMessage(
                                    tenant,
                                    token,
                                    payloadSendMessage
                                )
                                    .then((r) => {
                                        expect(r.status).eq(200);
                                        expect(r.body.id).eq(
                                            payloadSendMessage.id
                                        );
                                        expect(r.body.subject).eq(
                                            payloadSendMessage.subject
                                        );

                                        return r.body;
                                    })
                                    .then(() => {
                                        api.tokenAuthentication(
                                            tenant,
                                            "sarja3@nilavodev.com",
                                            "Nil@vo2006"
                                        );
                                    })
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        let bearerToken2 =
                                            response.headers.authorization;
                                        console.log(bearerToken2);
                                        token2 = bearerToken2;
                                        return bearerToken2;
                                    })
                                    .then(() => {
                                        debugger;
                                        let qs = {
                                            read: false,
                                            page: 1,
                                            size: 100,
                                        };
                                        cy.wait(200)
                                        api.listMessageThreads(
                                            tenant,
                                            token2,
                                            "inbox",
                                            qs
                                        );
                                    })
                                    .then((r) => {
                                        let bool = false;
                                        let id = null;
                                        expect(r.status).eq(200);
                                        expect(r.body).to.be.a("Array");

                                        let match = r.body.find(
                                            (o) =>
                                                o.subject ===
                                                "Reply from sarja1"
                                        );

                                        if (match) {
                                            bool = true;

                                            return match.id;
                                        } else {
                                            expect(true).to.be.false;
                                        }
                                    })
                                    .then((threadId) => {
                                        let qs = {
                                            page: 1,
                                            size: 100,
                                        };

                                        return api.listMessages(
                                            tenant,
                                            token2,
                                            "inbox",
                                            threadId,
                                            qs
                                        );
                                    })
                                    .then((res) => {
                                        expect(res.status).eq(200);
                                        let payload = {
                                            secureMessage:
                                                "<p> Reply This secure </p>",
                                            notificationMessage:
                                                "<p> reply is notification </p>",
                                            dateExpires: date,
                                            requireSignIn: true,
                                        };
                                        console.log("L2 " + res.body[0].id);

                                        api.replyMessage(
                                            tenant,
                                            token2,
                                            "res.body[0].id",
                                            payload
                                        );
                                    })
                                    .then((response) => {
                                        expect(response.status).eq(400);
                                    });
                            }
                        );
                    });
            });

            it("Reply All Messages- API - Bad request", () => {
                let token2 = null;
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let date = new Date();
                        date.setDate(date.getDate() + 3);

                        let payload = {
                            to: [
                                {
                                    displayName: "Sarja One",
                                    email: "sarja3@nilavodev.com",
                                },
                            ],
                            cc: [
                                {
                                    displayName: "Sarja Three",
                                    email: "sarja4@nilavodev.com",
                                },
                            ],
                            bcc: [
                                {
                                    displayName: "Sarja Five",
                                    email: "sarja5@nilavodev.com",
                                },
                            ],
                            subject: "Message from sarja1",
                            secureMessage: "<p> This secure </p>",
                            notificationMessage:
                                "<p> This is notification </p>",
                            dateExpires: date,
                            requireSignIn: true,
                        };

                        api.createMessage(tenant, token, payload).then(
                            (response) => {
                                console.log(response);
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.subject).eq(
                                    payload.subject
                                );

                                let payloadSendMessage = {
                                    id: response.body.id,
                                    to: [
                                        {
                                            displayName: "Sarja Three",
                                            email: "sarja3@nilavodev.com",
                                        },
                                    ],
                                    cc: [
                                        {
                                            displayName: "Sarja Four",
                                            email: "sarja4@nilavodev.com",
                                        },
                                    ],
                                    bcc: [
                                        {
                                            displayName: "Sarja Five",
                                            email: "sarja5@nilavodev.com",
                                        },
                                    ],
                                    subject: "Reply from sarja1",
                                    secureMessage: "<p> This secure </p>",
                                    notificationMessage:
                                        "<p> This is notification </p>",
                                    dateExpires: date,
                                    requireSignIn: true,
                                };

                                api.sendMessage(
                                    tenant,
                                    token,
                                    payloadSendMessage
                                )
                                    .then((r) => {
                                        expect(r.status).eq(200);
                                        expect(r.body.id).eq(
                                            payloadSendMessage.id
                                        );
                                        expect(r.body.subject).eq(
                                            payloadSendMessage.subject
                                        );

                                        return r.body;
                                    })
                                    .then(() => {
                                        api.tokenAuthentication(
                                            tenant,
                                            "sarja3@nilavodev.com",
                                            "Nil@vo2006"
                                        );
                                    })
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        let bearerToken2 =
                                            response.headers.authorization;
                                        console.log(bearerToken2);
                                        token2 = bearerToken2;
                                        return bearerToken2;
                                    })
                                    .then(() => {
                                        debugger;
                                        let qs = {
                                            read: false,
                                            page: 1,
                                            size: 100,
                                        };
                                        cy.wait(200)
                                        api.listMessageThreads(
                                            tenant,
                                            token2,
                                            "inbox",
                                            qs
                                        );
                                    })
                                    .then((r) => {
                                        let bool = false;
                                        let id = null;
                                        expect(r.status).eq(200);
                                        expect(r.body).to.be.a("Array");

                                        let match = r.body.find(
                                            (o) =>
                                                o.subject ===
                                                "Reply from sarja1"
                                        );

                                        if (match) {
                                            bool = true;

                                            return match.id;
                                        } else {
                                            expect(true).to.be.false;
                                        }
                                    })
                                    .then((threadId) => {
                                        let qs = {
                                            page: 1,
                                            size: 100,
                                        };

                                        return api.listMessages(
                                            tenant,
                                            token2,
                                            "inbox",
                                            threadId,
                                            qs
                                        );
                                    })
                                    .then((res) => {
                                        expect(res.status).eq(200);
                                        let payload = {
                                            secureMessage:
                                                "<p> Reply This secure </p>",
                                            notificationMessage:
                                                "<p> reply is notification </p>",
                                            dateExpires: date,
                                            requireSignIn: true,
                                        };
                                        console.log("L2 " + res.body[0].id);

                                        api.replyAllMessage(
                                            tenant,
                                            token2,
                                            "res.body[0].id",
                                            payload
                                        );
                                    })
                                    .then((response) => {
                                        expect(response.status).eq(400);
                                    });
                            }
                        );
                    });
            });

            it("Forward Message and Send - API - Bad request", () => {
                let token2 = null;
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let date = new Date();
                        date.setDate(date.getDate() + 3);

                        let payload = {
                            to: [
                                {
                                    displayName: "Sarja One",
                                    email: "sarja3@nilavodev.com",
                                },
                            ],
                            subject: "Forward message from sarja1",
                            secureMessage: "<p> This secure </p>",
                            notificationMessage:
                                "<p> This is notification </p>",
                            dateExpires: date,
                            requireSignIn: true,
                        };

                        api.createMessage(tenant, token, payload).then(
                            (response) => {
                                console.log(response);
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.subject).eq(
                                    payload.subject
                                );

                                let payloadSendMessage = {
                                    id: response.body.id,
                                    to: [
                                        {
                                            displayName: "Sarja Three",
                                            email: "sarja3@nilavodev.com",
                                        },
                                    ],
                                    subject: "Forward message from sarja1",
                                    secureMessage: "<p> This secure </p>",
                                    notificationMessage:
                                        "<p> This is notification </p>",
                                    dateExpires: date,
                                    requireSignIn: true,
                                };

                                api.sendMessage(
                                    tenant,
                                    token,
                                    payloadSendMessage
                                )
                                    .then((r) => {
                                        expect(r.status).eq(200);
                                        expect(r.body.id).eq(
                                            payloadSendMessage.id
                                        );
                                        expect(r.body.subject).eq(
                                            payloadSendMessage.subject
                                        );

                                        return r.body;
                                    })
                                    .then(() => {
                                        api.tokenAuthentication(
                                            tenant,
                                            "sarja3@nilavodev.com",
                                            "Nil@vo2006"
                                        );
                                    })
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        let bearerToken2 =
                                            response.headers.authorization;
                                        console.log(bearerToken2);
                                        token2 = bearerToken2;
                                        return bearerToken2;
                                    })
                                    .then(() => {
                                        debugger;
                                        let qs = {
                                            read: false,
                                            page: 1,
                                            size: 100,
                                        };
                                        cy.wait(200)
                                        api.listMessageThreads(
                                            tenant,
                                            token2,
                                            "inbox",
                                            qs
                                        );
                                    })
                                    .then((r) => {
                                        let bool = false;
                                        let id = null;
                                        expect(r.status).eq(200);
                                        expect(r.body).to.be.a("Array");

                                        let match = r.body.find(
                                            (o) =>
                                                o.subject ===
                                                "Forward message from sarja1"
                                        );

                                        if (match) {
                                            bool = true;

                                            return match.id;
                                        } else {
                                            expect(true).to.be.false;
                                        }
                                    })
                                    .then((threadId) => {
                                        let qs = {
                                            page: 1,
                                            size: 100,
                                        };

                                        return api.listMessages(
                                            tenant,
                                            token2,
                                            "inbox",
                                            threadId,
                                            qs
                                        );
                                    })
                                    .then((res) => {
                                        expect(res.status).eq(200);
                                        let payload = {
                                            secureMessage:
                                                "<p> Forward This secure </p>",
                                            notificationMessage:
                                                "<p> Forward is notification </p>",
                                            dateExpires: date,
                                            requireSignIn: true,
                                        };
                                        console.log("L2 " + res.body[0].id);

                                        api.forwardMessage(
                                            tenant,
                                            token2,
                                            "res.body[0].id",
                                            payload
                                        );
                                    })
                                    .then((response) => {
                                        expect(response.status).eq(400);
                                    });
                            }
                        );
                    });
            });

            it.skip("Delete Message Threads Permanently - API - Bad request", () => {
                //response code is incorrect
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let date = new Date();
                        date.setDate(date.getDate() + 3);

                        let payload = {
                            to: [
                                {
                                    displayName: "Sarja One",
                                    email: "sarja3@nilavodev.com",
                                },
                            ],
                            cc: [
                                {
                                    displayName: "Sarja Four",
                                    email: "sarja4@nilavodev.com",
                                },
                            ],
                            bcc: [
                                {
                                    displayName: "Sarja Five",
                                    email: "sarja5@nilavodev.com",
                                },
                            ],
                            subject: "Message from sarja1",
                            secureMessage: "<p> This secure </p>",
                            notificationMessage:
                                "<p> This is notification </p>",
                            dateExpires: date,
                            requireSignIn: true,
                        };

                        api.createMessage(tenant, token, payload)
                            .then((response) => {
                                console.log(response);
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.subject).eq(
                                    payload.subject
                                );

                                let payloadSendMessage = {
                                    id: response.body.id,
                                    to: [
                                        {
                                            displayName: "Sarja One",
                                            email: "sarja3@nilavodev.com",
                                        },
                                    ],
                                    cc: [
                                        {
                                            displayName: "Sarja Two",
                                            email: "sarja4@nilavodev.com",
                                        },
                                    ],
                                    bcc: [
                                        {
                                            displayName: "Sarja Three",
                                            email: "sarja5@nilavodev.com",
                                        },
                                    ],
                                    subject: "Delete2 message thread",
                                    secureMessage: "<p> This secure </p>",
                                    notificationMessage:
                                        "<p> This is notification </p>",
                                    dateExpires: date,
                                    requireSignIn: true,
                                };

                                api.sendMessage(
                                    tenant,
                                    token,
                                    payloadSendMessage
                                ).then((r) => {
                                    expect(r.status).eq(200);
                                    expect(r.body.id).eq(payloadSendMessage.id);
                                    expect(r.body.subject).eq(
                                        payloadSendMessage.subject
                                    );

                                    return r.body;
                                });
                            })
                            .then((res) => {
                                let payload = {
                                    read: false,
                                    page: 1,
                                    size: 100,
                                };
                                cy.wait(200)
                                        api.listMessageThreads(
                                    tenant,
                                    token,
                                    "sent",
                                    payload
                                ).then((r) => {
                                    expect(r.status).eq(200);
                                    expect(r.body).to.be.a("Array");

                                    let match = r.body.find(
                                        (o) =>
                                            o.subject ===
                                            "Delete2 message thread"
                                    );
                                    if (match) {
                                        let payload = [match.id];
                                        api.deleteMessageThreads(
                                            tenant,
                                            token,
                                            "sent",
                                            payload
                                        )
                                            .then((response) => {
                                                expect(response.status).eq(200);
                                                expect(
                                                    response.body
                                                        .operationSucceeded
                                                ).to.contain(match.id);
                                            })
                                            .then(() => {
                                                let payload = ["match.id"];
                                                api.deleteMessageThreadsPermanently(
                                                    tenant,
                                                    token,
                                                    payload
                                                ).then((response) => {
                                                    expect(response.status).eq(
                                                        400
                                                    );
                                                });
                                            });
                                    } else {
                                        expect(true).to.be.false;
                                    }
                                });
                            });
                    });
            });

            it.skip("Restore Message Threads - API - Bad request", () => {

                //response code is not correct
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let date = new Date();
                        date.setDate(date.getDate() + 3);

                        let payload = {
                            to: [
                                {
                                    displayName: "Sarja One",
                                    email: "sarja3@nilavodev.com",
                                },
                            ],
                            cc: [
                                {
                                    displayName: "Sarja Four",
                                    email: "sarja4@nilavodev.com",
                                },
                            ],
                            bcc: [
                                {
                                    displayName: "Sarja Five",
                                    email: "sarja5@nilavodev.com",
                                },
                            ],
                            subject: "Message from sarja1",
                            secureMessage: "<p> This secure </p>",
                            notificationMessage:
                                "<p> This is notification </p>",
                            dateExpires: date,
                            requireSignIn: true,
                        };

                        api.createMessage(tenant, token, payload)
                            .then((response) => {
                                console.log(response);
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.subject).eq(
                                    payload.subject
                                );

                                let payloadSendMessage = {
                                    id: response.body.id,
                                    to: [
                                        {
                                            displayName: "Sarja One",
                                            email: "sarja3@nilavodev.com",
                                        },
                                    ],
                                    cc: [
                                        {
                                            displayName: "Sarja Two",
                                            email: "sarja4@nilavodev.com",
                                        },
                                    ],
                                    bcc: [
                                        {
                                            displayName: "Sarja Three",
                                            email: "sarja5@nilavodev.com",
                                        },
                                    ],
                                    subject: "Delete2 message thread",
                                    secureMessage: "<p> This secure </p>",
                                    notificationMessage:
                                        "<p> This is notification </p>",
                                    dateExpires: date,
                                    requireSignIn: true,
                                };

                                api.sendMessage(
                                    tenant,
                                    token,
                                    payloadSendMessage
                                ).then((r) => {
                                    expect(r.status).eq(200);
                                    expect(r.body.id).eq(payloadSendMessage.id);
                                    expect(r.body.subject).eq(
                                        payloadSendMessage.subject
                                    );

                                    return r.body;
                                });
                            })
                            .then((res) => {
                                let payload = {
                                    read: false,
                                    page: 1,
                                    size: 100,
                                };
                                cy.wait(200)
                                        api.listMessageThreads(
                                    tenant,
                                    token,
                                    "sent",
                                    payload
                                ).then((r) => {
                                    expect(r.status).eq(200);
                                    expect(r.body).to.be.a("Array");

                                    let match = r.body.find(
                                        (o) =>
                                            o.subject ===
                                            "Delete2 message thread"
                                    );
                                    if (match) {
                                        let payload = [match.id];
                                        api.deleteMessageThreads(
                                            tenant,
                                            token,
                                            "sent",
                                            payload
                                        )
                                            .then((response) => {
                                                expect(response.status).eq(200);
                                                expect(
                                                    response.body
                                                        .operationSucceeded
                                                ).to.contain(match.id);
                                            })
                                            .then(() => {
                                                let payload = ['match.id'];
                                                api.restoreMessageThread(
                                                    tenant,
                                                    token,
                                                    payload
                                                ).then((response) => {
                                                    expect(response.status).eq(400);
                                                    
                                                });
                                            });
                                    } else {
                                        expect(true).to.be.false;
                                    }
                                });
                            });
                    });
            });

            it.skip("Delete Messages - API - Bad request", () => {
                //Response code is not correct
                let token2 = null;
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let date = new Date();
                        date.setDate(date.getDate() + 3);

                        let payload = {
                            to: [
                                {
                                    displayName: "Sarja One",
                                    email: "sarja3@nilavodev.com",
                                },
                            ],
                            cc: [
                                {
                                    displayName: "Sarja Four",
                                    email: "sarja4@nilavodev.com",
                                },
                            ],
                            bcc: [
                                {
                                    displayName: "Sarja Five",
                                    email: "sarja5@nilavodev.com",
                                },
                            ],
                            subject: "Message from sarja1",
                            secureMessage: "<p> This secure </p>",
                            notificationMessage:
                                "<p> This is notification </p>",
                            dateExpires: date,
                            requireSignIn: true,
                        };

                        api.createMessage(tenant, token, payload).then(
                            (response) => {
                                console.log(response);
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.subject).eq(
                                    payload.subject
                                );

                                let payloadSendMessage = {
                                    id: response.body.id,
                                    to: [
                                        {
                                            displayName: "Sarja One",
                                            email: "sarja3@nilavodev.com",
                                        },
                                    ],
                                    cc: [
                                        {
                                            displayName: "Sarja Two",
                                            email: "sarja4@nilavodev.com",
                                        },
                                    ],
                                    bcc: [
                                        {
                                            displayName: "Sarja Three",
                                            email: "sarja5@nilavodev.com",
                                        },
                                    ],
                                    subject: "Message from sarja1",
                                    secureMessage: "<p> This secure </p>",
                                    notificationMessage:
                                        "<p> This is notification </p>",
                                    dateExpires: date,
                                    requireSignIn: true,
                                };

                                api.sendMessage(
                                    tenant,
                                    token,
                                    payloadSendMessage
                                )
                                    .then((r) => {
                                        expect(r.status).eq(200);
                                        expect(r.body.id).eq(
                                            payloadSendMessage.id
                                        );
                                        expect(r.body.subject).eq(
                                            payloadSendMessage.subject
                                        );

                                        return r.body;
                                    })
                                    .then(() => {
                                        api.tokenAuthentication(
                                            tenant,
                                            "sarja3@nilavodev.com",
                                            testData.password
                                        );
                                    })
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        let bearerToken2 =
                                            response.headers.authorization;
                                        console.log(bearerToken2);
                                        token2 = bearerToken2;
                                        return bearerToken2;
                                    })
                                    .then(() => {
                                        let qs = {
                                            read: false,
                                            page: 1,
                                            size: 100,
                                        };
                                        cy.wait(200)
                                        api.listMessageThreads(
                                            tenant,
                                            token2,
                                            "inbox",
                                            qs
                                        );
                                    })
                                    .then((r) => {
                                        let bool = false;
                                        let id = null;
                                        expect(r.status).eq(200);
                                        expect(r.body).to.be.a("Array");

                                        let match = r.body.find(
                                            (o) =>
                                                o.subject ===
                                                "Message from sarja1"
                                        );

                                        if (match) {
                                            bool = true;

                                            return match.id;
                                        } else {
                                            expect(true).to.be.false;
                                        }
                                    })
                                    .then((threadId) => {
                                        let qs = {
                                            page: 1,
                                            size: 100,
                                        };

                                        return api.listMessages(
                                            tenant,
                                            token2,
                                            "inbox",
                                            threadId,
                                            qs
                                        );
                                    })
                                    .then((response) => {
                                        let bool = false;
                                        expect(response.status).eq(200);
                                        let match = response.body.find(
                                            (o) =>
                                                o.subject ===
                                                "Message from sarja1"
                                        );

                                        if (match) {
                                            bool = true;
                                            payload=['match.id']
                                            api.deleteMessages(tenant,token2,'inbox',payload)
                                            .then((response)=>{
                                                expect(response.status).eq(400)
                                            
                                            })
                                        } else {
                                            expect(true).to.be.false;
                                        }
                                        expect(bool).to.be.true;
                                    });
                            }
                        );
                    });
            });

            it.skip("Delete Messages Permanentlty - API - Bad request", () => {
                //Response code is incorrect
                let token2 = null;
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let date = new Date();
                        date.setDate(date.getDate() + 3);

                        let payload = {
                            to: [
                                {
                                    displayName: "Sarja One",
                                    email: "sarja3@nilavodev.com",
                                },
                            ],
                            cc: [
                                {
                                    displayName: "Sarja Four",
                                    email: "sarja4@nilavodev.com",
                                },
                            ],
                            bcc: [
                                {
                                    displayName: "Sarja Five",
                                    email: "sarja5@nilavodev.com",
                                },
                            ],
                            subject: "Message from sarja1",
                            secureMessage: "<p> This secure </p>",
                            notificationMessage:
                                "<p> This is notification </p>",
                            dateExpires: date,
                            requireSignIn: true,
                        };

                        api.createMessage(tenant, token, payload).then(
                            (response) => {
                                console.log(response);
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.subject).eq(
                                    payload.subject
                                );

                                let payloadSendMessage = {
                                    id: response.body.id,
                                    to: [
                                        {
                                            displayName: "Sarja One",
                                            email: "sarja3@nilavodev.com",
                                        },
                                    ],
                                    cc: [
                                        {
                                            displayName: "Sarja Two",
                                            email: "sarja4@nilavodev.com",
                                        },
                                    ],
                                    bcc: [
                                        {
                                            displayName: "Sarja Three",
                                            email: "sarja5@nilavodev.com",
                                        },
                                    ],
                                    subject: "Message from sarja1",
                                    secureMessage: "<p> This secure </p>",
                                    notificationMessage:
                                        "<p> This is notification </p>",
                                    dateExpires: date,
                                    requireSignIn: true,
                                };

                                api.sendMessage(
                                    tenant,
                                    token,
                                    payloadSendMessage
                                )
                                    .then((r) => {
                                        expect(r.status).eq(200);
                                        expect(r.body.id).eq(
                                            payloadSendMessage.id
                                        );
                                        expect(r.body.subject).eq(
                                            payloadSendMessage.subject
                                        );

                                        return r.body;
                                    })
                                    .then(() => {
                                        api.tokenAuthentication(
                                            tenant,
                                            "sarja3@nilavodev.com",
                                            testData.password
                                        );
                                    })
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        let bearerToken2 =
                                            response.headers.authorization;
                                        console.log(bearerToken2);
                                        token2 = bearerToken2;
                                        return bearerToken2;
                                    })
                                    .then(() => {
                                        let qs = {
                                            read: false,
                                            page: 1,
                                            size: 100,
                                        };
                                        cy.wait(200)
                                        api.listMessageThreads(
                                            tenant,
                                            token2,
                                            "inbox",
                                            qs
                                        );
                                    })
                                    .then((r) => {
                                        let bool = false;
                                        let id = null;
                                        expect(r.status).eq(200);
                                        expect(r.body).to.be.a("Array");

                                        let match = r.body.find(
                                            (o) =>
                                                o.subject ===
                                                "Message from sarja1"
                                        );

                                        if (match) {
                                            bool = true;

                                            return match.id;
                                        } else {
                                            expect(true).to.be.false;
                                        }
                                    })
                                    .then((threadId) => {
                                        let qs = {
                                            page: 1,
                                            size: 100,
                                        };

                                        return api.listMessages(
                                            tenant,
                                            token2,
                                            "inbox",
                                            threadId,
                                            qs
                                        );
                                    })
                                    .then((response) => {
                                        let bool = false;
                                        expect(response.status).eq(200);
                                        let match = response.body.find(
                                            (o) =>
                                                o.subject ===
                                                "Message from sarja1"
                                        );

                                        if (match) {
                                            bool = true;
                                            payload=[match.id]
                                            api.deleteMessages(tenant,token2,'inbox',payload)
                                            .then((response)=>{
                                                expect(response.status).eq(200)
                                                expect(response.body.operationSucceeded).to.contain(match.id);

                                            })
                                            .then(()=>{
                                                 let payload = ['match.id'];
                                                api.deleteMessagesPermanently(tenant,token2,payload)
                                                .then((response)=>{
                                                    expect(response.status).eq(400)
                                                    

                                                })
                                            })
                                        } else {
                                            expect(true).to.be.false;
                                        }
                                        expect(bool).to.be.true;
                                    });
                            }
                        );
                    });
            });

            it.skip("Restore Messages - API - Bad request", () => {

                //Response code is not correct
                let token2 = null;
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let date = new Date();
                        date.setDate(date.getDate() + 3);

                        let payload = {
                            to: [
                                {
                                    displayName: "Sarja One",
                                    email: "sarja3@nilavodev.com",
                                },
                            ],
                            cc: [
                                {
                                    displayName: "Sarja Four",
                                    email: "sarja4@nilavodev.com",
                                },
                            ],
                            bcc: [
                                {
                                    displayName: "Sarja Five",
                                    email: "sarja5@nilavodev.com",
                                },
                            ],
                            subject: "Message from sarja1",
                            secureMessage: "<p> This secure </p>",
                            notificationMessage:
                                "<p> This is notification </p>",
                            dateExpires: date,
                            requireSignIn: true,
                        };

                        api.createMessage(tenant, token, payload).then(
                            (response) => {
                                console.log(response);
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.subject).eq(
                                    payload.subject
                                );

                                let payloadSendMessage = {
                                    id: response.body.id,
                                    to: [
                                        {
                                            displayName: "Sarja One",
                                            email: "sarja3@nilavodev.com",
                                        },
                                    ],
                                    cc: [
                                        {
                                            displayName: "Sarja Two",
                                            email: "sarja4@nilavodev.com",
                                        },
                                    ],
                                    bcc: [
                                        {
                                            displayName: "Sarja Three",
                                            email: "sarja5@nilavodev.com",
                                        },
                                    ],
                                    subject: "Message from sarja1",
                                    secureMessage: "<p> This secure </p>",
                                    notificationMessage:
                                        "<p> This is notification </p>",
                                    dateExpires: date,
                                    requireSignIn: true,
                                };

                                api.sendMessage(
                                    tenant,
                                    token,
                                    payloadSendMessage
                                )
                                    .then((r) => {
                                        expect(r.status).eq(200);
                                        expect(r.body.id).eq(
                                            payloadSendMessage.id
                                        );
                                        expect(r.body.subject).eq(
                                            payloadSendMessage.subject
                                        );

                                        return r.body;
                                    })
                                    .then(() => {
                                        api.tokenAuthentication(
                                            tenant,
                                            "sarja3@nilavodev.com",
                                            testData.password
                                        );
                                    })
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        let bearerToken2 =
                                            response.headers.authorization;
                                        console.log(bearerToken2);
                                        token2 = bearerToken2;
                                        return bearerToken2;
                                    })
                                    .then(() => {
                                        let qs = {
                                            read: false,
                                            page: 1,
                                            size: 100,
                                        };
                                        cy.wait(200)
                                        api.listMessageThreads(
                                            tenant,
                                            token2,
                                            "inbox",
                                            qs
                                        );
                                    })
                                    .then((r) => {
                                        let bool = false;
                                        let id = null;
                                        expect(r.status).eq(200);
                                        expect(r.body).to.be.a("Array");

                                        let match = r.body.find(
                                            (o) =>
                                                o.subject ===
                                                "Message from sarja1"
                                        );

                                        if (match) {
                                            bool = true;

                                            return match.id;
                                        } else {
                                            expect(true).to.be.false;
                                        }
                                    })
                                    .then((threadId) => {
                                        let qs = {
                                            page: 1,
                                            size: 100,
                                        };

                                        return api.listMessages(
                                            tenant,
                                            token2,
                                            "inbox",
                                            threadId,
                                            qs
                                        );
                                    })
                                    .then((response) => {
                                        let bool = false;
                                        expect(response.status).eq(200);
                                        let match = response.body.find(
                                            (o) =>
                                                o.subject ===
                                                "Message from sarja1"
                                        );

                                        if (match) {
                                            bool = true;
                                            payload=[match.id]
                                            api.deleteMessages(tenant,token2,'inbox',payload)
                                            .then((response)=>{
                                                expect(response.status).eq(200)
                                                expect(response.body.operationSucceeded).to.contain(match.id);

                                            }).then(() => {
                                                let payload = ['match.id'];
                                                api.restoreMessage(
                                                    tenant,
                                                    token2,
                                                    payload
                                                ).then((response) => {
                                                    expect(response.status).eq(
                                                        400
                                                    );
                                                    
                                                });
                                            });
                                        } else {
                                            expect(true).to.be.false;
                                        }
                                        expect(bool).to.be.true;
                                    });
                            }
                        );
                    });
            });

            it("List Message Activities - API - Bad request", () => {
                let token2 = null;
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let date = new Date();
                        date.setDate(date.getDate() + 3);

                        let payload = {
                            to: [
                                {
                                    displayName: "Sarja One",
                                    email: "sarja3@nilavodev.com",
                                },
                            ],
                            cc: [
                                {
                                    displayName: "Sarja Four",
                                    email: "sarja4@nilavodev.com",
                                },
                            ],
                            bcc: [
                                {
                                    displayName: "Sarja Five",
                                    email: "sarja5@nilavodev.com",
                                },
                            ],
                            subject: "Message from sarja1",
                            secureMessage: "<p> This secure </p>",
                            notificationMessage:
                                "<p> This is notification </p>",
                            dateExpires: date,
                            requireSignIn: true,
                        };

                        api.createMessage(tenant, token, payload).then(
                            (response) => {
                                console.log(response);
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.subject).eq(
                                    payload.subject
                                );

                                let payloadSendMessage = {
                                    id: response.body.id,
                                    to: [
                                        {
                                            displayName: "Sarja One",
                                            email: "sarja3@nilavodev.com",
                                        },
                                    ],
                                    cc: [
                                        {
                                            displayName: "Sarja Two",
                                            email: "sarja4@nilavodev.com",
                                        },
                                    ],
                                    bcc: [
                                        {
                                            displayName: "Sarja Three",
                                            email: "sarja5@nilavodev.com",
                                        },
                                    ],
                                    subject: "Message from sarja1",
                                    secureMessage: "<p> This secure </p>",
                                    notificationMessage:
                                        "<p> This is notification </p>",
                                    dateExpires: date,
                                    requireSignIn: true,
                                };

                                api.sendMessage(
                                    tenant,
                                    token,
                                    payloadSendMessage
                                )
                                    .then((r) => {
                                        expect(r.status).eq(200);
                                        expect(r.body.id).eq(
                                            payloadSendMessage.id
                                        );
                                        expect(r.body.subject).eq(
                                            payloadSendMessage.subject
                                        );

                                        return r.body;
                                    })
                                    .then(() => {
                                        let qs = {
                                            read: false,
                                            page: 1,
                                            size: 100,
                                        };
                                        cy.wait(200)
                                        api.listMessageThreads(
                                            tenant,
                                            token,
                                            "sent",
                                            qs
                                        );
                                    })
                                    .then((r) => {
                                        let bool = false;
                                        let id = null;
                                        expect(r.status).eq(200);
                                        expect(r.body).to.be.a("Array");

                                        let match = r.body.find(
                                            (o) =>
                                                o.subject ===
                                                "Message from sarja1"
                                        );

                                        if (match) {
                                            bool = true;

                                            return match.id;
                                        } else {
                                            expect(true).to.be.false;
                                        }
                                    })
                                    .then((threadId) => {
                                        let qs = {
                                            page: 1,
                                            size: 100,
                                        };

                                        return api.listMessages(
                                            tenant,
                                            token,
                                            "sent",
                                            threadId,
                                            qs
                                        );
                                    })
                                    .then((response) => {
                                        let bool = false;
                                        expect(response.status).eq(200);
                                        let match = response.body.find(
                                            (o) =>
                                                o.subject ===
                                                "Message from sarja1"
                                        );

                                        if (match) {
                                            bool = true;
                                            api.listMessageActivities(tenant,token,'match.id')
                                            .then((response)=>{
                                                expect(response.status).eq(400) 
                                            })
                                        } else {
                                            expect(true).to.be.false;
                                        }
                                        expect(bool).to.be.true;
                                    });
                            }
                        );
                    });
            });

            it.skip("Mark Messages as Read - API - Bad request", () => {
                //Response code incorrect
                let token2 = null;
                api.tokenAuthentication(
                    tenant,
                    testData.tenantManager,
                    testData.password
                )
                    .then((response) => {
                        expect(response.status).eq(200);
                        let bearerToken = response.headers.authorization;
                        console.log(bearerToken);
                        return bearerToken;
                    })
                    .then((token) => {
                        let date = new Date();
                        date.setDate(date.getDate() + 3);

                        let payload = {
                            to: [
                                {
                                    displayName: "Sarja One",
                                    email: "sarja3@nilavodev.com",
                                },
                            ],
                            cc: [
                                {
                                    displayName: "Sarja Four",
                                    email: "sarja4@nilavodev.com",
                                },
                            ],
                            bcc: [
                                {
                                    displayName: "Sarja Five",
                                    email: "sarja5@nilavodev.com",
                                },
                            ],
                            subject: "Message from sarja1",
                            secureMessage: "<p> This secure </p>",
                            notificationMessage:
                                "<p> This is notification </p>",
                            dateExpires: date,
                            requireSignIn: true,
                        };

                        api.createMessage(tenant, token, payload).then(
                            (response) => {
                                console.log(response);
                                expect(response.status).eq(200);
                                expect(response.headers["content-type"]).eq(
                                    "application/json"
                                );
                                expect(response.body.subject).eq(
                                    payload.subject
                                );

                                let payloadSendMessage = {
                                    id: response.body.id,
                                    to: [
                                        {
                                            displayName: "Sarja One",
                                            email: "sarja3@nilavodev.com",
                                        },
                                    ],
                                    cc: [
                                        {
                                            displayName: "Sarja Two",
                                            email: "sarja4@nilavodev.com",
                                        },
                                    ],
                                    bcc: [
                                        {
                                            displayName: "Sarja Three",
                                            email: "sarja5@nilavodev.com",
                                        },
                                    ],
                                    subject: "Message from sarja1",
                                    secureMessage: "<p> This secure </p>",
                                    notificationMessage:
                                        "<p> This is notification </p>",
                                    dateExpires: date,
                                    requireSignIn: true,
                                };

                                api.sendMessage(
                                    tenant,
                                    token,
                                    payloadSendMessage
                                )
                                    .then((r) => {
                                        expect(r.status).eq(200);
                                        expect(r.body.id).eq(
                                            payloadSendMessage.id
                                        );
                                        expect(r.body.subject).eq(
                                            payloadSendMessage.subject
                                        );

                                        return r.body;
                                    })
                                    .then(() => {
                                        api.tokenAuthentication(
                                            tenant,
                                            "sarja3@nilavodev.com",
                                            testData.password
                                        );
                                    })
                                    .then((response) => {
                                        expect(response.status).eq(200);
                                        let bearerToken2 =
                                            response.headers.authorization;
                                        console.log(bearerToken2);
                                        token2 = bearerToken2;
                                        return bearerToken2;
                                    })
                                    .then(() => {
                                        let qs = {
                                            read: false,
                                            page: 1,
                                            size: 100,
                                        };
                                        cy.wait(200)
                                        api.listMessageThreads(
                                            tenant,
                                            token2,
                                            "inbox",
                                            qs
                                        );
                                    })
                                    .then((r) => {
                                        let bool = false;
                                        let id = null;
                                        expect(r.status).eq(200);
                                        expect(r.body).to.be.a("Array");

                                        let match = r.body.find(
                                            (o) =>
                                                o.subject ===
                                                "Message from sarja1"
                                        );

                                        if (match) {
                                            bool = true;

                                            return match.id;
                                        } else {
                                            expect(true).to.be.false;
                                        }
                                    })
                                    .then((threadId) => {
                                        let qs = {
                                            page: 1,
                                            size: 100,
                                        };

                                        return api.listMessages(
                                            tenant,
                                            token2,
                                            "inbox",
                                            threadId,
                                            qs
                                        );
                                    })
                                    .then((response) => {
                                        let bool = false;
                                        expect(response.status).eq(200);
                                        let match = response.body.find(
                                            (o) =>
                                                o.subject ===
                                                "Message from sarja1"
                                        );

                                        if (match) {
                                            bool = true;
                                            api.markMessagesAsRead(tenant,token2,['match.id'])
                                            .then((response)=>{
                                                expect(response.status).eq(400)
                                                expect(
                                                    response.body
                                                        .operationSucceeded
                                                ).to.contain(match.id);
                                            })
                                        } else {
                                            expect(true).to.be.false;
                                        }
                                        expect(bool).to.be.true;
                                    });
                            }
                        );
                    });
            });
        });
    });
});
