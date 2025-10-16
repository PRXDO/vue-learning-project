<script setup>
import { ref } from 'vue';

const newTaskTitle = ref('');
const emit = defineEmits(['task-added']);

const addTask = () => {
  // Impede de adicionar tarefa vazia
  if (newTaskTitle.value.trim() === '') {
    return;
  }
  // Emite o evento para o componente pai com o título da nova tarefa
  emit('task-added', newTaskTitle.value);
  // Limpa o campo de input
  newTaskTitle.value = '';
};
</script>

<template>
  <form @submit.prevent="addTask">
    <input
      type="text"
      v-model="newTaskTitle"
      placeholder="Adicionar nova tarefa..."
    />
    <button type="submit">Adicionar</button>
  </form>
</template>

<style scoped>
  form {
    display: flex;
    margin-bottom: 20px;
  }
  input {
    flex-grow: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  button {
    padding: 10px 15px;
    border: none;
    background-color: #41b883;
    color: white;
    border-radius: 4px;
    margin-left: 10px;
    cursor: pointer;
  }
</style>