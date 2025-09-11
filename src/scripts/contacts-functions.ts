import { groupManager } from "../managers/GroupManager";
import { Contact } from "../classes/Contact";
import IMask from "imask";
import { renderGroups } from "./groups-render";
import { updatePanelMode } from './main-scripts';

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

let selectedGroupId: string | null = null;
let editingContact: Contact | null = null;

IMask(inputPhone, {
  mask: '+{7}(000)000-00-00',
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

function saveContact() {
  if(!inputName.value.trim() || !inputPhone.value.trim() || !selectedGroupId) return;

  const group = groupManager.getGroups().find(g => g.id === selectedGroupId);
  if(!group) return;

  if(editingContact){
    editingContact.name = inputName.value.trim();
    editingContact.phone = inputPhone.value.trim();
  } else {
    const newContact = new Contact(
      inputName.value.trim(),
      inputPhone.value.trim(),
      selectedGroupId
    );
    group.contacts = group.contacts ?? [];
    group.contacts.push(newContact);
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