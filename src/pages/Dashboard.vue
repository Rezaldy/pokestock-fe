<template>
  <q-page class="column items-top justify-start q-pa-md">
    <span class="text-h1 text-white">Dashboard</span>
    <span class="text-h2 text-center text-white">Welcome to OnceInLuv's break store! What would you like to do today?</span>
    <div class="flex full-width justify-evenly align-center buttonContainer q-mt-lg">
      <q-btn class="q-px-xl q-py-xl" color="primary" rounded icon="shop" label="Browse the shop!" />
      <q-btn class="q-px-xl q-py-xl" color="primary" rounded icon="list" label="Find your orders" />
    </div>
  </q-page>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';

@Component({
  components: {}
})
export default class PageIndex extends Vue {

};
</script>

<style lang="scss" scoped>
.buttonContainer {
  height: 300px;
}
</style>
