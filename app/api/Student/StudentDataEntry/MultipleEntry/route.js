// app/api/upload-student-data/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Student_data from '@/app/models/Student_data';
// import XLSX from 'xlsx';
import * as XLSX from 'xlsx/xlsx.mjs';

export async function POST(request) {
    try {
        await connectDB(); // Ensure DB connection
        console.log('I am workig 1');
        
        const formData = await request.formData();

        console.log('I am workig 2');
        const file = formData.get('file');
        console.log('I am workig 3');
        
        if (!file) {
            return NextResponse.json({ success: false, msg: 'No file uploaded' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(worksheet);
        console.log(data);
        
        for (let student of data) {
            console.log('I am working 4');
            // const { rollNo, name, class: { number, section }, batchYear } = student;
            // Updated destructuring
            const { rollNo, name, batchYear,school } = student;
            const number = student['class.number'];
            const section = student['class.section'];
            console.log(rollNo, name, number ,section, batchYear);
            
            if (number < 1 || number > 12 || !['A', 'B', 'C', 'D'].includes(section.toUpperCase())) {
                continue; // Skip invalid entries
            }

            let record = await Student_data.findOne({
                school,
                batchYear,
                'class.number': number,
                'class.section': section.toUpperCase()
            });

            if (record) {
                const studentExists = record.studentData.some(stu => stu.rollNo === rollNo);
                if (!studentExists) {
                    record.studentData.push({ rollNo, name });
                    await record.save();
                }
            } else {
                
                
                record = new Student_data({
                    school,
                    batchYear,
                    class: { number, section: section.toUpperCase() },
                    studentData: [{ rollNo, name }]
                });
                await record.save();
            }
        }

        return NextResponse.json({ success: true, msg: 'Student data uploaded successfully' }, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, msg: 'Error processing file' }, { status: 500 });
    }
}

export const config = {
    api: {
        bodyParser: false, // Required to handle file uploads
    },
};
