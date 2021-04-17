import express from 'express';
import { Socket, ServerOptions } from 'socket.io';
import http from 'http';
import SocketIO from 'socket.io';
import { CorsOptions } from 'cors';
import cors from 'cors';
import { User, Message } from './Message'
import { clientList, UserList } from './dummyData';
export class ExtendedMessage {
    message: Message;
    isGroupChat: boolean;
    roomID: string;
    usersList: Array<User>;
    constructor(message: Message,
        isGroupChat: boolean,
        roomID: string,
        usersList: Array<User>) {
        this.isGroupChat = isGroupChat; this.roomID = roomID; this.message = message; this.usersList = usersList
    }
}

class SocketHandler {
    IO: SocketIO.Server;


    constructor(httpServer: http.Server, socketOptions: any) {
        this.IO = new SocketIO.Server(httpServer, socketOptions)
        this.startSocketServer();
        // console.log(this.IO);

    }

    public startSocketServer() {
        this.IO.use(async (socket, next) => {
            let handshake = socket.handshake;
            // console.log(handshake);
            if (handshake.query.userName != "not set") {
                await socket.join(handshake.query.userName)
                console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-")
                console.log("connection succeded user joined room ", handshake.query.userName);
                socket.data = { userName: handshake.query.userName }
                console.log(socket.rooms, socket.data);
                console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-")
                next();
            }
            else {
                console.log("Socket did not sent a valid userName ", handshake.query.userName);
                next(new Error("unauthorized"))
            }
        });
        this.IO.on("connection", socket => {
            console.log("Client Connected |%s| on server has rooms |%s| username |%s|", socket.id, socket.rooms, socket.data.userName);
            this.IO.to(socket.id).emit("serverMessage", "Connected to server!");
            var listOfUsers: Array<User> = new Array<User>();
            for (const [_, eachSocket] of this.IO.of("/").sockets) {
                listOfUsers.push({ userName: eachSocket.data.userName });
            }
            console.log("sending users list to all clients ", listOfUsers," due to new added user ",socket.data.userName);
            this.IO.emit("getUsers", listOfUsers);


            socket.on("disconnect", (reason) => {
                console.log("Client disconnected |%s| reason |%s| username |%s|", socket.id, reason, socket.data.userName);
            });
            socket.on("testServer", (data) => {
                console.log("Client sent data on test server ", data);
                this.IO.to(socket.id).emit("testServer", "Thanks for sending data have it back now " + data);
            });
            socket.on("message", (message: Message, recipient: User, isGroupChat: boolean = false, roomID?: string, usersList?: Array<User>) => {
                var extMessage = new ExtendedMessage(message, isGroupChat, roomID, usersList);
                if (!isGroupChat) {

                    this.IO.to(recipient.userName).emit("recievedMessage", extMessage);
                }
                else {
                    this.IO.to(roomID).emit("recievedMessage", extMessage);
                }
            });
            socket.on("joinGroup", (roomIDhash: string, userList: Array<User>) => {
                socket.join(roomIDhash);
                try {
                    for (const [_, eachSocket] of this.IO.of("/").sockets) {
                        // console.log("Checking socket ", eachSocket.data, " inside ", userList, " result is |%s|", userList.includes({ userName: eachSocket.data.userName }));
                        for (const user of userList) {
                            // console.log(user," == ",)
                            if (user.userName == eachSocket.data.userName) {
                                eachSocket.join(roomIDhash);
                            }
                        }
                    }
                    this.IO.to(socket.id).emit("serverMessage", "Joined a group chat!");
                } catch (error) {
                    console.log("Join room error [%s] on socket |%s| socketData is [%s]", error, socket, JSON.stringify(socket.data, null, 2));
                }
            });
            socket.on("leaveGroup", (roomIDhash: string) => {
                socket.leave(roomIDhash);
                this.IO.to(socket.id).emit("serverMessage", "Left a group chat!");
            });
            socket.on("getUsers", () => {
                var listOfUsers: Array<User> = new Array<User>();
                for (const [_, eachSocket] of this.IO.of("/").sockets) {
                    listOfUsers.push({ userName: eachSocket.data.userName });
                }
                console.log("sending users list ", listOfUsers);
                this.IO.to(socket.id).emit("getUsers", listOfUsers);
            });
        });
    }

}

export default SocketHandler;