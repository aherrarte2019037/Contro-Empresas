import Pdf from 'pdfkit';
import fs from 'fs';
import { format } from 'date-fns';


function generatePdf( filename= 'Employees Report', data ) {

    const company = data[0].company;

    filename = filename.concat( ' ', format(new Date(),'dd-MM-uuuu hh-mm-ss-a'), '.pdf' )
    const doc = new Pdf({ margins: { top: 10, left: 83, right: 83, bottom: 0 }, bufferPages: true });

    doc.pipe( fs.createWriteStream(`./pdf/${filename}`) );

    doc.image( './static/pdfImg.png', -1, 0, { cover: [613, 800] });
    doc.font('./static/OpenSans-SemiBold.ttf').fillColor('white').fontSize(23).text(company.name, 40, 50);

    doc.font('Helvetica').fillColor('#2F2F2F').fontSize(12).text(company.email, { lineGap: 6, align: 'right' });
    doc.image( './static/iconMail.png', 532, 79, { cover: [13, 13] });

    doc.font('Helvetica').fillColor('#2F2F2F').fontSize(12).text('+502 36987751', { lineGap: 4.8, align: 'right' });
    doc.image( './static/iconPhone.png', 532, 98, { cover: [12, 12] });

    doc.font('Helvetica').fillColor('#2F2F2F').fontSize(12).text('Zona 4, Calle 1-3 Ave 6', { lineGap: 80, align: 'right' });
    doc.image( './static/iconLocation.png', 531, 115, { cover: [15, 15] });


    doc.font('./static/OpenSans-Light.ttf').fillColor('#2F2F2F').fontSize(22).text('Reporte', { lineGap: 10, align: 'left', characterSpacing : 1 });

    let employeesCount = 0;
    
    data.forEach ( employee =>{
        
        employeesCount++;
        const fullname = employee.firstname.concat(' ', employee.lastname);
        const age = employee.age.toString().concat(' ','años')

        doc.image( './static/iconUser.png', { cover: [20, 20] });
        doc.font('./static/OpenSans-Regular.ttf').fillColor('#575859').fontSize(12).text(fullname, { lineGap: 2, align: 'left' });
        doc.font('./static/OpenSans-Regular.ttf').fillColor('#575859').fontSize(12).text(age, { lineGap: 2, align: 'left' });
        doc.font('./static/OpenSans-Regular.ttf').fillColor('#575859').fontSize(12).text(titleClase( employee.job ), { lineGap: 2, align: 'left' });
        doc.font('./static/OpenSans-Regular.ttf').fillColor('#575859').fontSize(12).text(titleClase( employee.departament ), { lineGap: 30, align: 'left' });

        if( employeesCount%4 === 0 && employeesCount !== data.length ) {
            //doc.font('./static/OpenSans-Regular.ttf').fillColor('#575859').fontSize(9).text(format(new Date(), 'MMMM dd, uuuu hh:mm:ss:a'), 39.6, doc.page.heigth)
            doc.addPage({ margins: { top: 230, left: 38, right: 38, bottom: 0 } });
            doc.image( './static/pdfImg.png', -1, 0, { cover: [613, 800] });
        }

    });

    for (let i = 0; i < doc.bufferedPageRange().count; i++) {
        doc.switchToPage(i);
        doc.font('./static/OpenSans-Regular.ttf').fillColor('#575859').fontSize(9).text(format(new Date(), 'MMMM dd, uuuu hh:mm:ss:a'), 39.6, 750)
    }

    const response = {
        doc: doc,
        filename: filename
    }

    doc.end();
    return response;
}


function titleClase( string ) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


export default generatePdf;