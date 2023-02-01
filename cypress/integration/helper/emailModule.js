/// <reference types="Cypress" />
var ImapClient = require('emailjs-imap-client').default
module.exports = {

    deleteMailByUser: function (json) {
        var client = new ImapClient(json.squirrelmailServer, json.port, {
            auth: {
                user: json.user,
                pass: json.pass
            }
        });
        client.connect().then(() => {

            client.selectMailbox('INBOX').then((inbox) => {
                numberOfEmails = inbox.exists;

                if (numberOfEmails) {
                    console.log("Total mail: " + numberOfEmails)
                    client.deleteMessages('INBOX', '1:*').then(() => {
                        client.close();
                        return true;
                    })
                } else {
                    console.log("Total mail: " + numberOfEmails)
                    client.close();
                    return true
                }
            })
        })


    },

    getEmailBySubject: function (json) {
        var result
        var client = new ImapClient(json.server, json.port, {
            auth: {
                user: json.username,
                pass: json.password
            }
        });
        return client
            .connect().then(() => {
                client.search(
                    'inbox',
                    {
                        header: ['subject', json.subject],
                    }
                ).then((email) => {

                    if (email.length > 0) {
                        // If there are multiple matched emails, let's return the latest one
                        return email[email.length - 1];
                    }
                    throw new Error(`No messages match the subject of "${json.subject}"`);

                }).then((latestMatchedEmail) => {


                    return client.listMessages('inbox', latestMatchedEmail, ['body[]']);
                }).then((listedEmail) => {
                    if (listedEmail.length > 0) {
                        //console.log('Mail body is : ' + listedEmail[0]['body[]'])
                        return listedEmail[0]['body[]'];
                    }

                    throw new Error('Failed to list out email body');
                }).then((emailBody) => {
                    client.close();
                    result = emailBody
                    return result
                })
                    .catch((err) => {
                        console.log('Error: ', err);
                        return '';
                    });

                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(result)
                    }, 10000)

                })
            })


    },


    Squirrelmail: function () {

       // const squirrelmailServer = '',
       // const port = ''

        function poll(asyncFn, timeout = 10000, interval = 5000) {
            const endTime = Number(new Date()) + timeout;
            const checkCondition = (resolve, reject) => {
                const asyncPromise = asyncFn();
                asyncPromise
                    .then((isSuccess) => {
                        const resolveTime = Number(new Date());
                        // If the condition is met, we're done!
                        if (isSuccess) {
                            resolve(isSuccess);
                        }
                        // If the condition isn't met but the timeout hasn't elapsed, go again
                        else if (resolveTime < endTime) {
                            setTimeout(checkCondition, interval, resolve, reject);
                        }
                        // Didn't match and too much time, reject false
                        else {
                            console.error(`Failed to satisfy checkCondition in timeout duration`);
                            reject(false);
                        }
                    })
                    .catch(() => {
                        const resolveTime = Number(new Date());
                        if (resolveTime < endTime) {
                            setTimeout(checkCondition, interval, resolve, reject);
                        }
                        else {
                            console.error(`Failed to satisfy checkCondition in timeout duration`);
                            reject(false);
                        }
                    });
            };
            return new Promise(checkCondition);
        };

        const findMatchingMessage = (json) => {

            process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // So we don't instafail because self-signed cert
            const client = new ImapClient(json.squirrelmailServer, json.port, {
                auth: {
                    user: json.user,
                    pass: json.pass
                }

            });
            //console.log('My json ' + json.user + json.pass+ json.squirrelmailServer+ json.port+' subject '+ json.searchString)
            return client
                .connect()
                .then(() => client.search('inbox', {
                    header: ['subject', json.searchString],
                }))
                .then((matchedEmails) => {
                    console.log('Matched emails: ', matchedEmails);
                    if (matchedEmails && matchedEmails.length > 0) {
                        console.log(`A message has arrived matching "${json.searchString}"`);
                        return matchedEmails[matchedEmails.length - 1];
                    }
                    throw new Error(`No messages matched "${json.searchString}" yet`);
                })
                .then((latestMatchedEmail) => {


                    return client.listMessages('inbox', latestMatchedEmail, ['body[]']);
                })

                .then((listedEmail) => {
                    if (listedEmail.length > 0) {
                        //console.log('Mail body is : ' + listedEmail[0]['body[]'])
                        return listedEmail[0]['body[]'];
                    }

                    throw new Error('Failed to list out email body');})
                    .then((result) => {
                        client.close();
                        return result;
                    })
                .catch((err) => {
                    client.close();
                    console.error(error, err);
                    return false;
                });
        };


        const awaitEmail = (json) => poll(() => findMatchingMessage(json), json.timeoutInMs, json.checkIntervalInMs);
        return {
            awaitEmail,
            // ...Other task functions
        };



    }



};





