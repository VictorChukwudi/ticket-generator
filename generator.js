import bwip from "bwip-js"
import path from "path"
import { fileURLToPath } from "url"
import sharp from "sharp"
import TextToSvg from "text-to-svg"


const  __filename= fileURLToPath(import.meta.url)
const __dirname=path.dirname(__filename)

// console.log(__dirname)

const testToSvg= TextToSvg.loadSync("./fonts/PlayfairDisplay-Regular.ttf")

const generateText= async(text, fontSize)=>{
    try {
        const svg= testToSvg.getSVG(text, {
            fontSize: fontSize,
            anchor: "top",
            attributes:{ fill: "black"}
        })
        return Buffer.from(svg)
    } catch (err) {
        console.error("Error generating svg:", err)
        throw err
    }
}


const generateQrcode= async(text)=>{
    let qrcodeBuffer = await bwip.toBuffer({
        bcid:"qrcode",
        text,
        scale: 7.5,
    })

    return qrcodeBuffer
}

const createTicket= async(event, outputPath)=>{
    const {title, date, address, price, ticketId}=event
    const templatePath= path.join(__dirname,"./ticket3.png")

    const ticket = sharp(templatePath)

    try {
          const qrcodeImageBuffer = await generateQrcode(ticketId)

          const titleBuffer= await generateText(title, 120)

          const dateBuffer= await generateText(date, 35)

          const addressBuffer= await generateText(address, 35)

          const priceBuffer= await generateText(price, 80)

         const ticketIdBuffer= await generateText(ticketId,30)

          const qrcodeOverlay={
            input: qrcodeImageBuffer,
            top: 60,
            left: 1547
          }

          const titleOverlay={
            input: titleBuffer,
            top: 115,
            left: 132
          }

          const dateOverlay={
            input: dateBuffer,
            top: 495,
            left: 132
          }

          const addressOverlay={
            input: addressBuffer,
            top: 495,
            left: 660
          }

          const priceOverlay={
            input: priceBuffer,
            top: 510,
            left: 1633
          }

          const ticketIdOverlay={
            input: ticketIdBuffer,
            top:455,
            left:1560,
            
          }

        // const idOverlay=  sharp(ticketIdBuffer).rotate(-90,{background:{r:0,g:0,b:0}})

          await ticket
            .composite([
                titleOverlay,
                dateOverlay,
                addressOverlay,
                priceOverlay,
                qrcodeOverlay,
                // idOverlay
                ticketIdOverlay
            ])
            .toFile(outputPath)
          
    } catch (error) {
    console.error("Error when creating ticket:", error)
    throw error   
    }
}

createTicket({
    title:" In-House Party",
    date: "10 April, 2024",
    address:" 12 Anywhere Street, Nowhere, Somewhere.",
    price:"$50",
    ticketId:"6479044567892hfdjkd9876"
}, `./output/new-ticket/${Date.now()}.png`)