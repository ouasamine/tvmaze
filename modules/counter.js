const counter = (arr) => {
    let showcounter = 0;
    for (let i = 0; i < arr.length; i ++){
      showcounter ++;
    }
    return showcounter;
  }


module.exports = counter;