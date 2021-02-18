import mongoose from 'mongoose';


const EmployeeSchema = mongoose.Schema({
    firstname  : { type: String, required: [true, 'Firstname is required'], maxLength: 30 },
    lastname   : { type: String, required: [true, 'Lastname is required'], maxLength: 30 },
    age        : { type: Number, required: [true, 'Age is required'], min: 1, max: 100 },
    job        : { type: String, required: [true, 'Job is required'], maxLength: 50 },
    departament: { type: String, required: [true, 'Departament is required'], maxLength: 50 },
    company    : { type: mongoose.Schema.Types.ObjectId, ref: 'Company' }
});


export default mongoose.model('Employee', EmployeeSchema);