const groupsBtn = document.querySelector('.header__groups-btn') as HTMLButtonElement;
const groupsPanel = document.querySelector('.groups-panel') as HTMLDivElement;
const overlay = document.querySelector('.overlay') as HTMLDivElement;
const closeButton = document.querySelector('.groups-panel__close') as HTMLButtonElement;

groupsBtn.addEventListener('click', openGroupPanel);
overlay.addEventListener('click', closeGroupPanel);
closeButton.addEventListener('click', closeGroupPanel);

function updatePanelMode(){
    if(window.innerWidth>=768){
        groupsPanel.classList.add('desktop');
        groupsPanel.classList.remove('mobile');
    }   
    else{
        groupsPanel.classList.add('mobile');
        groupsPanel.classList.remove('desktop');
    }
}

function openGroupPanel() {
    updatePanelMode();
    groupsPanel.classList.add('active');
    overlay.style.display = 'block'; 
}

function closeGroupPanel() {
    groupsPanel.classList.remove('active');
    overlay.style.display = 'none';
}


window.addEventListener('resize',()=>{
    if(!groupsPanel.classList.contains('active')){
        updatePanelMode();
    }
})