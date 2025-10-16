<script setup>
const props = defineProps({
  tasks: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['toggle-status']);

const toggleStatus = (task) => {
  const newStatus = task.status === 'pendente' ? 'concluída' : 'pendente';
  emit('toggle-status', { id: task.id, status: newStatus });
};
</script>

<template>
  <ul>
    <li
      v-for="task in tasks"
      :key="task.id"
      :class="{ completed: task.status === 'concluída' }"
    >
      <span>{{ task.title }}</span>
      <button @click="toggleStatus(task)">
        {{ task.status === 'pendente' ? 'Concluir' : 'Reabrir' }}
      </button>
    </li>
  </ul>
</template>

<style scoped>
  ul {
    list-style: none;
    padding: 0;
  }
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #eee;
  }
  li.completed span {
    text-decoration: line-through;
    color: #999;
  }
  button {
    padding: 5px 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background-color: #34495e;
    color: white;
  }
</style>