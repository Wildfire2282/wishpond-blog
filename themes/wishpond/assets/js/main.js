document.documentElement.classList.replace("no-js", "js");

const hero = document.querySelector(".hero");
const wishDrop = hero?.querySelector(".wish-drop");
const animationEndTarget = hero?.querySelector(".wish-drop__animation-end");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const canHover = window.matchMedia("(hover: hover) and (pointer: fine)");

if (hero && wishDrop && animationEndTarget) {
  let autoPlayTimer;
  let initialPlayFinished = false;
  let hoverArmed = true;

  const stopHeroAnimation = () => hero.classList.remove("is-playing");
  const cancelAutoPlay = () => {
    window.clearTimeout(autoPlayTimer);
    hero.classList.remove("is-animation-pending");
  };
  const playHeroAnimation = () => {
    if (reducedMotion.matches || hero.classList.contains("is-playing")) return;
    hero.classList.remove("is-animation-pending");
    hero.classList.add("is-playing");
  };
  const scheduleAutoPlay = () => {
    if (reducedMotion.matches) return;
    hero.classList.add("is-animation-pending");
    autoPlayTimer = window.setTimeout(playHeroAnimation, 1000);
  };

  animationEndTarget.addEventListener("animationend", (event) => {
    if (event.animationName !== "ripple-six") return;
    stopHeroAnimation();
    hero.classList.add("has-played");
    initialPlayFinished = true;
  });
  animationEndTarget.addEventListener("animationcancel", stopHeroAnimation);
  if (canHover.matches) {
    wishDrop.addEventListener("pointerenter", () => {
      if (!initialPlayFinished || !hoverArmed) return;
      hoverArmed = false;
      playHeroAnimation();
    });
    wishDrop.addEventListener("pointerleave", () => {
      hoverArmed = true;
    });
  }
  const handleReducedMotionChange = (event) => {
    if (event.matches) {
      cancelAutoPlay();
      stopHeroAnimation();
      hero.classList.add("has-played");
      initialPlayFinished = true;
    }
  };
  if (reducedMotion.addEventListener) {
    reducedMotion.addEventListener("change", handleReducedMotionChange);
  } else {
    reducedMotion.addListener(handleReducedMotionChange);
  }
  if (reducedMotion.matches) {
    hero.classList.add("has-played");
    initialPlayFinished = true;
  } else {
    scheduleAutoPlay();
  }
}

const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

const setNavOpen = (isOpen) => {
  navToggle?.setAttribute("aria-expanded", String(isOpen));
  navToggle?.setAttribute("aria-label", isOpen ? "关闭菜单" : "打开菜单");
  if (navToggle) navToggle.querySelector(".nav-toggle__label").textContent = isOpen ? "关闭" : "菜单";
  siteNav?.classList.toggle("is-open", isOpen);
};

navToggle?.addEventListener("click", () => setNavOpen(navToggle.getAttribute("aria-expanded") !== "true"));
siteNav?.addEventListener("click", (event) => {
  if (event.target.closest("a")) setNavOpen(false);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navToggle?.getAttribute("aria-expanded") === "true") {
    setNavOpen(false);
    navToggle.focus();
  }
});

const progress = document.querySelector(".reading-progress");
const articleContent = document.querySelector(".article-content");
if (articleContent && progress) {
  let framePending = false;
  const updateProgress = () => {
    const start = articleContent.offsetTop;
    const end = start + articleContent.offsetHeight - window.innerHeight;
    const value = end > start ? (window.scrollY - start) / (end - start) : 1;
    progress.style.transform = `scaleX(${Math.min(1, Math.max(0, value))})`;
    framePending = false;
  };
  const requestProgressUpdate = () => {
    if (!framePending) {
      framePending = true;
      requestAnimationFrame(updateProgress);
    }
  };
  updateProgress();
  window.addEventListener("scroll", requestProgressUpdate, { passive: true });
  window.addEventListener("resize", requestProgressUpdate);
  document.fonts?.ready.then(requestProgressUpdate);
}

const searchInput = document.querySelector("#search-input");
const searchResults = document.querySelector("#search-results");
const searchStatus = document.querySelector("#search-status");

if (searchInput && searchResults && searchStatus) {
  let index = [];
  let debounceTimer;
  const resultList = searchResults.querySelector("ul");
  const normalize = (value) => String(value || "").toLocaleLowerCase("zh-CN");
  const prepareItem = (item) => {
    if (!item || typeof item !== "object") return null;
    const url = String(item.url || "");
    if (!url.startsWith("/") || url.startsWith("//")) return null;
    const topics = Array.isArray(item.topics) ? item.topics.filter((value) => typeof value === "string") : [];
    const tags = Array.isArray(item.tags) ? item.tags.filter((value) => typeof value === "string") : [];
    return {
      title: String(item.title || ""),
      url,
      description: String(item.description || ""),
      date: String(item.date || ""),
      dateISO: String(item.dateISO || ""),
      topics,
      titleText: normalize(item.title),
      taxonomyText: normalize([...topics, ...tags].join(" ")),
      bodyText: normalize(`${item.description || ""} ${item.content || ""}`),
    };
  };

  const renderResults = () => {
    const terms = [...new Set(normalize(searchInput.value.trim()).split(/\s+/).filter(Boolean))].slice(0, 20);
    resultList.replaceChildren();
    if (!terms.length) {
      searchStatus.textContent = "输入关键词开始搜索。";
      return;
    }

    const matches = index.map((item) => {
      let score = 0;
      const matched = terms.every((term) => {
        if (item.titleText.includes(term)) { score += 8; return true; }
        if (item.taxonomyText.includes(term)) { score += 5; return true; }
        if (item.bodyText.includes(term)) { score += 1; return true; }
        return false;
      });
      return matched ? { item, score } : null;
    }).filter(Boolean).sort((a, b) => b.score - a.score);

    searchStatus.textContent = matches.length
      ? `找到 ${matches.length} 篇相关记录${matches.length > 20 ? "，显示前 20 篇" : ""}。`
      : "没有找到相关记录。";

    const fragment = document.createDocumentFragment();
    matches.slice(0, 20).forEach(({ item }) => {
      const listItem = document.createElement("li");
      const link = document.createElement("a");
      link.className = "search-result";
      link.href = item.url;

      const heading = document.createElement("h2");
      heading.textContent = item.title;
      const description = document.createElement("span");
      description.textContent = item.description;
      const meta = document.createElement("small");
      const time = document.createElement("time");
      time.dateTime = item.dateISO;
      time.textContent = item.date;
      meta.append(time);
      if (item.topics.length) meta.append(` · ${item.topics.join(" · ")}`);

      link.append(heading, description, meta);
      listItem.append(link);
      fragment.append(listItem);
    });
    resultList.replaceChildren(fragment);
  };

  const searchController = new AbortController();
  const searchTimeout = window.setTimeout(() => searchController.abort(), 10000);
  fetch(document.body.dataset.searchIndex, { signal: searchController.signal })
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then((data) => {
      window.clearTimeout(searchTimeout);
      if (!Array.isArray(data)) throw new TypeError("Invalid search index");
      index = data.map(prepareItem).filter(Boolean);
      searchInput.disabled = false;
      searchStatus.textContent = "输入关键词开始搜索。";
      if (searchInput.value.trim()) renderResults();
    })
    .catch(() => {
      window.clearTimeout(searchTimeout);
      searchInput.disabled = true;
      searchStatus.textContent = "搜索索引加载失败，请前往归档页浏览文章。";
    });

  searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(renderResults, 120);
  });
  document.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      searchInput.focus();
    }
  });
}
