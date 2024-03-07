import PDFDocument from "pdfkit"
import fs from "fs"

const toPdf= async(imagepath, outputpath)=>{
    const doc = new PDFDocument({layout:"landscape", size:"A5"})
    
    try {
        doc.pipe(fs.createWriteStream(outputpath));
    doc.image(imagepath, {
        fit: [480, 250],
        align: 'center',
        valign: 'center'
      });

    doc.end()
    } catch (error) {
        console.error("Error when converting to pdf:", error)
        throw error
    }
}
toPdf("./output/new-ticket/1709802156556.png", `./pdfs/ticket${Date.now()}.pdf`)
