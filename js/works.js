// Nowa praca: skopiuj blok poniżej i wklej go na górę listy.
// Новая работа: скопируй блок и вставь его в начало списка.
//
// title    — nazwa
// summary  — jedno lub dwa zdania
// tags     — co jest na stronie albo jakich narzędzi użyłeś
// url      — adres. Zostaw pusty, jeśli strona jeszcze nie stoi
// year     — rok
// place    — miasto, opcjonalnie
// image    — podgląd na komputerze, opcjonalnie
// imageAlt — krótki opis obrazka
// mobile   — zrzuty z telefonu, opcjonalnie: [{ src, alt }]

export const works = [
  {
    title: "Głowa i Broda",
    summary:
      "Strona barbershopu na krakowskim Kazimierzu. Cennik, galeria realizacji, zespół i kontakt — od razu widać ofertę i jak się umówić.",
    tags: ["Cennik", "Galeria", "Zespół", "Kontakt"],
    url: "https://glowa-broda-gold-chair.lovable.app/",
    year: "2026",
    place: "Kraków",
    image: "./images/glowa-broda.jpg",
    imageAlt: "Podgląd strony głównej Głowa i Broda na komputerze",
    mobile: [
      {
        src: "./images/glowa-broda-mobile-1.jpg",
        alt: "Strona Głowa i Broda na telefonie, ekran powitalny",
      },
      {
        src: "./images/glowa-broda-mobile-2.jpg",
        alt: "Strona Głowa i Broda na telefonie, realizacje",
      },
    ],
  },
];
