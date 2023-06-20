const algoliasearch = require('algoliasearch');

let breakUpObject = (object, maxBytes) => {
    const smallerObjects = [];
    let id = object['_id']
    let currentSize = 0;
    let currentObject = {};
    for (let key in object) {
      if (object.hasOwnProperty(key)) {
        if (typeof object[key] === 'string'){
            const propertySize = object[key].length;
            for(let i=0; i<propertySize; i++){
                if (currentSize == maxBytes){
                    currentObject._id = id
                    smallerObjects.push(currentObject);
                    let newObject = {}
                    newObject[key] = ''
  
                    currentObject = newObject
                    currentSize = 0;
                }
                else{
                    if (!currentObject.hasOwnProperty(key)){
                        currentObject[key] = ''
                    }  
                    currentObject[key] += object[key][i]
                    currentSize++;
                }
                
            }
        } else {
            currentObject[key] = object[key]
        }
      }
        
    }
  
    smallerObjects.push(currentObject);
    currentObject['_id'] = id
    return smallerObjects
}

module.exports.add = documents => {
  const client = algoliasearch('3U240B9PZS', '5d7957d6533b2b65eeca044c5f54c6d8');
  const index = client.initIndex('Acordaos')
  let smallerObjects = []
  // Só se podem guardar até 10000 carateres
  for(let i=0; i<documents.length; i++){
    let breakUpObjects = breakUpObject(documents[i], 7000);
    for(let j=0; j<breakUpObjects.length; j++){
      smallerObjects.push(breakUpObjects[j]) // Max size of object is 9000 bytes
    }
    
    //console.log(breakUpObject(documents[i], 9000))
  }

  //console.log(smallerObjects)
  
  return index
  .saveObjects(smallerObjects, { autoGenerateObjectIDIfNotExist: true})
  .then(response => {
    //console.log(response)
    return response
  })
  .catch(err => {
    console.log(err)
    return err
  });
}

module.exports.update = doc => {
  const client = algoliasearch('3U240B9PZS', '5d7957d6533b2b65eeca044c5f54c6d8');
  const index = client.initIndex('Acordaos')

  return index
  .deleteBy({
    "params":"numericFilters=_id="+doc._id
  })
  .then(response => {
    let smallerObjects = breakUpObject(doc, 9000) // Max size of object is 9000 bytes

    return index
    .saveObjects(smallerObjects, { autoGenerateObjectIDIfNotExist: true})
    .then(response => {
      return response
    })
    .catch(err => {
      return err
    });
  })
  .catch(err => {
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