// import server from "./server"


// const port = process.env.PORT || 4000
// server.listen(port, ()=>{
// console.log(`Mi puerto esta escuchando en el puerto : ${port}`)
// })
import server from "./server";

import { networkInterfaces } from 'os';

const port = process.env.PORT || 4000;

const getNetworkAddress = () => {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]!) {
      // Omitir direcciones internas y no IPv4
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
};

server.listen(port, () => {
  const ip = getNetworkAddress();
  console.log(`REST API funcionando en el puerto ${port}`);
  console.log((`Documentación disponible en http://localhost:${port}/docs`));
  console.log((`\nPARA LA APP MÓVIL (src/api/books.ts):`));
  console.log((`http://${ip}:${port}/api`));
});