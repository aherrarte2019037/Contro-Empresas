import express from 'express';
import UserController from '../controllers/user.controller.js'
import Passport from 'passport';
import AuthMiddleware from '../middlewares/auth.middleware.js'


const router = express.Router();


router.get('/', async(req, res) => {

    try {
        const response = await UserController.getAll();
        res.status(200).send(response);

    } catch(error) {
        res.status(500).send(error);
    }

});


router.post('/register', AuthMiddleware.registerUserAdmin, async(req, res) => {
    
    const data = req.body;
    const response = await UserController.register( data );
    res.send( response );
    
});


router.post('/login', (req, res) => {

    Passport.authenticate( 'authenticate_user', {session: false}, (error, user, message) =>{
        
        if(error || !user) {
            res.status(500).send(message);

        } else {
            res.status(200).send(message);
        }

    })(req, res);

});


export default router;