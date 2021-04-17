export const config = {
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "someemail", // generated ethereal user
        pass: "somepassword", // generated ethereal password
    }
}