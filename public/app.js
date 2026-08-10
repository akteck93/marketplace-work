const state = {
  user: null,
  csrfToken: "",
  currentContract: null,
  currentProposalProjectId: null,
  notifications: [],
  publicConfig: {}
};

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

let toastTimer;

function showToast(message, type = "success") {
  clearTimeout(toastTimer);
  const el = $("#toast");
  el.textContent = message;
  el.className = `toast show ${type}`;
  toastTimer = setTimeout(() => {
    el.className = "toast";
  }, 4200);
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function truncate(value = "", length = 190) {
  const text = String(value || "");
  return text.length > length ? `${text.slice(0, length)}…` : text;
}

function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

function formatMoney(value, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

function parseSkills(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function tags(skills = []) {
  const list = skills.length ? skills : ["General"];
  return list
    .slice(0, 8)
    .map((skill) => `<span class="tag">${escapeHtml(skill)}</span>`)
    .join("");
}

function status(value = "") {
  return `<span class="status ${escapeHtml(value)}">${escapeHtml(
    String(value).replaceAll("_", " ")
  )}</span>`;
}

function empty(message) {
  return `<div class="empty">${escapeHtml(message)}</div>`;
}

function setBusy(button, busy, text = "Working...") {
  if (!button) return;
  button.dataset.originalText ||= button.textContent;
  button.disabled = busy;
  button.textContent = busy ? text : button.dataset.originalText;
}

async function refreshCsrf() {
  const response = await fetch("/api/auth/csrf", {
    credentials: "same-origin"
  });
  const data = await response.json();
  state.csrfToken = data.csrfToken;
}

async function api(url, options = {}, retryCsrf = true) {
  const method = String(options.method || "GET").toUpperCase();

  if (!state.csrfToken) {
    await refreshCsrf();
  }

  const response = await fetch(url, {
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      ...(method !== "GET" && method !== "HEAD"
        ? { "x-csrf-token": state.csrfToken }
        : {}),
      ...(options.headers || {})
    },
    ...options
  });

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const text = await response.text();
    console.error("NON-JSON API RESPONSE", response.status, text);
    throw new Error(`Server returned ${response.status} instead of JSON.`);
  }

  const data = await response.json();

  if (
    response.status === 403 &&
    retryCsrf &&
    /csrf/i.test(data.message || "")
  ) {
    await refreshCsrf();
    return api(url, options, false);
  }

  if (!response.ok) {
    const details = Array.isArray(data.errors)
      ? data.errors.map((item) => `${item.field}: ${item.message}`).join(" • ")
      : "";
    throw new Error(details || data.message || "Request failed.");
  }

  return data;
}

function roleLabel(role) {
  if (role === "client") return "SERVICE SEEKER";
  if (role === "provider") return "SERVICE PROVIDER";
  return "ADMIN";
}

function navForRole(role) {
  if (role === "client") {
    return [
      ["dashboard", "Dashboard"],
      ["post", "Post a Project"],
      ["projects", "My Projects"],
      ["experts", "Find Experts"],
      ["saved-providers", "Saved Providers"],
      ["contracts", "Contracts"],
      ["reviews", "Reviews"],
      ["notifications", "Notifications"],
      ["subscription", "Subscription"],
      ["profile", "Profile"]
    ];
  }

  if (role === "provider") {
    return [
      ["dashboard", "Dashboard"],
      ["marketplace", "Find Projects"],
      ["proposals", "My Proposals"],
      ["saved-projects", "Saved Projects"],
      ["contracts", "Contracts"],
      ["reviews", "Reviews"],
      ["notifications", "Notifications"],
      ["subscription", "Subscription"],
      ["profile", "Profile"]
    ];
  }

  return [
    ["dashboard", "Dashboard"],
    ["admin", "Administration"],
    ["notifications", "Notifications"],
    ["profile", "Profile"]
  ];
}

function renderSidebar() {
  $("#sidebarNav").innerHTML = navForRole(state.user.role)
    .map(
      ([view, label]) =>
        `<button data-view="${view}">${escapeHtml(label)}</button>`
    )
    .join("");

  $("#sidebarName").textContent = state.user.name;
  $("#sidebarRole").textContent = roleLabel(state.user.role);
  $("#avatar").textContent = state.user.name.slice(0, 1).toUpperCase();
  $("#welcomeText").textContent = `Welcome, ${state.user.name}`;

  const sub = state.user.subscription || {};
  $("#subscriptionPill").textContent = `${sub.plan || "free"} · ${
    sub.status || "active"
  }`;

  $$(".provider-profile").forEach((node) => {
    node.classList.toggle("hidden", state.user.role !== "provider");
  });
}

function showPublic() {
  state.user = null;
  $("#appShell").classList.add("hidden");
  $("#publicSite").classList.remove("hidden");
}

function showApp() {
  $("#publicSite").classList.add("hidden");
  $("#appShell").classList.remove("hidden");
  renderSidebar();
  loadNotificationCount();
  go("dashboard");
}

function go(view) {
  if (!state.user) return;

  const allowed = navForRole(state.user.role).map(([key]) => key);
  if (view !== "workroom" && !allowed.includes(view)) {
    view = "dashboard";
  }

  $$(".view").forEach((node) => node.classList.add("hidden"));
  $(`#view-${view}`)?.classList.remove("hidden");

  $$("#sidebarNav [data-view]").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === view);
  });

  $("#sidebar").classList.remove("open");

  if (view === "dashboard") loadDashboard();
  if (view === "projects") loadMyProjects();
  if (view === "marketplace") loadMarketplace();
  if (view === "proposals") loadMyProposals();
  if (view === "saved-projects") loadSavedProjects();
  if (view === "experts") loadExperts();
  if (view === "saved-providers") loadSavedProviders();
  if (view === "contracts") loadContracts();
  if (view === "reviews") loadReviews();
  if (view === "notifications") loadNotifications();
  if (view === "profile") fillProfile();
  if (view === "subscription") loadSubscription();
  if (view === "admin") loadAdmin();
}

function projectPrice(project) {
  if (project.contractType === "hourly") {
    return `${formatMoney(project.hourlyMin, project.currency)} – ${formatMoney(
      project.hourlyMax,
      project.currency
    )}/hr`;
  }

  return formatMoney(project.budget, project.currency);
}

function projectCard(project, { owner = false, saved = false } = {}) {
  let actions = "";

  if (owner) {
    actions = `
      <button class="secondary view-proposals-button" data-id="${project._id}" data-title="${escapeHtml(project.title)}">
        View Proposals (${project.proposalCount || 0})
      </button>
      ${
        project.status === "open"
          ? `<button class="danger close-project-button" data-id="${project._id}">Close</button>`
          : ""
      }
    `;
  } else if (state.user.role === "provider" && project.status === "open") {
    actions = `
      <button class="primary apply-button" data-id="${project._id}" data-title="${escapeHtml(project.title)}" data-bid="${project.contractType === "fixed" ? project.budget || "" : project.hourlyMin || ""}">
        Submit Proposal
      </button>
      <button class="secondary save-project-button" data-id="${project._id}">
        ${saved || project.saved ? "Remove Saved" : "Save Project"}
      </button>
    `;
  }

  return `
    <article class="card">
      <div class="meta">
        <span>${escapeHtml(project.category)}</span><span>•</span>
        <span>${project.contractType === "fixed" ? "Fixed Price" : "Hourly"}</span><span>•</span>
        <span>${escapeHtml(project.experienceLevel || "intermediate")}</span>
      </div>
      <h3>${escapeHtml(project.title)}</h3>
      <p>${escapeHtml(truncate(project.description, 220))}</p>
      <div class="tags">${tags(project.skills || [])}</div>
      <div class="meta">
        <strong>${projectPrice(project)}</strong><span>•</span>
        <span>${escapeHtml(project.location || "Remote")}</span>
      </div>
      <div class="meta">
        ${
          project.client?.name
            ? `<span>Client: ${escapeHtml(project.client.name)}</span><span>•</span>`
            : ""
        }
        <span>Expires ${formatDate(project.expirationDate)}</span><span>•</span>
        ${status(project.status || "open")}
      </div>
      ${actions ? `<div class="card-actions">${actions}</div>` : ""}
    </article>
  `;
}

function providerCard(provider, saved = false) {
  const profile = provider.profile || {};
  return `
    <article class="card">
      <div class="meta">
        <span>★ ${Number(provider.rating?.average || 0).toFixed(1)} (${provider.rating?.count || 0})</span>
        <span>•</span><span>${provider.completedContracts || 0} completed</span>
      </div>
      <h3>${escapeHtml(provider.name)}</h3>
      <p><strong>${escapeHtml(profile.headline || "Independent professional")}</strong></p>
      <p>${escapeHtml(truncate(profile.bio || "Profile details are being completed.", 180))}</p>
      <div class="tags">${tags(profile.skills || [])}</div>
      <div class="meta">
        <span>${escapeHtml(profile.location || profile.country || "Location not set")}</span>
        ${
          Number(profile.hourlyRate || 0) > 0
            ? `<span>• ${formatMoney(profile.hourlyRate, "INR")}/hr</span>`
            : ""
        }
        <span>• ${escapeHtml(profile.availability || "available")}</span>
      </div>
      <div class="card-actions">
        <button class="secondary save-provider-button" data-id="${provider._id}">
          ${saved || provider.saved ? "Remove Saved" : "Save Provider"}
        </button>
      </div>
    </article>
  `;
}

function proposalCard(proposal) {
  const project = proposal.project || {};
  return `
    <article class="card">
      <div class="meta">${status(proposal.status)}<span>•</span><span>${formatDate(proposal.createdAt)}</span></div>
      <h3>${escapeHtml(project.title || "Project")}</h3>
      <p>${escapeHtml(truncate(proposal.coverLetter, 210))}</p>
      <div class="meta">
        <strong>${formatMoney(proposal.bidAmount, project.currency || "INR")}</strong>
        <span>• ${proposal.estimatedDays} days</span>
      </div>
      ${
        proposal.clientNote
          ? `<p><strong>Client note:</strong> ${escapeHtml(proposal.clientNote)}</p>`
          : ""
      }
      ${
        ["submitted", "shortlisted"].includes(proposal.status)
          ? `<div class="card-actions"><button class="danger withdraw-proposal-button" data-id="${proposal._id}">Withdraw</button></div>`
          : ""
      }
    </article>
  `;
}

function contractCard(contract) {
  const other =
    state.user.role === "client" ? contract.provider : contract.client;

  let actions = `
    <button class="secondary open-workroom-button" data-id="${contract._id}">Open Workroom</button>
  `;

  if (
    state.user.role === "provider" &&
    contract.status === "offer_pending"
  ) {
    actions = `
      <button class="primary accept-offer-button" data-id="${contract._id}">Accept Offer</button>
      <button class="danger reject-offer-button" data-id="${contract._id}">Decline</button>
    `;
  }

  if (contract.status === "completed") {
    actions += `
      <button class="secondary review-contract-button" data-id="${contract._id}">Leave Review</button>
    `;
  }

  return `
    <article class="card">
      <div class="meta">${status(contract.status)}<span>•</span><span>${contract.contractType === "fixed" ? "Fixed Price" : "Hourly"}</span></div>
      <h3>${escapeHtml(contract.title)}</h3>
      <p>${state.user.role === "client" ? "Provider" : "Client"}: <strong>${escapeHtml(other?.name || "Workiffy User")}</strong></p>
      <div class="meta">
        <strong>${
          contract.contractType === "hourly"
            ? `${formatMoney(contract.hourlyRate, contract.currency)}/hr`
            : formatMoney(contract.totalValue, contract.currency)
        }</strong>
        <span>• ${contract.milestones?.length || 0} milestone(s)</span>
      </div>
      <div class="card-actions">${actions}</div>
    </article>
  `;
}

function proposalReviewRow(proposal, project) {
  const provider = proposal.provider || {};
  const profile = provider.profile || {};

  return `
    <article class="proposal-row">
      <div class="meta">
        ${status(proposal.status)}<span>•</span>
        <span>★ ${Number(provider.rating?.average || 0).toFixed(1)}</span>
        <span>• ${provider.completedContracts || 0} completed</span>
      </div>
      <h3>${escapeHtml(provider.name || "Service Provider")}</h3>
      <p><strong>${escapeHtml(profile.headline || "")}</strong></p>
      <p>${escapeHtml(proposal.coverLetter)}</p>
      <div class="tags">${tags(profile.skills || [])}</div>
      <div class="meta">
        <strong>${formatMoney(proposal.bidAmount, project.currency || "INR")}</strong>
        <span>• ${proposal.estimatedDays} days</span>
      </div>
      <div class="card-actions">
        ${
          proposal.status === "submitted"
            ? `<button class="secondary proposal-decision-button" data-id="${proposal._id}" data-action="shortlist">Shortlist</button>`
            : ""
        }
        ${
          ["submitted", "shortlisted"].includes(proposal.status)
            ? `<button class="danger proposal-decision-button" data-id="${proposal._id}" data-action="reject">Reject</button>
               <button class="primary send-offer-button" data-id="${proposal._id}">Send Offer</button>`
            : ""
        }
      </div>
    </article>
  `;
}

function milestoneRow(contract, milestone) {
  let actions = "";

  if (
    state.user.role === "provider" &&
    contract.status === "active" &&
    ["active", "revision_requested"].includes(milestone.status)
  ) {
    actions = `
      <button class="primary milestone-action-button" data-contract="${contract._id}" data-milestone="${milestone._id}" data-action="submit">
        Submit Work
      </button>
    `;
  }

  if (
    state.user.role === "client" &&
    contract.status === "active" &&
    milestone.status === "submitted"
  ) {
    actions = `
      <button class="primary milestone-action-button" data-contract="${contract._id}" data-milestone="${milestone._id}" data-action="approve">
        Approve
      </button>
      <button class="secondary milestone-action-button" data-contract="${contract._id}" data-milestone="${milestone._id}" data-action="revision">
        Request Revision
      </button>
    `;
  }

  return `
    <article class="milestone">
      <div class="milestone-top">
        <div>
          <strong>${escapeHtml(milestone.title)}</strong>
          <div class="meta">
            <span>${formatMoney(milestone.amount, contract.currency)}</span>
            ${milestone.dueDate ? `<span>• Due ${formatDate(milestone.dueDate)}</span>` : ""}
          </div>
        </div>
        ${status(milestone.status)}
      </div>
      ${
        milestone.description
          ? `<p class="muted">${escapeHtml(milestone.description)}</p>`
          : ""
      }
      ${
        milestone.submissionNote
          ? `<p class="muted"><strong>Submission:</strong> ${escapeHtml(milestone.submissionNote)}</p>`
          : ""
      }
      ${
        milestone.clientNote
          ? `<p class="muted"><strong>Client note:</strong> ${escapeHtml(milestone.clientNote)}</p>`
          : ""
      }
      ${actions ? `<div class="card-actions">${actions}</div>` : ""}
    </article>
  `;
}

function messageRow(message) {
  const senderId = message.sender?._id || message.sender;
  const own = String(senderId) === String(state.user.id);

  return `
    <div class="message ${own ? "own" : ""}">
      <small>${escapeHtml(message.sender?.name || "User")} · ${formatDate(message.createdAt)}</small>
      <p>${escapeHtml(message.body)}</p>
    </div>
  `;
}

async function loadNotificationCount() {
  try {
    const data = await api("/api/notifications");
    state.notifications = data.notifications;
    $("#notificationCount").textContent = data.notifications.filter(
      (item) => !item.isRead
    ).length;
  } catch (error) {
    console.error(error);
  }
}

async function loadDashboard() {
  const cards = $("#dashboardCards");
  cards.innerHTML = empty("Loading dashboard...");

  try {
    if (state.user.role === "client") {
      const [projectsData, contractsData, providersData] = await Promise.all([
        api("/api/projects/mine"),
        api("/api/contracts/mine"),
        api("/api/users/providers?limit=6")
      ]);

      $("#dashboardTitle").textContent =
        "Post requirements. Compare specialists. Move work forward.";
      $("#dashboardSubtitle").textContent =
        "Manage projects, proposals and delivery from your Service Seeker dashboard.";
      $("#dashboardPrimary").textContent = "Post a Project";
      $("#dashboardSectionTitle").textContent = "Recommended Experts";
      $("#dashboardSectionSubtitle").textContent =
        "Professional profiles available on Workiffy.";
      $("#dashboardSectionButton").textContent = "Find Experts";

      const open = projectsData.projects.filter((p) => p.status === "open").length;
      const active = contractsData.contracts.filter((c) => c.status === "active").length;

      $("#dashboardStats").innerHTML = [
        ["Projects", projectsData.projects.length],
        ["Open Projects", open],
        ["Contracts", contractsData.contracts.length],
        ["Active Contracts", active]
      ]
        .map(([label, value]) => `<article class="stat"><small>${label}</small><strong>${value}</strong></article>`)
        .join("");

      cards.innerHTML = providersData.providers.length
        ? providersData.providers.map((p) => providerCard(p)).join("")
        : empty("No provider profiles are available yet.");
    } else if (state.user.role === "provider") {
      const [projectsData, proposalsData, contractsData] = await Promise.all([
        api("/api/projects?limit=6"),
        api("/api/proposals/mine"),
        api("/api/contracts/mine")
      ]);

      $("#dashboardTitle").textContent =
        "Discover relevant projects. Submit stronger proposals.";
      $("#dashboardSubtitle").textContent =
        "Use your Service Provider dashboard to find opportunities and manage delivery.";
      $("#dashboardPrimary").textContent = "Find Projects";
      $("#dashboardSectionTitle").textContent = "Latest Opportunities";
      $("#dashboardSectionSubtitle").textContent =
        "Recently posted projects accepting proposals.";
      $("#dashboardSectionButton").textContent = "Find Projects";

      const active = contractsData.contracts.filter((c) => c.status === "active").length;
      const pendingOffers = contractsData.contracts.filter((c) => c.status === "offer_pending").length;

      $("#dashboardStats").innerHTML = [
        ["Open Projects", projectsData.pagination?.total ?? projectsData.projects.length],
        ["My Proposals", proposalsData.proposals.length],
        ["Active Contracts", active],
        ["Pending Offers", pendingOffers]
      ]
        .map(([label, value]) => `<article class="stat"><small>${label}</small><strong>${value}</strong></article>`)
        .join("");

      cards.innerHTML = projectsData.projects.length
        ? projectsData.projects.map((p) => projectCard(p)).join("")
        : empty("No open projects are available.");
    } else {
      const data = await api("/api/admin/metrics");

      $("#dashboardTitle").textContent = "Marketplace Operations";
      $("#dashboardSubtitle").textContent =
        "Monitor Workiffy activity and account health.";
      $("#dashboardPrimary").textContent = "Open Administration";
      $("#dashboardSectionTitle").textContent = "Administration";
      $("#dashboardSectionSubtitle").textContent =
        "Use the administration workspace for user controls.";
      $("#dashboardSectionButton").textContent = "Administration";

      const m = data.metrics;
      $("#dashboardStats").innerHTML = [
        ["Users", m.users],
        ["Clients", m.clients],
        ["Providers", m.providers],
        ["Active Contracts", m.activeContracts]
      ]
        .map(([label, value]) => `<article class="stat"><small>${label}</small><strong>${value}</strong></article>`)
        .join("");

      cards.innerHTML = `
        <article class="card">
          <h3>Open Projects</h3><p>Current open marketplace requirements.</p><strong>${m.openProjects}</strong>
        </article>
        <article class="card">
          <h3>Proposals</h3><p>Total provider proposal records.</p><strong>${m.proposals}</strong>
        </article>
        <article class="card">
          <h3>Completed Contracts</h3><p>Completed engagements.</p><strong>${m.completedContracts}</strong>
        </article>
      `;
    }
  } catch (error) {
    cards.innerHTML = empty(error.message);
    showToast(error.message, "error");
  }
}

async function loadMyProjects() {
  const container = $("#myProjectCards");
  container.innerHTML = empty("Loading projects...");

  try {
    const data = await api("/api/projects/mine");
    container.innerHTML = data.projects.length
      ? data.projects.map((p) => projectCard(p, { owner: true })).join("")
      : empty("You have not posted a project yet.");
  } catch (error) {
    container.innerHTML = empty(error.message);
    showToast(error.message, "error");
  }
}

async function loadMarketplace(query = "") {
  const container = $("#marketplaceCards");
  container.innerHTML = empty("Loading projects...");

  try {
    const data = await api(`/api/projects${query ? `?${query}` : ""}`);
    container.innerHTML = data.projects.length
      ? data.projects.map((p) => projectCard(p)).join("")
      : empty("No matching projects found.");
  } catch (error) {
    container.innerHTML = empty(error.message);
    showToast(error.message, "error");
  }
}

async function loadMyProposals() {
  const container = $("#myProposalCards");
  container.innerHTML = empty("Loading proposals...");

  try {
    const data = await api("/api/proposals/mine");
    container.innerHTML = data.proposals.length
      ? data.proposals.map(proposalCard).join("")
      : empty("You have not submitted a proposal yet.");
  } catch (error) {
    container.innerHTML = empty(error.message);
    showToast(error.message, "error");
  }
}

async function loadSavedProjects() {
  const container = $("#savedProjectCards");
  container.innerHTML = empty("Loading saved projects...");

  try {
    const data = await api("/api/projects/saved");
    container.innerHTML = data.projects.length
      ? data.projects.map((p) => projectCard(p, { saved: true })).join("")
      : empty("You have not saved any projects.");
  } catch (error) {
    container.innerHTML = empty(error.message);
    showToast(error.message, "error");
  }
}

async function loadExperts(query = "") {
  const container = $("#expertCards");
  container.innerHTML = empty("Loading experts...");

  try {
    const data = await api(
      `/api/users/providers${query ? `?${query}` : ""}`
    );
    container.innerHTML = data.providers.length
      ? data.providers.map((p) => providerCard(p)).join("")
      : empty("No matching providers found.");
  } catch (error) {
    container.innerHTML = empty(error.message);
    showToast(error.message, "error");
  }
}

async function loadSavedProviders() {
  const container = $("#savedProviderCards");
  container.innerHTML = empty("Loading saved providers...");

  try {
    const data = await api("/api/users/providers/saved");
    container.innerHTML = data.providers.length
      ? data.providers.map((p) => providerCard(p, true)).join("")
      : empty("You have not saved any providers.");
  } catch (error) {
    container.innerHTML = empty(error.message);
    showToast(error.message, "error");
  }
}

async function loadContracts() {
  const container = $("#contractCards");
  container.innerHTML = empty("Loading contracts...");

  try {
    const data = await api("/api/contracts/mine");
    container.innerHTML = data.contracts.length
      ? data.contracts.map(contractCard).join("")
      : empty("No contracts or offers yet.");
  } catch (error) {
    container.innerHTML = empty(error.message);
    showToast(error.message, "error");
  }
}

async function loadReviews() {
  const container = $("#reviewCards");
  container.innerHTML = empty("Loading reviews...");

  try {
    const data = await api("/api/reviews/mine");

    container.innerHTML = data.reviews.length
      ? data.reviews
          .map((review) => {
            const received =
              String(review.reviewee?._id || review.reviewee) ===
              String(state.user.id);
            return `
              <article class="card">
                <div class="meta">
                  <span>${"★".repeat(review.rating)}</span><span>•</span>
                  <span>${received ? "Received" : "Given"}</span>
                </div>
                <h3>${escapeHtml(review.contract?.title || "Completed Contract")}</h3>
                <p>${escapeHtml(review.comment || "No written feedback.")}</p>
                <div class="meta">
                  <span>${received ? `From ${escapeHtml(review.reviewer?.name || "User")}` : `For ${escapeHtml(review.reviewee?.name || "User")}`}</span>
                  <span>• ${formatDate(review.createdAt)}</span>
                </div>
              </article>
            `;
          })
          .join("")
      : empty("No reviews yet.");
  } catch (error) {
    container.innerHTML = empty(error.message);
    showToast(error.message, "error");
  }
}

async function loadNotifications() {
  const container = $("#notificationList");
  container.innerHTML = empty("Loading notifications...");

  try {
    const data = await api("/api/notifications");
    state.notifications = data.notifications;

    const unread = data.notifications.filter((item) => !item.isRead).length;
    $("#notificationCount").textContent = unread;

    container.innerHTML = data.notifications.length
      ? data.notifications
          .map(
            (item) => `
              <article class="notification ${item.isRead ? "" : "unread"}">
                <div>
                  <h3>${escapeHtml(item.title)}</h3>
                  <p>${escapeHtml(item.body)}</p>
                  <small class="muted">${formatDate(item.createdAt)}</small>
                </div>
                ${
                  item.isRead
                    ? ""
                    : `<button class="secondary mark-read-button" data-id="${item._id}">Mark Read</button>`
                }
              </article>
            `
          )
          .join("")
      : empty("No notifications.");
  } catch (error) {
    container.innerHTML = empty(error.message);
    showToast(error.message, "error");
  }
}


function loadSubscription() {
  const sub = state.user.subscription || {};
  const enforced = Boolean(state.publicConfig.subscriptionsEnforced);
  const support = state.publicConfig.supportEmail || "support@workiffy.com";
  const expiry = sub.expiresAt ? formatDate(sub.expiresAt) : "No fixed expiry";

  $("#subscriptionContent").innerHTML = `
    <article class="card">
      <span class="eyebrow">CURRENT PLAN</span>
      <h3>${escapeHtml(String(sub.plan || "free").toUpperCase())}</h3>
      <div class="meta">${status(sub.status || "active")}<span>•</span><span>${escapeHtml(expiry)}</span></div>
      <p>${
        enforced
          ? "Marketplace transaction features are controlled by your active Workiffy subscription."
          : "Subscription enforcement is currently disabled by the platform administrator."
      }</p>
    </article>
    <article class="card">
      <span class="eyebrow">PLAN MANAGEMENT</span>
      <h3>Upgrade or Renew</h3>
      <p>Online billing is intentionally not simulated. Until the payment gateway is connected, subscription changes can be handled by the Workiffy admin team.</p>
      <div class="card-actions"><a class="primary" href="mailto:${escapeHtml(support)}">Contact Workiffy</a></div>
    </article>
    <article class="card">
      <span class="eyebrow">ACCESS POLICY</span>
      <h3>Paid Marketplace Actions</h3>
      <p>When subscription enforcement is enabled, project posting, proposal submission, offer creation and protected proposal/client-detail access require an active paid plan.</p>
    </article>
  `;
}

async function loadAdmin() {
  const metrics = $("#adminMetrics");
  const users = $("#adminUsers");
  metrics.innerHTML = "";
  users.innerHTML = "Loading...";

  try {
    const [metricData, userData] = await Promise.all([
      api("/api/admin/metrics"),
      api("/api/admin/users")
    ]);

    metrics.innerHTML = Object.entries(metricData.metrics)
      .slice(0, 4)
      .map(
        ([key, value]) =>
          `<article class="stat"><small>${escapeHtml(
            key.replace(/([A-Z])/g, " $1")
          )}</small><strong>${value}</strong></article>`
      )
      .join("");

    users.innerHTML = `
      <table class="table">
        <thead>
          <tr><th>Name</th><th>Email</th><th>Role</th><th>Plan</th><th>Subscription</th><th>Account</th><th>Created</th><th>Action</th></tr>
        </thead>
        <tbody>
          ${userData.users
            .map(
              (user) => `
                <tr>
                  <td>${escapeHtml(user.name)}</td>
                  <td>${escapeHtml(user.email)}</td>
                  <td>${escapeHtml(user.role)}</td>
                  <td>
                    <select class="admin-plan-select" data-id="${user._id}">
                      ${["free", "provider", "client", "business"].map((value) => `<option value="${value}" ${user.subscription?.plan === value ? "selected" : ""}>${value}</option>`).join("")}
                    </select>
                  </td>
                  <td>
                    <select class="admin-sub-status-select" data-id="${user._id}">
                      ${["active", "inactive", "expired", "cancelled"].map((value) => `<option value="${value}" ${user.subscription?.status === value ? "selected" : ""}>${value}</option>`).join("")}
                    </select>
                  </td>
                  <td>${status(user.accountStatus)}</td>
                  <td>${formatDate(user.createdAt)}</td>
                  <td>
                    <select class="admin-status-select" data-id="${user._id}">
                      ${["active", "suspended", "closed"]
                        .map(
                          (value) =>
                            `<option value="${value}" ${
                              user.accountStatus === value ? "selected" : ""
                            }>${value}</option>`
                        )
                        .join("")}
                    </select>
                  </td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>
    `;
  } catch (error) {
    users.innerHTML = escapeHtml(error.message);
    showToast(error.message, "error");
  }
}

async function reviewProjectProposals(projectId, title) {
  state.currentProposalProjectId = projectId;
  $("#proposalReviewTitle").textContent = title || "Project Proposals";
  $("#proposalReviewList").innerHTML = empty("Loading proposals...");
  $("#proposalReviewDialog").showModal();

  try {
    const data = await api(`/api/proposals/project/${projectId}`);
    $("#proposalReviewList").innerHTML = data.proposals.length
      ? data.proposals
          .map((proposal) => proposalReviewRow(proposal, data.project))
          .join("")
      : empty("No proposals have been received yet.");
  } catch (error) {
    $("#proposalReviewList").innerHTML = empty(error.message);
    showToast(error.message, "error");
  }
}

async function openWorkroom(contractId) {
  try {
    const [contractData, messagesData] = await Promise.all([
      api(`/api/contracts/${contractId}`),
      api(`/api/contracts/${contractId}/messages`)
    ]);

    state.currentContract = contractData.contract;
    const contract = state.currentContract;

    $("#workroomTitle").textContent = contract.title;
    $("#workroomMeta").textContent = `${contract.contractType === "fixed" ? "Fixed Price" : "Hourly"} · ${contract.status.replaceAll("_", " ")}`;

    $("#milestoneList").innerHTML = contract.milestones.length
      ? contract.milestones
          .map((milestone) => milestoneRow(contract, milestone))
          .join("")
      : empty(
          contract.contractType === "hourly"
            ? "Hourly time-tracking/payment integration is not connected in this release."
            : "No milestones configured."
        );

    $("#messageList").innerHTML = messagesData.messages.length
      ? messagesData.messages.map(messageRow).join("")
      : empty("No messages yet.");

    const allApproved =
      contract.contractType === "hourly" ||
      contract.milestones.every((milestone) => milestone.status === "approved");

    $("#completeContractButton").classList.toggle(
      "hidden",
      !(
        state.user.role === "client" &&
        contract.status === "active" &&
        allApproved
      )
    );

    $$(".view").forEach((node) => node.classList.add("hidden"));
    $("#view-workroom").classList.remove("hidden");
    $$("#sidebarNav [data-view]").forEach((button) =>
      button.classList.remove("active")
    );

    const list = $("#messageList");
    list.scrollTop = list.scrollHeight;
  } catch (error) {
    showToast(error.message, "error");
  }
}

function fillProfile() {
  const form = $("#profileForm");
  const profile = state.user.profile || {};

  form.elements.name.value = state.user.name || "";
  form.elements.headline.value = profile.headline || "";
  form.elements.companyName.value = profile.companyName || "";
  form.elements.location.value = profile.location || "";
  form.elements.country.value = profile.country || "";
  form.elements.hourlyRate.value = Number(profile.hourlyRate || 0);
  form.elements.availability.value = profile.availability || "available";
  form.elements.website.value = profile.website || "";
  form.elements.portfolioUrl.value = profile.portfolioUrl || "";
  form.elements.skills.value = (profile.skills || []).join(", ");
  form.elements.bio.value = profile.bio || "";
}

function parseMilestones(value) {
  return String(value || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title, amount, dueDate] = line
        .split("|")
        .map((part) => part.trim());

      if (!title || !amount || Number(amount) <= 0) {
        throw new Error(
          "Each milestone must use: Title | Amount | YYYY-MM-DD"
        );
      }

      return {
        title,
        description: "",
        amount: Number(amount),
        dueDate: dueDate || null
      };
    });
}

function openAuth(mode = "login", role = "") {
  const login = mode === "login";
  $("#authDialogTitle").textContent = login ? "Sign In" : "Create Account";
  $("#loginForm").classList.toggle("hidden", !login);
  $("#registerForm").classList.toggle("hidden", login);

  $$("[data-auth-tab]").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.authTab === mode);
  });

  if (role) {
    $("#registerForm").elements.role.value = role;
  }

  if (!$("#authDialog").open) {
    $("#authDialog").showModal();
  }
}

async function bootstrap() {
  try {
    await refreshCsrf();

    try {
      const config = await api("/api/config/public");
      state.publicConfig = config.config || {};
      $("#supportEmail").textContent = config.config.supportEmail;
    } catch {
      // Public site can still render.
    }

    const data = await api("/api/auth/me");
    state.user = data.user;
    showApp();
  } catch {
    showPublic();
  }
}

/* ------------------------------ Event handlers --------------------------- */

document.addEventListener("click", async (event) => {
  const authButton = event.target.closest("[data-open-auth]");
  if (authButton) {
    openAuth(authButton.dataset.openAuth, authButton.dataset.role || "");
    return;
  }

  const navButton = event.target.closest("[data-view]");
  if (navButton && state.user) {
    go(navButton.dataset.view);
    return;
  }

  const closeDialog = event.target.closest(".close-dialog");
  if (closeDialog) {
    closeDialog.closest("dialog")?.close();
    return;
  }

  const apply = event.target.closest(".apply-button");
  if (apply) {
    $("#proposalTitle").textContent = apply.dataset.title;
    $("#proposalForm").elements.projectId.value = apply.dataset.id;
    $("#proposalForm").elements.bidAmount.value = apply.dataset.bid || "";
    $("#proposalDialog").showModal();
    return;
  }

  const viewProposals = event.target.closest(".view-proposals-button");
  if (viewProposals) {
    await reviewProjectProposals(
      viewProposals.dataset.id,
      viewProposals.dataset.title
    );
    return;
  }

  const closeProject = event.target.closest(".close-project-button");
  if (closeProject) {
    if (!confirm("Close this project and stop new proposals?")) return;

    try {
      const data = await api(`/api/projects/${closeProject.dataset.id}/close`, {
        method: "PATCH",
        body: JSON.stringify({})
      });
      showToast(data.message);
      loadMyProjects();
    } catch (error) {
      showToast(error.message, "error");
    }
    return;
  }

  const saveProject = event.target.closest(".save-project-button");
  if (saveProject) {
    try {
      const data = await api(`/api/projects/${saveProject.dataset.id}/save`, {
        method: "POST",
        body: JSON.stringify({})
      });
      showToast(data.message);
      if (!$("#view-saved-projects").classList.contains("hidden")) {
        loadSavedProjects();
      } else {
        loadMarketplace();
      }
    } catch (error) {
      showToast(error.message, "error");
    }
    return;
  }

  const saveProvider = event.target.closest(".save-provider-button");
  if (saveProvider) {
    try {
      const data = await api(`/api/users/providers/${saveProvider.dataset.id}/save`, {
        method: "POST",
        body: JSON.stringify({})
      });
      showToast(data.message);
      if (!$("#view-saved-providers").classList.contains("hidden")) {
        loadSavedProviders();
      } else {
        loadExperts();
      }
    } catch (error) {
      showToast(error.message, "error");
    }
    return;
  }

  const withdraw = event.target.closest(".withdraw-proposal-button");
  if (withdraw) {
    if (!confirm("Withdraw this proposal?")) return;

    try {
      const data = await api(`/api/proposals/${withdraw.dataset.id}/withdraw`, {
        method: "PATCH",
        body: JSON.stringify({})
      });
      showToast(data.message);
      loadMyProposals();
    } catch (error) {
      showToast(error.message, "error");
    }
    return;
  }

  const decision = event.target.closest(".proposal-decision-button");
  if (decision) {
    try {
      const data = await api(`/api/proposals/${decision.dataset.id}/decision`, {
        method: "PATCH",
        body: JSON.stringify({
          action: decision.dataset.action,
          note: ""
        })
      });
      showToast(data.message);
      await reviewProjectProposals(
        state.currentProposalProjectId,
        $("#proposalReviewTitle").textContent
      );
    } catch (error) {
      showToast(error.message, "error");
    }
    return;
  }

  const offer = event.target.closest(".send-offer-button");
  if (offer) {
    $("#offerForm").elements.proposalId.value = offer.dataset.id;
    $("#offerDialog").showModal();
    return;
  }

  const accept = event.target.closest(".accept-offer-button");
  if (accept) {
    try {
      const data = await api(`/api/contracts/${accept.dataset.id}/accept`, {
        method: "POST",
        body: JSON.stringify({})
      });
      showToast(data.message);
      loadContracts();
      loadNotificationCount();
    } catch (error) {
      showToast(error.message, "error");
    }
    return;
  }

  const reject = event.target.closest(".reject-offer-button");
  if (reject) {
    if (!confirm("Decline this offer?")) return;

    try {
      const data = await api(`/api/contracts/${reject.dataset.id}/reject`, {
        method: "POST",
        body: JSON.stringify({})
      });
      showToast(data.message);
      loadContracts();
    } catch (error) {
      showToast(error.message, "error");
    }
    return;
  }

  const workroom = event.target.closest(".open-workroom-button");
  if (workroom) {
    await openWorkroom(workroom.dataset.id);
    return;
  }

  const milestone = event.target.closest(".milestone-action-button");
  if (milestone) {
    const form = $("#milestoneForm");
    form.elements.contractId.value = milestone.dataset.contract;
    form.elements.milestoneId.value = milestone.dataset.milestone;
    form.elements.action.value = milestone.dataset.action;

    $("#milestoneDialogTitle").textContent =
      milestone.dataset.action === "submit"
        ? "Submit Milestone"
        : milestone.dataset.action === "approve"
          ? "Approve Milestone"
          : "Request Revision";

    $("#milestoneDialog").showModal();
    return;
  }

  const review = event.target.closest(".review-contract-button");
  if (review) {
    $("#reviewForm").elements.contractId.value = review.dataset.id;
    $("#reviewDialog").showModal();
    return;
  }

  const markRead = event.target.closest(".mark-read-button");
  if (markRead) {
    try {
      await api(`/api/notifications/${markRead.dataset.id}/read`, {
        method: "PATCH",
        body: JSON.stringify({})
      });
      await loadNotifications();
    } catch (error) {
      showToast(error.message, "error");
    }
  }
});

$$("[data-auth-tab]").forEach((tab) => {
  tab.addEventListener("click", () => {
    openAuth(tab.dataset.authTab);
  });
});

$("#loginForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = $("button[type=submit]", event.currentTarget);
  setBusy(button, true, "Signing In...");

  const form = new FormData(event.currentTarget);

  try {
    const data = await api("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password")
      })
    });

    state.user = data.user;
    $("#authDialog").close();
    showToast(data.message);
    showApp();
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    setBusy(button, false);
  }
});

$("#registerForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = $("button[type=submit]", event.currentTarget);
  setBusy(button, true, "Creating...");

  const form = new FormData(event.currentTarget);

  try {
    const data = await api("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
        role: form.get("role")
      })
    });

    state.user = data.user;
    $("#authDialog").close();
    showToast(data.message);
    showApp();
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    setBusy(button, false);
  }
});

$("#logoutButton").addEventListener("click", async () => {
  try {
    await api("/api/auth/logout", {
      method: "POST",
      body: JSON.stringify({})
    });
  } catch (error) {
    console.error(error);
  } finally {
    state.user = null;
    state.currentContract = null;
    showPublic();
  }
});

$("#projectContractType").addEventListener("change", (event) => {
  const hourly = event.target.value === "hourly";
  $("#budgetField").classList.toggle("hidden", hourly);
  $("#hourlyFields").classList.toggle("hidden", !hourly);
});

$("#postProjectForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = $("button[type=submit]", event.currentTarget);
  setBusy(button, true, "Posting...");

  const form = new FormData(event.currentTarget);
  const contractType = form.get("contractType");

  try {
    const data = await api("/api/projects", {
      method: "POST",
      body: JSON.stringify({
        title: form.get("title"),
        description: form.get("description"),
        category: form.get("category"),
        subcategory: form.get("subcategory"),
        skills: parseSkills(form.get("skills")),
        contractType,
        budget:
          contractType === "fixed" ? Number(form.get("budget")) : null,
        hourlyMin:
          contractType === "hourly" ? Number(form.get("hourlyMin")) : null,
        hourlyMax:
          contractType === "hourly" ? Number(form.get("hourlyMax")) : null,
        currency: form.get("currency"),
        experienceLevel: form.get("experienceLevel"),
        locationType: form.get("locationType"),
        location: form.get("location"),
        duration: form.get("duration"),
        expirationDate: form.get("expirationDate")
      })
    });

    showToast(data.message);
    event.currentTarget.reset();
    $("#projectContractType").dispatchEvent(new Event("change"));
    go("projects");
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    setBusy(button, false);
  }
});

$("#projectSearchForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const params = new URLSearchParams();

  ["q", "category", "contractType"].forEach((key) => {
    const value = form.get(key);
    if (value) params.set(key, value);
  });

  loadMarketplace(params.toString());
});

$("#expertSearchForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const params = new URLSearchParams();

  ["q", "skill"].forEach((key) => {
    const value = form.get(key);
    if (value) params.set(key, value);
  });

  loadExperts(params.toString());
});

$("#proposalForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = $("button[type=submit]", event.currentTarget);
  setBusy(button, true, "Submitting...");

  const form = new FormData(event.currentTarget);

  try {
    const data = await api("/api/proposals", {
      method: "POST",
      body: JSON.stringify({
        projectId: form.get("projectId"),
        bidAmount: Number(form.get("bidAmount")),
        estimatedDays: Number(form.get("estimatedDays")),
        coverLetter: form.get("coverLetter")
      })
    });

    showToast(data.message);
    $("#proposalDialog").close();
    event.currentTarget.reset();
    go("proposals");
    loadNotificationCount();
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    setBusy(button, false);
  }
});

$("#offerForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = $("button[type=submit]", event.currentTarget);
  setBusy(button, true, "Sending...");

  const form = new FormData(event.currentTarget);

  try {
    const milestones = parseMilestones(form.get("milestones"));

    const data = await api(
      `/api/proposals/${form.get("proposalId")}/offer`,
      {
        method: "POST",
        body: JSON.stringify({ milestones })
      }
    );

    showToast(data.message);
    $("#offerDialog").close();
    $("#proposalReviewDialog").close();
    event.currentTarget.reset();
    go("contracts");
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    setBusy(button, false);
  }
});

$("#milestoneForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = $("button[type=submit]", event.currentTarget);
  setBusy(button, true, "Saving...");

  const form = new FormData(event.currentTarget);
  const contractId = form.get("contractId");
  const milestoneId = form.get("milestoneId");
  const action = form.get("action");
  const note = form.get("note") || (action === "approve" ? "Approved" : "");

  try {
    if (action === "submit") {
      await api(
        `/api/contracts/${contractId}/milestones/${milestoneId}/submit`,
        {
          method: "POST",
          body: JSON.stringify({ note })
        }
      );
      showToast("Milestone submitted.");
    } else {
      await api(
        `/api/contracts/${contractId}/milestones/${milestoneId}/decision`,
        {
          method: "POST",
          body: JSON.stringify({
            action: action === "approve" ? "approve" : "request_revision",
            note
          })
        }
      );
      showToast(
        action === "approve" ? "Milestone approved." : "Revision requested."
      );
    }

    $("#milestoneDialog").close();
    event.currentTarget.reset();
    await openWorkroom(contractId);
    loadNotificationCount();
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    setBusy(button, false);
  }
});

$("#messageForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!state.currentContract) return;

  const button = $("button[type=submit]", event.currentTarget);
  setBusy(button, true, "Sending...");

  const form = new FormData(event.currentTarget);

  try {
    await api(`/api/contracts/${state.currentContract._id}/messages`, {
      method: "POST",
      body: JSON.stringify({ body: form.get("body") })
    });

    event.currentTarget.reset();
    await openWorkroom(state.currentContract._id);
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    setBusy(button, false);
  }
});

$("#completeContractButton").addEventListener("click", async () => {
  if (!state.currentContract) return;
  if (!confirm("Mark this contract as completed?")) return;

  try {
    const data = await api(
      `/api/contracts/${state.currentContract._id}/complete`,
      {
        method: "POST",
        body: JSON.stringify({})
      }
    );

    showToast(data.message);
    go("contracts");
  } catch (error) {
    showToast(error.message, "error");
  }
});

$("#reviewForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = $("button[type=submit]", event.currentTarget);
  setBusy(button, true, "Publishing...");

  const form = new FormData(event.currentTarget);

  try {
    const data = await api("/api/reviews", {
      method: "POST",
      body: JSON.stringify({
        contractId: form.get("contractId"),
        rating: Number(form.get("rating")),
        comment: form.get("comment")
      })
    });

    showToast(data.message);
    $("#reviewDialog").close();
    event.currentTarget.reset();
    go("reviews");
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    setBusy(button, false);
  }
});

$("#profileForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = $("button[type=submit]", event.currentTarget);
  setBusy(button, true, "Saving...");

  const form = new FormData(event.currentTarget);

  try {
    const data = await api("/api/users/me", {
      method: "PATCH",
      body: JSON.stringify({
        name: form.get("name"),
        headline: form.get("headline"),
        bio: form.get("bio"),
        location: form.get("location"),
        country: form.get("country"),
        skills: parseSkills(form.get("skills")),
        hourlyRate: Number(form.get("hourlyRate") || 0),
        companyName: form.get("companyName"),
        website: form.get("website"),
        portfolioUrl: form.get("portfolioUrl"),
        availability: form.get("availability") || "available"
      })
    });

    state.user = data.user;
    renderSidebar();
    showToast(data.message);
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    setBusy(button, false);
  }
});

$("#markAllRead").addEventListener("click", async () => {
  try {
    await api("/api/notifications/read-all", {
      method: "PATCH",
      body: JSON.stringify({})
    });
    await loadNotifications();
  } catch (error) {
    showToast(error.message, "error");
  }
});

$("#adminUsers").addEventListener("change", async (event) => {
  const accountSelect = event.target.closest(".admin-status-select");
  if (accountSelect) {
    try {
      const data = await api(`/api/admin/users/${accountSelect.dataset.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: accountSelect.value })
      });
      showToast(data.message);
    } catch (error) {
      showToast(error.message, "error");
      loadAdmin();
    }
    return;
  }

  const subscriptionSelect = event.target.closest(".admin-plan-select, .admin-sub-status-select");
  if (!subscriptionSelect) return;

  const row = subscriptionSelect.closest("tr");
  const plan = row.querySelector(".admin-plan-select").value;
  const subStatus = row.querySelector(".admin-sub-status-select").value;

  try {
    const data = await api(`/api/admin/users/${subscriptionSelect.dataset.id}/subscription`, {
      method: "PATCH",
      body: JSON.stringify({ plan, status: subStatus, expiresAt: null })
    });
    showToast(data.message);
  } catch (error) {
    showToast(error.message, "error");
    loadAdmin();
  }
});

$("#dashboardPrimary").addEventListener("click", () => {
  if (state.user.role === "client") go("post");
  else if (state.user.role === "provider") go("marketplace");
  else go("admin");
});

$("#dashboardSectionButton").addEventListener("click", () => {
  if (state.user.role === "client") go("experts");
  else if (state.user.role === "provider") go("marketplace");
  else go("admin");
});

$("#backToContracts").addEventListener("click", () => go("contracts"));
$("#openMenu").addEventListener("click", () => $("#sidebar").classList.add("open"));
$("#closeMenu").addEventListener("click", () => $("#sidebar").classList.remove("open"));

bootstrap();
