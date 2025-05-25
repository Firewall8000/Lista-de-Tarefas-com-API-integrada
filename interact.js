document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('taskList');
    const addTaskForm = document.getElementById('addTaskForm');
    const taskDescriptionInput = document.getElementById('taskDescription');

    // Função para buscar e exibir as tarefas
    async function fetchAndDisplayTasks() {
        try {
            const response = await fetch('/tasks');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const tasks = await response.json();
            taskList.innerHTML = ''; // Limpa a lista existente
            tasks.forEach(task => {
                addTaskToDOM(task);
            });
        } catch (error) {
            console.error('Erro ao buscar tarefas:', error);
            taskList.innerHTML = '<li>Erro ao carregar tarefas. Tente novamente mais tarde.</li>';
        }
    }

    // Função para adicionar uma tarefa ao DOM
    function addTaskToDOM(task) {
        const listItem = document.createElement('li');
        listItem.dataset.id = task.id; // Armazena o ID da tarefa no elemento li

        let completeButton;
        if (task.completed) {
            listItem.classList.add('completed');
            listItem.innerHTML = `
                <span>${task.description}</span>
                <button class="completed-btn" disabled>Concluída</button>
            `;
        } else {
            listItem.innerHTML = `
                <span>${task.description}</span>
                <button class="complete-btn">Concluir</button>
            `;
            completeButton = listItem.querySelector('.complete-btn');
            completeButton.addEventListener('click', () => completeTask(task.id, listItem, completeButton));
        }
        taskList.appendChild(listItem);
    }

    // Função para lidar com o envio do formulário de nova tarefa
    addTaskForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evita o comportamento padrão de recarregar a página

        const description = taskDescriptionInput.value.trim();
        if (!description) {
            alert('A descrição da tarefa não pode estar vazia.');
            return;
        }

        try {
            const response = await fetch('/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ description })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const newTask = await response.json();
            addTaskToDOM(newTask); // Adiciona a nova tarefa ao DOM
            taskDescriptionInput.value = ''; // Limpa o campo de texto
        } catch (error) {
            console.error('Erro ao adicionar tarefa:', error);
            alert('Erro ao adicionar tarefa: ' + error.message);
        }
    });

    // Função para enviar a requisição PUT para completar a tarefa
    async function completeTask(id, listItem, button) {
        try {
            const response = await fetch(`/tasks/${id}/complete`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const updatedTask = await response.json();
            listItem.classList.add('completed');
            button.textContent = 'Concluída';
            button.classList.remove('complete-btn');
            button.classList.add('completed-btn');
            button.disabled = true; // Desabilita o botão após concluir
            console.log('Tarefa atualizada:', updatedTask);
        } catch (error) {
            console.error('Erro ao completar tarefa:', error);
            alert('Erro ao completar tarefa: ' + error.message);
        }
    }

    // Carrega as tarefas ao carregar a página
    fetchAndDisplayTasks();
});