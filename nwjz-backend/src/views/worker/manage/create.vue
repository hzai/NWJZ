<template>
  <worker-detail :is-edit="false" />
</template>

<script>
import WorkerDetail from './components/workerDetail';

export default {
    name: 'CreateWorker',
    components: { WorkerDetail }
};
</script>

