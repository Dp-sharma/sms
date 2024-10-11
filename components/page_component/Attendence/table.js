import React, { useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Scrollbar from 'smooth-scrollbar';

const AttendanceTable = ({ records }) => {
  if (!records || records.length === 0) {
    return <p>No attendance records available.</p>;
  }

  useEffect(() => {
    // Ensure Scrollbar is initialized only on client-side and after DOM is ready
    if (typeof window !== 'undefined') {
      const scrollbar = Scrollbar.init(document.querySelector('.all'), {
        damping: 0.1, // Customize damping for smoother scroll
        renderByPixels: true, // Improve performance on certain devices
      });
      return () => {
        scrollbar.destroy(); // Cleanup on component unmount
      };
    }
  }, []);

  const generatePDF = () => {
    const pdf = new jsPDF('landscape'); // Set to landscape mode
    const tableColumn = ["Roll Number", "Name", "Status"];
    const tableRows = [];

    records.forEach(record => {
      const rowData = [record.rollNo, record.name, record.status];
      tableRows.push(rowData);
    });

    pdf.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      margin: { top: 10 },
      styles: { fontSize: 10 },
      pageBreak: 'auto', // Automatically add a page break when necessary
      rowPageBreak: 'auto', // Ensure that rows split correctly between pages
      bodyStyles: { valign: 'top' },
      rowStyles: (row, index) => ({ minCellHeight: 10 }), // Ensure minimum row height
      didDrawPage: (data) => {
        // Limit to 10 rows per page
        if (data.cursor.y >= pdf.internal.pageSize.getHeight() - 30) {
          pdf.addPage();
          data.cursor.y = 20; // Reset the Y position
        }
      },
    });

    return pdf.output('blob');
  };

  const downloadPDF = () => {
    const pdfBlob = generatePDF();
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'attendance.pdf';
    link.click();
    URL.revokeObjectURL(url);
  };

  const sharePDF = async () => {
    const pdfBlob = generatePDF();
    const url = URL.createObjectURL(pdfBlob);

    try {
      // Create a File object
      const file = new File([pdfBlob], 'attendance.pdf', { type: 'application/pdf' });

      // Check if the browser supports file sharing
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Attendance Report',
          text: 'Here is the attendance report you requested.',
          files: [file],
        });
      } else {
        alert('Your browser does not support sharing files.');
      }
    } catch (error) {
      console.error('Error sharing the file:', error);
    } finally {
      // Clean up
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div>
      <div id="attendance-table" className="all overflow-y-auto" style={{ height: '50vh' }}>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Roll Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {records.map((record, index) => (
              <tr
                key={record._id}
                className={index % 2 === 0 ? 'bg-blue-50' : 'bg-white'}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {record.rollNo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {record.name}
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                  {record.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='flex justify-center'>
        <button
          onClick={downloadPDF}
          className="mt-2 mb-4 px-4 py-2 bg-blue-500 text-white rounded mr-2"
        >
          Download as PDF
        </button>
        <button
          onClick={sharePDF}
          className="mt-2 mb-4 px-4 py-2 bg-green-500 text-white rounded"
        >
          Share as PDF
        </button>
      </div>
    </div>
  );
};

export default AttendanceTable;
