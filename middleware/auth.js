const jwt = require("jsonwebtoken");

const resp = {
  status:false,
  content: {
  }
}

const secretKey = process.env.SECRET_KEY;

const getToken = (user) => {
  // console.log(secretKey);
  const token = jwt.sign(user,secretKey,{expiresIn: '15m'});
  if(!token){
    res.content.data = {message: "Error in token creation try again."};
    res.status(500).json(resp);
  }
  return token;
}

const authenticateToken = (req,res,next) => {
  const headers = req.headers["authorization"];
  const token = headers && headers.split(' ')[1];

  if(!token){
    resp.content.data = {message: "Token not found."};
    res.status(500).json(resp);
  }

  jwt.verify(token,secretKey,function(err,user){
    if(err){
      resp.content.data = {message:"Token is not valid"}
      res.status(401).json(resp);
      return;
    }
    else{
      req.user = user;
      next();
    }
  })
}

module.exports = {
  getToken,
  authenticateToken
};