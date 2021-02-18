# Wstęp do grafiki komputerowej - projekt
Projekt z przedmiotu Wstęp do grafiki komputerowej (AGH, WIET, 2020/2021). Projekt przedstawia prostą scenę w której możemy się poruszać postacią za pomocą klawiatury.  

## Uczestnicy
1. Grzegorz Zacharski (gzacharski@student.agh.edu.pl)

## Prezentacja
Film prezentujący aplikację dostępny pod [linkiem](https://www.youtube.com/watch?v=Hd4qvRFBTZA&feature=youtu.be&ab_channel=GrzegorzZacharski).

## Technologie
* Front-end: Javascipt, Three.js, Cannon.js, Mixamo
* Back-end: Node.js oraz Express.js (REST API)
* Konteneryzacja: Docker

## Uruchamianie i zamykanie
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