import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define the schema for a lecture
const LectureSchema = new Schema({
    lectureNumber: { type: Number, required: true }, // camelCase for consistency
    subject: { type: String, required: true }, // Use lower camelCase
    teacher: { type: String, required: true }
});

// Define the schema for a class
const ClassSchema = new Schema({
    number: { type: Number, required: true },
    section: { type: String, required: true }
});

// Define the main schema for lectures within a class
const LectureMainSchema = new Schema({
    lectures: [
        {
            class: { type: ClassSchema, required: true },
            lectureList: [LectureSchema] // Renamed for clarity
        }
    ]
});

// Create the model from the schema
const LectureMain = mongoose.models.LectureMain || mongoose.model('LectureMain', LectureMainSchema);

export default LectureMain;
