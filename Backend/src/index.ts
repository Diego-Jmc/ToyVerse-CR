import express, { Request, Response } from "express";
import {pool} from './db_connection/db';

const app = express();
const PORT = 3000;

app.use(express.json());


app.get("/testDb", async (req: Request, res: Response) => {
  const [result] = await pool.query("SELECT * FROM personajes");
  res.send(result); 
});

app.get("/",(req: Request, res: Response) => {
  res.send("TOYVERSE CR");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});




