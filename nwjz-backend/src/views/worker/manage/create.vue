<template>
  <worker-detail :is-edit="false" />
</template>

<script>
import NewWorker from './components/newWorker';
import WorkerDetail from './components/WorkerDetail';

export default {
  name: 'CreateWorker',
  components: { NewWorker, WorkerDetail }
};
</script>

