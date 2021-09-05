// Import Dependencies
const express = require("express");
const shopController = require("../controllers/shopController");
const checkAuth = require("../middleware/checkAuthMiddleware");
const userAuth = require("../middleware/userAuthMiddleware");
const cache = require("../middleware/cacheMiddleware/cache");

// Define Express router poperty
const router = express.Router();

/*
*  Fetch All Shops
*/
router.get("/shop", 
  [checkAuth.verifyToken,userAuth.checkAdmin,cache.cacheMiddleware(30)], 
shopController.index
);

/* 
*  SEARCH SHOP
*/
router.get("/shop/search", 
  [cache.cacheMiddleware(30)], 
shopController.search
);

/*
*  Fetch a single shop by it's id
*/
router.get("/shop/:shopId", 
[checkAuth.verifyToken,cache.cacheMiddleware(30)], 
shopController.show
);

/*
*   Shop Storing , Only Admin access it 
*/
router.post(
  "/shop",
  [checkAuth.verifyToken, userAuth.checkAdmin],
  shopController.store
);

/*
*  Delete Shop By shopId, Only Admin access it 
*/
router.delete(
  "/shop/:shopId",
  [checkAuth.verifyToken, userAuth.checkAdmin],
  shopController.deleteShop
);

/*
*  Update Shop by shopId, Only Admin access it 
*/
router.patch(
  "/shop/:shopId",
  [checkAuth.verifyToken, userAuth.checkAdmin],
  shopController.updateShop
);

/*
* Show those shops , who provide this paticuler repair system 
*/ 
router.get(
  "/shops/:repair",
  [checkAuth.verifyToken, [cache.cacheMiddleware(30)]],
  shopController.matchShops
);

// Export Router
module.exports = router;
