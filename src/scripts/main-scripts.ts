const contactPanel = document.querySelector('.contacts-panel') as HTMLDivElement;
const groupsPanel = document.querySelector('.groups-panel') as HTMLDivElement;
const successToast = document.querySelector('.success-toats') as HTMLDivElement;

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

export function successToastShow(type:string, text:string):void{
    const imgEl = document.querySelector('.success-img') as HTMLImageElement;
    const divEL = document.querySelector('.success-toats') as HTMLDivElement;
    const textEl = document.querySelector('.success-text') as HTMLSpanElement;
    imgEl.src = `${type}`;
    textEl.innerHTML = text;
    divEL.classList.add('show');
    setTimeout(() => {
      divEL.classList.remove('show');
    }, 5000);
}

window.addEventListener('resize',()=>{
    if(!groupsPanel.classList.contains('active') || !contactPanel.classList.contains('active')){
        updatePanelMode();
    }
});