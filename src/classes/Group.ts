import type { IGroup } from "../interfaces/IGroup";
import type { IContact } from "../interfaces/IContact";

export class Group implements IGroup {
  id: string;
  name: string;
  contacts: IContact[];

  constructor(name: string, id?: string, contacts: IContact[] = []) {
    this.id = id ?? crypto.randomUUID();
    this.name = name;
    this.contacts = contacts;
  }
}