<template>
  <company-detail :is-edit="true" />
</template>

<script>
import CompanyDetail from './components/CompanyDetail';

export default {
  name: 'EditCompany',
  components: { CompanyDetail }
};
</script>

