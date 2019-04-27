<template>
  <worker-detail :is-edit="true" />
</template>

<script>
import WorkerDetail from './components/workerDetail';

export default {
    name: 'WorkerDetail2',
    components: { WorkerDetail }
};
</script>

