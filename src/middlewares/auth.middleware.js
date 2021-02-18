import Passport from 'passport';

export default class AuthMiddleware {

    static registerUserAdmin( req, res, next ) {

        if( req.body.role === 'admin' ) {
            Passport.authenticate( 'authorize_user', {session: false}, (error, user, message) =>{

                if(error || !user || user.role === 'normal') {
                    res.status(500).send('Unauthorized');
        
                } else {
                    next();
                }
        
            })(req, res, next);

        } else {
            next();
        }

    }


    static isAdmin( req, res, next ) {

        Passport.authenticate( 'authorize_user', {session: false}, (error, user, message) =>{

            if(error || !user || user.role === 'normal') {
                res.status(500).send('Unauthorized');
        
            } else {
                next();
            }
        
        })(req, res, next);

    }

    
    static  authorizeCompany( req, res, next ) {

        Passport.authenticate( 'authorize_company', {session: false}, (error, user, message) =>{

            if(error || !user || user.role === 'normal') {
                res.status(500).send('Unauthorized');
        
            } else {
                next();
            }

        })(req, res, next);

    }

}