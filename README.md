# Network Scanner

This is a project that allows scanning a local network for hosts, discovering their open ports, and obtaining information about them. Additionally (WIP), it allows searching for known vulnerabilities in each of the found hosts.

## Instalación

1. Clone this repository on your local machine.
2. Run npm install to install the necessary dependencies.
3. Install nmap on the local machine.
4. Run the main network scanning process with `npm start`.

## Configuration

Before running the application, it is necessary to configure the following environment variables in a .env file at the root of the project:

```
SHODAN_API_KEY=XXXXXXXX
INTERVAL_MINUTES=3
```

SHODAN_API_KEY: Shodan API key to access the vulnerability API.
INTERVAL_MINUTES: time interval in minutes between vulnerability checks.

## Usage
The main network scanning process runs automatically when executing the npm start command.

## Contributions
Contributions are welcome. If you have any ideas or suggestions to improve the project, please open an issue or a pull request in this repository.
