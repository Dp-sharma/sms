import mongoose from 'mongoose';

const { Schema } = mongoose;

const Teacher_data_schema = new Schema({
    classTeacher: {
        number: { type: Number, required: true },
        section: { type: String, required: true }
    },
    TeacherData: [{
        name: { type: String, required: true },
        Subject: { type: String, required: true }
    }]
});





const Teacher_data = mongoose.models["Teacher_data"] || mongoose.model('Teacher_data', Teacher_data_schema);
export default Teacher_data;