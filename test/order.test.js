const orderController = require("../controllers/orderController");
//
test("Throw a 406 error", async () => {
  const req = {
    body: function (type, customerInfo, shippingAddress, service) {
      return null;
    },
  };
  // const data = await orderController.store(req, {}, () => {});
   await expect(() =>orderController.store(req , {}, () =>{}) ).toThrow();
});

// //
// test("Should return a object", async () => {
   
//   const req = {
//     body: function (
//       type,
//       items,
//       productPrice,
//       customerInfo,
//       shippingAddress,
//       billingAddress,
//       customerNotes,
//       service,
//       appointmentTime
//     ) {
//       return {
//         type,
//         items,
//         productPrice,
//         customerInfo,
//         shippingAddress,
//         billingAddress,
//         customerNotes,
//         service,
//         appointmentTime,
//       };
//     },
//   };
//   const data = await orderController.store(req, {}, () => {});
//   expect(data).toBe("successfull");
// });

// // Delete
// test("Should return a message", async()=>{
//     const req = {
//         params: function(id){
//             return id ;
//         }
//     }
//     const data = await orderController.delete(req, {}, () =>{});
//     expect(data).toBe({ message: "Deleted" })
// })