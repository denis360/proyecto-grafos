# Proyecto Grafos
## Requerimientos

Para poner en marcha parte de este proyecto tendras que tener instalado:

* [Python](https://www.python.org/downloads/) Para el servidor de datos

* [Node.js](https://nodejs.org/en/download/) Para el servidor cliente

Suponiendo que ya está instalado procedemos a comenzar.

## Comenzando

Como cuando se installa python y node.js viene con una herramienta adicional **llamada administrador de paquetes**.

Para python `pip` y para node.js `npm`, instalamos depencencias abriendo una terminal/consola/cmd de comandos y pegamos:

```
pip install networkx matplotlib
```

Para poner en marcha el servidor que tiene los datos del grafo tenemos que crear un entorno virtual con python ya que utiliza Flask:

```
cd app-web\server
python -m venv venv/
```

Luego activa el entorno virtual, instalar dependencias virtuales y poner en marcha el servidor:
```
source venv/bin/activate
pip install flask flask_cors
flask --debug run
```
Y hasta aqui ya tenemos el servidor de datos corriendo en nuestra máquina local.

Ahora levantaremos la aplicación cliente que contiene la vista grafica para pedir/mostrar datos.
```
cd ..
cd client
npm install
npm run build
npm start
```

Ahora existen 2 servidores corriendo en tu máquina local, uno en el puerto 8080 y otro en el puerto 3000 pero el mas importante es el que estan en [http://localhost:3000](http://localhost:3000/)