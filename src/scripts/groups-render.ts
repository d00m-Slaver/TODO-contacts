import { groupManager } from "../managers/GroupManager";
import { Contact } from "../classes/Contact";
import { openEditContactPanel } from "./contacts-functions";

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

    const arrow = document.createElement("span");
    arrow.innerHTML = "&#9662;";
    arrow.classList.add("group__arrow");

    groupHeader.append(title, arrow);

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

        const phone = document.createElement("span");
        phone.textContent = contact.phone;
        phone.classList.add("contact__phone");

        const editBtn = document.createElement("button");
        editBtn.textContent = "✎";
        editBtn.classList.add("contact__edit");
        editBtn.addEventListener("click", () => {
          openEditContactPanel(contact, group.id);
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "🗑";
        deleteBtn.classList.add("contact__delete");
        deleteBtn.addEventListener("click", () => {
          if (confirm(`Удалить контакт "${contact.name}"?`)) {
            group.contacts = group.contacts.filter(c => c.id !== contact.id);
            groupManager.saveGroups();
            renderGroups();
            document.dispatchEvent(new CustomEvent("groups:changed"));
          }
        });

        contactBlock.append(name, phone, editBtn, deleteBtn);
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
      arrow.innerHTML = isVisible ? "&#9662;" : "&#9652;";
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


