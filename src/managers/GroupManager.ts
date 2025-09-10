import type { IGroup } from "../interfaces/IGroup";
import { Group } from "../classes/Group";
import { Contact } from "../classes/Contact";

export class GroupManager {
  private groups: Group[] = [];
  private storageKey: string = "groups";

  constructor() {
    this.loadGroups();
  }

  getGroups(): Group[] {
    return this.groups;
  }

  addGroup(group: Group): void {
    if (this.groups.some((g) => g.id === group.id)) {
      console.error(`Группа "${group.name}" уже существует`);
      return;
    }
    this.groups.push(group);
    this.saveGroups();
    this.emitChange();
  }

  removeGroup(group: Group): void {
    this.groups = this.groups.filter((g) => g.id !== group.id);
    this.saveGroups();
    this.emitChange();
  }

  updateGroup(group: Group): void {
    const existing = this.groups.find((g) => g.id === group.id);
    if (existing) existing.name = group.name;
    this.saveGroups();
    this.emitChange();
  }

  addContact(groupId: string, name: string, phone: string): void {
    const group = this.groups.find((g) => g.id === groupId);
    if (!group) return;
    const newContact = new Contact(name, phone, groupId);
    group.contacts.push(newContact);
    this.saveGroups();
    this.emitChange();
  }

  removeContact(groupId: string, contactId: string): void {
    const group = this.groups.find((g) => g.id === groupId);
    if (!group) return;
    group.contacts = group.contacts.filter((c) => c.id !== contactId);
    this.saveGroups();
    this.emitChange();
  }
  
  private notifyUpdate(): void {
    document.dispatchEvent(new Event("groupsChanged"));
  }

  public saveGroups(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.groups));
    this.notifyUpdate();
  }

  private loadGroups(): void {
    const data = localStorage.getItem(this.storageKey);
    if (data) {
      const parsed = JSON.parse(data) as IGroup[];
      this.groups = parsed.map(
        (g) => new Group(g.name, g.id, (g as any).contacts ?? [])
      );
    }
  }

  private emitChange(): void {
    window.dispatchEvent(new Event("groups:changed"));
  }
}

export const groupManager = new GroupManager();