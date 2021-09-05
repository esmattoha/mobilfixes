/*
 *  Check  User is a admin or not
 */
exports.checkAdmin = async (req, res, next) => {
  const { type } = req.user;
  if (type !== "admin") {
    return res.status(401).json({
      message: "Unauthenticated!",
    });
  }
  next();
};

/*
 *  Check  User is a Manager or not
 */
exports.checkManager = (req, res, next) => {
  const { type } = req.user;
  if (type !== "manager") {
    return res.status(401).json({
      message: "Unauthenticated!",
    });
  }
  next();
};
