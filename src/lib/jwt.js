const jwt = require('jsonwebtoken');
const { config } = require('../config');

/**
 * expiresIn: 86400, in milliseconds second - 24 hours
 *
 *
 *
 */

const expiredTimeMap = {
    access: 86400 * 30,
    refresh: 86400 * 30,
};

const makeToken = ({ type }) => {
    let jwtToken = "";
    try {
        jwtToken = jwt.sign({ type: type }, config.jwtSecret, {
            expiresIn: expiredTimeMap[type],
        });
    } catch (e) {
        console.log("[getToken]", e);
    }
    return jwtToken;
};



     
   

const verifyToken = ({ token }) => {
    let isVerify = false;

    try {
        const decodedToken = jwt.verify(token, config.jwtSecret);
        if (decodedToken) {
            isVerify = true;
        }
    } catch (err) {
        console.log("[lib][jwt][verifyToken][token is invalid]", err);
    }
    return isVerify;
};


const isAccessValid = ({event}) => {
  
      
   const { headers: {authorization}} = event;
  
  
  
    if(!authorization.startsWith('Bearer ')){
        return false;
    }

    const token = authorization.replace("Bearer ", "");
    
    
    return verifyToken({ token }) 
      
     }
     
     
     
     module.exports = {
         verifyToken, 
         isAccessValid,
         makeToken
     }