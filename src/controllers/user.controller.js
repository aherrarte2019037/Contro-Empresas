import UserModel from '../models/user.model.js'

export default class UserController {

    static async createAdminUser() {

        const userRepeat = await UserModel.findOne({ name: 'Admin', role: 'admin' });
        if( !userRepeat ) await UserModel.create({ name: 'Admin', role: 'admin', email: 'admin@admin.com.gt', password: '123456' });
    
    }


    static async getAll() {

        try {
            const data = await UserModel.find();
            if( !data || data.length === 0 ) return { error: 'Data not found' };
            return data;

        } catch(error) {
            return { error: error }
        }

    }
    

    static async register({ name, role, email, password }) {
        const user = new UserModel({
            name: name,
            role: role,
            email: email,
            password: password
        });

        try {
            const userRepeat = await UserModel.findOne({ $or: [ {name: name}, {email: email} ] });
            if( userRepeat ) return { registered: false, error: 'Name or email already exists' };
            await user.save();
            const response = {...user}._doc
            delete response.password
            return { registered: true, item: response };

        } catch(error) {
            return { registered: false, error: error.message };
        }  
        
    }

}