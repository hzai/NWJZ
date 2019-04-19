<template>
  <customer-detail :is-edit="false" />
</template>

<script>
import CustomerDetail from '@/views/customer/components/customerDetail';
export default {
    name: 'CustomerCreate',
    components: {
        CustomerDetail
    }
};
</script>

