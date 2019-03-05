# reaktor-2019-server

The API for Reaktor's coding exercise of 2019. Made with Express.js. Because of the POC-like nature of the app the database chosen is [Nedb](https://github.com/louischatriot/nedb), an in-memory database with MongoDB API. For a real production app there should be an actual MongoDB set up and used instead.

## Routes
 - `/emissions?year={year}&country={country}`
   - `GET` – Returns the population(s) of the given country the given year
 - `/populations?year={year}&country={country}`
   - `GET` – Returns the population(s) of the given country the given year
 - `/countries`
   - `GET` – Returns the list of all possible countries

## How to
To run the server run the following:
 - `npm install`
 - `npm start`
