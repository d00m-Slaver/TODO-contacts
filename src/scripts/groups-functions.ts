const groupsBtn = document.querySelector('.header__groups-btn') as HTMLButtonElement;
const groupsPanel = document.querySelector('.groups-panel') as HTMLDivElement;
const overlay = document.querySelector('.overlay') as HTMLDivElement;
const closeButton = document.querySelector('.groups-panel__close') as HTMLButtonElement;

function openGroupPanel() {
    groupsPanel.classList.add('active');
    overlay.style.display = 'block'; 
}

function closeGroupPanel() {
    groupsPanel.classList.remove('active');
    overlay.style.display = 'none';
}

groupsBtn.addEventListener('click', openGroupPanel);
overlay.addEventListener('click', closeGroupPanel);
closeButton.addEventListener('click', closeGroupPanel);