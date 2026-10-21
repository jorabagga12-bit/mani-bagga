/* C) SLIDER FIX: सिर्फ़ असली slides गिनो, ताकि आख़िर में blank पेज न आए */
window.addEventListener('DOMContentLoaded', function () {
    window.moveFrontSlide = function (direction, event) {
        if (event) { event.stopPropagation(); clearInterval(sliderInterval); startSlider(); }
        var track = document.getElementById('frontSliderTrack');
        if (!track) return;
        var slides = Array.prototype.filter.call(track.children, function (el) {
            return /^(IMG|VIDEO|IFRAME)$/.test(el.tagName) || el.classList.contains('clean-video-wrapper');
        });
        if (!slides.length) return;
        currentSlideIndex += direction;
        if (currentSlideIndex < 0) currentSlideIndex = slides.length - 1;
        if (currentSlideIndex >= slides.length) currentSlideIndex = 0;
        track.style.transform = 'translateX(-' + (currentSlideIndex * 100) + '%)';
    };
});
/* Adds the blue section at the end of the Home page (right above the footer). Skips if it already exists in the page. */
window.addEventListener('DOMContentLoaded', function () {
    var home = document.getElementById('page-home');
    if (!home || document.getElementById('speed-section')) return;
    var sec = document.createElement('div');
    sec.id = 'speed-section';
    sec.className = 'speed-sec';
    sec.innerHTML = `
        <div class="speed-in">
            <p class="spd-eyebrow"><span>03</span> TIMINGS FROM REAL DEPLOYS</p>
            <h2 class="spd-title">Fast enough that <em>you never leave the conversation.</em></h2>
            <div class="spd-grid">
                <div class="spd-cell"><p class="spd-num"><small>~</small>36<small>s</small></p><p class="spd-cap">A static site, from push to live</p></div>
                <div class="spd-cell"><p class="spd-num"><small>~</small>1.2<small>s</small></p><p class="spd-cap">To read and analyse your code</p></div>
                <div class="spd-cell"><p class="spd-num">0</p><p class="spd-cap">Config files added to your project</p></div>
                <div class="spd-cell"><p class="spd-num">1</p><p class="spd-cap">Sentence to deploy it</p></div>
            </div>
            <p class="spd-note">The first two are wall-clock, taken from the platform’s own records.</p>
        </div>`;
    home.appendChild(sec);
});
        // ================= DYNAMIC CUSTOM ALERT SYSTEM ================= //
        let customAlertCallback = null;
        function customAlert(msg, title = "NOTIFICATION", icon = "fa-circle-info", type = "info", callback = null) {
            const modal = document.getElementById('customAlertModal');
            const titleElem = document.getElementById('customAlertTitle');
            const msgElem = document.getElementById('customAlertMsg');
            const iconElem = document.getElementById('customAlertIcon');
            
            titleElem.innerText = title;
            msgElem.innerText = msg;
            iconElem.innerHTML = `<i class="fa-solid ${icon}"></i>`;
            
            if(type === 'success') {
                iconElem.style.color = '#28a745'; iconElem.style.textShadow = '0 0 15px #28a745'; titleElem.style.color = '#28a745';
            } else if(type === 'error') {
                iconElem.style.color = '#ff004c'; iconElem.style.textShadow = '0 0 15px #ff004c'; titleElem.style.color = '#ff004c';
            } else {
                iconElem.style.color = '#00d2ff'; iconElem.style.textShadow = '0 0 15px #00d2ff'; titleElem.style.color = '#00d2ff';
            }
            
            customAlertCallback = callback;
            modal.style.display = 'flex';
        }

        function closeCustomAlert() {
            document.getElementById('customAlertModal').style.display = 'none';
            if(customAlertCallback) { customAlertCallback(); customAlertCallback = null; }
        }

        let customConfirmCallback = null;
        function customConfirm(msg, callback) {
            document.getElementById('customConfirmMsg').innerText = msg;
            customConfirmCallback = callback;
            document.getElementById('customConfirmModal').style.display = 'flex';
        }

        function handleConfirmChoice(choice) {
            document.getElementById('customConfirmModal').style.display = 'none';
            if(customConfirmCallback) { customConfirmCallback(choice); customConfirmCallback = null; }
        }

        let customPromptCallback = null;
        function customPrompt(title, msg, callback) {
            document.getElementById('customPromptTitle').innerText = title;
            document.getElementById('customPromptMsg').innerText = msg;
            document.getElementById('customPromptInput').value = '';
            customPromptCallback = callback;
            document.getElementById('customPromptModal').style.display = 'flex';
        }

        function submitCustomPrompt() {
            const val = document.getElementById('customPromptInput').value.trim();
            document.getElementById('customPromptModal').style.display = 'none';
            if(customPromptCallback) { customPromptCallback(val); customPromptCallback = null; }
        }

        function closeCustomPrompt() {
            document.getElementById('customPromptModal').style.display = 'none';
            if(customPromptCallback) { customPromptCallback(null); customPromptCallback = null; }
        }

        // ================= ALIGNMENT GRID TOGGLE ================= //
        function toggleAlignmentGrid() {
            const grid = document.getElementById('alignmentGridOverlay');
            if (grid) {
                grid.style.display = (grid.style.display === 'none' || grid.style.display === '') ? 'block' : 'none';
            }
        }

        // ================= PAGE ROUTING LOGIC ================= //
        function navigateTo(pageId) {
            if ((typeof isMoveModeActive !== 'undefined' && isMoveModeActive) || (typeof isResizeModeActive !== 'undefined' && isResizeModeActive)) return; 
            if (document.activeElement && document.activeElement.classList.contains('editable-active')) return;
            
            document.querySelectorAll('.page-view').forEach(page => page.classList.remove('active'));
            const targetPage = document.getElementById('page-' + pageId);
            if (targetPage) { 
                targetPage.classList.add('active'); 
                window.scrollTo(0, 0); 
            }
        }

        function goToHomeSection(sectionId) {
            if ((typeof isMoveModeActive !== 'undefined' && isMoveModeActive) || (typeof isResizeModeActive !== 'undefined' && isResizeModeActive)) return; 
            if (document.activeElement && document.activeElement.classList.contains('editable-active')) return;
            
            navigateTo('home');
            setTimeout(() => { 
                const elem = document.getElementById(sectionId);
                if(elem) elem.scrollIntoView({behavior: 'smooth'}); 
            }, 100);
        }

        // ================= AUTO SLIDER ================= //
        let currentSlideIndex = 0; let sliderInterval;
        function startSlider() { 
            if(sliderInterval) clearInterval(sliderInterval);
            const heroCard = document.getElementById('tilt-card');
            if (heroCard && heroCard.classList.contains('slim') && window.matchMedia('(max-width: 900px)').matches) return;
            sliderInterval = setInterval(() => { moveFrontSlide(1); }, 3000); 
        }
        function moveFrontSlide(direction, event) {
            if(event) { event.stopPropagation(); clearInterval(sliderInterval); startSlider(); } 
            const track = document.getElementById('frontSliderTrack');
            if(!track || track.children.length === 0) return;
            const totalSlides = track.children.length;
            currentSlideIndex += direction;
            if (currentSlideIndex < 0) currentSlideIndex = totalSlides - 1;
            if (currentSlideIndex >= totalSlides) currentSlideIndex = 0;
            track.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
        }

        // ================= CONTACT FORM & MESSAGES SYSTEM ================= //
        function submitUserMessage(e) {
            e.preventDefault();
            const name = document.getElementById('senderName').value.trim();
            const email = document.getElementById('senderEmail').value.trim();
            const msg = document.getElementById('senderMsg').value.trim();
            if(!name || !email || !msg) return;

            const newMessage = { name: name, email: email, message: msg, date: new Date().toLocaleString() };
            let messagesList = JSON.parse(localStorage.getItem('mani_user_messages') || '[]');
            messagesList.push(newMessage);
            localStorage.setItem('mani_user_messages', JSON.stringify(messagesList));

            customAlert('Thank you! Your message has been sent successfully.', 'MESSAGE SENT', 'fa-paper-plane', 'success');
            document.getElementById('siteContactForm').reset();
            updateMessageCounter();
        }

        function updateMessageCounter() {
            let btn = document.getElementById('adminViewMsgBtn');
            if(btn) {
                let messagesList = JSON.parse(localStorage.getItem('mani_user_messages') || '[]');
                btn.innerHTML = `<i class="fa-solid fa-envelope-open-text"></i> View Messages (${messagesList.length})`;
                if(messagesList.length > 0) btn.style.background = "#e91e63"; 
                else btn.style.background = "#8a2be2";
            }
        }

        function openAdminMessages() {
            const listContainer = document.getElementById('messagesListContainer');
            let messagesList = JSON.parse(localStorage.getItem('mani_user_messages') || '[]');
            if(messagesList.length === 0) {
                listContainer.innerHTML = '<p style="color:#b3b3cc; text-align:center;">No new messages yet.</p>';
            } else {
                listContainer.innerHTML = messagesList.reverse().map(m => `
                    <div style="background:#1a1a2e; border:1px solid #00d2ff; padding:15px; border-radius:8px; margin-bottom:15px;">
                        <p style="margin:0 0 5px 0; color:#00d2ff; font-size:15px;"><strong>Name:</strong> ${m.name}</p>
                        <p style="margin:0 0 10px 0; color:#ffc107; font-size:15px;"><strong>Email:</strong> ${m.email}</p>
                        <div style="background:#10101a; padding:10px; border-radius:5px; color:white; font-size:14px; line-height:1.5;">${m.message}</div>
                        <small style="color:#888; display:block; margin-top:10px; font-size:11px;">Sent on: ${m.date}</small>
                    </div>
                `).join('');
            }
            document.getElementById('adminMessagesModal').style.display = 'flex';
        }

        function closeAdminMessages() { document.getElementById('adminMessagesModal').style.display = 'none'; }
        function clearAllMessages() {
            customConfirm('Are you sure you want to delete all messages? This cannot be undone.', function(confirmed) {
                if(confirmed) {
                    localStorage.removeItem('mani_user_messages'); openAdminMessages(); updateMessageCounter();
                }
            });
        }

        // ================= NOTIFICATION SYSTEM ================= //
        let currentActiveNotifItem = null;

        function viewNotification(item) {
            currentActiveNotifItem = item;
            const title = item.querySelector('.notif-title').innerText;
            const desc = item.querySelector('.notif-desc').innerText;
            const imgElem = item.querySelector('img.notif-hidden-media');
            const vidElem = item.querySelector('video.notif-hidden-media');

            document.getElementById('viewNotifTitle').innerText = title;
            document.getElementById('viewNotifDesc').innerText = desc;

            const modalImg = document.getElementById('viewNotifImg');
            const modalVid = document.getElementById('viewNotifVid');

            modalImg.style.display = 'none';
            modalVid.style.display = 'none';

            if (imgElem && imgElem.src) {
                modalImg.src = imgElem.src;
                modalImg.style.display = 'block';
            } else if (vidElem && vidElem.src) {
                modalVid.src = vidElem.src;
                modalVid.style.display = 'block';
            }

            if (localStorage.getItem('mani_admin_logged') === 'true') {
                document.getElementById('adminEditNotifBtn').style.display = 'block';
            } else {
                document.getElementById('adminEditNotifBtn').style.display = 'none';
            }

            document.getElementById('viewNotifModal').style.display = 'flex';
        }

        function closeViewNotif(e) {
            if(e && e.target !== document.getElementById('viewNotifModal')) return;
            document.getElementById('viewNotifModal').style.display = 'none';
            const modalVid = document.getElementById('viewNotifVid');
            modalVid.pause();
            currentActiveNotifItem = null;
        }

        function addNewNotification() {
            currentActiveNotifItem = null; 
            document.getElementById('notifModalHeader').innerHTML = '<i class="fa-solid fa-bell"></i> Add New Notification';
            document.getElementById('notifEditTitle').value = '';
            document.getElementById('notifEditDesc').value = '';
            document.getElementById('notifMediaFile').value = '';
            document.getElementById('notifSubmitBtn').innerHTML = '<i class="fa-solid fa-plus-circle"></i> PUBLISH NOTIFICATION';
            document.getElementById('innerUploadModal').style.display = 'flex';
        }

        function openUploadModalFromView() {
            if(!currentActiveNotifItem) return;
            document.getElementById('viewNotifModal').style.display = 'none';
            document.getElementById('notifModalHeader').innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Edit Notification';
            document.getElementById('notifEditTitle').value = currentActiveNotifItem.querySelector('.notif-title').innerText;
            document.getElementById('notifEditDesc').value = currentActiveNotifItem.querySelector('.notif-desc').innerText;
            document.getElementById('notifMediaFile').value = '';
            document.getElementById('notifSubmitBtn').innerHTML = '<i class="fa-solid fa-check-circle"></i> UPDATE NOTIFICATION';
            document.getElementById('innerUploadModal').style.display = 'flex';
        }

        function closeUploadModal(e) {
            document.getElementById('innerUploadModal').style.display = 'none';
        }

        function confirmNotifAction(e) {
            e.preventDefault();
            const title = document.getElementById('notifEditTitle').value.trim();
            const desc = document.getElementById('notifEditDesc').value.trim();
            const fileInput = document.getElementById('notifMediaFile');
            
            if(!title || !desc) {
                customAlert('Please enter both title and message.', 'WARNING', 'fa-triangle-exclamation', 'error');
                return;
            }

            const todayDate = new Date().toLocaleDateString('en-GB').split('/').join('-');

            if (currentActiveNotifItem) {
                currentActiveNotifItem.querySelector('.notif-title').innerText = title;
                currentActiveNotifItem.querySelector('.notif-desc').innerText = desc;
                
                if (fileInput.files && fileInput.files[0]) {
                    const file = fileInput.files[0];
                    const reader = new FileReader();
                    reader.onload = function(evt) {
                        const fileData = evt.target.result;
                        let oldImg = currentActiveNotifItem.querySelector('img.notif-hidden-media');
                        let oldVid = currentActiveNotifItem.querySelector('video.notif-hidden-media');
                        if(oldImg) oldImg.remove();
                        if(oldVid) oldVid.remove();

                        const textContainer = currentActiveNotifItem.querySelector('.notif-text');
                        if(file.type.startsWith('image/')) {
                            let newImg = document.createElement('img');
                            newImg.src = fileData;
                            newImg.className = 'media-target notif-hidden-media';
                            newImg.style.display = 'none';
                            textContainer.appendChild(newImg);
                        } else if(file.type.startsWith('video/')) {
                            let newVid = document.createElement('video');
                            newVid.src = fileData;
                            newVid.className = 'media-target notif-hidden-media';
                            newVid.style.display = 'none';
                            textContainer.appendChild(newVid);
                        }
                        bindMediaClickHandlers();
                        customAlert('Notification Updated Successfully!', 'SUCCESS', 'fa-circle-check', 'success');
                        closeUploadModal();
                    };
                    reader.readAsDataURL(file);
                } else {
                    customAlert('Notification Updated Successfully!', 'SUCCESS', 'fa-circle-check', 'success');
                    closeUploadModal();
                }
            } else {
                const wrapper = document.getElementById('notifWrapper');
                const newItem = document.createElement('div');
                newItem.className = 'notif-list-item';
                newItem.onclick = function() { viewNotification(newItem); };

                if (fileInput.files && fileInput.files[0]) {
                    const file = fileInput.files[0];
                    const reader = new FileReader();
                    reader.onload = function(evt) {
                        const fileData = evt.target.result;
                        let tagMarkup = file.type.startsWith('video/') ? 
                            `<video src="${fileData}" class="media-target notif-hidden-media" style="display:none;"></video>` : 
                            `<img src="${fileData}" class="media-target notif-hidden-media" style="display:none;">`;
                        
                        newItem.innerHTML = `
                            <div class="notif-date">${todayDate}</div>
                            <div class="notif-text">
                                <div class="notif-title">${title}</div>
                                <div class="notif-desc" style="display:none;">${desc}</div>
                                ${tagMarkup}
                            </div>
                        `;
                        wrapper.insertBefore(newItem, wrapper.firstChild);
                        bindMediaClickHandlers();
                        customAlert('New Notification Published Successfully! Go to Notifications page to view it.', 'PUBLISHED', 'fa-circle-check', 'success');
                        closeUploadModal();
                    };
                    reader.readAsDataURL(file);
                } else {
                    newItem.innerHTML = `
                        <div class="notif-date">${todayDate}</div>
                        <div class="notif-text">
                            <div class="notif-title">${title}</div>
                            <div class="notif-desc" style="display:none;">${desc}</div>
                        </div>
                    `;
                    wrapper.insertBefore(newItem, wrapper.firstChild);
                    customAlert('New Notification Published Successfully! Go to Notifications page to view it.', 'PUBLISHED', 'fa-circle-check', 'success');
                    closeUploadModal();
                }
            }
        }

        // ================= ADMIN AUTHENTICATION SYSTEM ================= //
        let currentTargetElement = null; 
        let isWaitingToPlaceText = false; // TEXT CARD PLACEMENT FIX

        const GITHUB_OWNER = 'jorabagga12-bit';       
        const GITHUB_REPO = 'mani-bagga';             
        const FILE_PATH = 'index.html';

        window.addEventListener('DOMContentLoaded', () => {
            startSlider(); 
            if (localStorage.getItem('mani_admin_logged') === 'true') { activateAdminMode(); }
        });

        // GLOBAL CLICK EVENT TO HIDE POPUP CONTROLS & ADD TEXT CARD
        document.addEventListener('click', function(e) {
            if (isWaitingToPlaceText) {
                if (e.target.closest('.admin-modal') || e.target.closest('.admin-dashboard') || e.target.closest('#customAlertModal')) {
                    return; 
                }
                
                e.preventDefault();
                e.stopPropagation();

                isWaitingToPlaceText = false;
                document.body.style.cursor = 'default';

                const activePage = document.querySelector('.page-view.active');
                
                const newItem = document.createElement('div');
                newItem.className = 'showcase-item custom-text-card';
                newItem.style.position = 'absolute';
                newItem.style.left = e.pageX + 'px';
                newItem.style.top = e.pageY + 'px';
                newItem.style.zIndex = '50';
                newItem.style.width = '300px';
                
                newItem.innerHTML = `
                    <div>
                        <h3 contenteditable="true" class="editable-active" style="color:#00d2ff; margin-bottom:10px;">Custom Text</h3>
                        <p contenteditable="true" class="editable-active" style="color:white; font-size:15px;">Write here...</p>
                    </div>
                `;
                
                if (activePage) activePage.appendChild(newItem);
                else document.body.appendChild(newItem);
                
                attachDeleteBtnIfEditing(newItem);
                
                return;
            }

            let imgControls = document.getElementById('admin-img-controls');
            if(imgControls && !imgControls.contains(e.target) && !e.target.classList.contains('media-target')) {
                imgControls.remove();
                startSlider();
            }
            
            let textControls = document.getElementById('admin-text-controls');
            if(textControls && !textControls.contains(e.target) && !e.target.classList.contains('editable-active')) textControls.remove();
        });

        function handleAdminBadgeClick(e) {
            if ((typeof isMoveModeActive !== 'undefined' && isMoveModeActive) || (typeof isResizeModeActive !== 'undefined' && isResizeModeActive)) {
                if(e) e.preventDefault();
                return;
            }

            if (localStorage.getItem('mani_admin_logged') === 'true') {
                const toolsMenu = document.getElementById('adminEditTools');
                
                if (toolsMenu && toolsMenu.style.display === 'block') {
                    let imgElem = document.querySelector('.admin-img');
                    if (e && (e.target === imgElem || e.target.closest('.admin-badge-left'))) {
                        currentTargetElement = imgElem;
                        showAdminImageControls(e, imgElem);
                        return;
                    }
                }
                customAlert('Admin Mode is Active! Use the tools floating at the bottom right.', 'ADMIN MODE', 'fa-user-gear', 'info');
            } else { 
                openAdminLogin(); 
            }
        }

        function openAdminLogin() {
            document.getElementById('adminUserX').value = ''; document.getElementById('adminPassX').value = '';
            document.getElementById('adminLoginModal').style.display = 'flex';
        }
        function closeAdminLogin() { document.getElementById('adminLoginModal').style.display = 'none'; }

        function handleLogin(e) {
            e.preventDefault();
            const user = document.getElementById('adminUserX').value.trim();
            const pass = document.getElementById('adminPassX').value.trim();
            
            if (user === 'bagga' && pass === 'iphonex0421&') {
                try { localStorage.setItem('mani_admin_logged', 'true'); } catch(err) {}
                closeAdminLogin();
                customAlert('Admin Logged In! 🚀\n\n- Click "View Messages" to read contact forms.\n- Click "Edit Website" to open editing tools.', 'WELCOME ADMIN', 'fa-shield-halved', 'success');
                activateAdminMode();
            } else {
                document.getElementById('wrongPassModal').style.display = 'flex';
                const errBox = document.getElementById('errorBoxAnim');
                errBox.style.animation = 'none';
                setTimeout(() => { errBox.style.animation = 'errorShake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both'; }, 10);
            }
        }

        function logoutAdmin() {
            localStorage.removeItem('mani_admin_logged');
            customAlert('Admin logged out successfully!', 'LOGOUT', 'fa-right-from-bracket', 'info', function() {
                window.location.reload();
            });
        }

        function activateAdminMode() {
            document.getElementById('adminDashboard').style.display = 'block';
            document.getElementById('adminTagLabel').innerText = "ADMIN (LOGGED IN)";
            document.getElementById('adminTagLabel').style.color = "#28a745";
            updateMessageCounter();
        }

        // ================= CARD DELETION HELPER FUNCTIONS ================= //
        function deleteThisCard(btn, event) {
            if (event) { event.stopPropagation(); event.preventDefault(); }
            customConfirm("क्या आप इस पूरे कार्ड/गैलरी आइटम को डिलीट करना चाहते हैं?", function(confirmed) {
                if(confirmed) {
                    const card = btn.closest('.showcase-item, .card-3d');
                    if (card) { card.remove(); }
                }
            });
        }

        function deleteCardFromTextControls(event) {
            if (event) { event.stopPropagation(); event.preventDefault(); }
            if (!currentTextElement) return;
            const card = currentTextElement.closest('.showcase-item, .card-3d');
            if (card) {
                customConfirm("क्या आप इस पूरे कार्ड को डिलीट करना चाहते हैं?", function(confirmed) {
                    if(confirmed) {
                        card.remove();
                        document.getElementById('admin-text-controls')?.remove();
                    }
                });
            }
        }

        function attachDeleteBtnIfEditing(cardElement) {
            const toolsMenu = document.getElementById('adminEditTools');
            if (toolsMenu && toolsMenu.style.display === 'block') {
                if (!cardElement.querySelector('.card-delete-btn')) {
                    let delBtn = document.createElement('button');
                    delBtn.className = 'card-delete-btn';
                    delBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i> Delete Card';
                    delBtn.title = "Delete this card";
                    delBtn.onclick = function(e) { deleteThisCard(this, e); };
                    cardElement.appendChild(delBtn);
                }
            }
        }

        // ================= EDIT TOOLS TOGGLE ================= //
        function toggleEditWebsiteTools() {
            const toolsMenu = document.getElementById('adminEditTools');
            const editBtn = document.getElementById('toggleEditBtn');
            const textElements = document.querySelectorAll('h1, h2, h3, h4, p:not(.notif-desc), span:not(.close-btn):not(.admin-tag), .nav-links a, .footer-logo, footer p, .email-text, .admin-name, .btn-primary, .btn-main, .btn-secondary, label, .logo, .logo span');

            if (toolsMenu.style.display === 'block') {
                toolsMenu.style.display = 'none';
                editBtn.innerHTML = '<i class="fa-solid fa-pen-ruler"></i> Edit Website';
                editBtn.style.background = '#28a745';
                
                textElements.forEach(el => { 
                    el.contentEditable = "false"; 
                    el.classList.remove('editable-active'); 
                    el.onclick = null;
                });
                document.querySelectorAll('.media-target').forEach(elem => {
                    elem.classList.remove('media-editable');
                    elem.removeAttribute('title');
                    elem.onclick = null;
                });
                
                document.querySelectorAll('.card-delete-btn').forEach(btn => btn.remove());

                let floatingControlImg = document.getElementById('admin-img-controls'); 
                if(floatingControlImg) floatingControlImg.remove();
                
                let floatingControlText = document.getElementById('admin-text-controls'); 
                if(floatingControlText) floatingControlText.remove();
                
                startSlider();

            } else {
                toolsMenu.style.display = 'block';
                editBtn.innerHTML = '<i class="fa-solid fa-xmark"></i> Close Tools';
                editBtn.style.background = '#dc3545';
                
                textElements.forEach(el => { 
                    el.contentEditable = "true"; 
                    el.classList.add('editable-active'); 
                    
                    el.onclick = function(e) {
                        if (localStorage.getItem('mani_admin_logged') === 'true' && !isMoveModeActive && !isResizeModeActive) { 
                            showAdminTextControls(e, el);
                        }
                    };
                });

                // EDIT INSTAGRAM & YOUTUBE SOCIAL LINKS IN EDIT MODE
                document.querySelectorAll('.hero-btns a, .social-links a, .email-text a').forEach(link => {
                    link.onclick = function(e) {
                        if (localStorage.getItem('mani_admin_logged') === 'true' && !isMoveModeActive && !isResizeModeActive) {
                            e.preventDefault();
                            e.stopPropagation();
                            customPrompt("EDIT LINK URL", "Enter Instagram / YouTube / Email URL for this button:", function(newUrl) {
                                if(newUrl) {
                                    link.href = newUrl;
                                    customAlert("Link URL updated successfully!", "URL UPDATED", "fa-link", "success");
                                }
                            });
                        }
                    };
                });

                bindMediaClickHandlers();

                document.querySelectorAll('.showcase-item, .card-3d').forEach(item => {
                    attachDeleteBtnIfEditing(item);
                });
            }
        }

        // ================= TEXT EDIT CONTROLS ================= //
        let currentTextElement = null;

        function showAdminTextControls(e, elem) {
            currentTextElement = elem;
            let existingText = document.getElementById('admin-text-controls'); if(existingText) existingText.remove();
            let existingImg = document.getElementById('admin-img-controls'); if(existingImg) { existingImg.remove(); startSlider(); }
            
            let cardParent = elem.closest('.showcase-item, .card-3d');
            let cardDelBtnMarkup = cardParent ? `<button onclick="deleteCardFromTextControls(event)" style="background:#dc3545; color:#fff; padding:6px 10px; border:none; cursor:pointer; font-weight:bold; border-radius:4px;" title="Delete Whole Card"><i class="fa-solid fa-trash"></i> Card</button>` : '';

            let controls = document.createElement('div'); controls.id = 'admin-text-controls';
            controls.style.position = 'absolute'; 
            controls.style.left = Math.min(e.pageX, window.innerWidth - 350) + 'px'; 
            controls.style.top = (e.pageY - 50) + 'px';
            controls.style.background = '#10101a'; 
            controls.style.border = '2px solid #00d2ff'; 
            controls.style.padding = '8px 12px'; 
            controls.style.borderRadius = '8px'; 
            controls.style.zIndex = '100000'; 
            controls.style.display = 'flex'; 
            controls.style.gap = '6px'; 
            controls.style.boxShadow = '0 5px 20px rgba(0,0,0,0.9)';
            
            controls.innerHTML = `
                <button onclick="changeTextSize(2, event)" style="background:#28a745; color:#fff; padding:6px 10px; border:none; cursor:pointer; font-weight:bold; border-radius:4px;" title="Increase Size"><i class="fa-solid fa-plus"></i> A</button>
                <button onclick="changeTextSize(-2, event)" style="background:#dc3545; color:#fff; padding:6px 10px; border:none; cursor:pointer; font-weight:bold; border-radius:4px;" title="Decrease Size"><i class="fa-solid fa-minus"></i> A</button>
                <button onclick="resizeBoxByElement(30, currentTextElement)" style="background:#8a2be2; color:#fff; padding:6px 10px; border:none; cursor:pointer; font-weight:bold; border-radius:4px;" title="Make Box Bigger">Box <i class="fa-solid fa-plus"></i></button>
                <button onclick="resizeBoxByElement(-30, currentTextElement)" style="background:#e91e63; color:#fff; padding:6px 10px; border:none; cursor:pointer; font-weight:bold; border-radius:4px;" title="Make Box Smaller">Box <i class="fa-solid fa-minus"></i></button>
                ${cardDelBtnMarkup}
                <button onclick="this.parentElement.remove()" style="background:transparent; color:red; border:none; cursor:pointer; font-size:18px; padding:0 4px;">&times;</button>
            `;
            document.body.appendChild(controls);
        }

        function changeTextSize(step, e) {
            if(e) { e.preventDefault(); e.stopPropagation(); }
            if(!currentTextElement) return;
            let currentSize = window.getComputedStyle(currentTextElement).fontSize;
            let newSize = parseFloat(currentSize) + step;
            currentTextElement.style.fontSize = newSize + 'px';
        }

        // ================= ADD NEW CARDS & SLIDES ================= //
        function getActiveContainer() {
            const activePage = document.querySelector('.page-view.active');
            if(!activePage) return null;
            let container = activePage.querySelector('.cards-grid') || activePage.querySelector('.showcase-grid');
            if (!container) {
                container = activePage.querySelector('section') || activePage;
            }
            return container;
        }

        function addHeroSlide() {
            const track = document.getElementById('frontSliderTrack');
            if(!track) { customAlert("Slider not found!", "ERROR", "fa-triangle-exclamation", "error"); return; }
            
            const newMedia = document.createElement('img');
            newMedia.src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80'; 
            newMedia.alt = 'New Hero Slide';
            newMedia.className = 'media-target media-editable';
            newMedia.title = "Click to Edit Image/Video";
            
            track.appendChild(newMedia);
            bindMediaClickHandlers();
            
            currentSlideIndex = track.children.length - 1;
            track.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
            
            customAlert('New Slide Box added! Click on this new photo to Upload your own Image or Paste Video URL.', 'SLIDE ADDED', 'fa-images', 'success');
        }

        function addNewMediaCard() {
            const container = getActiveContainer();
            if(!container) { customAlert('Container not found on page!', 'ERROR', 'fa-triangle-exclamation', 'error'); return; }
            
            const newItem = document.createElement('div');
            if (container.classList.contains('cards-grid')) {
                newItem.className = 'card-3d';
                newItem.style = "opacity: 1; transform: translateY(0px) scale(1); transition: 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);";
                newItem.innerHTML = `
                    <div class="card-icon"><i class="fa-solid fa-image"></i></div>
                    <div class="card-img-container">
                        <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80" alt="New Item" class="media-target">
                    </div>
                    <h3 contenteditable="true" class="editable-active">New Item Title</h3>
                    <p contenteditable="true" class="editable-active">Description here.</p>
                `;
            } else {
                newItem.className = 'showcase-item';
                newItem.innerHTML = `
                    <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80" alt="New Gallery Item" class="media-target">
                    <div class="showcase-overlay">
                        <h4 contenteditable="true" class="editable-active">New Epic Moment</h4>
                        <p contenteditable="true" class="editable-active">BGMI Gameplay Highlight</p>
                    </div>
                `;
            }

            container.appendChild(newItem);
            attachDeleteBtnIfEditing(newItem);
            bindMediaClickHandlers();
            customAlert('New Gallery Card Added Successfully on current page!', 'CARD ADDED', 'fa-circle-check', 'success');
        }

        function addYouTubeVideo() {
            customPrompt("ADD YOUTUBE VIDEO", "Enter YouTube Video ID, Live URL, or Watch URL:", function(ytUrl) {
                if(!ytUrl) return;
                
                let ytMatch = ytUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|live\/|shorts\/))([^"&?\/\s]{11})/);
                let vidId = (ytMatch && ytMatch[1]) ? ytMatch[1] : (ytUrl.length === 11 ? ytUrl : ytUrl);
                
                // CLEAN EMBED WITHOUT YOUTUBE BRANDING / EXTRA LINKS / TITLES / REDIRECTS
                let videoEmbedUrl = `https://www.youtube.com/embed/${vidId}?autoplay=1&mute=0&controls=1&loop=1&playlist=${vidId}&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`;
                
                const container = getActiveContainer();
                if(!container) return;
                
                const newItem = document.createElement('div');
                if (container.classList.contains('cards-grid')) {
                    newItem.className = 'card-3d';
                    newItem.style = "opacity: 1; transform: translateY(0px) scale(1);";
                } else {
                    newItem.className = 'showcase-item';
                }

                newItem.innerHTML = `
                    <div class="clean-video-wrapper" style="position:relative; width:100%; height:220px; overflow:hidden; border-radius:10px;">
                        <iframe class="media-target" width="100%" height="100%" src="${videoEmbedUrl}" title="Video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="border-radius:10px; border:none; transform:scale(1.18); transform-origin:center;"></iframe>
                        <div class="yt-blocker-top" style="position:absolute; top:0; left:0; width:100%; height:60px; z-index:5; background:transparent;"></div>
                    </div>
                    <div class="showcase-overlay" style="position:relative; background:rgba(0,0,0,0.8); padding:10px; margin-top:5px; border-radius:5px;">
                        <h4 contenteditable="true" class="editable-active">YouTube Gameplay</h4>
                        <p contenteditable="true" class="editable-active">Watch full match on channel</p>
                    </div>
                `;
                
                container.appendChild(newItem);
                attachDeleteBtnIfEditing(newItem);
                bindMediaClickHandlers(); 
                customAlert('Clean Video Card Added Successfully on current page!', 'VIDEO ADDED', 'fa-brands fa-youtube', 'success');
            });
        }

        function addNewTextCard() {
            isWaitingToPlaceText = true;
            customAlert('अब स्क्रीन पर कहीं भी टैप करें जहाँ आप टेक्स्ट लगाना चाहते हैं।', 'TAP TO PLACE', 'fa-hand-pointer', 'info');
            document.body.style.cursor = 'crosshair';
        }

        // ================= RESIZE SYSTEM ================= //
        let isResizeModeActive = false;
        let activeResize = null;
        let startW = 0, startH = 0, startX = 0, startY = 0;

        function toggleResizeMode() {
            isResizeModeActive = !isResizeModeActive;
            const btn = document.getElementById('dashResizeBtn');

            if(isResizeModeActive) {
                if (typeof isMoveModeActive !== 'undefined' && isMoveModeActive) toggleMoveMode();
                btn.style.background = '#ff4d4d'; btn.style.color = '#fff';
                btn.innerHTML = '<i class="fa-solid fa-check"></i> Stop Resizing';

                let floatingControlText = document.getElementById('admin-text-controls');
                if(floatingControlText) floatingControlText.remove();
                let floatingControlImg = document.getElementById('admin-img-controls');
                if(floatingControlImg) floatingControlImg.remove();
                startSlider();

                customAlert('Resize Mode is ON! \n\nअब आप किसी भी आइटम (फोटो, कार्ड, टेक्स्ट) या खाली पेज को पकड़ कर खींचें (Drag करें) उसे अपनी मर्ज़ी से बड़ा या छोटा करने के लिए।', 'RESIZE MODE ACTIVE', 'fa-crop-simple', 'info');
            } else {
                btn.style.background = '#673ab7'; btn.style.color = '#fff';
                btn.innerHTML = '<i class="fa-solid fa-crop-simple"></i> Resize Items';
            }
        }

        function initFreeResize(e, clientX, clientY) {
            if (localStorage.getItem('mani_admin_logged') !== 'true') return;
            if (isResizeModeActive) {
                let target = e.target.closest('.card-3d, .showcase-item, img, video, iframe, .custom-text-card, .hero-text, section, .page-view');
                if (target && !target.closest('.admin-dashboard') && !target.closest('.admin-modal')) {
                    activeResize = target;
                    let compStyle = window.getComputedStyle(activeResize);
                    startW = parseFloat(compStyle.width) || activeResize.offsetWidth;
                    startH = parseFloat(compStyle.height) || activeResize.offsetHeight;
                    startX = clientX;
                    startY = clientY;
                    activeResize.style.transition = "none";
                    activeResize.style.maxWidth = "none";
                    
                    if (activeResize.tagName.toLowerCase() !== 'section' && !activeResize.classList.contains('page-view')) {
                         activeResize.style.zIndex = "99999";
                    }
                    if(e.cancelable && !activeResize.classList.contains('page-view') && activeResize.tagName.toLowerCase() !== 'section') e.preventDefault();
                }
            }
        }

        function handleFreeResizeMove(e, clientX, clientY) {
            if (activeResize && isResizeModeActive) {
                let deltaX = clientX - startX;
                let deltaY = clientY - startY;
                
                if (activeResize.classList.contains('page-view') || activeResize.tagName.toLowerCase() === 'section') {
                    // Resize page background container
                    activeResize.style.minHeight = Math.max(100, startH + deltaY) + 'px';
                } else {
                    // Resize specific items
                    activeResize.style.width = Math.max(20, startW + deltaX) + 'px';
                    activeResize.style.height = Math.max(20, startH + deltaY) + 'px';
                }
                if(e.cancelable) e.preventDefault();
            }
        }

        function stopFreeResize() {
            if (activeResize) {
                activeResize.style.transition = "";
                activeResize.style.zIndex = "";
                activeResize = null;
            }
        }

        // ================= MOVE / DRAG SYSTEM ================= //
        let isMoveModeActive = false; 

        function toggleMoveMode() {
            if (typeof isResizeModeActive !== 'undefined' && isResizeModeActive) toggleResizeMode(); // Turn off resize if on
            isMoveModeActive = !isMoveModeActive;
            const btn = document.getElementById('dashMoveBtn');
            const editableElements = document.querySelectorAll('.editable-active');

            if(isMoveModeActive) {
                btn.style.background = '#ff4d4d'; btn.style.color = '#fff';
                btn.innerHTML = '<i class="fa-solid fa-check"></i> Stop Moving';
                editableElements.forEach(el => { el.contentEditable = "false"; el.style.userSelect = "none"; el.style.cursor = "move"; el.onclick = null; });
                
                let floatingControlText = document.getElementById('admin-text-controls'); 
                if(floatingControlText) floatingControlText.remove();
                let floatingControlImg = document.getElementById('admin-img-controls'); 
                if(floatingControlImg) floatingControlImg.remove();
                startSlider();

                customAlert('Move Mode is ON! \n\nअब आप किसी भी आइटम को पकड़ कर मूव कर सकते हैं।', 'MOVE MODE ACTIVE', 'fa-arrows-up-down-left-right', 'info');
            } else {
                btn.style.background = '#ff9800'; btn.style.color = '#000';
                btn.innerHTML = '<i class="fa-solid fa-arrows-up-down-left-right"></i> Move Items';
                editableElements.forEach(el => { 
                    el.contentEditable = "true"; 
                    el.style.userSelect = "auto"; 
                    el.style.cursor = "text"; 
                    
                    el.onclick = function(e) {
                        if (localStorage.getItem('mani_admin_logged') === 'true' && !isMoveModeActive && !isResizeModeActive) { 
                            showAdminTextControls(e, el);
                        }
                    };
                });
            }
        }

        let activeFreeDrag = null; let fDragX = 0, fDragY = 0; 
        function initFreeDrag(e, clientX, clientY) {
            if (localStorage.getItem('mani_admin_logged') !== 'true') return;
            
            if (isMoveModeActive) {
                let target = e.target.closest('.admin-badge-left') || e.target.closest('.logo') || e.target.closest('.nav-links') || e.target.closest('.navbar') || e.target.closest('a, li, h1, h2, h3, h4, p, span, img, video, iframe, .card-3d-main, .showcase-item, .card-3d, .hero-text, .notif-list-item, .notif-list-wrapper, .contact-box, .about-card');
                
                if (target && !target.closest('.admin-dashboard') && !target.closest('.admin-modal')) {
                    activeFreeDrag = target;
                    if (window.getComputedStyle(activeFreeDrag).position === 'static') activeFreeDrag.style.position = 'relative';
                    let currentLeft = parseFloat(activeFreeDrag.style.left) || 0; let currentTop = parseFloat(activeFreeDrag.style.top) || 0;
                    fDragX = clientX - currentLeft; fDragY = clientY - currentTop;
                    activeFreeDrag.style.zIndex = "99999"; activeFreeDrag.style.cursor = "grabbing"; activeFreeDrag.style.transition = "none"; 
                    if(isMoveModeActive) { e.preventDefault(); } 
                }
            }
        }

        function handleFreeDragMove(e, clientX, clientY) {
            if (activeFreeDrag) {
                activeFreeDrag.style.left = (clientX - fDragX) + 'px';
                activeFreeDrag.style.top = (clientY - fDragY) + 'px';
                if(e.cancelable) e.preventDefault();
            }
        }
        function stopFreeDrag() {
            if (activeFreeDrag) {
                activeFreeDrag.style.cursor = isMoveModeActive ? "move" : "";
                activeFreeDrag.style.zIndex = ""; activeFreeDrag.style.transition = ""; activeFreeDrag = null;
            }
        }

        // UNIFIED POINTER EVENTS FOR BOTH MOVE & RESIZE
        function unifiedPointerDown(e, clientX, clientY) {
            if(typeof isResizeModeActive !== 'undefined' && isResizeModeActive) initFreeResize(e, clientX, clientY);
            else if(typeof isMoveModeActive !== 'undefined' && isMoveModeActive) initFreeDrag(e, clientX, clientY);
        }
        function unifiedPointerMove(e, clientX, clientY) {
            if(typeof isResizeModeActive !== 'undefined' && isResizeModeActive) handleFreeResizeMove(e, clientX, clientY);
            else if(typeof isMoveModeActive !== 'undefined' && isMoveModeActive) handleFreeDragMove(e, clientX, clientY);
        }
        function unifiedPointerUp() {
            if(typeof stopFreeResize !== 'undefined') stopFreeResize();
            if(typeof stopFreeDrag !== 'undefined') stopFreeDrag();
        }

        document.addEventListener('mousedown', (e) => unifiedPointerDown(e, e.clientX, e.clientY), {passive: false});
        document.addEventListener('mousemove', (e) => unifiedPointerMove(e, e.clientX, e.clientY), {passive: false});
        document.addEventListener('mouseup', unifiedPointerUp);
        document.addEventListener('touchstart', (e) => unifiedPointerDown(e, e.touches[0].clientX, e.touches[0].clientY), {passive: false});
        document.addEventListener('touchmove', (e) => unifiedPointerMove(e, e.touches[0].clientX, e.touches[0].clientY), {passive: false});
        document.addEventListener('touchend', unifiedPointerUp);



        /* ===== A) YouTube: टाइटल/लोगो पर रीडायरेक्ट रोकना ===== */
(function () {
  function guardIframe(ifr) {
    if (!/youtube(-nocookie)?\.com\/embed/.test(ifr.src)) return;
    const wrap = ifr.closest('.clean-video-wrapper');
    if (!wrap) return;
    if (!wrap.querySelector('.yt-blocker-top')) {
      const t = document.createElement('div'); t.className = 'yt-blocker-top'; wrap.appendChild(t);
    }
    if (!wrap.querySelector('.yt-blocker-br')) {
      const b = document.createElement('div'); b.className = 'yt-blocker-br'; wrap.appendChild(b);
    }
    // सेटिंग्स: कम से कम YouTube ब्रांडिंग
    try {
      const u = new URL(ifr.src);
      ['modestbranding', 'rel', 'iv_load_policy'].forEach(k => u.searchParams.set(k, k === 'iv_load_policy' ? '3' : '1'));
      u.searchParams.set('rel', '0');
      if (u.toString() !== ifr.src) ifr.src = u.toString();
    } catch (e) {}
  }
  function scan() {
    document.querySelectorAll('iframe').forEach(guardIframe);
    if (typeof bindMediaClickHandlers === 'function') bindMediaClickHandlers(); // एडमिन एडिट के लिए
  }
  window.addEventListener('DOMContentLoaded', scan);
  new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true });
})();

/* ===== Mobile hero slider: scroll down = open + autoplay, scroll up = close + hide.
   Laptop / desktop keeps the original always-open slider. ===== */
(function () {
  const mobileQuery = window.matchMedia('(max-width: 900px)');
  window.addEventListener('DOMContentLoaded', function () {
    const card = document.getElementById('tilt-card');
    if (!card) return;
    let lastY = window.scrollY, ticking = false, lockUntil = 0;

    function applyState(open) {
      card.classList.toggle('slim', !open);
      card.classList.toggle('open', open);
      if (open) startSlider(); else clearInterval(sliderInterval);
    }
    function setOpen(open) {
      if (card.classList.contains('open') === open) return;
      applyState(open);
      lockUntil = performance.now() + 700; // ignore layout-induced scroll shifts while animating
    }
    function update() {
      ticking = false;
      if (!mobileQuery.matches) return;
      const y = window.scrollY;
      if (performance.now() < lockUntil) { lastY = y; return; }
      if (y <= 10) setOpen(false);
      else if (y > lastY + 4) setOpen(true);
      else if (y < lastY - 4) setOpen(false);
      lastY = y;
    }
    function sync() {
      lastY = window.scrollY;
      if (mobileQuery.matches) applyState(window.scrollY > 10);
      else applyState(true);
    }

    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    mobileQuery.addEventListener('change', sync);
    sync();
  });
})();

/* ===== Collapsible three-dot navigation menu (tablet / phone) ===== */
(function () {
  window.addEventListener('DOMContentLoaded', function () {
    const button = document.getElementById('navToggle');
    const menu = document.getElementById('primaryNav');
    if (!button || !menu) return;
    function setMenu(open) {
      menu.classList.toggle('open', open);
      button.setAttribute('aria-expanded', String(open));
      button.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    button.addEventListener('click', function (e) {
      e.stopPropagation();
      setMenu(!menu.classList.contains('open'));
    });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('click', function (e) { if (!e.target.closest('header')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    window.matchMedia('(min-width: 1025px)').addEventListener('change', function (e) { if (e.matches) setMenu(false); });
  });
})();

        
        // ================= MEDIA EDIT HANDLERS & CROP SYSTEM ================= //
        function bindMediaClickHandlers() {
            const mediaElements = document.querySelectorAll('.media-target:not(.notif-hidden-media)');
            mediaElements.forEach(elem => {
                elem.classList.add('media-editable'); elem.title = "Click to Edit Image/Video";
                
                const handleMediaClick = function(e) {
                    if (localStorage.getItem('mani_admin_logged') === 'true' && !isMoveModeActive && !isResizeModeActive) { 
                        e.preventDefault(); 
                        e.stopPropagation(); 
                        currentTargetElement = elem; 
                        showAdminImageControls(e, elem);
                    }
                };

                elem.onclick = handleMediaClick;

                let parentWrapper = elem.closest('.clean-video-wrapper');
                if (parentWrapper) {
                    let blocker = parentWrapper.querySelector('.yt-blocker-top');
                    if (blocker) {
                        blocker.onclick = handleMediaClick;
                    }
                }
                
                if(elem.tagName.toLowerCase() === 'video') {
                    elem.onpause = function() {
                        if (localStorage.getItem('mani_admin_logged') === 'true' && !isMoveModeActive && !isResizeModeActive) { 
                            currentTargetElement = elem; 
                            let rect = elem.getBoundingClientRect();
                            let mockEvent = {
                                pageX: window.scrollX + rect.left + (rect.width / 2) - 130,
                                pageY: window.scrollY + rect.top + (rect.height / 2)
                            };
                            showAdminImageControls(mockEvent, elem);
                        }
                    };
                    elem.onplay = function() {
                        let existing = document.getElementById('admin-img-controls'); 
                        if(existing) { existing.remove(); startSlider(); }
                    };
                }
            });
        }

        function showAdminImageControls(e, elem) {
            if (elem) currentTargetElement = elem; 
            
            if(typeof sliderInterval !== 'undefined') { clearInterval(sliderInterval); }

            let existingText = document.getElementById('admin-text-controls'); if(existingText) existingText.remove();
            let existing = document.getElementById('admin-img-controls'); if(existing) existing.remove();
            let controls = document.createElement('div'); controls.id = 'admin-img-controls';
            controls.style.position = 'absolute'; controls.style.left = Math.min(e.pageX, window.innerWidth - 450) + 'px'; controls.style.top = (e.pageY + 10) + 'px';
            controls.style.background = '#10101a'; controls.style.border = '2px solid #00d2ff'; controls.style.padding = '8px 12px'; controls.style.borderRadius = '8px'; controls.style.zIndex = '100000'; controls.style.display = 'flex'; controls.style.gap = '6px'; controls.style.boxShadow = '0 5px 20px rgba(0,0,0,0.9)';
            controls.innerHTML = `
                <button onclick="document.getElementById('adminFileInput').click()" style="background:#00d2ff; color:#000; padding:6px 10px; border:none; cursor:pointer; font-weight:bold; border-radius:4px;" title="Upload"><i class="fa-solid fa-upload"></i></button>
                <button onclick="changePhotoByUrl()" style="background:#ffc107; color:#000; padding:6px 10px; border:none; cursor:pointer; font-weight:bold; border-radius:4px;" title="Paste URL"><i class="fa-solid fa-link"></i></button>
                <button onclick="toggleImageCrop(event)" style="background:#ff5722; color:#fff; padding:6px 10px; border:none; cursor:pointer; font-weight:bold; border-radius:4px;" title="Crop / Fit Mode"><i class="fa-solid fa-crop-simple"></i> Crop</button>
                <button onclick="zoomElement(0.1, event)" style="background:#28a745; color:#fff; padding:6px 10px; border:none; cursor:pointer; font-weight:bold; border-radius:4px;" title="Zoom In"><i class="fa-solid fa-magnifying-glass-plus"></i> +</button>
                <button onclick="zoomElement(-0.1, event)" style="background:#dc3545; color:#fff; padding:6px 10px; border:none; cursor:pointer; font-weight:bold; border-radius:4px;" title="Zoom Out"><i class="fa-solid fa-magnifying-glass-minus"></i> -</button>
                <button onclick="resizeBoxByElement(30)" style="background:#8a2be2; color:#fff; padding:6px 10px; border:none; cursor:pointer; font-weight:bold; border-radius:4px;" title="Make Box Bigger">Box <i class="fa-solid fa-plus"></i></button>
                <button onclick="resizeBoxByElement(-30)" style="background:#e91e63; color:#fff; padding:6px 10px; border:none; cursor:pointer; font-weight:bold; border-radius:4px;" title="Make Box Smaller">Box <i class="fa-solid fa-minus"></i></button>
                <button onclick="deleteMediaElement()" style="background:#dc3545; color:#fff; padding:6px 10px; border:none; cursor:pointer; font-weight:bold; border-radius:4px;" title="Delete Card/Image/Video"><i class="fa-solid fa-trash"></i></button>
                <button onclick="this.parentElement.remove(); startSlider();" style="background:transparent; color:red; border:none; cursor:pointer; font-size:18px; padding:0 4px;">&times;</button>
            `;
            document.body.appendChild(controls);
        }

        // CROP / FIT TOGGLE FUNCTION
        function toggleImageCrop(e) {
            if(e) { e.preventDefault(); e.stopPropagation(); }
            if(!currentTargetElement) return;
            let currentFit = currentTargetElement.style.objectFit || 'cover';
            if(currentFit === 'cover') {
                currentTargetElement.style.objectFit = 'contain';
                customAlert("Image mode changed to: CONTAIN (Full image, no crop)", "IMAGE FIT", "fa-crop-simple", "info");
            } else if(currentFit === 'contain') {
                currentTargetElement.style.objectFit = 'fill';
                customAlert("Image mode changed to: FILL (Stretched)", "IMAGE FIT", "fa-crop-simple", "info");
            } else {
                currentTargetElement.style.objectFit = 'cover';
                customAlert("Image mode changed to: COVER (Cropped to box)", "IMAGE FIT", "fa-crop-simple", "info");
            }
        }

        function deleteMediaElement() {
            customConfirm("Are you sure you want to delete this photo/video/card?", function(confirmed) {
                if(confirmed && currentTargetElement) {
                    let parentCard = currentTargetElement.closest('.showcase-item');
                    if (parentCard) {
                        parentCard.remove();
                    } else {
                        currentTargetElement.remove();
                    }
                    document.getElementById('admin-img-controls')?.remove();
                    const track = document.getElementById('frontSliderTrack'); if (track) { currentSlideIndex = 0; track.style.transform = `translateX(0%)`; }
                    currentTargetElement = null;
                    startSlider();
                }
            });
        }

        function zoomElement(step, event) {
            if (event) { event.preventDefault(); event.stopPropagation(); }
            if(!currentTargetElement) return;
            let currentScale = parseFloat(currentTargetElement.getAttribute('data-scale')) || 1; 
            currentScale += step;
            if(currentScale < 0.3) currentScale = 0.3; 
            if(currentScale > 3.0) currentScale = 3.0; 
            
            currentTargetElement.setAttribute('data-scale', currentScale.toFixed(2)); 
            currentTargetElement.style.transform = `scale(${currentScale.toFixed(2)})`;
            currentTargetElement.style.transition = 'transform 0.2s ease';
        }

        function resizeBoxByElement(step, targetElem) {
            let elem = targetElem || currentTargetElement;
            if(!elem) return;
            let parentBox = elem.closest('.showcase-item, .card-3d, .custom-text-card');

            if(!parentBox) {
                let currentWidth = elem.offsetWidth;
                elem.style.width = (currentWidth + step) + 'px';
                return;
            }

            let currentWidth = parentBox.offsetWidth;
            parentBox.style.width = (currentWidth + step) + 'px';
            parentBox.style.minWidth = (currentWidth + step) + 'px';
            parentBox.style.maxWidth = 'none';

            if(!parentBox.classList.contains('custom-text-card')) {
                let currentHeight = parentBox.offsetHeight;
                parentBox.style.height = (currentHeight + step * 0.75) + 'px';
                parentBox.style.minHeight = (currentHeight + step * 0.75) + 'px';

                let imgContainer = parentBox.querySelector('.card-img-container');
                if(imgContainer) {
                    let currentImgHeight = imgContainer.offsetHeight;
                    imgContainer.style.height = (currentImgHeight + step * 0.75) + 'px';
                }
            }
        }

        function changePhotoByUrl() {
            customPrompt("PASTE IMAGE / VIDEO / INSTA URL", "Paste direct URL, YouTube link, or Instagram post/reel link here:", function(url) {
                if(url && currentTargetElement) {
                    
                    // YOUTUBE CLEAN EMBED PARSER
                    let ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|live\/|shorts\/))([^"&?\/\s]{11})/);
                    let ytId = (ytMatch && ytMatch[1]) ? ytMatch[1] : (url.length === 11 && !url.includes('/') ? url : null);

                    // INSTAGRAM CLEAN EMBED PARSER
                    let igMatch = url.match(/(?:instagram\.com\/(?:p|reel|reels)\/)([^"&?\/\s]+)/);
                    let igId = (igMatch && igMatch[1]) ? igMatch[1] : null;

                    if (ytId) {
                        let cleanEmbedSrc = `https://www.youtube.com/embed/${ytId}?autoplay=1&mute=0&controls=1&loop=1&playlist=${ytId}&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`;
                        
                        let parentWrapper = currentTargetElement.closest('.clean-video-wrapper');
                        if (parentWrapper) {
                            let iframe = parentWrapper.querySelector('iframe') || currentTargetElement;
                            iframe.src = cleanEmbedSrc;
                            iframe.style.transform = 'scale(1.18)';
                            iframe.style.transformOrigin = 'center';
                            if (!parentWrapper.querySelector('.yt-blocker-top')) {
                                let blocker = document.createElement('div');
                                blocker.className = 'yt-blocker-top';
                                blocker.style.cssText = 'position:absolute; top:0; left:0; width:100%; height:60px; z-index:5; background:transparent;';
                                parentWrapper.appendChild(blocker);
                            }
                            currentTargetElement = iframe;
                        } else {
                            let wrapper = document.createElement('div');
                            wrapper.className = 'clean-video-wrapper';
                            wrapper.style.cssText = 'position:relative; width:100%; height:100%; min-height:220px; overflow:hidden; border-radius:inherit;';

                            let iframe = document.createElement('iframe');
                            iframe.className = currentTargetElement.className;
                            iframe.src = cleanEmbedSrc;
                            iframe.setAttribute('frameborder', '0');
                            iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
                            iframe.setAttribute('allowfullscreen', 'true');
                            iframe.style.cssText = 'width:100%; height:100%; border:none; border-radius:inherit; transform:scale(1.18); transform-origin:center;';

                            let blocker = document.createElement('div');
                            blocker.className = 'yt-blocker-top';
                            blocker.style.cssText = 'position:absolute; top:0; left:0; width:100%; height:60px; z-index:5; background:transparent;';

                            wrapper.appendChild(iframe);
                            wrapper.appendChild(blocker);

                            currentTargetElement.parentNode.replaceChild(wrapper, currentTargetElement);
                            currentTargetElement = iframe;
                        }
                    } 
                    else if (igId) {
                        let iframe = document.createElement('iframe');
                        iframe.className = currentTargetElement.className;
                        iframe.src = `https://www.instagram.com/p/${igId}/embed`;
                        iframe.setAttribute('frameborder', '0');
                        iframe.setAttribute('scrolling', 'no');
                        iframe.setAttribute('allowtransparency', 'true');
                        iframe.style.width = '100%';
                        iframe.style.height = '100%';
                        iframe.style.minHeight = '350px';
                        iframe.style.borderRadius = 'inherit';
                        iframe.style.border = 'none';
                        
                        currentTargetElement.parentNode.replaceChild(iframe, currentTargetElement);
                        currentTargetElement = iframe;
                    }
                    else if(url.match(/\.(mp4|webm|ogg)$/i)) {
                        let newVideo = document.createElement('video'); 
                        newVideo.src = url; 
                        newVideo.controls = true; 
                        newVideo.autoplay = true; 
                        newVideo.muted = true; 
                        newVideo.loop = true; 
                        newVideo.className = currentTargetElement.className; 
                        currentTargetElement.parentNode.replaceChild(newVideo, currentTargetElement);
                        currentTargetElement = newVideo;
                    } else { 
                        if (currentTargetElement.tagName.toLowerCase() === 'iframe' || currentTargetElement.tagName.toLowerCase() === 'video') {
                            let newImg = document.createElement('img'); 
                            newImg.src = url; 
                            newImg.className = currentTargetElement.className; 
                            currentTargetElement.parentNode.replaceChild(newImg, currentTargetElement); 
                            currentTargetElement = newImg;
                        } else {
                            currentTargetElement.src = url; 
                        }
                    }
                    
                    document.getElementById('admin-img-controls')?.remove(); 
                    bindMediaClickHandlers(); 
                    startSlider();
                }
            });
        }

        function handleFileSelected(event) {
            const file = event.target.files[0]; if (!file || !currentTargetElement) return;
            const reader = new FileReader();
            reader.onload = function(e) {
                const fileData = e.target.result;
                if (file.type.startsWith('image/')) {
                    if (currentTargetElement.tagName.toLowerCase() === 'video' || currentTargetElement.tagName.toLowerCase() === 'iframe') { 
                        const newImg = document.createElement('img'); newImg.src = fileData; newImg.className = currentTargetElement.className; currentTargetElement.parentNode.replaceChild(newImg, currentTargetElement); currentTargetElement = newImg; 
                    } 
                    else { currentTargetElement.src = fileData; }
                } else if (file.type.startsWith('video/')) {
                    const newVideo = document.createElement('video'); newVideo.src = fileData; newVideo.controls = true; newVideo.autoplay = true; newVideo.muted = true; newVideo.loop = true; newVideo.className = currentTargetElement.className; currentTargetElement.parentNode.replaceChild(newVideo, currentTargetElement); currentTargetElement = newVideo;
                }
                document.getElementById('admin-img-controls')?.remove(); bindMediaClickHandlers(); startSlider();
            };
            reader.readAsDataURL(file); event.target.value = '';
        }

        // ================= GITHUB AUTO-SAVE SYSTEM ================= //
        function stringToBase64UTF8(str) {
            const encoder = new TextEncoder(); const bytes = encoder.encode(str); let binary = '';
            for (let i = 0; i < bytes.byteLength; i++) { binary += String.fromCharCode(bytes[i]); } return btoa(binary);
        }

        function clearSavedToken() {
            localStorage.removeItem('gh_token_bagga');
            customAlert("GitHub Token is already set to ask every time now. Old tokens cleared!", "TOKEN RESET", "fa-key", "info");
        }

        function closeGithubModal() {
            document.getElementById('githubTokenModal').style.display = 'none';
        }

        function saveGithubTokenAndProceed() {
            const inputVal = document.getElementById('githubTokenInputModal').value.trim();
            if(!inputVal) { customAlert('Please enter a valid GitHub token.', 'INVALID TOKEN', 'fa-triangle-exclamation', 'error'); return; }
            
            window.temp_gh_token_bagga = inputVal; 
            closeGithubModal();
            saveChangesToGitHub(true);
        }

        async function saveChangesToGitHub(isTokenReady = false) {
            if (isTokenReady !== true) { 
                document.getElementById('githubTokenInputModal').value = '';
                document.getElementById('githubTokenModal').style.display = 'flex';
                return; 
            }

            let token = window.temp_gh_token_bagga;

            const saveBtn = document.getElementById('btnSaveLive');
            saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...'; 
            saveBtn.disabled = true;

            try {
                const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}`;
                const getResponse = await fetch(apiUrl, { headers: { 'Authorization': `token ${token}` } }); 
                
                if (!getResponse.ok) {
                    if (getResponse.status === 401) {
                        throw new Error("GitHub Token Invalid or Expired! Please click Save again to re-enter your Token.");
                    }
                    throw new Error("GitHub Repository File or Token Invalid!");
                }
                
                const fileData = await getResponse.json(); const sha = fileData.sha;

                const toolsMenu = document.getElementById('adminEditTools');
                const wasOpen = toolsMenu.style.display === 'block';
                if (wasOpen) toggleEditWebsiteTools(); 

                let clone = document.documentElement.cloneNode(true);
                
                let clonedSaveBtn = clone.querySelector('#btnSaveLive'); 
                if(clonedSaveBtn) { 
                    clonedSaveBtn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> Save to Live Site'; 
                    clonedSaveBtn.disabled = false; 
                }
                
                let dash = clone.querySelector('#adminDashboard'); if(dash) dash.style.display = 'none';
                let modal = clone.querySelector('#adminLoginModal'); if(modal) modal.style.display = 'none';
                let ghModal = clone.querySelector('#githubTokenModal'); if(ghModal) ghModal.style.display = 'none';
                let upModal = clone.querySelector('#innerUploadModal'); if(upModal) upModal.style.display = 'none';
                let viewModal = clone.querySelector('#viewNotifModal'); if(viewModal) viewModal.style.display = 'none';
                let msgsModal = clone.querySelector('#adminMessagesModal'); if(msgsModal) msgsModal.style.display = 'none'; 
                let wrongModal = clone.querySelector('#wrongPassModal'); if(wrongModal) wrongModal.style.display = 'none';
                let customAlertM = clone.querySelector('#customAlertModal'); if(customAlertM) customAlertM.style.display = 'none';
                let customConfirmM = clone.querySelector('#customConfirmModal'); if(customConfirmM) customConfirmM.style.display = 'none';
                let customPromptM = clone.querySelector('#customPromptModal'); if(customPromptM) customPromptM.style.display = 'none';
                
                let floatingControlImg = clone.querySelector('#admin-img-controls'); if(floatingControlImg) floatingControlImg.remove();
                let floatingControlText = clone.querySelector('#admin-text-controls'); if(floatingControlText) floatingControlText.remove();
                
                clone.querySelectorAll('.card-delete-btn').forEach(btn => btn.remove());

                clone.querySelectorAll('.page-view').forEach(p => p.classList.remove('active'));
                let homeP = clone.querySelector('#page-home'); if(homeP) homeP.classList.add('active');
                
                const tagLbl = clone.querySelector('#adminTagLabel'); if(tagLbl) { tagLbl.innerText = "ADMIN"; tagLbl.style.color = ""; }

                clone.querySelectorAll('.editable-active').forEach(el => {
                    el.removeAttribute('contenteditable'); el.classList.remove('editable-active'); el.onclick = null;
                    el.style.border = ''; el.style.padding = '';
                });
                
                clone.querySelectorAll('.media-editable').forEach(el => {
                    el.classList.remove('media-editable'); el.removeAttribute('title');
                    el.style.outline = ''; el.onclick = null;
                });

                const fullHTML = "<!DOCTYPE html>\n<html lang=\"en\">\n" + clone.innerHTML + "\n</html>";
                const base64Content = stringToBase64UTF8(fullHTML);

                const putResponse = await fetch(apiUrl, {
                    method: 'PUT',
                    headers: { 'Authorization': `token ${token}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: 'Updated Site Content via Admin', content: base64Content, sha: sha })
                });

                if (putResponse.ok) {
                    customAlert('🎉 Awesome! All changes saved to Live Site successfully!', 'PUBLISHED TO LIVE', 'fa-cloud-arrow-up', 'success');
                } else { 
                    const errorDetails = await putResponse.json(); 
                    throw new Error(errorDetails.message || "Failed to update GitHub"); 
                }
                
                if (wasOpen) toggleEditWebsiteTools(); 

            } catch (error) {
                console.error("Save Error:", error); 
                customAlert('Save Error: ' + error.message, 'ERROR', 'fa-triangle-exclamation', 'error');
            } finally {
                saveBtn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> Save to Live Site'; 
                saveBtn.disabled = false;
                window.temp_gh_token_bagga = null; 
            }
        }
document.addEventListener('DOMContentLoaded', () => {

    /* ===================================================
       1. 3D CARD TILT EFFECT (3D माउस रोटेशन इफेक्ट)
       =================================================== */
    const tiltCard = document.getElementById('tilt-card');
    
    if (tiltCard) {
        tiltCard.parentElement.addEventListener('mousemove', (e) => {
            const rect = tiltCard.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // 3D कोण कैलकुलेशन
            const rotateX = (-y / 15).toFixed(2);
            const rotateY = (x / 15).toFixed(2);

            tiltCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
            tiltCard.style.transition = 'transform 0.1s ease-out';
        });

        tiltCard.parentElement.addEventListener('mouseleave', () => {
            tiltCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            tiltCard.style.transition = 'transform 0.5s ease-in-out';
        });
    }

    /* ===================================================
       2. ALL CARDS 3D HOVER EFFECT (सभी कार्ड्स पर 3D रिस्पॉन्स)
       =================================================== */
    const all3DCards = document.querySelectorAll('.card-3d, .showcase-item, .stat-card');
    
    all3DCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const rotateX = (-y / 20).toFixed(2);
            const rotateY = (x / 20).toFixed(2);

            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });

    /* ===================================================
       3. Dynamic 3D Floating Particles (3D कैनवास एनीमेशन)
       =================================================== */
    const canvas = document.createElement('canvas');
    canvas.id = 'particles-canvas';
    document.body.prepend(canvas);

    // कैनवास स्टाइल (वाइट और लाइट ब्लू बैकग्राउंड के लिए)
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-1';

    const ctx = canvas.getContext('2d');
    let particlesArray = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 5 + 2; // बबल्स का आकार
            this.speedX = (Math.random() - 0.5) * 1.2;
            this.speedY = (Math.random() - 0.5) * 1.2;
            // 3D वाइट और ब्लू शेड्स
            const colors = ['rgba(37, 99, 235, 0.25)', 'rgba(219, 234, 254, 0.6)', 'rgba(147, 197, 253, 0.3)'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();

            // 3D सॉफ्ट ग्लो
            ctx.shadowBlur = 8;
            ctx.shadowColor = 'rgba(37, 99, 235, 0.3)';
        }
    }

    function initParticles() {
        particlesArray = [];
        const numberOfParticles = Math.floor((canvas.width * canvas.height) / 18000);
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particlesArray.forEach(particle => {
            particle.update();
            particle.draw();
        });
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    /* ===================================================
       4. SMART SCROLL ANIMATION (स्क्रॉल करने पर 3D पॉप)
       =================================================== */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.card-3d, .showcase-item, .about-card, .contact-box').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px) scale(0.95)';
        el.style.transition = 'all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)';
        observer.observe(el);
    });
});

/* ===== PAGE LOADER: shown on every load/refresh, hidden once the page is ready ===== */
(function () {
    var shownAt = Date.now();
    var MIN_VISIBLE_MS = 900;
    function hideLoader() {
        var wait = Math.max(0, MIN_VISIBLE_MS - (Date.now() - shownAt));
        setTimeout(function () { document.documentElement.classList.add('page-ready'); }, wait);
    }
    if (document.readyState === 'complete') { hideLoader(); }
    else { window.addEventListener('load', hideLoader); }
})();

/* ===== ADMIN UPLOADS -> images/ FOLDER =====
   Additive wrapper only: the original upload, login and save functions are not modified.
   Newly uploaded images are committed to images/ on "Save to Live Site" and the <img> src
   is rewritten to the saved path before the page HTML is saved. */
(function () {
    var pendingUploads = new Map();
    var originalHandleFileSelected = window.handleFileSelected;
    var originalSaveChanges = window.saveChangesToGitHub;
    if (typeof originalHandleFileSelected !== 'function' || typeof originalSaveChanges !== 'function') return;

    window.handleFileSelected = function (event) {
        var file = event.target.files && event.target.files[0];
        if (file && file.type.indexOf('image/') === 0) {
            var reader = new FileReader();
            reader.onload = function (e) { pendingUploads.set(e.target.result, file); };
            reader.readAsDataURL(file);
        }
        return originalHandleFileSelected.apply(this, arguments);
    };

    function safeName(name) {
        return String(name || 'image').toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'image';
    }

    async function uploadPendingImages(token) {
        var counter = 0;
        var images = Array.prototype.slice.call(document.querySelectorAll('img'));
        for (var i = 0; i < images.length; i++) {
            var img = images[i];
            var src = img.getAttribute('src');
            if (!src || !pendingUploads.has(src)) continue;
            var file = pendingUploads.get(src);
            var fileName = 'upload-' + Date.now() + '-' + (counter++) + '-' + safeName(file.name);
            var apiUrl = 'https://api.github.com/repos/' + GITHUB_OWNER + '/' + GITHUB_REPO + '/contents/images/' + fileName;
            var response = await fetch(apiUrl, {
                method: 'PUT',
                headers: { 'Authorization': 'token ' + token, 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: 'Uploaded image via Admin', content: src.split(',')[1] })
            });
            if (!response.ok) { throw new Error('Image upload to images/ failed (' + response.status + ')'); }
            img.setAttribute('src', 'images/' + fileName);
            pendingUploads.delete(src);
        }
    }

    window.saveChangesToGitHub = async function (isTokenReady) {
        if (isTokenReady === true && pendingUploads.size) {
            try { await uploadPendingImages(window.temp_gh_token_bagga); }
            catch (err) { console.error('Image folder upload error:', err); }
        }
        return originalSaveChanges.apply(this, arguments);
    };
})();
