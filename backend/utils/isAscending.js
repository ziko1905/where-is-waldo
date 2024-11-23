module.exports = (arr, callBack = (e) => e) => {
  for (let i = 0; i < arr.length - 1; i++) {
    if (callBack(arr[i]) > callBack(arr[i + 1])) {
      return false;
    }
  }

  return true;
};
