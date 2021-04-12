exports.events_connect = async (client) => {
  let newContentType = {
    "id": "contentType1"
  };

  let eventCallback = (eventJSON, subscriptionId) => {
    console.log("Event:" + eventJSON);
  };

  return client.events.connectToEventsStream({ topicsJSON: '[{ "resourceType" : "entry"}]' }, eventCallback)
    .then(result => {
      console.log('API call result: ', result);
      return result;
    })
    .catch(error => {
      console.log('API call error: ', error);
      throw error;
    });
};
