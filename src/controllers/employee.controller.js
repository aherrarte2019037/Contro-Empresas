import EmployeeModel from '../models/employee.model.js';
import CompanyModel from '../models/company.model.js';
import generatePdf from '../services/pdf.service.js';
import decodeJwt from '../services/auth.service.js'

export default class EmployeeController {

    static async getAll( query, token ) {

        const companyId = decodeJwt( token.slice(7, token.length) ).sub;

        try {
            const data = await EmployeeModel.find({ ...query, company: companyId }).populate( 'company', {name: 1, email: 1} );
            if( !data || data.length === 0 ) return { error: 'Data not found' };
            return data;

        } catch(error) {
            return { error: error };
        }

    }


    static async getById( id, token ) {

        const companyId = decodeJwt( token.slice(7, token.length) ).sub;

        try {
            const data = await EmployeeModel.findOne({ _id: id, company: companyId }).populate( 'company', {name: 1, email: 1} );
            if( !data ) return { error: 'Id invalid or not found' };
            return data;

        } catch(error) {
            return { error: error };
        }

    }


    static async getCount( token ) {

        const companyId = decodeJwt( token.slice(7, token.length) ).sub;

        try {
            const data = await EmployeeModel.countDocuments({ company: companyId })
            if( !data || data.length === 0 ) return { error: 'Data not found' };
            return { employeesCount: data};

        } catch(error) {
            return { error: error };
        }

    }


    static async add({ firstname, lastname, age, job, departament }, token) {

        const companyId = decodeJwt( token.slice(7, token.length) ).sub;

        const employee = new EmployeeModel({
            firstname, firstname,
            lastname, lastname,
            age: age,
            job: job,
            departament: departament,
            company: companyId
        });

        try {
            const employeeRepeat = await EmployeeModel.findOne({ firstname: firstname, lastname: lastname, age: age, company: companyId });
            if( employeeRepeat ) return { added: false, error: 'Employee already exists' };
            
            const employeeId = ( await employee.save() ).id;
            await CompanyModel.findByIdAndUpdate( companyId, { $push: { employees: employeeId } } );

            return { added: true, item: employee };

        } catch(error) {
            return { added: false, error: error };
        }

    }


    static async updateById( id, updateData, token ) { 

        const companyId = decodeJwt( token.slice(7, token.length) ).sub;

        try {
            const data = await EmployeeModel.findOneAndUpdate( { _id : id, company: companyId }, updateData );
            if( !data ) return { updated: false, error: 'Id invalid or not found' };
            return { updated: true, item: data };

        } catch(error) {
            return { updated: false, error: error };
        }

    }


    static async deleteById( id, token ) {

        const companyId = decodeJwt( token.slice(7, token.length) ).sub;

        try {
            const data = await EmployeeModel.findOneAndDelete({ _id: id, company: companyId });
            if( !data ) return { deleted: false, error: 'Id invalid or not found' };
            await CompanyModel.findByIdAndUpdate( companyId, { $pull: {employees: data.id} } );
            return { deleted: true, item: data };

        } catch(error) {
            return { deleted: false, error: error };
        }

    }

    
    static async generatePdf( filename, token ) {

        const companyId = decodeJwt( token.slice(7, token.length) ).sub;

        try {
            const employees = await EmployeeModel.find({ company: companyId }).populate( 'company', { name: 1, email: 1 } );
            const data = generatePdf( filename, employees );
            return data;
            
        } catch (error) {
            return error;
        }
        
    }

}