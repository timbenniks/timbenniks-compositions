module.exports = function (doc) {
  if (doc.type === "writing") {
    return `/writings/${doc.uid}`;
  }

  return "/";
};
