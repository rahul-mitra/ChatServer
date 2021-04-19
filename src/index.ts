import { userdetails, clientList } from './dummyData';
import express from 'express';
import { Socket, ServerOptions } from 'socket.io';
import http from 'http';
import SocketIO from 'socket.io';
import { CorsOptions } from 'cors';
import cors from 'cors';
import * as nodeMailer from 'nodemailer'
import SocketHandler from './socketEvents';
import { config } from './config';
import Mail from 'nodemailer/lib/mailer';
const port:any = 3000;
const host = "0.0.0.0";
const SocketOptions: ServerOptions | any = {
    transports: ["websocket"],
    allowUpgrades: false
}
const options: CorsOptions = {
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'X-Access-Token',
    ],
    credentials: true,
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    origin: "*",
    preflightContinue: false,
};
const app = express();
app.use(cors(options))
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: 1024 * 1024, type: "*" }));
const server = http.createServer(app);
// const io:SocketIO.Server = new SocketIO.Server(server,SocketOptions)
new SocketHandler(server, SocketOptions);
app.get('/', (req, res) => {
    res.send(['The sedulous hyena ate the antelope!']);
});

app.post("/login", (req, res) => {
    console.log(req.body);
    var response = { message: "user validated", token: "12345", success: true }
    var errorresponse = { message: "incorrect details", success: false }
    for (const key in clientList) {
        if (Object.prototype.hasOwnProperty.call(clientList, key)) {
            const element = clientList[key];
            if (element.userName == req.body.userName && element.password == req.body.password) {
                res.send(response);
                return;
            }
        }
    }
    res.send(errorresponse);
});



server.listen(process.env.PORT || port, () => {

    console.log(`server is listening on port ${port}`);
});