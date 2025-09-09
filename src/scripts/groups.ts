interface IGroup {
    id:string;
    name: string;
}

class Group implements IGroup{
    id: string;
    name: string;

    constructor(name: string, id?: string){
        this.id = id ?? crypto.randomUUID();
        this.name = name;
    }
}

export class GroupManager{
    private groups: Group[] = [];
    private storageKey: string = 'groups';
    
    constructor(){
        this.loadGroups();
    }
    
    getGroups(): Group[]{
        return this.groups;
    }

    addGroup(name: string): void{
        if(this.groups.some(g => g.name === name)){
            console.error(`Группа "${name}" уже существует`);
            return;
        }
        const newGroup = new Group(name);
        this.groups.push(newGroup);
        this.saveGroups();
    }

    removeGroup(id: string): void {
        this.groups = this.groups.filter(g => g.id !== id);
        this.saveGroups();
    }

    updateGroup(id: string, name: string): void {
        const group = this.groups.find(g => g.id === id);
        if(group) group.name = name;
        this.saveGroups();
    }

    private saveGroups(): void {
        localStorage.setItem(this.storageKey, JSON.stringify(this.groups));
    }

    private loadGroups(): void {
        const data = localStorage.getItem(this.storageKey);
        if(data){
            const parsed = JSON.parse(data) as IGroup[];
            this.groups = parsed.map(g => new Group(g.name, g.id));
        } 
    }
}