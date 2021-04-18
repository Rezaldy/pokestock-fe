<template>
  <q-page padding>
    <div class="q-pa-md row">
      <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
        <q-card class="categoryCard" @click="goToShop(0)">
          <q-card-section class="text-center">
            <q-img class="image" src="~assets/img/shop/category/boosters.png" contain/>
          </q-card-section>
          <q-separator/>
          <q-card-section class="flex flex-center">
            <div class="text-h4">Singles</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
        <q-card class="categoryCard" @click="goToShop(1)">
          <q-card-section class="text-center">
            <q-img class="image" src="~assets/img/shop/category/ETB.webp" contain/>
          </q-card-section>
          <q-separator/>
          <q-card-section class="flex flex-center">
            <div class="text-h4">Elite Trainer Boxes</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
        <q-card class="categoryCard" @click="goToShop(2)">
          <q-card-section class="text-center">
            <q-img class="image" src="~assets/img/shop/category/tins.webp" contain/>
          </q-card-section>
          <q-separator/>
          <q-card-section class="flex flex-center">
            <div class="text-h4">Tins</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
        <q-card class="categoryCard" @click="goToShop(3)">
          <q-card-section class="text-center">
            <q-img class="image" src="~assets/img/shop/category/boosterbox.png" contain/>
          </q-card-section>
          <q-separator/>
          <q-card-section class="flex flex-center">
            <div class="text-h4">Booster Box</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
        <q-card class="categoryCard" @click="goToShop(4)">
          <q-card-section class="text-center">
            <q-img class="image" src="~assets/img/shop/category/misc.jpg" contain/>
          </q-card-section>
          <q-separator/>
          <q-card-section class="flex flex-center">
            <div class="text-h4">Misc. Boxes & Blister packs</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
        <q-card class="categoryCard" @click="goToShop(5)">
          <q-card-section class="text-center">
            <q-icon>

            </q-icon>
          </q-card-section>
          <q-separator/>
          <q-card-section class="flex flex-center">
            <div class="text-h4">Shipping</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
        <q-card class="categoryCard" @click="goToShop()">
          <q-card-section class="text-center">
            <q-img class="image" src="~assets/img/shop/category/etbplus1.png" contain/>
          </q-card-section>
          <q-separator/>
          <q-card-section class="flex flex-center">
            <div class="text-h4">View all</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';

@Component({
  components: {}
})
export default class ShopCategories extends Vue {

  goToShop(category?: number) {
    if (category !== undefined) {
      // @ts-ignore
      this.$router.push({name: 'shopCategory', params: {category}});
    } else {
      this.$router.push({name: 'shopAll'})
    }
  }
}
</script>

<style lang="scss" scoped>
.image {
  min-height: 250px;
  max-height: 250px;
}

.categoryCard {
  cursor: pointer;
  transition: box-shadow .2s ease-in-out;

  &:hover {
    -webkit-box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.75);
    box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.75);
  }
}
</style>
