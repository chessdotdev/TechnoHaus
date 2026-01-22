const checkRole = (allowedRoles)=>{
    return (req, res , next)=>{
        if(!allowedRoles.includes(req.user.role)){
            return res.status(403).json({message: "Access Denied"})
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