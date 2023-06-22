const algoliasearch = require('algoliasearch');

let breakUpObject = (object, maxSize) => {
  const smallerObjects = [];
  let id = object['_id'];
  let currentSize = 0;
  let currentObject = {};

  for (let key in object) {
    if (typeof object[key] === 'string') {
      let fieldValue = object[key];
      let fieldSize = fieldValue.length;

      for (let i = 0; i < fieldSize; ) {
        let chunkSize = Math.min(maxSize - currentSize, fieldSize - i);
        let chunk = fieldValue.slice(i, i + chunkSize);

        currentObject[key] = chunk;
        currentSize += chunkSize;
        i += chunkSize;

        if (currentSize === maxSize) {
          currentObject['_id'] = id;
          smallerObjects.push(currentObject);
          currentSize = 0;
          currentObject = {};
        }
      }
    }
  }

  if (Object.keys(currentObject).length !== 0) {
    currentObject['_id'] = id;
    smallerObjects.push(currentObject);
  }

  return smallerObjects;
};

module.exports.add = documents => {
  const client = algoliasearch('3U240B9PZS', '5d7957d6533b2b65eeca044c5f54c6d8');
  const index = client.initIndex('Acordaos');
  let smallerObjects = [];

  for (let i = 0; i < documents.length; i++) {
    let breakUpObjects = breakUpObject(documents[i], 7000);
    for (let j = 0; j < breakUpObjects.length; j++) {
      smallerObjects.push(breakUpObjects[j]);
    }
  }

  return index.saveObjects(smallerObjects, { autoGenerateObjectIDIfNotExist: true })
    .then(response => {
      return response;
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};

module.exports.update = doc => {
  const client = algoliasearch('3U240B9PZS', '5d7957d6533b2b65eeca044c5f54c6d8');
  const index = client.initIndex('Acordaos')

  return index
  .deleteBy({
    "params":"numericFilters=_id="+doc._id
  })
  .then(response => {
    console.log(response)
    let smallerObjects = breakUpObject(doc, 9000) // Max size of object is 9000 bytes

    return index
    .saveObjects(smallerObjects, { autoGenerateObjectIDIfNotExist: true})
    .then(response => {
      return response
    })
    .catch(err => {
      console.log(err)
      return err
    });
  })
  .catch(err => {
    console.log(err)
    return err
  });
}

module.exports.remove = id => {
    const client = algoliasearch('3U240B9PZS', '5d7957d6533b2b65eeca044c5f54c6d8');
    const index = client.initIndex('Acordaos')
    return index
    .deleteBy({
      "params":"numericFilters=_id="+id
    })
    .then(response => {
      return response;
    })
    .catch(err => {
      return err
    });
}