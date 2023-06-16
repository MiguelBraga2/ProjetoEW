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
                    console.log(currentObject)
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

module.exports.add = doc => {

}

module.exports.remove = id => {
    const client = algoliasearch('3U240B9PZS', '5d7957d6533b2b65eeca044c5f54c6d8');
    const index = client.initIndex('Acordaos')
    index.deleteBy({
      'filters': '_id:' + id
    })
    .then(response => {
      return response
    })
    .catch(err => {
      console.log(err)
    })
}