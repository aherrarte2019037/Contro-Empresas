import mongoose from 'mongoose'
import bcrypt from 'bcrypt';

const CompanyModel = mongoose.Schema({
    name     : { type: String, required: [true, 'Name is required'], maxLength: 30 },
    email    : { type: String, required: [true, 'Email is required'], maxLength: 254 },
    password : { type: String, required: [true, 'Password is required'], mingLength: 8, maxLength: 30 },
    phone: { type: Number, required: [true, 'Phone is required'], minLength: 8, maxLength: 8 },
    employees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }]
});


CompanyModel.pre( 'save', async function(next) {
    const user = this;

    if( !user.isModified('password') ) return next(); 

    const hashPassword = await bcrypt.hash( user.password, 10 );
    user.password = hashPassword;
});


CompanyModel.methods.validPassword = async function(password) {
    return await bcrypt.compare( password, this.password )
};


CompanyModel.methods.toJSON = function() {
    const company = this;
    const response = company.toObject();
    delete response.password;
    return response;
};


export default mongoose.model('Company', CompanyModel);