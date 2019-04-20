<template>
  <new-worker :is-edit="false" />
</template>

<script>
import NewWorker from './components/newWorker';

export default {
    name: 'CreateWorker',
    components: { NewWorker }
};
</script>

