const createTaskElement = (title, time, priority) => {
    const li = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'checkbox';
    checkbox.style.backgroundColor = 'yellow';

    checkbox.addEventListener('change', (e) => {
        toggleCheckbox(e.target, e.target.parentNode);
    });

    li.appendChild(checkbox);
    li.innerHTML += `<div class="task-title">Task: ${title}</div>
                     <div class="task-time">ETC: ${time}</div>
                     <div class="task-priority">Priority: ${priority}</div>`;

    handleTaskHover(li);
    li.querySelector('.task-title').addEventListener('click', () => editTask(li));
    li.querySelector('.task-time').addEventListener('click', () => editTask(li));
    li.querySelector('.task-priority').addEventListener('click', () => editTask(li));
 
    return li;
};

document.addEventListener('DOMContentLoaded', () => {
    let currentTask;
    
    const editTask = (task) => {
        const title = task.querySelector('.task-title').textContent.replace('Title Task: ', '');
        const time = task.querySelector('.task-time').textContent.replace('Estimated Remaining Time: ', '');
        const priority = task.querySelector('.task-priority').textContent.replace('Priority: ', '');

        document.getElementById('edit-title').value = title;
        document.getElementById('edit-time').value = time;
        document.getElementById('edit-priority').value = priority;

        currentTask = task;

        document.getElementById('edit-modal').style.display = 'block';
    };

    const toggleCheckbox = (checkbox, task) => {
        if (checkbox.checked) {
            task.style.textDecorationLine = 'line-through';
            task.style.textDecorationThickness = '10px';
            task.style.color = 'green';
        } else {
            task.style.textDecorationLine = 'none';
            task.style.color = 'white';
        }
        saveTasks();
    };

    const handleTaskHover = (task) => {
        task.addEventListener('mouseover', () => task.classList.add('hover'));
        task.addEventListener('mouseout', () => task.classList.remove('hover'));
        task.querySelector('.task-title').addEventListener('click', () => editTask(task));
        task.querySelector('.task-time').addEventListener('click', () => editTask(task)); // Fix here
        task.querySelector('.task-priority').addEventListener('click', () => editTask(task));
    };

    const loadTasks = () => {
        const taskSections = ['daily-process', 'core-tasks', 'experiments'];
        taskSections.forEach((sectionId) => {
            const section = document.getElementById(sectionId);
            const tasks = JSON.parse(localStorage.getItem(sectionId) || '[]');
            tasks.forEach((taskData) => {
                const li = createTaskElement(taskData.title, taskData.time, taskData.priority);
                const checkbox = li.querySelector('.checkbox');
                checkbox.checked = taskData.checked;
                toggleCheckbox(checkbox, li);
                section.appendChild(li);
            });
        });
    };
        
    const saveTasks = () => {
        ['daily-process', 'core-tasks', 'experiments'].forEach(id => {
            const taskList = document.getElementById(id);
            const tasks = [];
    
            taskList.querySelectorAll('li').forEach(li => {
                tasks.push({
                    title: li.querySelector('.task-title').innerText.replace('Task: ', ''),
                    time: li.querySelector('.task-time').innerText.replace('ETC: ', ''),
                    priority: li.querySelector('.task-priority').innerText.replace('Priority: ', ''),
                    checked: li.querySelector('.checkbox').checked
                });
            });
    
            localStorage.setItem(id, JSON.stringify(tasks));
        });
    };
    

    document.getElementById('new-task-form').addEventListener('submit', (e) => {
        e.preventDefault();

        const header = document.getElementById('header-select').value;
        const title = document.getElementById('title').value;
        const time = document.getElementById('time').value;
        const priority = document.getElementById('priority').value;
        const taskList = document.getElementById(header);
        const li = document.createElement('li');
       const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'checkbox';
        checkbox.style.backgroundColor = 'yellow';

        checkbox.addEventListener('change', (e) => {
            toggleCheckbox(e.target, e.target.parentNode);
        });

        li.appendChild(checkbox);
        li.innerHTML += `<div class="task-title">Task: ${title}</div>
                         <div class="task-time">ETC: ${time}</div>
                         <div class="task-priority">Priority: ${priority}</div>`;

        taskList.appendChild(li);
        handleTaskHover(li);
        li.querySelector('.task-title').addEventListener('click', () => editTask(li));
        li.querySelector('.task-time').addEventListener('click', () => editTask(li));
        li.querySelector('.task-priority').addEventListener('click', () => editTask(li));

        saveTasks();

        document.getElementById('modal').style.display = 'none';
    });

    document.getElementById('plus-sign').addEventListener('click', () => {
        document.getElementById('modal').style.display = 'block';
    });

    document.getElementById('close').addEventListener('click', () => {
        document.getElementById('modal').style.display = 'none';
    });

    document.getElementById('edit-task-form').addEventListener('submit', (e) => {
        e.preventDefault();

        currentTask.querySelector('.task-title').innerText = `Title Task: ${document.getElementById('edit-title').value}`;
        currentTask.querySelector('.task-time').innerText = `Estimated Remaining Time: ${document.getElementById('edit-time').value}`;
        currentTask.querySelector('.task-priority').innerText = `Priority: ${document.getElementById('edit-priority').value}`;

        saveTasks();

        document.getElementById('edit-modal').style.display = 'none';
    });

    document.getElementById('delete-task').addEventListener('click', () => {
        currentTask.remove();

        saveTasks();

        document.getElementById('edit-modal').style.display = 'none';
    });

    document.getElementById('edit-close').addEventListener('click', () => {
        document.getElementById('edit-modal').style.display = 'none';
    });

    loadTasks();
});
