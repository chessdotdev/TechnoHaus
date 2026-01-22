import jwt from 'jsonwebtoken';


const verifyToken = (req, res, next) =>{
    const token = req.cookies.jwt
    
    if(!token){
        // return res.status(401).json({ message: "No token, authorization denied" });
        return res.redirect('/');   
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded;
        // console.log(req.user);
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }

}



const checkIfValidToken = (req, res, next) => {
    const token = req.cookies?.jwt;
    if (!token) return next();
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return next();
        if (decoded.role === 'admin') return res.redirect('/addproduct');
        if (decoded.role === 'customer') return res.redirect('/product');
        return next();
    });
  };

export {
    verifyToken,
    checkIfValidToken
};
