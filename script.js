let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    
    const filterValue = document.getElementById('filterStatus').value;
    
    tasks.forEach((task, index) => {
        if (filterValue === 'all' || 
            (filterValue === 'completed' && task.completed) || 
            (filterValue === 'incomplete' && !task.completed)) {
            
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            li.draggable = true;
            
            li.innerHTML = `
                <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''} 
                    onclick="toggleComplete(${index})">
                <div class="task-content">${task.text}</div>
                <div class="task-actions">
                    <button class="edit-btn" onclick="editTask(${index})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="deleteTask(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            li.addEventListener('dragstart', () => {
                li.classList.add('dragging');
            });
            
            li.addEventListener('dragend', () => {
                li.classList.remove('dragging');
            });
            
            taskList.appendChild(li);
        }
    });
}

function addTask() {
    const input = document.getElementById('taskInput');
    const text = input.value.trim();
    
    if (text) {
        tasks.push({
            text: text,
            completed: false
        });
        saveTasks();
        renderTasks();
        input.value = '';
    }
}

function editTask(index) {
    const newText = prompt('Edit task:', tasks[index].text);
    if (newText !== null) {
        tasks[index].text = newText.trim();
        saveTasks();
        renderTasks();
    }
}

function deleteTask(index) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }
}

function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

function filterTasks() {
    renderTasks();
}

// Drag and Drop functionality
const taskList = document.getElementById('taskList');

taskList.addEventListener('dragover', e => {
    e.preventDefault();
    const draggingItem = document.querySelector('.dragging');
    const siblings = [...taskList.querySelectorAll('.task-item:not(.dragging)')];
    
    const nextSibling = siblings.find(sibling => {
        const box = sibling.getBoundingClientRect();
        return e.clientY <= box.top + box.height / 2;
    });
    
    if (nextSibling) {
        taskList.insertBefore(draggingItem, nextSibling);
    } else {
        taskList.appendChild(draggingItem);
    }
});

taskList.addEventListener('dragend', () => {
    const newOrder = [...document.querySelectorAll('.task-item')];
    tasks = newOrder.map(item => {
        const text = item.querySelector('.task-content').textContent;
        const completed = item.querySelector('.checkbox').checked;
        return { text, completed };
    });
    saveTasks();
});

// Initial render
renderTasks();