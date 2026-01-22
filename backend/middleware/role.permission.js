const checkRole = (allowedRoles)=>{
    return (req, res , next)=>{
        if(!allowedRoles.includes(req.user.role)){
            // return res.status(403).json({message: "Access Denied"})
            if (req.user.role === 'admin') {
                return res.redirect('/addproduct');   
            } else if (req.user.role === 'customer') {
                return res.redirect('/product'); 
            } else {
                return res.redirect('/');       
            }
        }
        next();

    }

}
// res.clearCookie('jwt',  {
//     httpOnly: true,
//     sameSite: 'Strict'

//   });
//   res.redirect('/')

export default checkRole;