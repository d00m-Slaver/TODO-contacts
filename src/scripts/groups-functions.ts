import trashIcon from '../assets/images/trash-can.png';
import { Group } from '../classes/Group';
import { groupManager } from "../managers/GroupManager";
import { showToast } from './toast';
import { updatePanelMode } from './main-scripts';

const openGroupsPanelBtn = document.querySelector('.header__groups-btn') as HTMLButtonElement;
const closeGroupsPanelBtn = document.querySelector('.groups-panel__close') as HTMLButtonElement;
const groupsPanel = document.querySelector('.groups-panel') as HTMLDivElement;
const overlay = document.querySelector('.overlay') as HTMLDivElement;
const groupsList = document.getElementById('groupsList') as HTMLUListElement;
const addGroupBtn = document.getElementById('addGroupBtn') as HTMLButtonElement;
const groupsPanelList = document.querySelector('.groups-panel__list') as HTMLUListElement;
const saveGroupsBtn = document.querySelector('.groups-panel__save') as HTMLButtonElement;

openGroupsPanelBtn.addEventListener('click', openGroupPanel);
closeGroupsPanelBtn.addEventListener('click', closeGroupPanel);
overlay.addEventListener('click', closeGroupPanel);
saveGroupsBtn.addEventListener('click',saveNewGroups);

function openGroupPanel() {
    updatePanelMode();
    groupsPanel.classList.add('active');
    overlay.style.display = 'block'; 
    renderGroupsPanel();
}

function closeGroupPanel() {
    groupsPanel.classList.remove('active');
    overlay.style.display = 'none';
}

addGroupBtn.addEventListener('click', ()=>{
    const emptyLi = groupsList.querySelector('.groups__empty');
    if(emptyLi) emptyLi.remove();
    const li = document.createElement('li');
    li.innerHTML = `<input name="groupName" type="text" class="groups-input" placeholder="Введите название группы"/>
        <button class="delete-btn" disabled><img src="${trashIcon}" alt="Удалить"/></button>`;

    const deleteBtn = li.querySelector('.delete-btn') as HTMLButtonElement;
    const input = li.querySelector('.groups-input') as HTMLInputElement;

    input.addEventListener('input', ()=>{
        deleteBtn.disabled = input.value.trim() === '';
    });

    deleteBtn.addEventListener('click',()=>{
        li.remove();
    });

    groupsList.appendChild(li);
});

function renderGroupsPanel(): void{
    const groupsList = document.getElementById('groupsList') as HTMLUListElement;
    groupsList.innerHTML = '';

    const groups: Group[] = groupManager.getGroups();
    const newGroupInputs = groupsList.querySelectorAll('.groups-input');

    if(groups.length === 0 && newGroupInputs.length === 0){
        const emptyLi = document.createElement('li');
        emptyLi.textContent = 'Нет доступных групп';
        emptyLi.classList.add('groups__empty')
        groupsList.appendChild(emptyLi);
        return;
    }

    groups.forEach(group=>{
        const li = document.createElement('li');
        li.innerHTML=`<input name="groupName" type="text" class="groups-input" value="${group.name}" data-id="${group.id}"/>
        <button class="delete-btn" disabled><img src="${trashIcon}" alt="Удалить"/></button>`;

        const deleteBtn = li.querySelector('.delete-btn') as HTMLButtonElement;
        const input = li.querySelector('.groups-input') as HTMLInputElement;
        deleteBtn.disabled = input.value.trim() === '';
        deleteBtn.addEventListener('click', ()=>{
            showToast("Удалить группу?","Удаление группы повлечет за собой удаление контактов связанных с этой группой", ()=>{
                groupManager.removeGroup(group);
                renderGroupsPanel();
            }, ()=>{
                renderGroupsPanel();
            })

        });
        input.addEventListener('input', ()=>{
            groupManager.updateGroup(new Group(input.value, group.id));
        });

        groupsList.appendChild(li);
    })
}

function saveNewGroups(): void {
    const inputs = document.querySelectorAll('.groups-input') as NodeListOf<HTMLInputElement>;
    inputs.forEach(input => {
        const name = input.value.trim();
        if(!name) return;
        if(groupManager.getGroups().some(g=>g.name === name)){
            return;
        }
        const newGroup = new Group(name);
        groupManager.addGroup(newGroup);
    })
    renderGroupsPanel();
}

saveGroupsBtn.addEventListener('click',()=>{
    groupsPanelList.querySelectorAll('li').forEach(li=>{
        const input = li.querySelector('.groups-input') as HTMLInputElement;
        const id = li.dataset.id!;
        const name = input.value.trim();
        const group = new Group(name, id);
        if(name) groupManager.updateGroup(group);
    })
    renderGroupsPanel();
});

