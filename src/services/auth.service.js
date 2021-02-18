import Passport from 'passport';
import PassportJwt from 'passport-jwt';
import CompanyModel from '../models/company.model.js';
import Jwt, { decode } from 'jsonwebtoken';
import { Strategy } from 'passport-local';
import dontenv from 'dotenv';
import UserModel from '../models/user.model.js'

dontenv.config();


const AuthFields = {
    usernameField: 'email',
    passwordField: 'password'
};


const JwtOptions = {
    jwtFromRequest: PassportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}


Passport.use( 'authenticate_company', new Strategy( AuthFields, async(email, password, done) =>{

    try {
        const company = await CompanyModel.findOne({ email: email });
        if( !company ) return done(null, false, { logged: false, error: 'Wrong email or password' });
        if( !await company.validPassword(password) ) return done(null, false, { logged: false, error: 'Wrong email or password' });


        return done(null, company, { logged: 'true', item: company, jwt: getCompanyToken(company) });

    } catch(error) {
        return done(null, false, { error: error });
    }

}));


Passport.use( 'authenticate_user', new Strategy( AuthFields, async(email, password, done) =>{

    try {
        const user = await UserModel.findOne({ email: email });
        if( !user ) return done(null, false, { logged: false, error: 'Wrong email or password' });
        if( !await user.validPassword(password) ) return done(null, false, { logged: false, error: 'Wrong email or password' });

        return done(null, user, { logged: 'true', item: user, jwt: getUserToken(user) });

    } catch(error) {
        return done(null, false, { error: error });
    }

}));


Passport.use( 'authorize_user',new PassportJwt.Strategy( JwtOptions, async(jwtPayload, done) =>{

    try {
        const user = await UserModel.findById( jwtPayload.sub );
        return done( null, user, { authorized: true } );

    } catch(error) {
        return done(error, false, { authorized: false, error: error })
    }

}));


Passport.use( 'authorize_company',new PassportJwt.Strategy( JwtOptions, async(jwtPayload, done) =>{

    try {
        const company = await CompanyModel.findById( jwtPayload.sub );
        if( !company ) return done(null, false, { authorized: false, error: 'Invalid token' });
        return done( null, company );

    } catch(error) {
        return done(null, false, { error: error })
    }

}));


function getCompanyToken( company ) {
    return Jwt.sign({
        iss: company.name,
        sub: company.id
    }, process.env.JWT_SECRET);
};


function getUserToken( user ) {
    return Jwt.sign({
        role: user.role,
        iss: user.name,
        sub: user.id
    }, process.env.JWT_SECRET);
};

function decodeJwt( jwt ) {
    return Jwt.decode( jwt );
}

export default decodeJwt;