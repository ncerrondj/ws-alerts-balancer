# Balanceador de Alertas con Web Sockets
## Problematica
La aplicación Caprinet hace consultas cada 3 minutos a un api principal que ejecuta y devuelve el buscado de alertas desde la base de datos, consulta que consume muchos recursos, sobre todo cuando hay muchos usuarios conectados al mismo tiempo, que pueden tener varias pestañas abiertas, lo que hace que la consulta se ejecute varias veces en un corto periodo de tiempo, lo que puede causar un cuello de botella en la base de datos.
## Descripción
Este proyecto permite que la aplicación Caprinet se conecte a un servidor de Web Sockets, el cual recopila las conexiones por usuario. <br>
De todas las conexiones de un usuario asigna uno como el padre y los demás como hijos. <br>
Ahora el Caprinet no hara la consulta al api principal cada 3 minutos, sino que le preguntara al servidor de Web Sockets si puede hacer la consulta al api princial cada 3 minutos, el cual se encargara de habilitar la consulta al api principal solo a la conexión padre del usuario (aunque muchas conexiones hijas pregunten), una vez el padre reciba la respuesta, la enviara a este API y esta se encargara de cachearla y notificar a los hijos de este usuario que pueden obtener la respuesta desde el cache (este API) sin necesidad de hacer la consulta al api principal.

## Características
- **Distribución en tiempo real**: Permite la comunicación bidireccional entre el servidor y los clientes.
- **Escalabilidad**: Capaz de manejar múltiples conexiones simultáneas por usuario.
- **Fiabilidad**: Asegura que solo una conexión por usuario realice la consulta al api principal y las demás obtengan la respuesta desde el cache.

## Requisitos
- Node.js >= 14.x
- npm >= 6.x

## Instalación
1. Clona el repositorio:
  ```bash
  git clone https://github.com/ncerrondj/ws-alerts-balancer
  ```
2. Navega al directorio del proyecto:
  ```bash
  cd ws-alerts-balancer
  ```
3. Instala las dependencias:
  ```bash
  npm install
  ```

## Uso
1. Inicia el servidor:
  ```bash
  npm start
  ```
2. Pon en el archivo contenedore.js.php del caprinet la url del servidor de Web Sockets:
  ```javascript
  const remoteUrl = 'http://localhost:40325';
  ```
## Docker
1. Construye la imagen:
  ```bash
  docker build -t ws-alerts-balancer .
  ```
2. Ejecuta el contenedor:
  ```bash
  docker run -d -p 5001:5001 -e PORT=5001  --name ws-alerts-balancer-app ws-alerts-balancer
  ```

## Licencia
Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.