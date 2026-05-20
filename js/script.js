console.log("blub");

async function bestellen (bestell_url) {
 try {
 const bestellung = await fetch(bestell_url);
 return await bestellung.json();
 } catch (e) {
 console.error(e);
 return [];
 }
}
let url = 'https://restcountries.com/v3.1/name/italy';
const bestellung = await bestellen(url);

const country = bestellung[0];
console.log(country);

const titel = document.querySelector(".titel h1");
titel.textContent = country.translations.deu.common.toUpperCase();

const fahrseite = document.querySelector(".auto p")
fahrseite.textContent = country.car.side;
if (fahrseite.textContent === "right") {
 fahrseite.textContent = "Rechtsverkehr";
} else {
 fahrseite.textContent = "Linksverkehr";
}

const name = document.querySelector("#name")
name.textContent = country.translations.deu.common;

const hauptstadt = document.querySelector("#hauptstadt")
hauptstadt.textContent = country.capital;

const einwohner = document.querySelector("#einwohner")
einwohner.textContent = country.population;

const zeitzone = document.querySelector("#zeitzone")
zeitzone.textContent = country.timezones;

const kennzeichen = document.querySelector("#kennzeichen")
kennzeichen.textContent = country.car.signs;

const unabhängigkeit = document.querySelector("#unabhängigkeit")
unabhängigkeit.textContent = country.independent;

const flaggeBild = document.querySelector(".flagge .card img")
flaggeBild.src = country.flags.svg;

const karte = document.querySelector(".karte #map")

    const lat = country.latlng[0];
    const lng = country.latlng[1];

    // Karte erstellen
    const map = L.map("map").setView([lat, lng], 5);

    // OpenStreetMap Tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    //   attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    // Marker
    L.marker([lat, lng])
      .addTo(map)
    //   .bindPopup(country.translations.deu.common)
      .openPopup();
