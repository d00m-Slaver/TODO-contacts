import successIMG from '../assets/images/success.png';
import declite from '../assets/images/error.png';
import { groupManager } from "../managers/GroupManager";
import { Contact } from "../classes/Contact";
import { openEditContactPanel } from "./contacts-functions";
import trashIcon from '../assets/images/trash-can.png';
import whiteTrashIcon from '../assets/images/trash-can-white.png';
import penIcon from '../assets/images/pen.png';
import whitePenIcon from '../assets/images/pen-white.png';
import arrow from '../assets/images/arrow.png';
import arrowAlt from '../assets/images/arrow-alt.png';
import { showToast } from './toast';
import { successToastShow } from "./main-scripts";

const groupsContainer = document.getElementById("groupsContainer") as HTMLDivElement;

export function renderGroups(): void {
  groupsContainer.innerHTML = "";

  const groups = groupManager.getGroups();

  if (groups.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "Список групп пуст";
    emptyMessage.classList.add("groups__empty");
    groupsContainer.appendChild(emptyMessage);
    return;
  }

  groups.forEach((group) => {
    const groupBlock = document.createElement("div");
    groupBlock.classList.add("group");

    const groupHeader = document.createElement("div");
    groupHeader.classList.add("group__header");

    const title = document.createElement("span");
    title.textContent = group.name;
    title.classList.add("group__title");

    const arrowEl = document.createElement("div");
    arrowEl.innerHTML = `<img src="${arrow}" class="img-arrow" alt="▼" />`;
    arrowEl.classList.add("group__arrow");

    groupHeader.append(title, arrowEl);

    const contactsWrapper = document.createElement("div");
    contactsWrapper.classList.add("group__contacts");
    contactsWrapper.style.display = "none";

    if (group.contacts && group.contacts.length > 0) {
      group.contacts.forEach((contact: Contact) => {
        const contactBlock = document.createElement("div");
        contactBlock.classList.add("contact");

        const name = document.createElement("span");
        name.textContent = contact.name;
        name.classList.add("contact__name");

        const rightPanelContactInfo = document.createElement("div");
        rightPanelContactInfo.classList.add("contact-info__right");


        const phone = document.createElement("span");
        phone.textContent = contact.phone;
        phone.classList.add("contact__phone");

        const editBtn = document.createElement("button");
        editBtn.innerHTML = `<img class="pen" src="${penIcon}" alt="Редактировать"/> <img class="white-pen" src="${whitePenIcon}" alt="Редактировать"/>`;
        editBtn.classList.add("contact__edit");
        editBtn.addEventListener("click", () => {
          openEditContactPanel(contact, group.id);
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = `<img src="${trashIcon}" class="trash-can" alt="Удалить"/><img src="${whiteTrashIcon}" class="white-trash-can" alt="Удалить"/>`;
        deleteBtn.classList.add("contact__delete");
        deleteBtn.addEventListener("click", () => {
          showToast("Удалить?","Удаление контакта будет безвозвратным.", ()=>{
                group.contacts = group.contacts.filter(c => c.id !== contact.id);
                groupManager.saveGroups();
                document.dispatchEvent(new CustomEvent("groups:changed"));
                successToastShow(successIMG,"Контакт успешно удален.");
                renderGroups();
            }, ()=>{
                renderGroups();
            });
        });
        rightPanelContactInfo.append(phone, editBtn, deleteBtn)
        contactBlock.append(name, rightPanelContactInfo);
        contactsWrapper.appendChild(contactBlock);
      });
    } else {
      const empty = document.createElement("p");
      empty.textContent = "Группа пуста";
      empty.classList.add("group__empty");
      contactsWrapper.appendChild(empty);
    }

    groupHeader.addEventListener("click", () => {
      const isVisible = contactsWrapper.style.display === "block";
      contactsWrapper.style.display = isVisible ? "none" : "block";
      arrowEl.innerHTML = isVisible ? `<img src="${arrow}" class="img-arrow" alt="▼" />` : `<img src="${arrowAlt}" class="img-arrow-alt" alt="▲" />`;
      groupHeader.style.borderBottom = isVisible ? "none" : "1px solid rgba(0,0,0,0.1)";
      title.style.color = isVisible ? "#000000" : "#005BFE";
    });

    groupBlock.append(groupHeader, contactsWrapper);
    groupsContainer.appendChild(groupBlock);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderGroups();
});

window.addEventListener("groups:changed", () => {
  renderGroups();
});


