module.exports = function promisify(fn) {
  return function promisify_wrapper() {
    const length = arguments.length;
    const argList = arguments;
    return new Promise(function(resolve, reject) {
      const args = [];
      var i;
      for(i = 0; i < length; i++) {
        args.push(argList[i]);
      }
      args.push(function promisify_callback(error, result) => {
        if(error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
      fn.apply(args);
    });
  };
}
