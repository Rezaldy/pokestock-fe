<template>
  <q-item
    clickable
    tag="a"
    target="_blank"
    @click="handleClick"
  >
    <q-item-section
      v-if="icon"
      avatar
    >
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>
        {{ caption }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class EssentialLink extends Vue {
  @Prop({ type: String, required: true }) readonly title!: string;
  @Prop({ type: String, default: '' }) readonly caption!: string;
  @Prop({ type: String, default: '' }) readonly route!: string;
  @Prop({ type: String, default: ''}) readonly icon!: string;
  @Prop({ type: Boolean, default: false}) readonly isExternal!: boolean;

  handleClick() {
    this.isExternal ? this.openLink() : void this.goToRoute();
  }

  goToRoute() {
    return this
      .$router
      .push({name: this.route});
  }

  openLink() {
    window.open(this.route);
  }
}
</script>
