<template>
  <q-page class="row items-center justify-start q-pa-xl">
    <div class="row justify-center items-center login shadow-4">
      <q-btn @click="twitchLogin" class="q-ma-sm q-pa-xl" color="primary" label="Login with Twitch"/>
    </div>
  </q-page>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';

@Component({
  components: {}
})
export default class PageIndex extends Vue {
  twitchLogin() {
    let win: null | Window;
    let checkConnect: number;
    const oAuthURL = process.env.API_PLAIN + '/login';

    win = window.open(oAuthURL, 'SomeAuthentication', 'width=972,height=660,modal=yes,alwaysRaised=yes');

    checkConnect = window.setInterval(function() {
      if (!win || !win.closed) return;
      clearInterval(checkConnect);
      window.location.reload();
    }, 100);
  }
};
</script>

<style lang="scss">
.login {
  border-radius:10px;
  background: $accent;
}
</style>
