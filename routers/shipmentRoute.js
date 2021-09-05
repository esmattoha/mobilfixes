const router = require("express").Router();
const { isLoggedIn } = require("../middleware/checkAuthMiddleware");
const { index, store, show } = require("../controllers/shipmentController");
const { checkAdmin } = require("../middleware/userAuthMiddleware");

router
  .route("/shipment")
  .get([isLoggedIn, checkAdmin], index);

router.route("/shipment/:id")
  .get(isLoggedIn, show)
  .post(isLoggedIn, store);

module.exports = router;
