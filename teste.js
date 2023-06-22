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
  
  let concatenateObjects = (smallerObjects) => {
    let concatenatedObject = {};
  
    for (let i = 0; i < smallerObjects.length; i++) {
      let smallerObject = smallerObjects[i];
      let id = smallerObject['_id'];
  
      for (let key in smallerObject) {
        if (key !== '_id') {
          if (!concatenatedObject[key]) {
            concatenatedObject[key] = smallerObject[key];
          } else {
            concatenatedObject[key] += smallerObject[key];
          }
        }
      }
    }
  
    concatenatedObject['_id'] = smallerObjects[0]['_id'];
    return concatenatedObject;
  };
  
  
  const r = concatenateObjects(breakUpObject({
    _id : 1,
    "Contencioso": "ADMINISTRATIVO",
    "Data": "06/23/2015",
    "Processo": "11452/14",
    "Nº Processo/TAF": "00000/00/0",
    "Sub-Secção": "2.º JUÍZO - 1.ª SECÇÃO",
    "Magistrado": "Fernanda Carneiro",
    "url": "/jtcampca.nsf/a10cb5082dc606f9802565f600569da6/d94509912714ba7e80257e7d0036bc87?OpenDocument",
    "tribunal": "jtcampca"
  }, 3));

  console.log(r);


  