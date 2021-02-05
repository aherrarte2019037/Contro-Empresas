import dotenv from 'dotenv'
import express from 'express';
const app = express();

//Configurar Servidor
app.use( express.json() );
app.use( express.urlencoded({ extended: true }) );
dotenv.config();

app.get('/', (req, res) => {
    res.send(`Servidor en el puerto ${process.env.SERVER_PORT}`);
});

//Iniciar Servidor
app.listen( process.env.SERVER_PORT , () => {
    console.log(`Servidor en el puerto ${process.env.SERVER_PORT}`);
});