exports.roles_get = (client, res) => {
    return client.roles.get('80baebc8-410e-429b-8bec-c16139c1ce8e')
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

exports.roles_create = (client, res) => {
    let role = {
        "name": "Movie Editors",
        "description": "Movie editors can edit movies, but not submit or approve them",
        "enabled": true,
        "permissions": {
            "entries": [
                {
                    "id": "movie",
                    "languages": ["en-GB"],
                    "actions": []
                }
            ],
            "blocks":
            {
                "actions": ["push", "release"]
            }

        },
        "assignments": {
            "users": ["a.pop"]
        }
    };
    return client.roles.create(role)
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

exports.roles_update = (client, res) => {
    let role = {
        "id": "54a06f7c-1cc8-4149-aa51-04aabe9f850d",
        "name": "Movie Editors 1",
        "description": "Movie editors 1 can edit movies, but not submit or approve them",
        "enabled": true,
        "permissions": {
            "entries": [
                {
                    "id": "movie",
                    "languages": ["*"],
                    "actions": []
                }
            ],
            "blocks":
            {
                "actions": ["push", "release"]
            }
        },
    };
    return client.roles.update(role)
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

exports.roles_delete = (client, res) => {
    return client.roles.delete('c31111e7-76f7-46dd-93fb-cbf81a853a37')
        .then(result => {
            console.log('API call was successful');
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

exports.roles_list = (client, res) => {
    return client.roles.list({ pageIndex: 1, pageSize: 5 })
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
