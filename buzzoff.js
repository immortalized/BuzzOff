(function() {
    'use strict';

    // Utility function to generate random IDs
    function generateRandomId(length = 20) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    // Create a unique ID for the popup and close button
    const popupId = generateRandomId();
    const closeButtonId = generateRandomId();

    function showAntiHoneyPopup() {
        const popup = document.createElement('div');
        popup.id = popupId; // Assign the dynamically generated ID

        popup.innerHTML = `
            <h2 class="popup-heading">Honey Extension Warning 🚨</h2>
            <p class="popup-text">
                Honey’s practices exploit content creators and users, ultimately undermining the integrity of the e-commerce ecosystem.
            </p>
            <ul class="popup-list">
                <li><strong>Honey Doesn’t Find the Best Deals:</strong> While Honey claims to scan for the best coupons, it mostly relies on user-submitted coupons and merchant partnerships, which means it doesn’t always find the most valuable deals for users.</li>
                <li><strong>Affiliate Hijacking:</strong> Honey exploits the "Last-Click Wins" model, overriding original affiliate links. This means Honey earns the commission instead of the content creator or website that referred you.</li>
                <li><strong>Coupon Manipulation:</strong> Businesses can remove or prioritize certain coupons, meaning Honey may show less valuable codes, often tailored to its business partners.</li>
                <li><strong>Data Collection:</strong> Honey has access to your checkout page and purchasing behavior. Although it claims to anonymize data, users may not fully understand the extent of the data being collected.</li>
            </ul>
            <p class="popup-cta">
                We advise that you close the Honey popup and uninstall the extension before you continue with your checkout.
            </p>
            <p class="popup-text-center">
                Learn more about Honey and why it's a <i>scam</i>:
            </p>
            <div class="popup-iframe-container">
                <iframe width="560" height="315" src="https://www.youtube.com/embed/vc4yL3YTwWk" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
            <div class="popup-close-btn-container">
                <button id="${closeButtonId}" class="popup-close-btn">Close</button>
            </div>
        `;

        document.body.appendChild(popup);

        document.getElementById(closeButtonId).addEventListener('click', () => {
            popup.remove();
        });

        const style = document.createElement('style');
        style.innerHTML = `
            #${popupId} {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 999999;
                background-color: #171d24;
                color: #ecf0f1;
                border: 3px solid #171d24;
                border-radius: 12px;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
                max-width: 600px;
                width: 90%;
                text-align: justify;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                padding: 20px;
                line-height: 1.6;
                max-height: 80%;
                overflow-y: auto;
                overflow-x: hidden;
                transition: transform 0.3s ease-in-out;
            }

            #${popupId} .popup-heading {
                color: #e74c3c;
                font-size: 1.8em;
                margin-bottom: 10px;
            }

            #${popupId} .popup-text, #${popupId} .popup-text-center {
                font-size: 1em;
                color: #bdc3c7;
            }

            #${popupId} .popup-cta {
                font-size: 1em;
                color: #e74c3c;
                font-weight: bold;
                margin-top: 20px;
            }

            #${popupId} .popup-list {
                font-size: 1em;
                margin: 10px 0 15px;
                padding-left: 20px;
                color: #bdc3c7;
                list-style: disc;
                list-style-position: inside;
            }

            #${popupId} .popup-text-center {
                text-align: center;
                margin-top: 20px;
            }

            #${popupId} .popup-iframe-container {
                text-align: center;
                margin-top: 20px;
            }

            #${popupId} .popup-close-btn-container {
                text-align: center;
                margin-top: 15px;
            }

            #${popupId} .popup-close-btn {
                padding: 12px 20px;
                background-color: #e74c3c;
                color: white;
                border: none;
                font-size: 16px;
                border-radius: 6px;
                cursor: pointer;
                transition: background-color 0.2s, transform 0.2s;
            }

            /* Scrollbar styles */
            #${popupId}::-webkit-scrollbar {
                width: 10px;
            }

            #${popupId}::-webkit-scrollbar-thumb {
                background-color: #2c3e50;
                border-radius: 10px;
                border: 3px solid #171d24;
            }

            #${popupId}::-webkit-scrollbar-thumb:hover {
                background-color: #232e3e;
            }

            #${popupId}::-webkit-scrollbar-track {
                background-color: #171d24;
                border-radius: 10px;
            }
        `;
        document.head.appendChild(style);
    }

    function checkNetwork() {
        // Check for Honey through network requests
        if (typeof performance !== 'undefined' && performance.getEntriesByType) {
            const resources = performance.getEntriesByType('resource');
            for (let i = 0; i < resources.length; i++) {
                if (resources[i].name.includes('cdn.honey.io')) {
                    showAntiHoneyPopup();
                    return true;
                }
            }
        }
        return false;
    }

    // Fallback Stage: Check network requests for Honey if no detection in Stage 1
    const fallbackTimeout = setTimeout(() => {
        if (checkNetwork()) {
            showAntiHoneyPopup();
        }
    }, 30000);

    // Main Stage: Observe DOM for Honey injection
    const observer = new MutationObserver((mutationsList, observer) => {
        mutationsList.forEach(mutation => {
            if (mutation.type === 'childList') {
                const honeyLinkTag = document.querySelector('link[href*="cdn.honey.io"]');
                if (honeyLinkTag) {
                    // Honey has injected itself, show the popup
                    showAntiHoneyPopup();
                    // Stop observing once Honey is detected
                    observer.disconnect();
                    // Cancel the timeout
                    clearTimeout(fallbackTimeout);
                }
            }
        });
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
})();
