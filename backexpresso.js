const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Middleware para servir arquivos estáticos da pasta 'public'
app.use(express.static('public'));

// Middleware para parsear JSON e URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let tasks = [
    { id: 1, description: 'Comprar pão', completed: false },
    { id: 2, description: 'Estudar Node.js', completed: false },
    { id: 3, description: 'Fazer exercício', completed: false }
];
let nextId = 4; // Para gerar IDs únicos para novas tarefas

// Rota para obter todas as tarefas
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// Rota para criar uma nova tarefa (POST)
app.post('/tasks', (req, res) => {
    const { description } = req.body;
    if (!description) {
        return res.status(400).json({ message: 'A descrição da tarefa é obrigatória.' });
    }
    const newTask = {
        id: nextId++,
        description,
        completed: false
    };
    tasks.push(newTask);
    res.status(201).json(newTask); // Retorna a nova tarefa criada com status 201 Created
});

// Rota para atualizar o status de uma tarefa para 'concluída' (PUT)
app.put('/tasks/:id/complete', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({ message: 'Tarefa não encontrada.' });
    }

    tasks[taskIndex].completed = true;
    res.status(200).json(tasks[taskIndex]); // Retorna a tarefa atualizada
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});