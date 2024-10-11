import mongoose from 'mongoose';

const { Schema } = mongoose;

const Student_data_schema = new Schema({
    batchYear: { type: Number, required: true },
    class: {
        number: { type: Number, required: true },
        section: { type: String, required: true }
    },
    school:{
        type: String, required: true
    },
    studentData: [{
        rollNo: { type: String, required: true },
        name: { type: String, required: true }
    }]
});





const Student_data = mongoose.models["Student_data"] || mongoose.model('Student_data', Student_data_schema);
export default Student_data;