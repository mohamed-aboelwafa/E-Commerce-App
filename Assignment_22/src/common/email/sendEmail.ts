
import nodemailer from "nodemailer";


export const sendEmail = async({to, subject, html}:{to:string, subject:string, html:string})=>{
    const transporter = nodemailer.createTransport({
        host: "smtp.example.com",
        port: 587,
        secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
        service: "gmail",
        auth: {
            user: "mohameddotmail1630@gmail.com",
            pass: "rmruqvfjweonqrac",
        },
    });


    try {
    const info = await transporter.sendMail({
        from: '"Example Team" <team@example.com>', // sender address
        to, // list of recipients
        subject, // subject line
        html, // HTML body
    });

    console.log("Message sent: %s", info.messageId);

    } catch (err) {
        console.error("Error while sending mail:", err);
    }
}