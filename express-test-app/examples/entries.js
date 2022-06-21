const uuidv4 = require('uuid/v4');

const Query = require('contensis-management-api').Query;
const ZenqlQuery = require('contensis-management-api').ZenqlQuery;
const Op = require('contensis-management-api').Op;

exports.entries_create = (client) => {
    const entryId = uuidv4();
    let newEntry = {
        "title": "Entry 1",
        "sys": {
            "id": entryId,
            "contentTypeId": "simple",
            "projectId": "website",
            "language": "en-GB",
            "dataFormat": "entry",
        }
    };

    return client.entries.create(newEntry)
        .then(result => {
            console.log('API call result: ', result);
            return result;
        })
        .catch(error => {
            console.log('API call error: ', error);
            throw error;
        });
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

exports.entries_create_with_id = async (client, entryId, wait = false) => {
    let newEntry = {
        "title": "Entry 1",
        "sys": {
            "id": entryId,
            "contentTypeId": "simple",
            "projectId": "website",
            "language": "en-GB",
            "dataFormat": "entry",
        }
    };

    if (wait) {
        await sleep(1000);
    }

    return client.entries.create(newEntry)
        .then(result => {
            console.log('API call result: ', result);
            return result;
        })
        .catch(error => {
            console.log('API call error: ', error);
            throw error;
        });
};

exports.entries_search = function entries_search(client) {
    var query = new Query(Op.or(
        Op.freeText('entryTitle', 'Testing'),
        Op.freeText('entryDescription', 'Testing')
    ));

    // var query = new Query(
    //     Op.freeText('entryTitle', 'Testing'));
    return client.entries.search(query)
        .then(result => {
            console.log('API call result: ', result);
            return result;
        })
        .catch(error => {
            console.log('API call error: ', error);
            throw error;
        });
}

exports.entries_search_zenql = client => {
    var query = new ZenqlQuery('sys.contentTypeId = al and shortText freetext "testing"');

    return client.entries.search(query)
        .then(result => {
            console.log('API call result: ', result);
            return result;
        })
        .catch(error => {
            console.log('API call error: ', error);
            throw error;
        });
};

exports.entries_list = (client, contentTypeId) => {
    return client.entries.list(contentTypeId)
        .then(result => {
            console.log('API call result: ', result);
            return result;
        })
        .catch(error => {
            console.log('API call error: ', error);
            throw error;
        });
};

exports.create_asset = (client) => {
    return client.entries.createAsset({
        "title": "Test 23-June",
        "sys": {
            //"id": entryId,
            "projectId": "website",
            "language": "en-GB",
            "dataFormat": "asset",
        }
    },
        'C:/Temp/test.jpg',
        '/contensis-management-api/assets')
        .then(result => {
            console.log('API call result: ', result);
            return result;
        })
        .catch(error => {
            console.log('API call error: ', error);
            throw error;
        });
};

exports.update_asset = (client, entryId) => {
    return client.entries.get(entryId).then(asset => {
        return client.entries.updateAsset(asset, 'C:/Temp/test_1.jpg')
            .catch(error => {
                console.log('API call error: ', error);
                throw error;
            });
    });
};

exports.invoke_workflow_by_trigger = (client) => {
    return client.entries.get('63070a56-3841-48fc-ae22-eb6e81af3622')
        .then(entry => {
            client.entries.invokeWorkflowByTrigger(entry, {
                event: 'awaitingSync.fail', //'syncFailed.submit',
                language: 'en-GB',
                version: '0.1',
                data: {
                    message: 'API manual fail'
                }
            })
                .then(result => {
                    console.log('API call result: ', result);
                    return result;
                })
                .catch(error => {
                    console.log('API invokeWorkflowByTrigger call error: ', error);
                    throw error;
                });
        })
        .catch(error => {
            console.log('API get entry call error: ', error);
            throw error;
        });
};

  // client.entries.get('5bca5bec-a401-4c80-a02a-c3ed2cf8f150').then(asset => {
  //   client.entries.updateAsset(asset, 'C:/Temp/test2.jpg')

  // client.entries.get('4b776c7b-415c-482a-be2f-9ec968745868')

  // client.entries.get({
  //   id: '4b776c7b-415c-482a-be2f-9ec968745868',
  //   version: '1.0',
  //   versionStatus: "published",
  //   language: 'en-GB'
  // })

   // client.entries.list({
  //   contentTypeId: 'movie',
  //   language: 'en-GB',
  //   versionStatus: "published",
  //   order: ['entryTitle', 'entryDescription'],
  //   pageOptions: {
  //     pageIndex: 0,
  //     pageSize: 50
  //   }
  // })

  // client.entries.delete('fa9bf8d8-c7f2-4fed-ae38-e7b1b2935d1c', ['fr', 'fr-FR'])
