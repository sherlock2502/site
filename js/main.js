import { reviews } from "./reviews.js";
import { works } from "./works.js";

const FORM_URL = "https://formspree.io/f/maeeedkl";

const workList = document.querySelector("#work-list");
const workEmpty = document.querySelector("#work-empty");
const reviewList = document.querySelector("#review-list");
const reviewEmpty = document.querySelector("#review-empty");

if (!workList || !workEmpty || !reviewList || !reviewEmpty) {
  throw new Error("Brakuje sekcji na stronie.");
}

if (!Array.isArray(works) || works.length === 0) {
  workEmpty.hidden = false;
} else {
  for (const [index, work] of works.entries()) {
    workList.append(renderWork(work, index));
  }
}

if (!Array.isArray(reviews) || reviews.length === 0) {
  reviewEmpty.hidden = false;
} else {
  for (const review of reviews) {
    reviewList.append(renderReview(review));
  }
}

setupForm();
const lightbox = createLightbox();

function renderWork(work, index) {
  const article = document.createElement("article");
  article.className = index === 0 ? "work work--feature" : "work";

  const card = document.createElement("div");
  card.className = "work-link";
  const photos = photosOf(work);

  if (photos.length > 0) {
    const shots = document.createElement("div");
    shots.className = "work-shots";
    const phones = document.createElement("div");
    phones.className = "shot-phones";
    photos.forEach((photo, photoIndex) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = photo.kind === "phone" ? "shot-button shot-button--phone" : "shot-button";
      button.setAttribute("aria-label", `Powiększ: ${photo.alt}`);
      button.append(makeImage(photo.src, photo.alt, photo.kind === "phone" ? "shot-phone" : "shot-desk"));
      button.addEventListener("click", () => lightbox.open(photos, photoIndex));
      if (photo.kind === "phone") phones.append(button);
      else shots.append(button);
    });
    if (phones.childElementCount > 0) shots.append(phones);
    card.append(shots);
  }

  const row = document.createElement("div");
  row.className = "work-row";

  const indexEl = document.createElement("p");
  indexEl.className = "work-index";
  indexEl.textContent = String(index + 1).padStart(2, "0");

  const body = document.createElement("div");
  body.className = "work-body";

  const top = document.createElement("div");
  top.className = "work-top";

  const title = document.createElement("h3");
  title.className = "work-title";
  title.textContent = work.title;

  const meta = document.createElement("p");
  meta.className = "work-meta";
  meta.textContent = [work.place, work.year].filter(Boolean).join(" · ");

  top.append(title);
  if (meta.textContent) top.append(meta);

  const summary = document.createElement("p");
  summary.className = "work-summary";
  summary.textContent = work.summary;

  body.append(top, summary);

  if (Array.isArray(work.tags) && work.tags.length > 0) {
    const tags = document.createElement("ul");
    tags.className = "tags";
    for (const tag of work.tags) {
      const item = document.createElement("li");
      item.textContent = tag;
      tags.append(item);
    }
    body.append(tags);
  }

  const go = document.createElement(work.url ? "a" : "p");
  go.className = work.url ? "work-go" : "work-go work-go--soon";
  go.textContent = work.url ? "Otwórz stronę" : "Wkrótce";
  if (work.url) {
    go.href = work.url;
    go.target = "_blank";
    go.rel = "noopener noreferrer";
  }

  row.append(indexEl, body, go);
  card.append(row);
  article.append(card);
  return article;
}

function photosOf(work) {
  const photos = [];
  if (work.image) {
    photos.push({ src: work.image, alt: work.imageAlt || work.title, kind: "desk" });
  }
  if (Array.isArray(work.mobile)) {
    for (const shot of work.mobile) {
      photos.push({ src: shot.src, alt: shot.alt || work.title, kind: "phone" });
    }
  }
  return photos;
}

function createLightbox() {
  const dialog = document.createElement("dialog");
  dialog.className = "lightbox";

  const img = document.createElement("img");
  img.alt = "";

  const close = document.createElement("button");
  close.type = "button";
  close.className = "lightbox-close";
  close.setAttribute("aria-label", "Zamknij zdjęcie");
  close.textContent = "×";

  const prev = document.createElement("button");
  prev.type = "button";
  prev.className = "lightbox-nav lightbox-nav--prev";
  prev.setAttribute("aria-label", "Poprzednie zdjęcie");
  prev.textContent = "‹";

  const next = document.createElement("button");
  next.type = "button";
  next.className = "lightbox-nav lightbox-nav--next";
  next.setAttribute("aria-label", "Następne zdjęcie");
  next.textContent = "›";

  dialog.append(close, prev, img, next);
  document.body.append(dialog);

  let photos = [];
  let index = 0;

  function show(nextIndex) {
    index = (nextIndex + photos.length) % photos.length;
    img.src = photos[index].src;
    img.alt = photos[index].alt;
    const single = photos.length < 2;
    prev.hidden = single;
    next.hidden = single;
  }

  close.addEventListener("click", () => dialog.close());
  prev.addEventListener("click", () => show(index - 1));
  next.addEventListener("click", () => show(index + 1));
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      show(index + 1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      show(index - 1);
    }
  });

  return {
    open(list, start) {
      photos = list;
      show(start);
      dialog.showModal();
    },
  };
}

function renderReview(review) {
  const item = document.createElement("article");
  item.className = "review";

  const text = document.createElement("p");
  text.className = "review-text";
  text.textContent = review.text;

  const name = document.createElement("p");
  name.className = "review-name";
  name.textContent = [review.name, review.place].filter(Boolean).join(" · ");

  item.append(text, name);
  return item;
}

function makeImage(src, alt, className) {
  const img = document.createElement("img");
  img.src = src;
  img.alt = alt;
  img.className = className;
  return img;
}

function setupForm() {
  const dialog = document.querySelector("#zapytanie");
  const form = document.querySelector("#order-form");
  const status = document.querySelector("#form-status");
  if (!(dialog instanceof HTMLDialogElement) || !form || !status) return;

  for (const button of document.querySelectorAll("[data-open-form]")) {
    button.addEventListener("click", () => {
      status.textContent = "";
      status.dataset.state = "";
      dialog.showModal();
      form.querySelector("input")?.focus();
    });
  }

  form.querySelector("[data-close-form]")?.addEventListener("click", () => {
    dialog.close();
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const contact = String(data.get("contact") || "").trim();
    const message = String(data.get("message") || "").trim();
    if (!name || !contact || !message) return;

    const submit = form.querySelector('[type="submit"]');
    if (submit instanceof HTMLButtonElement) submit.disabled = true;
    status.dataset.state = "";
    status.textContent = "Wysyłam…";

    const payload = {
      Imię: name,
      "Sposób kontaktu": contact,
      Opis: message,
      _subject: "Nowe zapytanie ze strony",
    };
    if (contact.includes("@")) payload._replyto = contact;

    try {
      const response = await fetch(FORM_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(String(response.status));
      form.reset();
      status.textContent = "Wysłane. Odezwę się.";
    } catch {
      status.dataset.state = "error";
      status.textContent = "Nie udało się wysłać. Spróbuj jeszcze raz albo napisz na yevhen.kasyan@gmail.com.";
    } finally {
      if (submit instanceof HTMLButtonElement) submit.disabled = false;
    }
  });
}
