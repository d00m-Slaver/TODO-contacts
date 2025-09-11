const contactPanel = document.querySelector('.contacts-panel') as HTMLDivElement;
const groupsPanel = document.querySelector('.groups-panel') as HTMLDivElement;

export function updatePanelMode() {
  if(window.innerWidth>=768){
    contactPanel.classList.add('desktop');
    groupsPanel.classList.add('desktop');

    contactPanel.classList.remove('mobile');
    groupsPanel.classList.remove('mobile');
  } else {
    contactPanel.classList.add('mobile');
    groupsPanel.classList.add('mobile');

    contactPanel.classList.remove('desktop');
    groupsPanel.classList.remove('desktop');
  }
}

window.addEventListener('resize',()=>{
    if(!groupsPanel.classList.contains('active') || !contactPanel.classList.contains('active')){
        updatePanelMode();
    }
});