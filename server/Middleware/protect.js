// const jwt = require('jsonwebtoken')
// const authenticationToken = async (req,res,next) => {
//     try {
//         const token = req.header('Authorization').split(' ')[1];
//         console.log('token in authRequire : ',token);

//         const decode = jwt.verify(token,process.env.JWT_SECRET);
//         console.log('Decoded Data in authRequire:', decode);

//         req.user = decode;
//         next();

//     } catch (error) {
//         res.status(403).send('Invalid token');
//     }
// }

// module.exports = authenticationToken;








const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user = decodedToken;
    next();
  });
};

module.exports = authenticateUser;
