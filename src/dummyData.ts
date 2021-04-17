import { User } from "./Message"

export const clientList:Array<userdetails>= [
    {
        userName:"rahul1991mitra@gmail.com",
        password:"12345"
    },
    {
        userName:"rahulmitra230@gmail.com",
        password:"12345"
    },
    {
        userName:"rahul.mitra@innowise.us",
        password:"12345"
    },
    {
        userName:"rahulmitra691@gmail.com",
        password:"12345"
    }
]

export const UserList:Array<User>= [
    {
        userName:"rahul1991mitra@gmail.com"
    },
    {
        userName:"rahulmitra230@gmail.com"
    },
    {
        userName:"rahul.mitra@innowise.us"
    },
    {
        userName:"rahulmitra691@gmail.com"
    }
]

export interface userdetails{
    userName:string,
    password:string
}