exports.contentTypes_list = (client) => {
  return client.contentTypes.list({
    dataFormat: 'entry',
    versionStatus: 'latest'
  })
    .then(result => {
      console.log('API call result: ', result);
      return result;
    })
    .catch(error => {
      console.log('API call fetch error: ', error);
      throw error;
    });
};

  // client.contentTypes.get('simple')
  // .then(result => {
  //   if (result) {
  //     console.log('result: ', result);
  //     let newContentType = result;
  //     newContentType.id = "simple1";
  //     newContentType.name['en-GB'] = "Simple 1";
  //     delete newContentType.version;
  //     client.contentTypes.create(newContentType).then( createResult => {
  //       console.log('createResult: ', createResult);
  //       res.render('index', { title: 'Success' });
  //     })
  //   }
  // })


  // client.contentTypes.get('simple')
  // .then(result => {
  //   if (result) {
  //     console.log('result: ', result);
  //     let newContentType = result;
  //     newContentType.name['en-GB'] = "Simple v1";
  //     client.contentTypes.update(newContentType).then( updateResult => {
  //       console.log('updateResult: ', updateResult);
  //       res.render('index', { title: 'Success' });
  //     })
  //   } 
  // })

  // client.contentTypes.get({
  //   id: "simple",
  //   version: '2.2',
  //   versionStatus: 'published'
  // })

  // client.contentTypes.get('simple1')
  // .then(result => {
  //   if (result) {
  //     console.log('result: ', result);
  //     client.contentTypes.delete(result.id).then( updateResult => {
  //       console.log('deleteResult: ', updateResult);
  //       res.render('index', { title: 'Success' });
  //     })
  //   } 
  // })

  // client.contentTypes.get('simple')
  //   .then(result => {
  //     if (result) {
  //       console.log('result: ', result);
  //       client.contentTypes.invokeWorkflow(result, 'publish').then(updateResult => {
  //         console.log('publishResult: ', updateResult);
  //         res.render('index', { title: 'Success' });
  //       });
  //     }
  //   })
