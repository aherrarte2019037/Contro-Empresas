import express from 'express';
import CompanyController from '../controllers/company.controller.js';
import Passport from 'passport';
import AuthMiddleware from '../middlewares/auth.middleware.js';
import '../services/auth.service.js';


const router = express.Router();


router.get('/', async(req, res) => {

    try {
        const data = await CompanyController.getAll();
        res.status(200).send(data)
        
    } catch(error) {
        res.status(500).send({ error: error })
    }

});


router.put('/:id', AuthMiddleware.isAdmin, async(req, res) => {

    try {
        const id = req.params.id;
        const data = req.body;
        const response = await CompanyController.updateById( id, data );
        res.status(200).send(response);

    } catch(error) {
        res.status(500).send({ updated: false, error: error });
    }
    
});


router.delete('/:id', AuthMiddleware.isAdmin, async(req, res) => {
    
    try {
        const id = req.params.id;
        const response = await CompanyController.deleteById( id );
        res.status(200).send(response);
    
    } catch(error) {
        res.status(500).send({ deleted: false, error: error });
    }

});


router.post('/register', AuthMiddleware.isAdmin, async(req, res) => {
    
    const data = req.body;
    const response = await CompanyController.register( data );
    res.send( response );
    
});


router.post('/login', (req, res) => {

     Passport.authenticate( 'authenticate_company', {session: false}, (error, company, message) =>{
        
        if(error || !company) {
            res.status(500).send(message);

        } else {
            res.status(200).send(message);
        }

    })(req, res);

});


export default router;