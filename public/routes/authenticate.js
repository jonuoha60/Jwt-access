import jwt from 'jsonwebtoken';

//Load the token using environmental variables or here your choice
const ACCESS_TOKEN_SECRET = ""
//Middleware to pass in api endpoint of your choice
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 
  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

export default authenticateToken;
