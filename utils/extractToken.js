/**
 * @param Object reqest
 * @return String token || Boolean
 */
 const extractToken = (req) => {
    let token = req.header("authorization");
  
    if (!token) {
      return false;
    }
  
    token = token.split(" ")[1];
    return token;
  };

module.exports = extractToken ;  