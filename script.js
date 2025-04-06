
let tasks = [];


const storedTasks = localStorage.getItem('tasks');
if (storedTasks) {
    tasks = JSON.parse(storedTasks);
    displayTasks(tasks);
}


const modal = document.getElementById('myModal');


const addTaskBtn = document.getElementById('add-task');


const span = document.getElementsByClassName('close')[0];


addTaskBtn.onclick = function () {
    modal.style.display = "block";
}


span.onclick = function () {
    modal.style.display = "none";
}


window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


function addTask() {
  const taskName = document.getElementById('task-name-modal').value;
  const taskDescription = document.getElementById('task-description-modal').value;
  const dueDate = document.getElementById('due-date-modal').value;
  const priority = document.getElementById('priority-modal').value;

  if (taskName && dueDate) {
      const task = {
          name: taskName,
          description: taskDescription,
          dueDate: dueDate,
          priority: priority,
          completed: false 
      };
      tasks.push(task);


      localStorage.setItem('tasks', JSON.stringify(tasks));


      document.getElementById('task-name-modal').value = '';
      document.getElementById('task-description-modal').value = '';
      document.getElementById('due-date-modal').value = '';
      document.getElementById('priority-modal').value = 'low';


      const today = new Date().toISOString().split('T')[0];
      let taskList;
      if (dueDate === today) {
          taskList = document.getElementById('today-tasks');
      } else if (dueDate < today) {
          taskList = document.getElementById('overdue-tasks');
      } else {
          taskList = document.getElementById('upcoming-tasks');
      }

      const listItem = document.createElement('li');
      listItem.className = 'task-item';
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'task-checkbox';
      listItem.appendChild(checkbox);

      const taskInfo = document.createElement('div');
      const taskNameElement = document.createElement('span');
      taskNameElement.textContent = task.name;
      taskNameElement.classList.add('task-name');
      taskInfo.appendChild(taskNameElement);

      if (task.description) {
          const taskDescriptionElement = document.createElement('div');
          taskDescriptionElement.textContent = task.description;
          taskDescriptionElement.style.marginLeft = '24px';
          taskInfo.appendChild(taskDescriptionElement);
      }

      const dueDateElement = document.createElement('div');
      dueDateElement.textContent = `Due Date: ${task.dueDate}`;
      dueDateElement.style.marginLeft = '24px';
      taskInfo.appendChild(dueDateElement);

      const priorityElement = document.createElement('div');
      priorityElement.textContent = `Priority: ${task.priority}`;
      priorityElement.style.marginLeft = '24px';
      taskInfo.appendChild(priorityElement);

      listItem.appendChild(taskInfo);
      taskList.appendChild(listItem);


      checkbox.addEventListener('change', handleCheckboxChange);

      modal.style.display = "none";
  }
}


function displayTasks(taskArray) {
  const allLists = ['upcoming-tasks', 'today-tasks', 'overdue-tasks', 'completed-tasks'];
  allLists.forEach(listId => {
      const taskList = document.getElementById(listId);
      taskList.innerHTML = '';
  });

  taskArray.forEach(task => {
      const today = new Date().toISOString().split('T')[0];
      let taskList;
      if (task.completed) {
          taskList = document.getElementById('completed-tasks');
      } else if (task.dueDate === today) {
          taskList = document.getElementById('today-tasks');
      } else if (task.dueDate < today) {
          taskList = document.getElementById('overdue-tasks');
      } else {
          taskList = document.getElementById('upcoming-tasks');
      }

      const listItem = document.createElement('li');
      listItem.className = 'task-item';
      if (task.completed) {
          listItem.classList.add('completed-task'); 
      }
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'task-checkbox';
      checkbox.checked = task.completed;
      checkbox.addEventListener('change', handleCheckboxChange);
      listItem.appendChild(checkbox);

      const taskInfo = document.createElement('div');
      const taskNameElement = document.createElement('span');
      taskNameElement.textContent = task.name;
      taskNameElement.classList.add('task-name');
      taskInfo.appendChild(taskNameElement);

      if (task.description) {
          const taskDescriptionElement = document.createElement('div');
          taskDescriptionElement.textContent = task.description;
          taskDescriptionElement.style.marginLeft = '24px';
          taskInfo.appendChild(taskDescriptionElement);
      }

      const dueDateElement = document.createElement('div');
      dueDateElement.textContent = `Due Date: ${task.dueDate}`;
      dueDateElement.style.marginLeft = '24px';
      taskInfo.appendChild(dueDateElement);

      const priorityElement = document.createElement('div');
      priorityElement.textContent = `Priority: ${task.priority}`;
      priorityElement.style.marginLeft = '24px';
      taskInfo.appendChild(priorityElement);

      listItem.appendChild(taskInfo);
      taskList.appendChild(listItem);
  });
}




function handleCheckboxChange(event) {
  event.preventDefault();
  const taskItem = event.target.parentElement;
  const originalList = taskItem.parentElement;
  const completedList = document.getElementById('completed-tasks');
  const isChecked = event.target.checked;

  if (isChecked) {
      originalList.removeChild(taskItem);
      completedList.appendChild(taskItem);
      taskItem.classList.add('completed-task');
  } else {
      const appropriateList = getAppropriateList(taskItem);
      completedList.removeChild(taskItem);
      appropriateList.appendChild(taskItem);
      taskItem.classList.remove('completed-task');
  }


  const taskId = parseInt(taskItem.dataset.taskId);
  tasks.forEach(task => {
      if (task.id === taskId) {
          task.completed = isChecked;
      }
  });


  localStorage.setItem('tasks', JSON.stringify(tasks));
}


function getAppropriateList(taskItem) {
  const taskText = taskItem.querySelector('.task-name').textContent;
  const task = tasks.find(t => t.name === taskText);
  const today = new Date().toISOString().split('T')[0];
  if (task.dueDate === today) {
      return document.getElementById('today-tasks');
  } else if (task.dueDate < today) {
      return document.getElementById('overdue-tasks');
  } else {
      return document.getElementById('upcoming-tasks');
  }
}




document.getElementById('add-task-modal').addEventListener('click', addTask);


function searchTasks() {
    const searchTerm = document.getElementById('search-task').value.toLowerCase();
    const filteredTasks = tasks.filter(task => task.name.toLowerCase().includes(searchTerm));
    displayTasks(filteredTasks);
}


const searchInput = document.getElementById('search-task');
searchInput.addEventListener('input', searchTasks);


function filterTasks(filter) {
    let filteredTasks = [];
    const today = new Date().toISOString().split('T')[0];

    switch (filter) {
        case 'today':
            filteredTasks = tasks.filter(task => task.dueDate === today);
            break;
        case 'important':
            filteredTasks = tasks.filter(task => task.priority === 'high');
            break;
        case 'upcoming':
            filteredTasks = tasks.filter(task => task.dueDate > today);
            break;
        default:
            filteredTasks = tasks;
    }

    displayTasks(filteredTasks);
}


function handleExpandCollapse(event) {
    const targetId = event.target.dataset.target;
    const targetList = document.getElementById(targetId);
    if (targetList.style.display === 'none') {
        targetList.style.display = 'block';
        event.target.textContent = event.target.textContent.replace('►', '▼');
    } else {
        targetList.style.display = 'none';
        event.target.textContent = event.target.textContent.replace('▼', '►');
    }
}


const expandCollapseBtns = document.querySelectorAll('.expand-collapse-btn');
expandCollapseBtns.forEach(btn => {
    btn.addEventListener('click', handleExpandCollapse);
});


function addRow() {
    const table = document.getElementById('timetable-table');
    const newRow = table.insertRow(-1);

    const timeCell = newRow.insertCell(0);
    const timeInput = document.createElement('input');
    timeInput.type = 'text';
    timeInput.placeholder = 'Time';
    timeCell.appendChild(timeInput);

    for (let i = 1; i < 8; i++) {
        const cell = newRow.insertCell(i);
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Task';
        cell.appendChild(input);
    }


    saveTimetable();
}


function saveTimetable() {
    const table = document.getElementById('timetable-table');
    const rows = table.rows;
    const timetableData = [];

    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const rowData = [];
        for (let j = 0; j < row.cells.length; j++) {
            const input = row.cells[j].querySelector('input');
            rowData.push(input? input.value : '');
        }
        timetableData.push(rowData);
    }

    localStorage.setItem('timetable', JSON.stringify(timetableData));
}


function loadTimetable() {
    const storedTimetable = localStorage.getItem('timetable');
    if (storedTimetable) {
        const timetableData = JSON.parse(storedTimetable);
        const table = document.getElementById('timetable-table');


        while (table.rows.length > 1) {
            table.deleteRow(1);
        }

        timetableData.forEach(rowData => {
            const newRow = table.insertRow(-1);
            rowData.forEach((cellData, index) => {
                const cell = newRow.insertCell(index);
                const input = document.createElement('input');
                input.type = 'text';
                input.value = cellData;
                cell.appendChild(input);
            });
        });
    }
}


function addInputEventListeners() {
    const table = document.getElementById('timetable-table');
    const inputs = table.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', saveTimetable);
    });
}


document.getElementById('add-row').addEventListener('click', addRow);


loadTimetable();
addInputEventListeners();