const taskInput = document.querySelector('#taskInput');
const addTaskBtn = document.querySelector('#addTaskBtn');
const tasksList = document.querySelector('#tasksList');
const emptyState = document.querySelector('#emptyState');
const filterButtons = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.querySelector('#clearCompletedBtn');
const actionsBar = document.querySelector('#actionsBar');
const totalTasksEl = document.querySelector('#totalTasks');
const activeTasksEl = document.querySelector('#activeTasks');
const completedTasksEl = document.querySelector('#completedTasks');

let tasks = [];
let currentFilter = 'all';

const STORAGE_KEY = 'todoAppTasks';

const loadTasks = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    tasks = JSON.parse(stored);
  }
  renderTasks();
  updateStats();
};

const saveTasks = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

const updateStats = () => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const active = total - completed;

  totalTasksEl.textContent = total;
  activeTasksEl.textContent = active;
  completedTasksEl.textContent = completed;

  if (completed > 0) {
    actionsBar.style.display = 'block';
  } else {
    actionsBar.style.display = 'none';
  }
};

const getFilteredTasks = () => {
  switch (currentFilter) {
    case 'active':
      return tasks.filter((t) => !t.completed);
    case 'completed':
      return tasks.filter((t) => t.completed);
    default:
      return tasks;
  }
};

const renderTasks = () => {
  const filteredTasks = getFilteredTasks();

  if (filteredTasks.length === 0 && tasks.length === 0) {
    emptyState.style.display = 'block';
    tasksList.innerHTML = '';
    tasksList.appendChild(emptyState);
    return;
  }

  if (filteredTasks.length === 0) {
    emptyState.style.display = 'block';
    emptyState.innerHTML = `<p>No ${currentFilter} tasks. ${currentFilter === 'completed' ? 'Complete some tasks!' : 'All tasks are completed!'}</p>`;
    tasksList.innerHTML = '';
    tasksList.appendChild(emptyState);
    return;
  }

  emptyState.style.display = 'none';
  tasksList.innerHTML = '';

  filteredTasks.forEach((task) => {
    const taskItem = document.createElement('li');
    taskItem.className = `task-item ${task.completed ? 'task-item--completed' : ''}`;
    taskItem.setAttribute('data-task-id', task.id);

    taskItem.innerHTML = `
      <label class="task-checkbox">
        <input
          type="checkbox"
          class="checkbox"
          ${task.completed ? 'checked' : ''}
          aria-label="Mark task as ${task.completed ? 'incomplete' : 'complete'}"
        />
        <span class="checkmark"></span>
      </label>
      <span class="task-text">${escapeHtml(task.text)}</span>
      <button class="btn-icon" data-action="delete" aria-label="Delete task">
        ×
      </button>
    `;

    tasksList.appendChild(taskItem);
  });

  attachTaskListeners();
};

const escapeHtml = (text) => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

const attachTaskListeners = () => {
  document.querySelectorAll('.task-item').forEach((item) => {
    const checkbox = item.querySelector('.checkbox');
    const deleteBtn = item.querySelector('[data-action="delete"]');
    const taskId = parseInt(item.dataset.taskId);

    checkbox.addEventListener('change', () => {
      toggleTask(taskId);
    });

    deleteBtn.addEventListener('click', () => {
      deleteTask(taskId);
    });
  });
};

const addTask = () => {
  const text = taskInput.value.trim();
  if (!text) return;

  const task = {
    id: Date.now(),
    text: text,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  tasks.push(task);
  taskInput.value = '';
  saveTasks();
  renderTasks();
  updateStats();
  taskInput.focus();
};

const toggleTask = (taskId) => {
  const task = tasks.find((t) => t.id === taskId);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
    updateStats();
  }
};

const deleteTask = (taskId) => {
  tasks = tasks.filter((t) => t.id !== taskId);
  saveTasks();
  renderTasks();
  updateStats();
};

const clearCompleted = () => {
  tasks = tasks.filter((t) => !t.completed);
  saveTasks();
  renderTasks();
  updateStats();
};

const setFilter = (filter) => {
  currentFilter = filter;
  filterButtons.forEach((btn) => {
    btn.classList.remove('active');
    if (btn.dataset.filter === filter) {
      btn.classList.add('active');
    }
  });
  renderTasks();
};

addTaskBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTask();
  }
});

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    setFilter(btn.dataset.filter);
  });
});

clearCompletedBtn.addEventListener('click', clearCompleted);

loadTasks();


