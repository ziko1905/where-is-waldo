module.exports.getNumericProperties = (obj) => {
  const newObj = { ...obj };
  for (let key in obj) {
    if (typeof obj[key] !== "number") {
      delete newObj[key];
    }
  }

  return newObj;
};
