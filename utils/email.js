const nodemailer = require('nodemailer');
exports.sendEmail = async(options) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'rustamsadatov@gmail.com',
            pass: 'kuwat2009',
        },
    });
    const mailOptions = {
        from: `Contact-Us <rustamsadatov@gmail.com>`,
        to: 'ibragimowserdar22@gmail.com',
        subject: 'Biri "Dowrebap" administratsiýasy bilen habarlaşmak isleýär',
        text: `ADY: ${options.name},\n\nTELEFON/EMAIL: ${options.email},\n\nHATY: ${options.text}`,
    };
    await transporter.sendMail(mailOptions);
};