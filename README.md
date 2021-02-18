# Wstęp do grafiki komputerowej - projekt
Celem projektu jest zaimplementowanie systemu realizującego wybrane podstawowe operacje w przykładowej bazie Northwind w wybranej technologii.

## Uczestnicy
3. Grzegorz Zacharski (gzacharski@student.agh.edu.pl)

## Dokumentacja
Dokumentacja w opracowaniu [Wiki](#link).

## Technologie
* Front-end: Javascipt, Three.js, Cannon.js, Mixamo
* Back-end: Node.js oraz Express.js (REST API)
* Konteneryzacja: Docker

## Uruchamianie i Zamykanie
1. Do uruchomienia potrzebny jest Docker.
1. Wystartowanie w kontenerze Dockerowym:
   ```shell script
   docker-compose up -d
   ```
1. Aplikacja będzie dostępna pod adresem http://localhost:3000
1. Usunięcie kontenera
   ```shell script
   docker-compose down
   ```