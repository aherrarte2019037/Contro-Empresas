import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = mongoose.Schema({
    name    : { type: String, required: [true, 'Name is required'], maxLength: 30 },
    role    : { type: String, enum: ['admin', 'normal'], default: 'normal' },
    email   : { type: String, required: [true, 'Email is required'], maxLength: 254 },
    password: { type: String, required: [true, 'Password is required'], mingLength: 8, maxLength: 30 }
});


UserSchema.pre( 'save', async function(next) {
    const user = this;

    if( !user.isModified('password') ) return next(); 

    const hashPassword = await bcrypt.hash( user.password, 10 );
    user.password = hashPassword;
});


UserSchema.methods.validPassword = async function(password) {
    return await bcrypt.compare( password, this.password )
};


UserSchema.methods.toJSON = function() {
    const user = this;
    const response = user.toObject();
    delete response.password;
    return response;
};


export default mongoose.model('User', UserSchema);