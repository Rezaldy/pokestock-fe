<template>
  <q-page padding>
  </q-page>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';

@Component({
  components: {}
})
export default class Order extends Vue {
  public data: any = {};

  public created () {
    this.$axios.get(`/orders/${this.$route.params.id}`).then(
      response => {
        this.data = response.data;
      }
    )
  }
}
</script>

<style lang="scss" scoped>

</style>
