import request from "supertest"
import server from '../../server';   
import { connectionDB } from "../../server";
import db from "../../config/db";
jest.mock("../../config/db")


describe("Connect to database", ()=>{
    it("Should handle database connection error", async () =>{
        //fuerza el error 
        jest.spyOn(db, 'authenticate')
        .mockRejectedValueOnce(new Error("Hubo un error al conectar"))
        const consoleSpy = jest.spyOn(console, 'log')
        await connectionDB();
        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining("Hubo un error al conectar")
        )
    })
})