/**** CUSTOM SIDEBAR ****/
// Custom delimiter for Vue templates
// Refer to sidebar folder
/**** END SIDEBAR ****/

function getLangPath(lang) {
	const pathArr = window.location.pathname.split("/");
	pathArr.splice(2, 1, lang.toLowerCase());
	return pathArr.join("/");
}

function getPageLang() {
	const pathname = window.location.pathname;
	return pathname.split("/")[2];
}

function isCommunity() {
	const pathname = window.location.pathname;
	return pathname.split("/")[3] === "community";
}

document.addEventListener("DOMContentLoaded", function () {
	function closest(element, selector) {
		if (Element.prototype.closest) {
			return element.closest(selector);
		}
		do {
			if (
				(Element.prototype.matches && element.matches(selector)) ||
				(Element.prototype.msMatchesSelector &&
					element.msMatchesSelector(selector)) ||
				(Element.prototype.webkitMatchesSelector &&
					element.webkitMatchesSelector(selector))
			) {
				return element;
			}
			element = element.parentElement || element.parentNode;
		} while (element !== null && element.nodeType === 1);
		return null;
	}

	//** social share popups
	Array.prototype.forEach.call(
		document.querySelectorAll(".share a"),
		function (anchor) {
			anchor.addEventListener("click", function (e) {
				e.preventDefault();
				window.open(this.href, "", "height = 500, width = 500");
			});
		}
	);

	//** show form controls when the textarea receives focus or backbutton is used and value exists
	var commentContainerTextarea = document.querySelector(
			".comment-container textarea"
		),
		commentContainerFormControls = document.querySelector(
			".comment-form-controls, .comment-ccs"
		);

	if (commentContainerTextarea) {
		commentContainerTextarea.addEventListener(
			"focus",
			function focusCommentContainerTextarea() {
				commentContainerFormControls.style.display = "block";
				commentContainerTextarea.removeEventListener(
					"focus",
					focusCommentContainerTextarea
				);
			}
		);

		if (commentContainerTextarea.value !== "") {
			commentContainerFormControls.style.display = "block";
		}
	}

	//** Expand Request comment form when Add to conversation is clicked
	var showRequestCommentContainerTrigger = document.querySelector(
			".request-container .comment-container .comment-show-container"
		),
		requestCommentFields = document.querySelectorAll(
			".request-container .comment-container .comment-fields"
		),
		requestCommentSubmit = document.querySelector(
			".request-container .comment-container .request-submit-comment"
		);

	if (showRequestCommentContainerTrigger) {
		showRequestCommentContainerTrigger.addEventListener(
			"click",
			function () {
				showRequestCommentContainerTrigger.style.display = "none";
				Array.prototype.forEach.call(
					requestCommentFields,
					function (e) {
						e.style.display = "block";
					}
				);
				requestCommentSubmit.style.display = "inline-block";

				if (commentContainerTextarea) {
					commentContainerTextarea.focus();
				}
			}
		);
	}

	//** Mark as solved button
	var requestMarkAsSolvedButton = document.querySelector(
			".request-container .mark-as-solved:not([data-disabled])"
		),
		requestMarkAsSolvedCheckbox = document.querySelector(
			".request-container .comment-container input[type=checkbox]"
		),
		requestCommentSubmitButton = document.querySelector(
			".request-container .comment-container input[type=submit]"
		);

	if (requestMarkAsSolvedButton) {
		requestMarkAsSolvedButton.addEventListener("click", function () {
			requestMarkAsSolvedCheckbox.setAttribute("checked", true);
			requestCommentSubmitButton.disabled = true;
			this.setAttribute("data-disabled", true);
			// Element.closest is not supported in IE11
			closest(this, "form").submit();
		});
	}

	//** Change Mark as solved text according to whether comment is filled
	var requestCommentTextarea = document.querySelector(
		".request-container .comment-container textarea"
	);

	if (requestCommentTextarea) {
		requestCommentTextarea.addEventListener("input", function () {
			if (requestCommentTextarea.value === "") {
				if (requestMarkAsSolvedButton) {
					requestMarkAsSolvedButton.innerText =
						requestMarkAsSolvedButton.getAttribute(
							"data-solve-translation"
						);
				}
				requestCommentSubmitButton.disabled = true;
			} else {
				if (requestMarkAsSolvedButton) {
					requestMarkAsSolvedButton.innerText =
						requestMarkAsSolvedButton.getAttribute(
							"data-solve-and-submit-translation"
						);
				}
				requestCommentSubmitButton.disabled = false;
			}
		});
	}

	//** Disable submit button if textarea is empty
	if (requestCommentTextarea && requestCommentTextarea.value === "") {
		requestCommentSubmitButton.disabled = true;
	}

	//** Submit requests filter form in the request list page
	Array.prototype.forEach.call(
		document.querySelectorAll(
			"#request-status-select, #request-organization-select"
		),
		function (el) {
			el.addEventListener("change", function (e) {
				e.stopPropagation();
				closest(this, "form").submit();
			});
		}
	);


	//** Submit organization form in the request page
	var requestOrganisationSelect = document.querySelector(
		"#request-organization select"
	);

	if (requestOrganisationSelect) {
		requestOrganisationSelect.addEventListener("change", function () {
			closest(this, "form").submit();
		});
	}

	//** Toggles expanded aria to collapsible elements
	Array.prototype.forEach.call(
		document.querySelectorAll(".collapsible-nav, .collapsible-sidebar"),
		function (el) {
			el.addEventListener("click", function (e) {
				e.stopPropagation();
				var isExpanded = this.getAttribute("aria-expanded") === "true";
				this.setAttribute("aria-expanded", !isExpanded);
			});
		}
	);

	//** If a section has more than 6 subsections, we collapse the list, and show a trigger to display them all
	const seeAllTrigger = document.querySelector("#see-all-sections-trigger");
	const subsectionsList = document.querySelector(".section-list");

	if (subsectionsList && subsectionsList.children.length > 6) {
		seeAllTrigger.setAttribute("aria-hidden", false);

		seeAllTrigger.addEventListener("click", function (e) {
			subsectionsList.classList.remove("section-list--collapsed");
			seeAllTrigger.parentNode.removeChild(seeAllTrigger);
		});
	}

	// Helper to get current help center locale
	function getLocale() {
		var links = window.location.href.split("/"),
			hcIndex = links.indexOf("hc"),
			links2 = links[hcIndex + 1].split("?"),
			locale = links2[0];

		return locale;
	}

//** User Navigation and Locale menu for Template V4
(function () {
  function initUserMenu() {
    const toggle = document.getElementById("user-menu-toggle");
    const menu = document.getElementById("user-menu");

    if (!toggle || !menu) return false;

    // Avoid double-binding if script runs twice
    if (toggle.dataset.bound === "true") return true;
    toggle.dataset.bound = "true";

    const openMenu = () => {
      toggle.setAttribute("aria-expanded", "true");
      menu.hidden = false;
    };

    const closeMenu = () => {
      toggle.setAttribute("aria-expanded", "false");
      menu.hidden = true;
    };

    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      expanded ? closeMenu() : openMenu();
    });

    document.addEventListener("click", (e) => {
      if (!menu.hidden && !menu.contains(e.target) && !toggle.contains(e.target)) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });

    return true;
  }

  // Run now, then retry a few times in case header renders late
  if (!initUserMenu()) {
    let tries = 0;
    const timer = setInterval(() => {
      tries += 1;
      if (initUserMenu() || tries >= 20) clearInterval(timer); // ~2s
    }, 100);
  }
})();

  (function () {
  function initDropdown(toggleId, menuId) {
    const toggle = document.getElementById(toggleId);
    const menu = document.getElementById(menuId);
    if (!toggle || !menu) return false;

    if (toggle.dataset.bound === "true") return true;
    toggle.dataset.bound = "true";

    const open = () => {
      toggle.setAttribute("aria-expanded", "true");
      menu.hidden = false;
    };

    const close = () => {
      toggle.setAttribute("aria-expanded", "false");
      menu.hidden = true;
    };

    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggle.getAttribute("aria-expanded") === "true" ? close() : open();
    });

    document.addEventListener("click", (e) => {
      if (!menu.hidden && !menu.contains(e.target) && !toggle.contains(e.target)) {
        close();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });

    return true;
  }

  function initAll() {
    initDropdown("user-menu-toggle", "user-menu");
    initDropdown("locale-menu-toggle", "locale-menu");
  }

  if (!initAll()) {
    let tries = 0;
    const timer = setInterval(() => {
      tries++;
      initAll();
      if (tries > 20) clearInterval(timer);
    }, 100);
  }
})();


	/**** END User Navigation AND Locale menu ****/

	//** Modify behavior of search input
	var input = document.getElementById("query");
	if (input) {
		input.addEventListener("input", function (event) {
			if (this.value) {
				input.style.fontStyle = "normal";
			} else {
				input.style.fontStyle = "italic";
			}
		});
	}


//***Feedback Community Behavior
  	initCommunityCheck();
});

const USER_FEEDBACK_COMMUNITY_ID = 1500000140542;

async function getUser() {
	const userResponse = await fetch("/api/v2/users/me");
	const userJson = await userResponse.json();
	return userJson;
}

async function getTopics() {
	const topicsResponse = await fetch(`/api/v2/community/topics`);
	const topicsJson = await topicsResponse.json();
	return topicsJson;
}

async function initCommunityCheck() {
	const { user } = HelpCenter;
	const { role } = user;

	$(".post-to-community").hide();
	$(".community-footer").hide();
	$(".end-user").hide();

	const userData = await getUser();
	const id = userData?.user?.id;

	if (!id) {
		if (isCommunity()) location.replace(`/hc/${currPageLang}`);
		return;
	}

	const topicsObj = await getTopics();
	const { topics } = topicsObj;

	if (!topics) {
		return;
	}

	const filtered = topics.filter(
		(topic) => topic.user_segment_id === USER_FEEDBACK_COMMUNITY_ID
	);
	const userSegmentExists = filtered.length > 0;

	const currPageLang = getPageLang();

	if (canVisitCommunity(role, userSegmentExists)) {
		$(".post-to-community").show();
		$(".community-footer").show();
		$(".end-user").show();
	}

	if (isCommunity() && !canVisitCommunity(role, userSegmentExists)) {
		location.replace(`/hc/${currPageLang}`);
	}

	return;
}

function canVisitCommunity(role, userSegmentExists) {
	if (role === "manager" || role === "agent") {
		return true;
	}

	if (userSegmentExists && role === "end_user") {
		return true;
	}

	return false;
}

/**** END Feedback Community Behavior ****/

document.addEventListener("DOMContentLoaded", function () {
	var acc = document.getElementsByClassName("accordion");
	var i;

	for (i = 0; i < acc.length; i++) {
		acc[i].addEventListener("click", function () {
			this.classList.toggle("active");
			var panel = this.nextElementSibling;
			if (panel.style.maxHeight) {
				panel.style.maxHeight = null;
				panel.style['-webkit-mask-image'] = 'linear-gradient(black 10%, transparent 80%)';
			} else {
				panel.style.maxHeight = panel.scrollHeight + "px";
				panel.style['-webkit-mask-image'] = 'linear-gradient(black 100%, transparent 80%)';
			}
		});
	}
});


//*** This adds an Chip/Badge to Articles in Announcements
function announcementTypeMetaFromLabels(article) {
  const labels = (article.label_names || []).map(l => String(l).toLowerCase());

  if (labels.includes("service-issues") || labels.includes("outage") || labels.includes("outages")) {
    return { label: "Service issue", className: "home-announcements__tag--issue" };
  }

  if (labels.includes("holiday") || labels.includes("holidays") || labels.includes("availability")) {
    return { label: "Holiday", className: "home-announcements__tag--holiday" };
  }

  if (labels.includes("notice")) {
    return {
      label: "Notice",
      className: "tag-notice"
    };
  }

  return null;
}


//*** Announcements Automation
function initAnnouncements() {
  const block = document.querySelector(".home-announcements[data-category-id]");
  const listEl = document.getElementById("home-announcements-list");
  if (!block || !listEl) return;

  const HIDE_WHEN_EMPTY = true;

  block.style.display = "";
  block.hidden = false;

  const categoryId = block.getAttribute("data-category-id");
  const locale = "en-us";

  const LIMIT_SHOW = 4;
  const LIMIT_FETCH = 50;
  const MAX_DAYS = 14;

  // Cache-buster helps after unpublish/archive changes
  const cacheBust = Date.now();

  const url =
    `/api/v2/help_center/${locale}/categories/${categoryId}/articles.json` +
    `?per_page=${LIMIT_FETCH}` +
    `&sort_by=updated_at` +
    `&sort_order=desc` +
    `&_=${cacheBust}`;

  fetch(url, {
    cache: "no-store"
  })
    .then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then((data) => {
      const articles = (data && data.articles) || [];

      const now = Date.now();
      const maxAgeMs = MAX_DAYS * 24 * 60 * 60 * 1000;

      const recent = articles.filter((a) => {
        const t = Date.parse(a.created_at);
        const isRecent = Number.isFinite(t) && now - t <= maxAgeMs;

        // Explicitly exclude anything back in draft/unpublished state
        const isPublished = a.draft !== true;

        // Defensive checks for odd/stale payloads
        const hasLink = typeof a.html_url === "string" && a.html_url.length > 0;
        const hasTitle = typeof a.title === "string" && a.title.trim().length > 0;

        return isRecent && isPublished && hasLink && hasTitle;
      });

      if (!recent.length) {
        if (HIDE_WHEN_EMPTY) {
          try {
            block.style.display = "none";
            block.hidden = true;
            listEl.innerHTML = "";
            return;
          } catch (e) {
            console.warn("[Announcements] hide failed, showing fallback message instead:", e);
          }
        }

        listEl.innerHTML =
          `<li class="home-announcements__empty">No announcements in the last 14 days.</li>`;
        return;
      }

      listEl.innerHTML = recent
        .slice(0, LIMIT_SHOW)
        .map((a, idx) => {
          const meta = announcementTypeMetaFromLabels(a);

          return `
            <li class="home-announcements__item ${idx === 0 ? "is-featured" : ""}">
              <div class="home-announcements__meta-row">
                <div class="home-announcements__meta">${formatDate(a.created_at)}</div>
              </div>
              <a class="home-announcements__link" href="${a.html_url}">
                ${escapeHtml(a.title)}
                ${meta ? `<span class="home-announcements__tag ${meta.className}">${meta.label}</span>` : ""}
              </a>
            </li>
          `;
        })
        .join("");
    })
    .catch((err) => {
      console.error("[Announcements] error:", err);
      block.style.display = "";
      block.hidden = false;
      listEl.innerHTML = `<li class="home-announcements__empty">Unable to load announcements.</li>`;
    });

  function formatDate(iso) {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
}

document.addEventListener("DOMContentLoaded", initAnnouncements);
document.addEventListener("turbolinks:load", initAnnouncements);
window.addEventListener("hashchange", initAnnouncements);

/***From Chat/Call UI - when "Start New Chat" is pressed, it opens chat widget**/
document.addEventListener("click", function (e) {
  const btn = e.target.closest(".js-open-messaging");
  if (!btn) return;

  e.preventDefault();

  // Messaging Web Widget
  if (typeof window.zE === "function") {
    try {
      // If you ever call hide() anywhere, show() first, then open().
      window.zE("messenger", "show");
      window.zE("messenger", "open"); // opens the messaging widget :contentReference[oaicite:2]{index=2}
      return;
    } catch (err) {
      // fall through to classic / fallback
    }
  }

  // Web Widget (Classic) fallback
  if (typeof window.zE === "function") {
    try {
      window.zE.activate(); // opens Classic widget :contentReference[oaicite:3]{index=3}
      return;
    } catch (err) {
      // ignore
    }
  }
});

// Date and Time Widget
document.addEventListener('DOMContentLoaded', () => {
  const HOLIDAY_API = 'https://dd3wp76elyvlxfepnfnetl6y4a0crowa.lambda-url.us-east-2.on.aws/';

  if (typeof luxon === 'undefined') {
    console.warn('Luxon not loaded; business-hours widget will not render.');
    return;
  }

  const { DateTime, Interval } = luxon;

  // Offices & hours (local office time)
  const OFFICES = [
    { key: 'US',       name: 'United States', tz: 'America/Detroit',    hours: { mon:'08:00-20:00', tue:'08:00-20:00', wed:'08:00-20:00', thu:'08:00-20:00', fri:'08:00-20:00' } },
    { key: 'Sweden',   name: 'Sweden',        tz: 'Europe/Stockholm',   hours: { mon:'08:00-17:00', tue:'08:00-17:00', wed:'08:00-17:00', thu:'08:00-17:00', fri:'08:00-17:00' } },
    { key: 'Malaysia', name: 'Malaysia',      tz: 'Asia/Kuala_Lumpur',  hours: { mon:'06:00-17:00', tue:'06:00-17:00', wed:'06:00-17:00', thu:'06:00-17:00', fri:'06:00-17:00' } },
    { key: 'Japan',    name: 'Japan',         tz: 'Asia/Tokyo',         hours: { mon:'09:00-18:00', tue:'09:00-18:00', wed:'09:00-18:00', thu:'09:00-18:00', fri:'09:00-18:00' } }
  ];

  const DAY_KEYS = ['sun','mon','tue','wed','thu','fri','sat'];
  const WKD = ['mon','tue','wed','thu','fri'];
  const userTZ = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

  // ---------- Helper Functions ----------
  async function fetchHolidays() {
    try {
      const res = await fetch(HOLIDAY_API, { cache: 'no-store' });
      if (!res.ok) throw new Error(res.statusText);
      return await res.json(); // { US:[YYYY-MM-DD,...], Sweden:[...], Malaysia:[...] }
    } catch (e) {
      console.warn('Holiday API error:', e);
      return {};
    }
  }

  function spanToInterval(dayKey, span, tz) {
    const [startHM, endHM] = span.split('-');
    const [sh, sm] = startHM.split(':').map(Number);
    const [eh, em] = endHM.split(':').map(Number);
    const anchor = DateTime.now().setZone(tz);
    const idx = { mon:0, tue:1, wed:2, thu:3, fri:4 }[dayKey];
    const base = anchor.startOf('week').plus({ days: idx });
    const start = base.set({ hour: sh, minute: sm, second:0 });
    const end   = base.set({ hour: eh, minute: em, second:0 });
    return Interval.fromDateTimes(start, end);
  }

function todayHolidayForOffice(office, holidays) {
  const list = (holidays && holidays[office.key]) || []; // [{date:'YYYY-MM-DD', name:'...'}]
  if (!list.length) return null;
  const todayLocal = luxon.DateTime.now().setZone(office.tz).toFormat('yyyy-LL-dd');
  // If multiple holidays share the same date, keep the first name.
  return list.find(h => h.date === todayLocal) || null;
}

  function nextHolidayForOffice(office, holidays) {
  const list = (holidays && holidays[office.key]) || [];
  if (!list.length) return null;
  const nowLocal = luxon.DateTime.now().setZone(office.tz).startOf('day');
  const upcoming = list
    .filter(h => luxon.DateTime.fromISO(h.date, { zone: office.tz }).startOf('day') >= nowLocal)
    .sort((a,b) => a.date.localeCompare(b.date));
  return upcoming[0] || null;
}
  
function currentStatus(office, holidays) {
  const { DateTime, Interval } = luxon;
  const now = DateTime.now().setZone(office.tz);
  const dayKey = ['sun','mon','tue','wed','thu','fri','sat'][now.weekday % 7];

  // weekend check
  if (!['mon','tue','wed','thu','fri'].includes(dayKey)) {
    return { open: false, reason: 'weekend' };
  }

  // holiday check (with name)
  const todayHol = todayHolidayForOffice(office, holidays);
  if (todayHol) {
    return { open: false, reason: 'holiday', holidayName: todayHol.name };
  }

  // hours check
  const span = office.hours[dayKey];
  if (!span) return { open: false, reason: 'closed' };
  const [startHM, endHM] = span.split('-');
  const [sh, sm] = startHM.split(':').map(Number);
  const [eh, em] = endHM.split(':').map(Number);
  const base = now.startOf('week').plus({ days: {mon:0,tue:1,wed:2,thu:3,fri:4}[dayKey] });
  const iv = Interval.fromDateTimes(
    base.set({ hour: sh, minute: sm, second: 0 }),
    base.set({ hour: eh, minute: em, second: 0 })
  );
  const open = iv.contains(now);
  return { open, reason: open ? 'open' : 'closed' };
}

  function formatRepresentativeHoursForUser(office) {
    const span = office.hours.mon;
    const iv = spanToInterval('mon', span, office.tz);
    const s = iv.start.setZone(userTZ);
    const e = iv.end.setZone(userTZ);
    return `${s.toFormat('h:mm a')} – ${e.toFormat('h:mm a')} (${s.offsetNameShort})`;
  }

  // ---------- Main Init ----------
  (async function init() {
    const holidays = await fetchHolidays();
   const detailsBlocks = OFFICES.map(office => {
  const status   = currentStatus(office, holidays);
  const nextHol  = nextHolidayForOffice(office, holidays);
  const hoursUsr = formatRepresentativeHoursForUser(office);

  let icon = '🔴', label = 'Closed now';
  if (status.reason === 'holiday') {
    icon = '🔴';
    label = status.holidayName ? `Closed (holiday) — ${status.holidayName}` : 'Closed (holiday)';
  } else if (status.reason === 'weekend') {
    icon = '🔴';
    label = 'Closed (weekend)';
  } else if (status.open) {
    icon = '🟢';
    label = 'Open now';
  }

  const nextHolLine = nextHol
    ? `Next holiday: <strong>${nextHol.name}</strong> on <strong>${luxon.DateTime.fromISO(nextHol.date).setZone(userTZ).toLocaleString({ weekday:'long', month:'long', day:'numeric' })}</strong>`
    : `Next holiday: <em>None on record</em>`;

  // If you're using collapsible <details>:
  return `
    <details class="biz-block" open>
      <summary class="biz-summary">
        <span class="biz-caret">▶</span>
        <span class="biz-icon">${icon}</span>
        <span class="biz-name">${office.name}</span>
        <span class="biz-label">${label}</span>
      </summary>
      <div class="biz-body">
        <div class="biz-sub">Today's hours (your time): ${hoursUsr}</div>
        <div class="biz-sub">${nextHolLine}</div>
      </div>
    </details>
  `;
}).join('');

    // ---------- Mount Widget Safely ----------
    try {
      const host = document.createElement('div');
      host.className = 'biz-host';
      const widget = document.createElement('section');
widget.className = 'biz-hours';
widget.innerHTML = `
  <h2 class="biz-title">Support Availability</h2>
  <div class="biz-tz">Times shown in your timezone: ${userTZ}</div>
  ${detailsBlocks}
`;
      host.appendChild(widget);

      const isInHeader = (el) =>
        !!el.closest('header, .header, nav, .top-bar, .hero, .hero-container');

      const candidates = [
        ['main .container', 'afterbegin'],
        ['main', 'afterbegin'],
        ['#main-content', 'afterbegin'],
        ['.container', 'afterbegin'],
        ['.page-header', 'afterend']
      ];

      let placed = false;
      for (const [sel, pos] of candidates) {
        const el = document.querySelector(sel);
        if (el && !isInHeader(el)) {
          el.insertAdjacentElement(pos, host);
          placed = true;
          break;
        }
      }

      if (!placed) {
        const main = document.querySelector('main');
        if (main) main.insertAdjacentElement('afterbegin', host);
        else document.body.appendChild(host);
      }

    } catch (err) {
      console.error('Mount error:', err);
    }
  })();
});

/***Hide Community Column in Search Results if Empty***/
document.addEventListener("DOMContentLoaded", function () {
 const searchResultsWrap = document.querySelector(".search-results");
const communityColumn = document.querySelector(".search-results-column.end-user");

if (communityColumn) {
  const results = communityColumn.querySelectorAll(".search-result-list-item");

  if (results.length === 0) {
    communityColumn.remove();
    searchResultsWrap?.classList.add("no-community");
  }
}
});

/****Locale Menu - Keep on same page, otherwise redirect to home page****/
  document.addEventListener("DOMContentLoaded", function () {
    const localeLinks = document.querySelectorAll("#locale-menu a[data-locale]");

    localeLinks.forEach((link) => {
      link.addEventListener("click", async function (e) {
        e.preventDefault();

        const targetLocale = this.dataset.locale;
        const currentUrl = new URL(window.location.href);

        const localizedUrl = buildLocalizedUrl(currentUrl, targetLocale);

        try {
          // Try the current page first
          const ok = await urlExists(localizedUrl);
          window.location.href = ok ? localizedUrl : `/hc/${targetLocale}`;
        } catch (err) {
          console.warn("[Locale switch] falling back to homepage:", err);
          window.location.href = `/hc/${targetLocale}`;
        }
      });
    });

    function buildLocalizedUrl(currentUrl, targetLocale) {
      const url = new URL(currentUrl.toString());
      const parts = url.pathname.split("/");

      // Expected Zendesk pattern: /hc/<locale>/...
      if (parts[1] === "hc" && parts[2]) {
        parts[2] = targetLocale;
      } else {
        // If we cannot detect the locale segment, just go to homepage fallback
        return `/hc/${targetLocale}`;
      }

      url.pathname = parts.join("/");
      return url.toString();
    }

    async function urlExists(testUrl) {
      // HEAD is light; fallback to GET if your environment blocks HEAD
      const res = await fetch(testUrl, {
        method: "GET",
        credentials: "same-origin"
      });

      return res.ok;
    }
  });