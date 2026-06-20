console.group("🌍 Country Explorer");
console.log("Version: 1.0");
console.log("API verbunden");
console.log("✈️ Reisepass erfolgreich validiert");
console.groupEnd();

function toTitleCase(text) {
  if (!text) return "";

  return text
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const form = document.querySelector('.suchleiste');

form.addEventListener('submit', function (auslesen){
  auslesen.preventDefault();

  const land = document.querySelector('.landSuche').value;

  if (land.length >=2) {
    window.location.href = `/html/land.html?land=${encodeURIComponent(land)}`;
  }
});


const params = new URLSearchParams(window.location.search);
const land = params.get("land");

let bestellung;
if (land) {
  const url = `https://api.restcountries.com/countries/v5?q=${land}`;
  bestellung = await bestellen(url);
}


async function bestellen (bestell_url) {
 try {
 const bestellung = await fetch(bestell_url, 
  { headers: { 'Authorization': 'Bearer rc_live_c33a9b117a494e89b8c19cc10f2a58bf' } }
);
 return await bestellung.json();
 } catch (e) {
 console.error(e);
 return [];
 }
}

// const bestellung = await bestellen(url);
// console.log(bestellung);
// const master = document.querySelector(".master");

const country = bestellung?.data?.objects?.[0];

if (!country) {
  const master = document.querySelector(".master");
  master.style.display = "none";

  const errorBox = document.createElement("div");
  errorBox.classList.add("error-box");
  errorBox.textContent =
    "Kein Land gefunden. Bitte existierendes Land eingeben.";

  document.querySelector("main").appendChild(errorBox);

  throw new Error("Country not found");
}

// console.log(country);

const titel = document.querySelector(".titel h1");
titel.textContent = country.names.translations.deu.common.toUpperCase();

const fahrseite = document.querySelector(".auto p")
const animation = document.querySelector(".auto lottie-player")
fahrseite.textContent = country.cars.driving_side;
if (fahrseite.textContent === "right") {
 fahrseite.textContent = "Rechtsverkehr";
} else {
 fahrseite.textContent = "Linksverkehr";
 animation.classList.add('linksverkehr');
}

const name = document.querySelector("#name")
name.textContent = country.names.translations.deu.common;

const hauptstadt = document.querySelector("#hauptstadt")
hauptstadt.textContent = country.capitals[0].name;

const einwohner = document.querySelector("#einwohner")
einwohner.textContent = new Intl.NumberFormat("de-CH").format(country.population);

const zeitzoneContainer = document.querySelector("#zeitzoneContainer");
const infoCard = document.querySelector(".infos .card");

if (country.timezones.length === 1) {

  zeitzoneContainer.textContent = country.timezones[0];

} else {

  const details = document.createElement("details");

  const summary = document.createElement("summary");
  summary.textContent = `${country.timezones.length} Zeitzonen`;

  const list = document.createElement("div");

  country.timezones.forEach((timezone) => {

    const p = document.createElement("p");
    p.textContent = timezone;

    list.appendChild(p);

  });

  details.appendChild(summary);
  details.appendChild(list);

  zeitzoneContainer.appendChild(details);

  infoCard.classList.add("cardEnhance");

}


const kennzeichen = document.querySelector("#kennzeichen")
kennzeichen.textContent = country.cars.signs;

const unabhängigkeit = document.querySelector("#unabhängigkeit")
unabhängigkeit.textContent = country.continents.join(", ");

const flaggeBild = document.querySelector(".flagge .card img")
flaggeBild.src = country.flag.url_svg;

flaggeBild.onload = function () {
const verhaeltnis = flaggeBild.naturalWidth / flaggeBild.naturalHeight;
if (verhaeltnis <= 1.4) {
  // console.log("zu gross");
  flaggeBild.classList.add('quad');
}
if (verhaeltnis >= 1.4) {
  // console.log("zu gross");
  flaggeBild.classList.add('weit');
}
else {
  // console.log("passt")
}
}

const sprache = document.querySelector("#sprache")
sprache.textContent = country.languages
  .map(lang => toTitleCase(lang.name))
  .join(", ");

const karte = document.querySelector(".karte #map")

    const lat = country.coordinates.lat;
    const lng = country.coordinates.lng;

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




const code = country.currencies[0].code;
const waehrung = country.currencies[0].name;

const waehrungUmrechner = document.querySelector("#waehrungUmrechner");
waehrungUmrechner.textContent = toTitleCase(waehrung);

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

