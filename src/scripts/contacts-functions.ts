import successIMG from '../assets/images/success.png';
import declite from '../assets/images/error.png';
import { groupManager } from "../managers/GroupManager";
import { Contact } from "../classes/Contact";
import IMask from "imask";
import { renderGroups } from "./groups-render";
import { updatePanelMode, successToastShow} from './main-scripts';

const contactPanel = document.querySelector('.contacts-panel') as HTMLDivElement;
const overlay = document.querySelector('.overlay') as HTMLDivElement;
const openBtnMobile = document.querySelector('.add-contact--desktop') as HTMLButtonElement;
const openBtnDesktop = document.querySelector('.add-contact--mobile') as HTMLButtonElement;
const closeBtn = contactPanel.querySelector('.contacts-panel__close') as HTMLButtonElement;

const inputName = contactPanel.querySelector('.contact-input--name') as HTMLInputElement;
const inputPhone = contactPanel.querySelector('.contact-input--phone') as HTMLInputElement;
const saveBtn = contactPanel.querySelector('.contacts-panel__save') as HTMLButtonElement;

const select = contactPanel.querySelector('.contact-select') as HTMLDivElement;
const selectToggle = select.querySelector('.contact-select__toggle') as HTMLButtonElement;
const selectList = select.querySelector('.contact-select__list') as HTMLUListElement;

const arrowImg = document.querySelector('.img-arrow') as HTMLImageElement;
const arrowImgAlt = document.querySelector('.img-arrow-alt') as HTMLImageElement;


let selectedGroupId: string | null = null;
let editingContact: Contact | null = null;
let isOpen: boolean = false;

IMask(inputPhone, {
  mask: [
    {
      mask: '+{7} (000) 000 - 00-00',
    }
  ]
});

openBtnMobile.addEventListener('click', openContactsPanel);
openBtnDesktop.addEventListener('click', openContactsPanel)

function openContactsPanel(): void{
  editingContact = null;
  updatePanelMode();
  contactPanel.classList.add('active');
  overlay.style.display = 'block';
  renderGroupsInSelect();
}
closeBtn.addEventListener('click', closeContactPanel);
overlay.addEventListener('click', closeContactPanel);

function closeContactPanel() {
  clearErrors()
  contactPanel.classList.remove('active');
  overlay.style.display = 'none';
  inputName.value = '';
  inputPhone.value = '';
  selectToggle.querySelector('span')!.textContent = "Выберите группу";
  selectedGroupId = null;
  editingContact = null;
}

function renderGroupsInSelect() {
  selectList.innerHTML = '';

  const groups = groupManager.getGroups();
  if(groups.length === 0){
    const li = document.createElement('li');
    li.textContent = "Групп нет";
    selectList.appendChild(li);
    return;
  }

  groups.forEach(g => {
    const li = document.createElement('li');
    li.textContent = g.name;
    li.addEventListener('click', () => {
      selectToggle.querySelector('span')!.textContent = g.name;
      selectedGroupId = g.id;
      select.classList.remove('open');
    });
    selectList.appendChild(li);
  });
}

selectToggle.addEventListener('click', () => {
  select.classList.toggle('open');
});

selectToggle.addEventListener('click',()=>{
  if(!isOpen){
    arrowImg.style.display = "block";
    arrowImgAlt.style.display = "none";
    isOpen = true;
  } else{
    arrowImg.style.display = "none";
    arrowImgAlt.style.display = "block";
    isOpen = false;
  }
})

const errorElPhone = document.querySelector('.required-phone') as HTMLSpanElement;
const errorElName = document.querySelector('.required-name') as HTMLSpanElement;

function saveContact() {
  clearErrors();
    if(!inputName.value.trim()){
      inputName.style.borderColor = "#EA3D2F";
      errorElName.classList.add('error');
    }
    if(!inputPhone.value.trim()){
      inputPhone.style.borderColor = "#EA3D2F";
      errorElPhone.classList.add('error');
    }

  if (!isContactNameUnique(inputName.value.trim())){
    successToastShow(declite, "Контакт с таким именем уже есть.");
    return;
  } 
  
  if(!inputName.value.trim() || !inputPhone.value.trim() || !selectedGroupId) return;

  const group = groupManager.getGroups().find(g => g.id === selectedGroupId);
  if(!group) return;

  if(editingContact){
    editingContact.name = inputName.value.trim();
    editingContact.phone = inputPhone.value.trim();
    successToastShow(successIMG,"Контакт успешно отредактирован.");
  } else {
    const newContact = new Contact(
      inputName.value.trim(),
      inputPhone.value.trim(),
      selectedGroupId
    );
    group.contacts = group.contacts ?? [];
    group.contacts.push(newContact);
    successToastShow(successIMG,"Контакт успешно добавлен.");
  }

  groupManager.saveGroups();
  renderGroups();
  renderGroupsInSelect();
  closeContactPanel();
}

saveBtn.addEventListener('click', saveContact);

export function openEditContactPanel(contact: Contact, groupId: string) {
  editingContact = contact;
  updatePanelMode();
  contactPanel.classList.add('active');
  overlay.style.display = 'block';
  renderGroupsInSelect();

  inputName.value = contact.name;
  inputPhone.value = contact.phone;
  selectedGroupId = groupId;

  const group = groupManager.getGroups().find(g => g.id === groupId);
  if(group){
    selectToggle.querySelector('span')!.textContent = group.name;
  }
}

closeBtn.addEventListener('click', closeContactPanel);
overlay.addEventListener('click', closeContactPanel);

window.addEventListener('resize', () => {
  if (contactPanel.classList.contains('active')) {
    updatePanelMode();
  }
});

function isContactNameUnique(name:string, excludeId = null) {
    const groups = groupManager.getGroups();
    const lowerCaseName = name.trim().toLowerCase();
    
    for (const group of groups) {
        if (group.contacts && group.contacts.length > 0) {
            const duplicate = group.contacts.find(contact => {
                if (excludeId && contact.id === excludeId) return false;
                
                return contact.name.trim().toLowerCase() === lowerCaseName;
            });
            
            if (duplicate) {
                return false;
            }
        }
    }
    
    return true;
}

function clearErrors(){
  inputName.style.borderColor = "rgba(0,0,0,0.05)";
  errorElName.classList.remove('error');
  errorElPhone.style.borderColor = "rgba(0,0,0,0.05)";
  inputPhone.classList.remove('error');
}