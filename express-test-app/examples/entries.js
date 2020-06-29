exports.entries_search = function entries_search(client, res) {
    var query = new Query(Op.contains('text', 'Test12345'));
    client.entries.search(query)
        .then(result => {
            console.log('API call result: ', result);
            res.render('index', { title: 'Success' });
        })
        .catch(error => {
            console.log('API call fetch error: ', error);
            res.render('index', { title: 'Error' });
        });
}

exports.entries_list = (client, contentTypeId) => {
    return client.entries.list(contentTypeId)
        .then(result => {
            console.log('API call result: ', result);
            return result;
        })
        .catch(error => {
            console.log('API call fetch error: ', error);
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
            console.log('API call fetch error: ', error);
            throw error;
        });
};

exports.update_asset = (client, entryId) => {
    return client.entries.get(entryId).then(asset => {
        return client.entries.updateAsset(asset, 'C:/Temp/test_1.jpg')
            .catch(error => {
                console.log('API call fetch error: ', error);
                throw error;
            });
    });
};

//   const entryId = uuidv4();
  //   let newEntry = {
  //     "title": "Entry 4",
  //     "data": "Data 4",    
  //     "sys": {
  //       "id": entryId,
  //         "contentTypeId": "simpleContent",
  //         "projectId": "website",
  //         "language": "en-GB",
  //         "dataFormat": "entry",
  //     }
  // };

  // client.entries.create(newEntry)

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

  //  client.entries.invokeWorkflowByTrigger(result, {
  //   event: 'sysUnpublish',
  //   language: 'en-GB'
  // }).then(updateResult => {
