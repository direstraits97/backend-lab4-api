# Autentisering i webbtjänst
Detta repo innehåller filer för ett API som lagrar användare med användarnamn och lösenord. Det är byggt med Express och CORS är implementerat för att tillåta anrop mellan olika domäner. När det kommer till CRUD är GET och POST möjliga.

## Installation
För lagring använder API:et better-sqlite3. Installera nödvändiga npm-paket som finns i kodfilerna, och kör sedan skriptet install.js med "npm run install". En tabell kommer skapas med samma struktur som exemplet nedan:
| id | username | password | created |
|----|----------|----------|---------|
| 1  | användarnamn | lösenord | datum och tid |

## Användning
Nedan beskrivs hur API:et kan anropas:

| Metod | Ändpunkt | Beskrivning |
| ----- | -------- | ----------- |
| GET | /api/protected | Hämtar en skyddad route som valideras med token. |
| POST | /api/login | Efter validering loggas användare in med en token. |
| POST | /api/register | Skapar en ny användare som lagras i databasen med hashat lösenord. |

## Länk till video-demo
https://youtu.be/5-3iTJHzciw
