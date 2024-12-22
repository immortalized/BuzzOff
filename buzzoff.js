(function() {
    'use strict';

    function showAntiHoneyPopup() {
        const popup = document.createElement('div');
        popup.id = 'buzz-off-popup';

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
                <button id="buzz-off-close" class="popup-close-btn">Close</button>
            </div>
        `;

        document.body.appendChild(popup);

        document.getElementById('buzz-off-close').addEventListener('click', () => {
            popup.remove();
        });

        const style = document.createElement('style');
        style.innerHTML = `
            #buzz-off-popup {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 999999;
                background-color: #171d24;
                color: #ecf0f1;
                border: 2px solid #404447;
                border-radius: 12px;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
                max-width: 600px;
                width: 90%;
                text-align: justify;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                padding: 20px;
                line-height: 1.6;
                overflow-y: auto;
                max-height: 80%;
                overflow-x: hidden;
                transition: transform 0.3s ease-in-out;
            }

            .popup-heading {
                color: #e74c3c;
                font-size: 1.8em;
                margin-bottom: 10px;
            }

            .popup-text, .popup-text-center {
                font-size: 1em;
                color: #bdc3c7;
            }

            .popup-cta {
                font-size: 1em;
                color: #e74c3c;
                font-weight: bold;
                margin-top: 20px;
            }

            .popup-list {
                font-size: 1em;
                margin: 10px 0 15px;
                padding-left: 20px;
                color: #bdc3c7;
                list-style: disc;
                list-style-position: inside;
            }

            .popup-text-center {
                text-align: center;
                margin-top: 20px;
            }

            .popup-iframe-container {
                text-align: center;
                margin-top: 20px;
            }

            .popup-close-btn-container {
                text-align: center;
                margin-top: 15px;
            }

            .popup-close-btn {
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
            #buzz-off-popup::-webkit-scrollbar {
                width: 10px;
            }

            #buzz-off-popup::-webkit-scrollbar-thumb {
                background-color: #2c3e50;
                border-radius: 10px;
                border: 3px solid #171d24;
            }

            #buzz-off-popup::-webkit-scrollbar-thumb:hover {
                background-color: #232e3e;
            }

            #buzz-off-popup::-webkit-scrollbar-track {
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

    // Stage 1: Observe DOM for Honey injection
    const observer = new MutationObserver((mutationsList, observer) => {
        mutationsList.forEach(mutation => {
            if (mutation.type === 'childList') {
                const honeyLinkTag = document.querySelector('link[href*="cdn.honey.io"]');
                if (honeyLinkTag) {
                    // Honey has injected itself, show the popup
                    showAntiHoneyPopup();
                    // Stop observing once Honey is detected
                    observer.disconnect();
                }
            }
        });
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });

    console.warn('🔄 Waiting for Honey to inject itself.');

    setTimeout(() => {
        observer.disconnect();
        console.warn('⏳ 30 seconds passed. Stopping observer. Checking network requests.');

        // Check network requests for Honey after stopping the observer
        if (checkNetwork()) {
            showAntiHoneyPopup();
        } else{
            console.warn('✅ Honey not found.');
        }
    }, 30000);
})();
