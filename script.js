document.addEventListener("DOMContentLoaded", function() {
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

    const popupPortugal = document.getElementById("popup-portugal");
    const popupGalway = document.getElementById("popup-galway");
    const popupAmericaWest = document.getElementById("popup-america-west");
    const popupAmericaEast = document.getElementById("popup-america-east");
    const popupIceland = document.getElementById("popup-iceland");

    const skillsListItems = document.querySelectorAll('.skills-list li');

    console.log("List items:", {codingItem, rugbyItem, gaaItem, golfItem, gymItem, learningItem});
    console.log("Popups:", {popup, popupRugby, popupGaa, popupGolf, popupGym, popupLearning, popupPortugal, popupGalway, popupAmericaWest, popupAmericaEast, popupIceland});

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

    document.addEventListener('click', function(event) {
        const clickedElement = event.target;
        const isPopup = clickedElement.closest('.popup');
        const isSkillsListItem = clickedElement.closest('.skills-list li');
        
        if (!isPopup && !isSkillsListItem) {
            closeAllPopups();
        }
    });

    document.querySelectorAll('.popup').forEach(popup => {
        popup.addEventListener('click', function(event) {
            event.stopPropagation();
        });
    });

    function showPopup(popupElement, listItem) {
        if (popupElement && listItem) {
            closeAllPopups();
            popupElement.style.display = 'block';
            document.querySelector('.popup-overlay').style.display = 'block';
            listItem.classList.add('active');
            document.body.classList.add('popup-active');
        }
    }

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

    addClickListener(codingItem, popup);
    addClickListener(rugbyItem, popupRugby);
    addClickListener(gaaItem, popupGaa);
    addClickListener(golfItem, popupGolf);
    addClickListener(gymItem, popupGym);
    addClickListener(learningItem, popupLearning);

    addClickListener(document.getElementById("trip-portugal"), popupPortugal);
    addClickListener(document.getElementById("trip-galway"), popupGalway);
    addClickListener(document.getElementById("trip-america-west"), popupAmericaWest);
    addClickListener(document.getElementById("trip-america-east"), popupAmericaEast);
    addClickListener(document.getElementById("trip-iceland"), popupIceland);

    const cvButton = document.querySelector('.cv-button');
    if (cvButton) {
        let attempts = 0;
        const maxAttempts = 3;
        
        const encrypt = (text) => {
            return btoa(text.split('').map((char, i) => 
                String.fromCharCode(char.charCodeAt(0) + ((i % 4) + 1))
            ).join(''));
        };

        const encryptedPass = "NTc4OQ==";
        
        cvButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            const lockoutTime = localStorage.getItem('cvLockoutTime');
            if (lockoutTime && Date.now() < parseInt(lockoutTime)) {
                const minutesLeft = Math.ceil((parseInt(lockoutTime) - Date.now()) / 60000);
                alert(`Too many attempts. Please try again in ${minutesLeft} minutes.`);
                return;
            }

            if (attempts >= maxAttempts) {
                localStorage.setItem('cvLockoutTime', Date.now() + (30 * 60 * 1000));
                alert("Maximum attempts reached. Please try again in 30 minutes.");
                return;
            }

            const password = prompt(`Please enter the password to download the CV (${maxAttempts - attempts} attempts remaining):`);
            
            if (password === null) return;
            
            if (btoa(password) === encryptedPass) {
                attempts = 0;
                localStorage.removeItem('cvLockoutTime');
                window.location.href = this.href;
            } else {
                attempts++;
                if (attempts >= maxAttempts) {
                    localStorage.setItem('cvLockoutTime', Date.now() + (30 * 60 * 1000));
                    alert("Maximum attempts reached. Please try again in 30 minutes.");
                } else {
                    alert(`Incorrect password. You have ${maxAttempts - attempts} attempts remaining.`);
                }
            }
        });
    }

    const gameCards = document.querySelectorAll('.game-card');
    const overlay = document.querySelector('.popup-overlay');
    
    gameCards.forEach(card => {
        // Skip the third card since it has its own onclick handler
        if (card.dataset.game !== 'game3') {
            card.addEventListener('click', () => {
                const gameId = card.dataset.game;
                const popup = document.getElementById(`${gameId}-popup`);
                if (popup) {
                    popup.style.display = 'block';
                    overlay.style.display = 'block';
                    document.body.classList.add('popup-active');
                }
            });
        }
    });
});

document.querySelectorAll('.close-btn').forEach(button => {
    button.addEventListener('click', function() {
        this.closest('.popup').style.display = 'none';
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

document.querySelector('.popup-overlay').addEventListener('click', closeAllPopups);