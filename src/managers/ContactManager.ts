import type { IContact } from "../interfaces/IContact";
import { Contact } from "../classes/Contact";

export class ContactManager {

  private contacts: Contact[] = [];
  private listEl: HTMLUListElement;
  private emptyEl: HTMLParagraphElement;
  private storageKey: string = 'contacts' ;

  constructor(listSelector: string, emptySelector: string) {
    this.listEl = document.querySelector(listSelector) as HTMLUListElement;
    this.emptyEl = document.querySelector(emptySelector) as HTMLParagraphElement;
    this.loadContacts();
    this.render();
  }

  addContact(name: string, phoneNumber: string, group: string, id?: string): void {
    const newContact = new Contact(name, phoneNumber, group, id);
    this.contacts.push(newContact);
    this.saveContacts();
    this.render();
  }

  private saveContacts(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.contacts));
  }

  private loadContacts(): void {
    const localData = localStorage.getItem(this.storageKey);
    if (localData) {
      const parsed = JSON.parse(localData) as IContact[];
      this.contacts = parsed.map(c=> new Contact(c.name, c.phone, c.groupId, c.id));
    }
  }

  private render(): void {
    this.listEl.innerHTML = '';

    if (this.contacts.length === 0) {
      this.emptyEl.style.display = 'block';
      return;
    }

    this.emptyEl.style.display = 'none';
    this.contacts.forEach(contact => {
      const li = document.createElement('li');
      li.textContent = `${contact.name} — ${contact.phone} [${contact.groupId}]`;
      this.listEl.appendChild(li);
    });
  }
}