// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function() {
    // Get the coding list item and the popups
    const codingItem = document.getElementById("coding");
    const rugbyItem = document.getElementById("rugby");
    const gaaItem = document.getElementById("gaa");
    const golfItem = document.getElementById("golf");
    const gymItem = document.getElementById("gym");
    const learningItem = document.getElementById("learning");

    const popup = document.getElementById("popup");
    const popupRugby = document.getElementById("popup-rugby");
    const popupGaa = document.getElementById("popup-gaa");
    const popupGolf = document.getElementById("popup-golf");
    const popupGym = document.getElementById("popup-gym");
    const popupLearning = document.getElementById("popup-learning");

    // New popups for trips
    const popupPortugal = document.getElementById("popup-portugal");
    const popupGalway = document.getElementById("popup-galway");
    const popupAmericaWest = document.getElementById("popup-america-west");
    const popupAmericaEast = document.getElementById("popup-america-east");
    const popupIceland = document.getElementById("popup-iceland");

    const skillsListItems = document.querySelectorAll('.skills-list li'); // Select all list items

    // Debug: Log all elements to ensure they're found
    console.log("List items:", {codingItem, rugbyItem, gaaItem, golfItem, gymItem, learningItem});
    console.log("Popups:", {popup, popupRugby, popupGaa, popupGolf, popupGym, popupLearning, popupPortugal, popupGalway, popupAmericaWest, popupAmericaEast, popupIceland});

    // Function to close all pop-ups
    function closeAllPopups() {
        [popup, popupRugby, popupGaa, popupGolf, popupGym, popupLearning, popupPortugal, popupGalway, popupAmericaWest, popupAmericaEast, popupIceland].forEach(p => {
            if (p) {
                p.classList.remove("show");
                p.classList.remove("active");
            }
        });
        skillsListItems.forEach(item => item.classList.remove('active'));
    }

    function showPopup(popupElement, listItem) {
        console.log('Attempting to show popup:', popupElement, 'for item:', listItem);
        if (popupElement && listItem) {
            closeAllPopups(); // Close any open popups before showing a new one
            popupElement.classList.add("show");
            popupElement.classList.add("active");
            listItem.classList.add('active');
            console.log('Popup shown successfully');
        } else {
            console.error('Popup or list item not found:', {popupElement, listItem});
        }
    }

    // Add click event listeners with debug logging
    const addClickListener = (item, popup) => {
        if (item) {
            item.addEventListener("click", () => {
                console.log(`Clicked on ${item.id}`);
                showPopup(popup, item);
            });
        } else {
            console.error(`Element not found: ${item}`);
        }
    };

    // Add click event listeners for the skills items
    addClickListener(codingItem, popup);
    addClickListener(rugbyItem, popupRugby);
    addClickListener(gaaItem, popupGaa);
    addClickListener(golfItem, popupGolf);
    addClickListener(gymItem, popupGym);
    addClickListener(learningItem, popupLearning);

    // Add click event listeners for the trip items
    addClickListener(document.getElementById("trip-portugal"), popupPortugal);
    addClickListener(document.getElementById("trip-galway"), popupGalway);
    addClickListener(document.getElementById("trip-america-west"), popupAmericaWest);
    addClickListener(document.getElementById("trip-america-east"), popupAmericaEast);
    addClickListener(document.getElementById("trip-iceland"), popupIceland);
});
