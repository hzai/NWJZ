<template>
  <worker-detail :is-edit="true" />
</template>

<script>
import WorkerDetail from './components/WorkerDetail';

export default {
    name: 'EditWorker',
    components: { WorkerDetail }
};
</script>

