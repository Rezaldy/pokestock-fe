<template>
  <div id="q-app">
    <router-view/>
  </div>
</template>
<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';
import Vuelidate from 'vuelidate';
Vue.use(Vuelidate);

@Component
export default class App extends Vue {

  created() {
    // Check Dark Mode
    if (this.$q.localStorage.getItem('dark')) {
      this.$q.dark.set(true);
    }

    this.$q.loading.show({
      message: 'Setting up!'
    });
    void this.$axios.get('/csrf-cookie').catch(
      error => {
        console.error(error);
        this.$q.notify({
          type: 'negative',
          message: 'Requesting CSRF cookie failed.'
        });
      }
    ).finally(
      () => {
        void this.$axios.get('/user').then(
          response => {
            this.$store.commit('auth/setUser', response.data);
            this.$store.commit('auth/setAuth', true);
            if (this.$route.name === 'home') {
              void this.$router.push({name: 'dashboard'});
            }
          },
          error => {
            console.error(error);
            if (this.$route.name !== 'home') {
              this.$q.notify({
                type: 'warning',
                message: 'Please log in.'
              });
              void this.$router.push({name: 'home'});
            }
          }
        ).finally(
          () => {
            this.$q.loading.hide();
          }
        )
      }
    );
  }
}
</script>

<style lang="scss">
</style>
