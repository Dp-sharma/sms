import mongoose from 'mongoose';

const { Schema } = mongoose;

const Teacher_data_schema = new Schema({
    classTeacher: {
        number: { type: Number, required: true },
        section: { type: String, required: true }
    },
    TeacherData: [{
        name: { type: String, required: true },
        designation: { type: String, required: true },
        contactNo: { type: String, required: true },
        email: { type: String, required: true },
        qualification: { type: String, required: true },
        dob : { type: String, required: true},
        Subject: { type: String, }
    }]
});





const Teacher_data = mongoose.models["Teacher_data"] || mongoose.model('Teacher_data', Teacher_data_schema);
export default Teacher_data;