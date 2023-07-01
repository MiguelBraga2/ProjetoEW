/**
 * Module to add and update documents in the Algolia index
 */

// Module to interact with the Algolia API
const algoliasearch = require('algoliasearch');

/**
 * The algolia database requires that documents are no more than 10000 bytes
 * This function breaks a document into multiple documents with no more than that size
 * @param {*} object - object to be split
 * @param {*} maxSize - maximum size of smaller objects
 * @returns a list of the smaller objects
 */
module.exports.splitObject = (object, maxSize) => {
  const smallerObjects = [];
  let id = object['_id'];
  let currentSize = 0;
  let currentObject = {};

  for (let key in object) {
    // Only strings are being split (we don't want to split arrays and integers are meaningfull)
    if (typeof object[key] === 'string') {
      let fieldValue = object[key];
      let fieldSize = fieldValue.length;

      // For each field of the original object
      for (let i = 0; i < fieldSize; ) {
        let chunkSize = Math.min(maxSize - currentSize, fieldSize - i); // The size of the chunk
        let chunk = fieldValue.slice(i, i + chunkSize); // The chunk of the string

        currentObject[key] = chunk;
        currentSize += chunkSize;
        i += chunkSize;
        
        // If the current object is full, add it to the list and start a new one
        if (currentSize === maxSize) {
          currentObject['_id'] = id;
          smallerObjects.push(currentObject);
          currentSize = 0;
          currentObject = {};
        }
      }
    }
    else{
      currentObject[key] = object[key];
    }
  }
  // If the currentObject is not empty, add it to the list to be returned
  if (Object.keys(currentObject).length !== 0) {
    currentObject['_id'] = id;
    smallerObjects.push(currentObject);
  }
  return smallerObjects;
};

/**
 * Adds documents to the Algolia index
 * @param {*} documents 
 * @returns an ack or an error
 */
module.exports.add = documents => {
  // Connect to the Algolia API
  const client = algoliasearch('3U240B9PZS', '5d7957d6533b2b65eeca044c5f54c6d8');
  const index = client.initIndex('Acordaos');
  let smallerObjects = [];

  // Split the bigger objects into smaller ones
  // Objects from the same original document will have the same _id but different algolia autogenerated ids
  for (let i = 0; i < documents.length; i++) {
    let splitObjects = this.splitObject(documents[i], 7000);
    for (let j = 0; j < splitObjects.length; j++) {
      smallerObjects.push(splitObjects[j]);
    }
  }

  return index.saveObjects(smallerObjects, { autoGenerateObjectIDIfNotExist: true })
    .then(response => {
      return response;
    })
    .catch(err => {
      console.log("Controller algolia: " + err);
      return err;
    });
};

/**
 * Updates that document in the algolia index
 * @param {*} doc 
 * @returns 
 */
module.exports.update = async (doc) => {
  const client = algoliasearch('3U240B9PZS', '5d7957d6533b2b65eeca044c5f54c6d8');
  const index = client.initIndex('Acordaos');

  try {
    await index.deleteBy({
      params: "numericFilters=_id=" + doc._id
    });

    const smallerObjects = splitObject(doc, 9000);
    await index.saveObjects(smallerObjects, { autoGenerateObjectIDIfNotExist: true });

    return { success: true };
  } catch (error) {
    console.log("Controller algolia: " + error);
    return error;
  }
};

/**
 * Remove a document from the algolia index
 * @param {int} id 
 * @returns 
 */
module.exports.remove = id => {
  // Connect to the Algolia API
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