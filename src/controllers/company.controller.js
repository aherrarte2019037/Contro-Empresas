import CompanyModel from '../models/company.model.js'

export default class CompanyController {

    static async getAll() {

        try {
            const data = await CompanyModel.find().populate('employees');
            if( !data || data.length === 0 ) return { error: 'Data not found' }
            return data;
            
        } catch(error) {
            return { error: error }
        }

    }


    static async updateById( id, updateData ) {

        try {
            delete updateData.password;
            const data = await CompanyModel.findByIdAndUpdate( id, updateData );
            if( !data ) return { updated: false, error: 'Id invalid or not found' };
            return { updated: true, item: data }

        } catch(error){
            return { updated: false, error: error }
        }

    }


    static async deleteById( id ) {

        try {
            const data = await CompanyModel.findByIdAndDelete( id );
            if( !data ) return { deleted: false, error: 'Id invalid or not found' }
            return { deleted: true, item: data };

        } catch(error) {
            return { deleted: false, error: error };
        }

    }


    static async register({ name, email, password, phone }) {
        const company = new CompanyModel({
            name: name,
            email: email,
            password: password,
            phone: phone

        });

        try {
            const companyRepeat = await CompanyModel.findOne({ $or: [ {name: name}, {email: email} ] });
            if( companyRepeat ) return { registered: false, error: 'Company already exists' };
            await company.save();
            const data = {...company}._doc
            delete data.employees
            delete data.password
            return { registered: true, item: data };

        } catch(error) {
            return { registered: false, error: error.message };
        }  
        
    }

}