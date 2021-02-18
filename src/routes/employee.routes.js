import express from 'express';
import EmployeeController from '../controllers/employee.controller.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';


const router = express.Router();


router.get('/', AuthMiddleware.authorizeCompany, async(req, res) => {

    const query = req.query;
    const token = req.headers.authorization;

    try {
        const response = await EmployeeController.getAll( query, token );
        res.status(200).send(response);

    } catch(error) {
        res.status(500).send(error);
    }
    
});


router.get('/:id', AuthMiddleware.authorizeCompany,  async(req, res) => {

    const id = req.params.id;
    const token = req.headers.authorization;

    try {
        const response = await EmployeeController.getById( id, token );
        res.status(200).send(response);

    } catch(error) {
        res.status(200).send(error)
    }

});


router.get('/operations/count', AuthMiddleware.authorizeCompany, async(req, res) => {

    const token = req.headers.authorization;

    try {
        const response = await EmployeeController.getCount( token );
        res.status(200).send(response);

    } catch(error) {
        res.status(500).send(error);
    }

});


router.post('/', AuthMiddleware.authorizeCompany, async(req, res) => {

    try {
        const data = req.body;
        const token = req.headers.authorization;
        const response = await EmployeeController.add( data, token );
        res.status(200).send(response);

    } catch(error) {
        res.status(500).send({ added: false, error: error });
    }

});


router.put('/:id', AuthMiddleware.authorizeCompany, async(req, res) => {

    try {
        const id = req.params.id;
        const data = req.body;
        const token = req.headers.authorization;
        const response = await EmployeeController.updateById( id, data, token );
        res.status(200).send(response);

    } catch(error) {
        res.status(500).send({ updated: false, error: error });
    }

});


router.delete('/:id', AuthMiddleware.authorizeCompany, async(req, res) => {

    try {
        const id = req.params.id;
        const token = req.headers.authorization;
        const response = await EmployeeController.deleteById( id, token );
        res.status(200).send(response)

    } catch(error) {
        return { deleted: false, error: error };
    }

});


router.post('/service/pdf', AuthMiddleware.authorizeCompany, async(req, res) => {

    try {
        const filename = req.body.filename;
        const token = req.headers.authorization;
        const response = await EmployeeController.generatePdf( filename, token );
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${response.filename}`);
        response.doc.pipe(res);

    } catch(error) {
        res.status(500).send({ error: 'Pdf generated failed' })
    }

});


export default router;