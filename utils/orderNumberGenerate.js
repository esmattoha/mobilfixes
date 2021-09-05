const generateOrderNumber = () => {
  const date = new Date();
  const uniqueNumber = Math.floor(Math.random() * 10000);
  return [
    "MF",
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    uniqueNumber,
  ].join("");
};

module.exports = { generateOrderNumber };
