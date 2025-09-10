import type { IContact } from "../interfaces/IContact";

export class Contact implements IContact {
  id: string;
  name: string;
  phone: string;
  groupId: string;

  constructor(name: string, phone: string, groupId: string, id?: string) {
    this.id = id ?? crypto.randomUUID();
    this.name = name;
    this.phone = phone;
    this.groupId = groupId;
  }
}