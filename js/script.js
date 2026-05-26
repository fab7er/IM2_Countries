console.log("blub");

const form = document.querySelector('.suchleiste');

form.addEventListener('submit', function (auslesen){
  auslesen.preventDefault();

  const land = document.querySelector('.landSuche').value;

  if (land.length >=2) {
    window.location.href = `/index.html?land=${encodeURIComponent(land)}`;
  }
});


const params = new URLSearchParams(window.location.search);
const land = params.get("land");



async function bestellen (bestell_url) {
 try {
 const bestellung = await fetch(bestell_url);
 return await bestellung.json();
 } catch (e) {
 console.error(e);
 return [];
 }
}
let url = `https://restcountries.com/v3.1/name/${land}`;
const bestellung = await bestellen(url);

const country = bestellung[0];
console.log(country);

const titel = document.querySelector(".titel h1");
titel.textContent = country.translations.deu.common.toUpperCase();

const fahrseite = document.querySelector(".auto p")
const animation = document.querySelector(".auto lottie-player")
fahrseite.textContent = country.car.side;
if (fahrseite.textContent === "right") {
 fahrseite.textContent = "Rechtsverkehr";
} else {
 fahrseite.textContent = "Linksverkehr";
 animation.classList.add('linksverkehr');
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
if (unabhängigkeit.textContent === "true") {
 unabhängigkeit.textContent = "Ja";
} else {
 unabhängigkeit.textContent = "Nein";
}

const flaggeBild = document.querySelector(".flagge .card img")
flaggeBild.src = country.flags.svg;

flaggeBild.onload = function () {
const verhaeltnis = flaggeBild.naturalWidth / flaggeBild.naturalHeight;
if (verhaeltnis <= 1.4) {
  console.log("zu gross");
  flaggeBild.classList.add('quad');
}
else {
  console.log("passt")
}
}

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




const code = Object.keys(country.currencies)[0];
const waehrung = country.currencies[code].name;

const waehrungUmrechner = document.querySelector("#waehrungUmrechner");
waehrungUmrechner.textContent = waehrung;

const zielWaehrung = document.querySelector("b#zielWaehrung");
zielWaehrung.textContent = code;

async function bestellen2 (bestell_url) {
 try {
 const bestellung2 = await fetch(bestell_url);
 return await bestellung2.json();
 } catch (e) {
 console.error(e);
 return [];
 }
}
let url2 = `https://api.unirateapi.com/api/rates?api_key=XL89LFgeWPhfIwgPt0z3KEeZjile4bIebTJajctKWSyJ5UifiP0SZcOrNNJl7JpG&from=CHF`;
const bestellung2 = await bestellen2(url2);

const rate = bestellung2.results[code];
const umrechnung = document.querySelector("#umrechnung");
umrechnung.textContent = rate;



const chf = document.querySelector("#chf");
const fremdWaehrung = document.querySelector("#fremdWaehrung");


chf.value = 0;
fremdWaehrung.value = 0;

function getValue(input) {
  return input.value === "" ? 0 : Number(input.value);
}

function updateFromCHF() {
  const amount = getValue(chf);
  fremdWaehrung.value = amount * rate;
}

function updateFromFremd() {
  const amount = getValue(fremdWaehrung);
  chf.value = amount / rate;
}

chf.addEventListener("input", updateFromCHF);
fremdWaehrung.addEventListener("input", updateFromFremd);


