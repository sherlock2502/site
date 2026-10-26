import { reviews } from "./reviews.js";
import { works } from "./works.js";

const MAIL = "yevhen.kasyan@gmail.com";

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

function renderWork(work, index) {
  const article = document.createElement("article");
  article.className = index === 0 ? "work work--feature" : "work";

  const link = document.createElement(work.url ? "a" : "div");
  link.className = "work-link";
  if (work.url) {
    link.href = work.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", `${work.title} — otwórz stronę`);
  }

  if (work.image || work.mobile?.length) {
    const shots = document.createElement("div");
    shots.className = "work-shots";
    if (work.image) {
      shots.append(makeImage(work.image, work.imageAlt || "", "shot-desk"));
    }
    if (Array.isArray(work.mobile) && work.mobile.length > 0) {
      const phones = document.createElement("div");
      phones.className = "shot-phones";
      for (const shot of work.mobile) {
        phones.append(makeImage(shot.src, shot.alt || "", "shot-phone"));
      }
      shots.append(phones);
    }
    link.append(shots);
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

  const go = document.createElement("p");
  go.className = "work-go";
  go.textContent = work.url ? "Otwórz stronę" : "Wkrótce";

  row.append(indexEl, body, go);
  link.append(row);
  article.append(link);
  return article;
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
    const payload = {
      name: String(data.get("name") || "").trim(),
      contact: String(data.get("contact") || "").trim(),
      message: String(data.get("message") || "").trim(),
    };
    if (!payload.name || !payload.contact || !payload.message) return;

    const submit = form.querySelector('[type="submit"]');
    if (submit instanceof HTMLButtonElement) submit.disabled = true;
    status.dataset.state = "";
    status.textContent = "Wysyłam…";

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${MAIL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...payload,
          _subject: "Nowe zapytanie ze strony",
          _template: "table",
        }),
      });
      if (!response.ok) throw new Error(String(response.status));
      form.reset();
      status.textContent = "Wysłane. Odezwę się.";
      window.setTimeout(() => dialog.close(), 900);
    } catch {
      status.dataset.state = "error";
      status.textContent = "Nie wyszło z tej strony. Otwieram pocztę.";
      const body = `Imię: ${payload.name}\nKontakt: ${payload.contact}\n\n${payload.message}`;
      window.location.href = `mailto:${MAIL}?subject=${encodeURIComponent("Nowe zapytanie ze strony")}&body=${encodeURIComponent(body)}`;
    } finally {
      if (submit instanceof HTMLButtonElement) submit.disabled = false;
    }
  });
}
