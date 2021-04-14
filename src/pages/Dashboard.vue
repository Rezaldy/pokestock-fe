<template>
  <q-page class="column items-top justify-start q-pa-md">
    <span class="text-h1 headerText text-white">Dashboard</span>
    <span class="text-h2 text-white subText q-mt-md">Welcome to The Magic Library!</span>
    <span class="text-h2 text-white subText">What would you like to do today?</span>
    <div class="buttonContainer q-mt-lg">
      <q-btn @click="$router.push({name: 'shopCategories'})" class="q-px-lg text-center dashboardButton row q-py-lg" color="primary" rounded icon="shop" label="Shop" />
      <q-btn @click="$router.push({name: 'orders'})" class="q-px-lg text-center dashboardButton row q-py-lg q-mt-md" color="primary" rounded icon="list" label="Orders" />
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
.headerText {
  font-weight: 500;
  -webkit-text-fill-color: white; /* Will override color (regardless of order) */
  -webkit-text-stroke-width: 2px;
  -webkit-text-stroke-color: black;
}

.dashboardButton {
  width: 250px;
  height: 250px;
}

.subText {
  -webkit-text-fill-color: white; /* Will override color (regardless of order) */
  -webkit-text-stroke-width: 2px;
  -webkit-text-stroke-color: black;
  font-weight:bold;
}
</style>
