import jwt from 'jsonwebtoken';


const verifyToken = (req, res, next) =>{
    const token = req.cookies.jwt
    
    // if(!token){
    //     return res.status(401).json({ message: "No token, authorization denied" });
        
    // }
    
    // try {
    //     const decoded = jwt.verify(token, process.env.JWT_SECRET)
    //     req.user = decoded;
    //     next();
    // } catch (error) {
    //     return res.status(401).json({ message: "Invalid token" });
    // }

    if(token){
        
        jwt.verify(token, process.env.JWT_SECRET,(err, decodedToken)=>{
            if(err){
                res.redirect('/')
            }else{
                console.log(decodedToken);
                next()
            }

        })

    }else{
        res.redirect('/')
    }
}



const checkIfValidToken = (req, res, next) => {
    const token = req.cookies?.jwt;
    if (!token) return next();
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {

        return next();
      }

      return res.redirect('/home');
    });
  };

export {
    verifyToken,
    checkIfValidToken
};
