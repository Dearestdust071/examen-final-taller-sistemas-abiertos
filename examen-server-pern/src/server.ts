import express from "express";
import router from "./router";
import db from "./config/db";
import swaggerSpec, { swaggerUiOptions } from "./config/swagger";
import swaggerUi from 'swagger-ui-express';
import cors from 'cors'

export async function connectionDB() {
    try {
        await db.authenticate()
        db.sync() 
        console.log("Conexion exitosa"); 
    } catch (error) {
        console.log("Hubo un error al conectar");
    }   
}
connectionDB()
const server = express()

server.use(cors({
  origin: '*', // o '*' si estás en desarrollo
  credentials: true
}))
server.use(express.json())
server.use('/api',router)
server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions))
export default server
