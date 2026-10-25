let currentUser = JSON.parse(localStorage.getItem("mb_isolated_session") || "null");
let selectedModel = "OpenAI GPT-OSS 20B";
let currentPowerMode = "Max";
let currentChatId = "chat-" + Date.now();
let currentMessages = [];
let captchaSum = 11;

// Unique browser token for device limit enforcement and 3-key rate limiting
let clientDeviceId = localStorage.getItem("mb_device_token");
if (!clientDeviceId) {
    clientDeviceId = "dev-" + Math.random().toString(36).substring(2, 11);
    localStorage.setItem("mb_device_token", clientDeviceId);
}

window.addEventListener("DOMContentLoaded", () => {
    const endpoint = window.location.origin + "/v1/chat/completions";
    const epBox = document.getElementById("extEndpointUrlBox");
    if (epBox) epBox.value = endpoint;

    refreshCaptcha();
    renderIntegrationCodes();

    if (currentUser && currentUser.owner_key) {
        applyUserSession(currentUser);
    } else {
        document.getElementById("guestButtons").classList.remove("hidden");
        document.getElementById("loggedInControls").classList.add("hidden");
    }

    const promptEl = document.getElementById("promptInput");
    if (promptEl) {
        promptEl.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }

    document.addEventListener("click", (e) => {
        const picker = document.getElementById("modelPicker");
        if (picker && !picker.contains(e.target)) {
            document.getElementById("modelMenu").classList.add("hidden");
        }
    });
});

// NAVIGATION BETWEEN SEPARATE FULL PAGES
function switchView(viewId) {
    document.querySelectorAll(".view-section").forEach(sec => sec.classList.add("hidden"));
    const target = document.getElementById(viewId);
    if (target) target.classList.remove("hidden");

    document.querySelectorAll(".nav-link").forEach(btn => btn.classList.remove("active-nav"));
    if (viewId === "workspaceView") document.getElementById("navBtn1").classList.add("active-nav");
    if (viewId === "apiStudioView" || viewId === "externalApiKeyView" || viewId === "adminPublicKeyView") {
        document.getElementById("navBtn2").classList.add("active-nav");
    }
    if (viewId === "codeStructureView") document.getElementById("navBtn3").classList.add("active-nav");
    if (viewId === "editionView") document.getElementById("navBtn4").classList.add("active-nav");
}

function openExternalApiKeyPage() {
    switchView("externalApiKeyView");
    refreshCaptcha();
    loadExternalServerApiKeys();
}

function openAdminPublicKeyPage() {
    if (!currentUser || !currentUser.is_admin) return;
    switchView("adminPublicKeyView");
    loadAdminPublicKeys();
}

// MODEL & POWER MODE
function toggleModelMenu(e) {
    e.stopPropagation();
    document.getElementById("modelMenu").classList.toggle("hidden");
}

function selectModel(name) {
    selectedModel = name;
    document.getElementById("selectedModelLabel").innerText = name;
    document.getElementById("modelMenu").classList.add("hidden");
}

function setPowerMode(mode, btn) {
    currentPowerMode = mode;
    document.querySelectorAll(".mode-pill").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
}

// APPLY USER / ADMIN SESSION
function applyUserSession(user) {
    currentUser = user;
    localStorage.setItem("mb_isolated_session", JSON.stringify(user));

    document.getElementById("guestButtons").classList.add("hidden");
    document.getElementById("loggedInControls").classList.remove("hidden");

    document.getElementById("dollarChip").innerText =
        user.dollars === "Unlimited" ? "$ Unlimited" : `$${Number(user.dollars).toFixed(2)}`;
    document.getElementById("creditChip").innerText =
        user.credits === "Unlimited" ? "Unlimited Cr" : `${user.credits} Cr`;

    const label = user.is_admin ? "ADMIN" : "KEY USER";
    document.getElementById("personalLabel").innerText = label;
    document.getElementById("drawerUserName").innerText = label;
    document.getElementById("drawerUserSub").innerText =
        user.remaining_str ? `Time: ${user.remaining_str}` : "Active Session";

    const adminBtn = document.getElementById("adminPublicKeyMenuBtn");
    if (user.is_admin) {
        adminBtn.classList.remove("hidden");
    } else {
        adminBtn.classList.add("hidden");
    }

    renderIntegrationCodes();
    loadSavedChats();
}

// =========================================================================
// AUTH MODAL: GOOGLE/GITHUB ALWAYS WRONG, MORE -> [ KEY | LOGIN ]
// =========================================================================
function openAuthModal() {
    hideAuthError();
    document.getElementById("authModal").classList.remove("hidden");
}

function closeModal(id) {
    document.getElementById(id).classList.add("hidden");
}

function toggleMoreMenu() {
    document.getElementById("moreSecretLinks").classList.toggle("hidden");
}

function openProviderRejectBox(titleText) {
    hideAuthError();
    document.getElementById("providerRejectTitle").innerText = titleText;
    openWhiteSubBox("providerRejectBox");
}

function openWhiteSubBox(boxId) {
    hideAuthError();
    ["providerRejectBox", "publicKeyLoginBox", "adminMasterLoginBox"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.toggle("hidden", id !== boxId);
    });
}

async function triggerWrongPasswordError() {
    const res = await fetch("/v1/auth/provider-reject", { method: "POST" });
    const data = await res.json();
    showAuthError(data.error || "Wrong Password! Access Denied.");
}

async function submitPublicKeyLogin() {
    hideAuthError();
    const keyVal = document.getElementById("publicKeyInput").value.trim();
    if (!keyVal) {
        showAuthError("कृपया अपनी Public Key डालें!");
        return;
    }

    const res = await fetch("/v1/auth/key-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key_value: keyVal, device_id: clientDeviceId })
    });
    const data = await res.json();
    if (!res.ok) {
        showAuthError(data.error || "Wrong Key!");
        return;
    }
    applyUserSession(data);
    closeModal("authModal");
}

async function submitAdminMasterLogin() {
    hideAuthError();
    const username = document.getElementById("adminUserInput").value.trim();
    const password = document.getElementById("adminPassInput").value;
    if (!username || !password) {
        showAuthError("कृपया एडमिन यूज़रनेम और पासवर्ड डालें!");
        return;
    }

    const res = await fetch("/v1/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) {
        showAuthError(data.error || "Wrong Admin Credentials!");
        return;
    }
    applyUserSession(data);
    closeModal("authModal");
}

// =========================================================================
// PAGE 1 (ADMIN ONLY): PUBLIC LOGIN KEY GENERATOR
// =========================================================================
async function createAdminPublicKey() {
    if (!currentUser || !currentUser.is_admin) return;
    const custom_key = document.getElementById("pkCustomName").value.trim();
    const days = parseInt(document.getElementById("pkDays").value || "0", 10);
    const hours = parseInt(document.getElementById("pkHours").value || "0", 10);
    const minutes = parseInt(document.getElementById("pkMinutes").value || "0", 10);
    const max_users = parseInt(document.getElementById("pkMaxUsers").value || "1", 10);
    const credits = parseInt(document.getElementById("pkCredits").value || "400", 10);
    const dollars = parseFloat(document.getElementById("pkDollars").value || "50");

    const res = await fetch("/v1/admin/public-keys/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${currentUser.owner_key}`
        },
        body: JSON.stringify({ custom_key, days, hours, minutes, max_users, credits, dollars })
    });
    const data = await res.json();
    if (!res.ok) {
        alert(data.error || "Failed to create key");
        return;
    }
    document.getElementById("pkCustomName").value = "";
    document.getElementById("pkResultBanner").classList.remove("hidden");
    document.getElementById("pkResultOutput").value = data.key_value;
    loadAdminPublicKeys();
}

async function loadAdminPublicKeys() {
    if (!currentUser || !currentUser.is_admin) return;
    const res = await fetch("/v1/admin/public-keys/list", {
        headers: { "Authorization": `Bearer ${currentUser.owner_key}` }
    });
    const list = await res.json();
    document.getElementById("pkTotalCount").innerText = list.length;
    const tbody = document.getElementById("pkTableBody");
    if (!list.length) {
        tbody.innerHTML = `<tr><td colspan="5">No public keys generated yet.</td></tr>`;
        return;
    }
    tbody.innerHTML = list.map(k => `
        <tr>
            <td><code>${k.key_value}</code></td>
            <td><strong>${k.current_users} / ${k.max_users}</strong> Users</td>
            <td>${k.credits} Cr ($${Number(k.dollars).toFixed(2)})</td>
            <td>${k.time_left}</td>
            <td>
                <button type="button" class="btn-login" onclick="navigator.clipboard.writeText('${k.key_value}')">Copy</button>
                <button type="button" class="btn-login" onclick="deleteKeyRecord('${k.key_value}', true)">Delete</button>
            </td>
        </tr>
    `).join("");
}

// =========================================================================
// PAGE 2: EXTERNAL SERVER API KEY STUDIO (CAPTCHA + MAX 3 KEYS IN 48H)
// =========================================================================
function refreshCaptcha() {
    const a = Math.floor(Math.random() * 9) + 2;
    const b = Math.floor(Math.random() * 9) + 1;
    captchaSum = a + b;
    const q = document.getElementById("captchaQuestion");
    if (q) q.innerText = `${a} + ${b} = ?`;
    const ans = document.getElementById("captchaAnswer");
    if (ans) ans.value = "";
}

async function generateExternalServerApiKey() {
    const errEl = document.getElementById("extApiErrorMsg");
    errEl.classList.add("hidden");

    const userAns = parseInt(document.getElementById("captchaAnswer").value || "0", 10);
    if (userAns !== captchaSum) {
        errEl.innerText = "Wrong Captcha Answer! कृपया सही जोड़ लिखें।";
        errEl.classList.remove("hidden");
        refreshCaptcha();
        return;
    }

    const model_id = document.getElementById("extApiModelSelect").value;
    const ownerToken = (currentUser && currentUser.owner_key) ? currentUser.owner_key : clientDeviceId;
    const authHeader = (currentUser && currentUser.owner_key) ? `Bearer ${currentUser.owner_key}` : "";

    const res = await fetch("/v1/studio/api-keys/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": authHeader
        },
        body: JSON.stringify({ owner_token: ownerToken, model_id })
    });
    const data = await res.json();
    refreshCaptcha();

    if (!res.ok) {
        errEl.innerText = data.error || "Limit reached";
        errEl.classList.remove("hidden");
        return;
    }

    document.getElementById("extNewKeyBanner").classList.remove("hidden");
    document.getElementById("extNewKeyOutput").value = data.api_key;
    loadExternalServerApiKeys();
    renderIntegrationCodes(data.api_key);
}

async function loadExternalServerApiKeys() {
    const ownerToken = (currentUser && currentUser.owner_key) ? currentUser.owner_key : clientDeviceId;
    const authHeader = (currentUser && currentUser.owner_key) ? `Bearer ${currentUser.owner_key}` : "";
    const res = await fetch(`/v1/studio/api-keys/list/${encodeURIComponent(ownerToken)}`, {
        headers: { "Authorization": authHeader }
    });
    const list = await res.json();
    document.getElementById("extKeysCount").innerText = list.length;
    const tbody = document.getElementById("extKeysTableBody");
    if (!list.length) {
        tbody.innerHTML = `<tr><td colspan="4">No API keys generated yet.</td></tr>`;
        return;
    }
    tbody.innerHTML = list.map(k => `
        <tr>
            <td><code>${k.api_key}</code></td>
            <td>${k.credits} Cr ($${Number(k.dollars).toFixed(2)})</td>
            <td>${(k.created_at || "").slice(0, 10)}</td>
            <td>
                <button type="button" class="btn-login" onclick="navigator.clipboard.writeText('${k.api_key}')">Copy</button>
                ${currentUser && currentUser.is_admin ? `<button type="button" class="btn-login" onclick="deleteKeyRecord('${k.api_key}', false)">Delete</button>` : ""}
            </td>
        </tr>
    `).join("");
}

async function deleteKeyRecord(keyVal, isPublicPage) {
    await fetch(`/v1/keys/${encodeURIComponent(keyVal)}`, { method: "DELETE" });
    if (isPublicPage) loadAdminPublicKeys();
    else loadExternalServerApiKeys();
}

// =========================================================================
// CHAT WORKSPACE & STRICT PER-KEY ISOLATED CHAT HISTORY
// =========================================================================
async function sendMessage() {
    const input = document.getElementById("promptInput");
    const text = input.value.trim();
    if (!text) return;

    if (!currentUser || !currentUser.owner_key) {
        openAuthModal();
        return;
    }

    input.value = "";
    // Hide hero header AND the decorative bottom wave as soon as chat begins
    document.getElementById("heroHeader").classList.add("hidden");
    document.getElementById("homeBottomDecor").classList.add("hidden");
    document.getElementById("workspaceView").classList.add("chat-active");

    const thread = document.getElementById("chatThread");
    thread.classList.remove("hidden");

    currentMessages.push({ role: "user", content: text });
    appendUserBubble(text);
    const aiTextEl = appendAiCard("...");

    try {
        const res = await fetch("/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${currentUser.owner_key}`
            },
            body: JSON.stringify({
                model: selectedModel,
                mode: currentPowerMode,
                stream: true,
                messages: currentMessages
            })
        });

        if (!res.ok) {
            const err = await res.json();
            aiTextEl.innerText = err.error || "Error";
            return;
        }

        aiTextEl.innerText = "";
        const reader = res.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let fullReply = "";

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            const chunkStr = decoder.decode(value, { stream: true });
            for (const line of chunkStr.split("\n")) {
                if (line.startsWith("data: ") && !line.includes("[DONE]")) {
                    try {
                        const data = JSON.parse(line.slice(6));
                        const piece = (data.choices && data.choices[0] && data.choices[0].delta && data.choices[0].delta.content) ? data.choices[0].delta.content : "";
                        fullReply += piece;
                        aiTextEl.innerText = fullReply;
                        thread.scrollTop = thread.scrollHeight;
                    } catch (e) {}
                }
            }
        }

        currentMessages.push({ role: "assistant", content: fullReply });

        if (!currentUser.is_admin && typeof currentUser.credits === "number") {
            currentUser.credits = Math.max(0, currentUser.credits - 1);
            currentUser.dollars = Math.max(0, Number((currentUser.dollars - 0.10).toFixed(2)));
            document.getElementById("creditChip").innerText = `${currentUser.credits} Cr`;
            document.getElementById("dollarChip").innerText = `$${currentUser.dollars.toFixed(2)}`;
            localStorage.setItem("mb_isolated_session", JSON.stringify(currentUser));
        }

        await saveIsolatedChat();
    } catch (e) {
        aiTextEl.innerText = "Connection Error. Please try again.";
    }
}

function appendUserBubble(text) {
    const thread = document.getElementById("chatThread");
    const row = document.createElement("div");
    row.className = "msg-row";
    const bubble = document.createElement("div");
    bubble.className = "msg-user-bubble";
    bubble.innerText = text;
    row.appendChild(bubble);
    thread.appendChild(row);
    thread.scrollTop = thread.scrollHeight;
}

function appendAiCard(initialText) {
    const thread = document.getElementById("chatThread");
    const row = document.createElement("div");
    row.className = "msg-row";
    const card = document.createElement("div");
    card.className = "msg-ai-card";
    const head = document.createElement("div");
    head.className = "msg-ai-header";
    head.innerText = `MONEY BAGGA AI (${selectedModel})`;
    const body = document.createElement("div");
    body.className = "msg-ai-text";
    body.innerText = initialText;
    card.appendChild(head);
    card.appendChild(body);
    row.appendChild(card);
    thread.appendChild(row);
    thread.scrollTop = thread.scrollHeight;
    return body;
}

async function saveIsolatedChat() {
    if (!currentUser || !currentUser.owner_key || !currentMessages.length) return;
    await fetch("/v1/chats/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: currentChatId,
            owner_key: currentUser.owner_key,
            title: currentMessages[0].content.slice(0, 32),
            messages: currentMessages
        })
    });
    loadSavedChats();
}

async function loadSavedChats() {
    if (!currentUser || !currentUser.owner_key) return;
    const res = await fetch(`/v1/chats/${encodeURIComponent(currentUser.owner_key)}`);
    const chats = await res.json();
    const wrap = document.getElementById("drawerSavedChats");
    if (!chats.length) {
        wrap.innerHTML = `<div class="drawer-empty">No recent sessions</div>`;
        return;
    }
    wrap.innerHTML = "";
    chats.forEach(c => {
        const div = document.createElement("div");
        div.className = "saved-chat-item";
        div.innerText = c.title;
        div.onclick = () => {
            closeRightDrawer();
            switchView("workspaceView");
            currentChatId = c.chat_id;
            currentMessages = c.messages || [];
            document.getElementById("heroHeader").classList.add("hidden");
            document.getElementById("homeBottomDecor").classList.add("hidden");
            document.getElementById("workspaceView").classList.add("chat-active");
            const thread = document.getElementById("chatThread");
            thread.classList.remove("hidden");
            thread.innerHTML = "";
            currentMessages.forEach(m => {
                if (m.role === "user") appendUserBubble(m.content);
                else appendAiCard(m.content);
            });
        };
        wrap.appendChild(div);
    });
}

// =========================================================================
// CODE EXAMPLES & COPY BUTTONS
// =========================================================================
function renderIntegrationCodes(customKey) {
    const endpoint = window.location.origin + "/v1/chat/completions";
    const modelSel = document.getElementById("extApiModelSelect");
    const modelId = modelSel ? modelSel.value : "mani-core-v1.2";
    const key = customKey || (currentUser && !currentUser.is_admin ? currentUser.api_key : "sk-mani-YOUR_GENERATED_KEY");

    const pyEl = document.getElementById("pyCodeBlock");
    if (pyEl) {
        pyEl.innerText = `import requests

url = "${endpoint}"
headers = {
    "Authorization": "Bearer ${key}",
    "Content-Type": "application/json"
}
payload = {
    "model": "${modelId}",
    "messages": [{"role": "user", "content": "Hello Mani AI!"}]
}

res = requests.post(url, headers=headers, json=payload)
print(res.json()["choices"][0]["message"]["content"])`;
    }

    const jsEl = document.getElementById("jsCodeBlock");
    if (jsEl) {
        jsEl.innerText = `const response = await fetch("${endpoint}", {
    method: "POST",
    headers: {
        "Authorization": "Bearer ${key}",
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        model: "${modelId}",
        messages: [{ role: "user", content: "Hello from JavaScript!" }]
    })
});
const data = await response.json();
console.log(data.choices[0].message.content);`;
    }

    const htmlEl = document.getElementById("htmlCodeBlock");
    if (htmlEl) {
        htmlEl.innerText = `<!DOCTYPE html>
<html>
<body>
  <input id="msg" placeholder="Ask Mani AI...">
  <button onclick="ask()">Send</button>
  <pre id="out"></pre>
  <script>
    async function ask() {
      const res = await fetch("${endpoint}", {
        method: "POST",
        headers: {
          "Authorization": "Bearer ${key}",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "${modelId}",
          messages: [{ role: "user", content: document.getElementById("msg").value }]
        })
      });
      const data = await res.json();
      document.getElementById("out").innerText = data.choices[0].message.content;
    }
  <\/script>
</body>
</html>`;
    }
}

function copyInputById(id, btn) {
    const el = document.getElementById(id);
    if (!el) return;
    navigator.clipboard.writeText(el.value);
    if (btn) {
        const old = btn.innerText;
        btn.innerText = "Copied!";
        setTimeout(() => { btn.innerText = old; }, 1200);
    }
}

function copyPreById(id, btn) {
    const el = document.getElementById(id);
    if (!el) return;
    navigator.clipboard.writeText(el.innerText);
    if (btn) {
        const old = btn.innerText;
        btn.innerText = "Copied!";
        setTimeout(() => { btn.innerText = old; }, 1200);
    }
}

// UI HELPERS
function resetToHome() {
    currentChatId = "chat-" + Date.now();
    currentMessages = [];
    document.getElementById("chatThread").innerHTML = "";
    document.getElementById("chatThread").classList.add("hidden");
    document.getElementById("heroHeader").classList.remove("hidden");
    document.getElementById("homeBottomDecor").classList.remove("hidden");
    document.getElementById("workspaceView").classList.remove("chat-active");
}

function toggleRightDrawer() {
    document.getElementById("rightDrawer").classList.toggle("open");
    document.getElementById("drawerBackdrop").classList.toggle("hidden");
}

function closeRightDrawer() {
    document.getElementById("rightDrawer").classList.remove("open");
    document.getElementById("drawerBackdrop").classList.add("hidden");
}

function showAuthError(msg) {
    const el = document.getElementById("authErrorMsg");
    el.innerText = msg;
    el.classList.remove("hidden");
}

function hideAuthError() {
    document.getElementById("authErrorMsg").classList.add("hidden");
}

function setQuickPrompt(txt) {
    switchView("workspaceView");
    const input = document.getElementById("promptInput");
    input.value = txt;
    input.focus();
}

function logoutUser() {
    localStorage.removeItem("mb_isolated_session");
    location.reload();
}
