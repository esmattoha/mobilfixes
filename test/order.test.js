const {
  getMetaData,
  getOrderItems,
  productItem,
} = require("../controllers/orderController");

/**
 * 
 */
test("Return a object after exicute the function", async () => {
  const req = {
    body: function (device, model) {
      return { device, model };
    },
  };
  expect(getMetaData(req)).resolves.toBe({});
});
/**
 * 
 */
test("return a object", async() => {
  const req = {
    body: function (product) {
      return product;
    },
  };

  expect(productItem(req)).resolves.toBe({});
});
/**
 * 
 */
test("Return an array", async () => {
  const items = ["60c02bb500c3478174c8e1ca", "60c02c2b00c3478174c8e1cc"];
  const data = await getOrderItems(items);
  expect(data).resolves.toBe([]);
});
