import { works } from "./works.js";

const list = document.querySelector("#work-list");
const empty = document.querySelector("#work-empty");

if (!list || !empty) {
  throw new Error("Brakuje listy prac na stronie.");
}

if (!Array.isArray(works) || works.length === 0) {
  empty.hidden = false;
} else {
  for (const [index, work] of works.entries()) {
    list.append(renderWork(work, index));
  }
}

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

  if (work.image) {
    const media = document.createElement("div");
    media.className = "work-media";
    const img = document.createElement("img");
    img.src = work.image;
    img.alt = work.imageAlt || "";
    img.width = 1440;
    img.height = 680;
    media.append(img);
    link.append(media);
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
