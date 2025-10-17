<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import TaskForm from './components/TaskForm.vue';
import TaskList from './components/TaskList.vue';

// A URL base da nossa API
const API_URL = import.meta.env.VITE_API_URL + '/tasks';

// Uma variável reativa para armazenar nossa lista de tarefas
const tasks = ref([]);

// Função para buscar as tarefas do backend
const fetchTasks = async () => {
  try {
    const response = await axios.get(API_URL);
    tasks.value = response.data;
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
  }
};

// Função para adicionar uma nova tarefa
const handleTaskAdded = async (title) => {
  try {
    const response = await axios.post(API_URL, { title });
    // Adiciona a nova tarefa (retornada pela API) à nossa lista local
    tasks.value.push(response.data);
  } catch (error) {
    console.error('Erro ao adicionar tarefa:', error);
  }
};

// Função para mudar o status de uma tarefa
const handleToggleStatus = async ({ id, status }) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, { status });
    // Atualiza a tarefa na lista local
    const index = tasks.value.findIndex((task) => task.id === id);
    if (index !== -1) {
      tasks.value[index] = response.data;
    }
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
  }
};


// onMounted é um "gancho de ciclo de vida" do Vue.
// O código dentro dele roda assim que o componente é montado na tela.
onMounted(fetchTasks);
</script>

<template>
  <main>
    <h1>Minha Lista de Tarefas</h1>
    <TaskForm @task-added="handleTaskAdded" />
    <TaskList :tasks="tasks" @toggle-status="handleToggleStatus" />
  </main>
</template>

<style scoped>
  main {
    max-width: 600px;
    margin: 50px auto;
    font-family: sans-serif;
  }
  h1 {
    text-align: center;
    color: #41b883; /* Cor principal do Vue */
  }
</style>