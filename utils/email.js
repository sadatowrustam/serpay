const nodemailer = require('nodemailer');
exports.sendEmail = async(options) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.mail.ru',
        port: 465,
        secure: true,
        auth: {
            user: 'rsadatow@bk.ru',
            pass: 'LSdd7rKzR0xuRqPSeT4A',
        },
    });
    const mailOptions = {
        from: `Contact-Us <rsadatow@bk.ru>`,
        to: 'rustamsadatov0@gmail.com',
        subject: 'Biri "E-commerce" administratsiýasy bilen habarlaşmak isleýär',
        text: `ADY: ${options.name},\n\n EMAIL: ${options.email}, \n\n TELEFON: ${options.phone},\n\nHATY: ${options.text}`,
    };
    await transporter.sendMail(mailOptions);
};