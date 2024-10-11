import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Attendance from '@/app/models/Attendence_model';
import * as XLSX from 'xlsx/xlsx.mjs';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'buffer' });

    await connectDB();
    function excelDateToJSDate(excelDate) {
      const date = new Date(Math.round((excelDate - 25569) * 86400 * 1000));
      return date;
    }
    workbook.SheetNames.forEach(async (sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);
      console.log(data);
      
      for (const record of data) {
        const {  Date: recordDate, 'Class Number': classNumber, Section, 'Student Name': name, 'Roll No': rollNo, Status } = record;
        
        const jsDate = excelDateToJSDate(recordDate);

        let attendanceRecord = await Attendance.findOne({
          date: jsDate,
          'class.number': classNumber,
          'class.section': Section.toUpperCase(),
        }).exec();

        if (!attendanceRecord) {
          attendanceRecord = new Attendance({
            date: jsDate,
            class: { number: classNumber, section: Section.toUpperCase() },
            records: [],
          });
        }

        attendanceRecord.records.push({ name, rollNo, status: Status });
        await attendanceRecord.save();
      }
    });

    return NextResponse.json({ success: true, msg: 'Attendance data uploaded successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, msg: 'Failed to upload attendance data' }, { status: 500 });
  }
}
