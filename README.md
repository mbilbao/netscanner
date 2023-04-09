# Network Scanner

Este es un proyecto que permite escanear una red local en busca de hosts, descubrir sus puertos abiertos y obtener información sobre ellos. Además, permite buscar vulnerabilidades conocidas en cada uno de los hosts encontrados.

## Instalación

1. Clona este repositorio en tu máquina local.
2. Ejecuta `npm install` para instalar las dependencias necesarias.
3. Instala nmap en la máquina local.
5. Ejecuta el proceso principal de escaneo de red con `npm start`.

## Configuración

Antes de ejecutar la aplicación, es necesario configurar las siguientes variables de entorno en un archivo .env en la raíz del proyecto:

```
SHODAN_API_KEY=XXXXXXXX
INTERVAL_MINUTES=3
```

SHODAN_API_KEY: clave de API de Shodan para acceder a la API de vulnerabilidades.
INTERVAL_MINUTES: intervalo de tiempo en minutos entre las verificaciones de vulnerabilidades.



## Uso

El proceso principal de escaneo de red se ejecuta automáticamente al ejecutar el comando `npm start`.


## Contribuciones

Las contribuciones son bienvenidas. Si tienes alguna idea o sugerencia para mejorar el proyecto, por favor, abre un issue o una pull request en este repositorio.

## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo LICENSE para más información.
