exports.users_getCurrent = (client, res) => {
    return client.security.users.getCurrent()
        .then(result => {
            console.log('API call result: ', result);
            if (res) {
                res.render('index', { title: 'Success' });
            }
            return result;
        })
        .catch(error => {
            console.log('API call error: ', error);
            if (res) {
                res.render('index', { title: 'Error' });
            }
        });
};

exports.users_getById = (client, res) => {
    return client.security.users.getById('{24312B9F-0B66-4E6D-AEC0-6348C5B8D867}')
        .then(result => {
            console.log('API call result: ', result);
            if (res) {
                res.render('index', { title: 'Success' });
            }
            return result;
        })
        .catch(error => {
            console.log('API call error: ', error);
            if (res) {
                res.render('index', { title: 'Error' });
            }
        });
};

exports.users_getByUsername = (client, res) => {
    return client.security.users.getByUsername('zengenti')
        .then(result => {
            console.log('API call result: ', result);
            if (res) {
                res.render('index', { title: 'Success' });
            }
            return result;
        })
        .catch(error => {
            console.log('API call error: ', error);
            if (res) {
                res.render('index', { title: 'Error' });
            }
        });
};

exports.users_getByEmail = (client, res) => {
    return client.security.users.getByEmail('test.user@zengenti.com')
        .then(result => {
            console.log('API call result: ', result);
            if (res) {
                res.render('index', { title: 'Success' });
            }
            return result;
        })
        .catch(error => {
            console.log('API call error: ', error);
            if (res) {
                res.render('index', { title: 'Error' });
            }
        });
};

exports.users_list = (client, res) => {
    return client.security.users.list({
        q: 'zengenti',
        pageOptions: { pageIndex: 1, pageSize: 5 },
        order: ['userName']
    })
        .then(result => {
            console.log('API call result: ', result);
            if (res) {
                res.render('index', { title: 'Success' });
            }
            return result;
        })
        .catch(error => {
            console.log('API call error: ', error);
            if (res) {
                res.render('index', { title: 'Error' });
            }
        });
};

exports.users_create = (client, res) => {
    let user = {
        "id": "00000000-0000-0000-0000-000000000002",
        "userName": "test_jspate_1",
        "email": "james@test.com",
        "language": "de-DE",
        "title": "Mr",
        "firstName": "James",
        "lastName": "Spate",
        "avatarUrl": "http://extrodinaryPeople.com/james.spate",
        "credentials": {
            "password": "MyPassword"
        }
    };

    return client.security.users.create(user)
        .then(result => {
            console.log('API call result: ', result);
            if (res) {
                res.render('index', { title: 'Success' });
            }
            return result;
        })
        .catch(error => {
            console.log('API call error: ', error);
            if (res) {
                res.render('index', { title: 'Error' });
            }
        });
};

exports.users_update = (client, res, user) => {
    if (!user) {
        user = {
            "id": "00000000-0000-0000-0000-000000000002",
            "userName": "test_jspate_1",
            "email": "james@test.com",
            "language": "de-DE",
            "title": "Mr",
            "firstName": "James",
            "lastName": "Spate",
            "avatarUrl": "http://extrodinaryPeople.com/james.spate/com"
        };
    }

    return client.security.users.update(user)
        .then(result => {
            console.log('API call result: ', result);
            if (!!res) {
                res.render('index', { title: 'Success' });
            }

            return result;
        })
        .catch(error => {
            console.log('API call error: ', JSON.stringify(error));
            if (!!res) {
                res.render('index', { title: 'Error' });
            }
        });
};

exports.users_delete = (client, res) => {
    let user = {
        "id": "00000000-0000-0000-0000-000000000002"
    };

    client.security.users.delete(user.id)
        .then(result => {
            console.log('API call result: ', result);
            if (res) {
                res.render('index', { title: 'Success' });
            }

            return result;
        })
        .catch(error => {
            console.log('API call error: ', error);
            if (res) {
                res.render('index', { title: 'Error' });
            }
        });
};

exports.users_users_userIsMemberOfGroup = (client, res) => {
    const userId = "0E2879B8-FA05-4291-BC99-035259B1CE61";
    const groupId = "89CEE207-6F12-4D27-8693-B7693766A82D";
    return client.security.users.userIsMemberOf(userId, groupId)
        .then(result => {
            console.log('API call result: ', result);
            if (res) {
                res.render('index', { title: 'Success' });
            }

            return result;
        })
        .catch(error => {
            console.log('API call error: ', error);
            if (res) {
                res.render('index', { title: 'Error' });
            }
        });
};

exports.users_userIsMemberOfGroups = (client, res) => {
    const userId = "0E2879B8-FA05-4291-BC99-035259B1CE61";
    const groupIds = ["89CEE207-6F12-4D27-8693-B7693766A82D", "2E86F729-9632-4D87-B38F-DF017F90B5CC"];
    return client.security.users.userIsMemberOf(userId, groupIds)
        .then(result => {
            console.log('API call result: ', result);
            if (res) {
                res.render('index', { title: 'Success' });
            }

            return result;
        })
        .catch(error => {
            console.log('API call error: ', error);
            if (res) {
                res.render('index', { title: 'Error' });
            }
        });
}

exports.users_getUserGroups = (client, res) => {
    const userId = "0E2879B8-FA05-4291-BC99-035259B1CE61";
    client.security.users.getUserGroups(userId)
        .then(result => {
            console.log('API call result: ', result);
            if (res) {
                res.render('index', { title: 'Success' });
            }

            return result;
        })
        .catch(error => {
            console.log('API call error: ', error);
            if (res) {
                res.render('index', { title: 'Error' });
            }
        });
};

exports.users_getUserGroupsIncludeInherited = (client, res) => {
    const userId = "0E2879B8-FA05-4291-BC99-035259B1CE61";
    client.security.users.getUserGroups({ userId, includeInherited: true })
        .then(result => {
            console.log('API call result: ', result);
            if (res) {
                res.render('index', { title: 'Success' });
            }

            return result;
        })
        .catch(error => {
            console.log('API call error: ', error);
            if (res) {
                res.render('index', { title: 'Error' });
            }
        });
};

exports.users_suspendUser = (client, res) => {
    let user = {
        "id": "D2F75C4F-946C-48DD-8A38-9C72EA3BD4D7"
    };

    return client.security.users.suspendUser(user.id)
        .then(result => {
            console.log('API call result: ', result);
            if (res) {
                res.render('index', { title: 'Success' });
            }

            return result;
        })
        .catch(error => {
            console.log('API call error: ', error);
            if (res) {
                res.render('index', { title: 'Error' });
            }
        });
};

exports.users_unsuspendUser = (client, res) => {
    let user = {
        "id": "D2F75C4F-946C-48DD-8A38-9C72EA3BD4D7"
    };

    return client.security.users.unsuspendUser(user.id)
        .then(result => {
            console.log('API call result: ', result);
            if (res) {
                res.render('index', { title: 'Success' });
            }

            return result;
        })
        .catch(error => {
            console.log('API call error: ', error);
            if (res) {
                res.render('index', { title: 'Error' });
            }
        });
};

exports.users_unlockUser = (client, res) => {
    let user = {
        "id": "D2F75C4F-946C-48DD-8A38-9C72EA3BD4D7"
    };

    return client.security.users.unlockUser(user.id)
        .then(result => {
            console.log('API call result: ', result);
            if (res) {
                res.render('index', { title: 'Success' });
            }

            return result;
        })
        .catch(error => {
            console.log('API call error: ', error);
            if (res) {
                res.render('index', { title: 'Error' });
            }
        });
};

