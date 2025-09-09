interface IContact{
    name: string;
    phoneNumber: string;
    group: string;
}

export class ContactManager {
  private contacts: IContact[] = [];
  private listEl: HTMLUListElement;
  private emptyEl: HTMLParagraphElement;

  constructor(listSelector: string, emptySelector: string) {
    this.listEl = document.querySelector(listSelector) as HTMLUListElement;
    this.emptyEl = document.querySelector(emptySelector) as HTMLParagraphElement;
    this.loadContacts();
    this.render();
  }

  addContact(contact: IContact): void {
    this.contacts.push(contact);
    this.saveContacts();
    this.render();
  }

  private saveContacts(): void {
    localStorage.setItem('contacts', JSON.stringify(this.contacts));
  }

  private loadContacts(): void {
    const localData = localStorage.getItem('contacts');
    if (localData) {
      this.contacts = JSON.parse(localData);
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
      li.textContent = `${contact.name} — ${contact.phoneNumber} [${contact.group}]`;
      this.listEl.appendChild(li);
    });
  }
}