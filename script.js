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
        document.querySelectorAll('.popup').forEach(popup => {
            popup.style.display = 'none';
        });
        document.querySelector('.popup-overlay').style.display = 'none';
        document.body.classList.remove('popup-active');
        document.querySelectorAll('.skills-list li').forEach(item => {
            item.classList.remove('active');
        });
    }

    // Add click event listener to the document
    document.addEventListener('click', function(event) {
        // Check if the click was outside any popup
        const clickedElement = event.target;
        const isPopup = clickedElement.closest('.popup');
        const isSkillsListItem = clickedElement.closest('.skills-list li');
        
        // If click is outside popup and not on a skills list item, close all popups
        if (!isPopup && !isSkillsListItem) {
            closeAllPopups();
        }
    });

    // Prevent popup from closing when clicking inside it
    document.querySelectorAll('.popup').forEach(popup => {
        popup.addEventListener('click', function(event) {
            event.stopPropagation();
        });
    });

    function showPopup(popupElement, listItem) {
        if (popupElement && listItem) {
            closeAllPopups(); // Close any open popups first
            popupElement.style.display = 'block';
            document.querySelector('.popup-overlay').style.display = 'block';
            listItem.classList.add('active');
            document.body.classList.add('popup-active');
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
// Add click event listeners to all close buttons
document.querySelectorAll('.close-btn').forEach(button => {
    button.addEventListener('click', function() {
        this.closest('.popup').style.display = 'none';
        // If you're using a popup-overlay, also hide it
        document.querySelector('.popup-overlay').style.display = 'none';
    });
}); 
document.querySelectorAll('.skills-list li').forEach(item => {
    item.addEventListener('click', function() {
        const popupId = this.id.replace('trip-', 'popup-');
        const popup = document.getElementById(popupId);
        if (popup) {
            showPopup(popup, this);
        }
    });
});

// Close popup when clicking on the overlay
document.querySelector('.popup-overlay').addEventListener('click', closeAllPopups); 