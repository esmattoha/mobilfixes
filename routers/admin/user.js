/**
 * Admin User Routes
 * Author: Jahid
 * Date: 02.04.2021
 */

const express = require("express");
const router = express.Router();
const userController = require("./../../controllers/userController");
const { isLoggedIn } = require("./../../middleware/checkAuthMiddleware");
const userAuth = require("./../../middleware/userAuthMiddleware");
const cache = require("./../../middleware/cacheMiddleware/cache");
const catchAsync = require("../../utils/catchAsync");
const User = require("../../models/userModel");

// User Routes
router
  .route("/")
  .get(
    [isLoggedIn, userAuth.checkAdmin, cache.cacheMiddleware(30)],
    userController.index
  );

router
  .route("/:id")
  .get(
    [isLoggedIn, userAuth.checkAdmin],
    catchAsync(async (req, res) => {
      const user = await User.findById(req.params.id);
      res.json(user);
    })
  )
  .patch(
    [isLoggedIn, userAuth.checkAdmin],
    catchAsync(async (req, res) => {
      const { id } = req.params;
      const { name, email, phone } = req.body;
      const user = await User.findByIdAndUpdate(id, {
        name,
        email,
        phone,
      });
      res.json(user);
    })
  );

router.post(
  "/:id/block",
  [isLoggedIn, userAuth.checkAdmin],
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, {
      blockedAt: Date.now(),
    });
    res.json("Successfull.");
  })
);
router.post(
  "/:id/unblock",
  [isLoggedIn, userAuth.checkAdmin],
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, {
      blockedAt: null,
    });
    res.json("Successfull.");
  })
);
/*
 *  Delete User
 */
router.delete("/:id", [isLoggedIn, userAuth.checkAdmin], userController.delete);

module.exports = router;
