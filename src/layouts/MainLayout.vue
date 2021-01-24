<template>
  <q-layout view="lHh Lpr lFf">
    <img class="bg" src="~assets/img/bg.jpg"/>
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-toolbar-title>
          OnceInLuv Pokémon Store
        </q-toolbar-title>
        <div class="row cursor-pointer justify-right items-center" v-if="$store.getters['auth/isAuthorized']">
          <span class="streamlink q-toolbar__title">{{ $store.getters['auth/user'].twitch_nickname }}</span>
          <q-img class="rounded-borders" transition="jump-down" style="width: 40px" :ratio="1"
                 :src="$store.getters['auth/user'].avatar"/>
          <q-menu touch-position>
            <q-list>
              <q-item clickable class="text-center">
                <q-item-section @click="toggleDark">{{ $q.dark.isActive ? 'Light Mode' : 'Dark Mode' }}</q-item-section>
              </q-item>
              <q-item clickable @click="connectDiscord" v-close-popup
                      v-if="!$store.getters['auth/user'].discord_nickname">
                <q-item-section>Connect Discord</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </div>
      </q-toolbar>
    </q-header>
    <q-drawer
      v-model="leftDrawerOpen"
      bordered
    >
      <q-list>
        <q-item-label header>
          Main Menu
        </q-item-label>
        <EssentialLink
          v-for="route in routes"
          :key="route.title"
          v-bind="route"
        />
      </q-list>
      <q-item-label header>
        External Links
      </q-item-label>
      <EssentialLink
        v-for="link in externalLinks"
        :key="link.title"
        :is-external="true"
        v-bind="link"
      />
    </q-drawer>

    <q-page-container>
      <transition
        mode="out-in"
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
        appear
      >
        <router-view/>
      </transition>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import EssentialLink from 'components/EssentialLink.vue';

const routesData: {
  title: string;
  caption: string;
  icon: string;
  route: string;
  requiresAuth: boolean;
  hideOnAuth: boolean;
  requiresAdmin?: boolean;
}[] = [
  {
    title: 'Login',
    caption: 'Log in here',
    icon: 'login',
    route: 'login',
    requiresAuth: false,
    hideOnAuth: true
  },
  {
    title: 'Dashboard',
    caption: 'The Pokémon library hub',
    icon: 'home',
    route: 'dashboard',
    requiresAuth: true,
    hideOnAuth: false
  },
  {
    title: 'Products',
    caption: 'Manage products here',
    icon: 'shopping_cart',
    route: 'products',
    requiresAuth: true,
    hideOnAuth: false,
    requiresAdmin: true,
  },
  {
    title: 'Shop',
    caption: 'Buy your items here!',
    icon: 'shopping_cart',
    route: 'shopCategories',
    requiresAuth: true,
    hideOnAuth: false,
    requiresAdmin: false,
  },
];

const externalLinksData: {
  title: string;
  caption: string;
  icon: string;
  route: string;
  requiresAuth: boolean;
  hideOnAuth: boolean;
  requiresAdmin?: boolean;
}[] = [
  {
    title: 'Stream',
    caption: 'Click here to go to my stream',
    icon: 'link',
    route: 'https://twitch.tv/onceinluv',
    requiresAuth: true,
    hideOnAuth: false
  },
]

import {Vue, Component} from 'vue-property-decorator';

@Component({
  components: {EssentialLink}
})
export default class MainLayout extends Vue {
  leftDrawerOpen = false;

  get routes() {
    return routesData.filter(
      link => {
        return (link.requiresAuth && this.$store.getters['auth/isAuthorized']) || (link.hideOnAuth && !this.$store.getters['auth/isAuthorized'])
      }
    ).filter(
      link => {
        if (link.requiresAdmin && !this.$store.getters['auth/isAdmin']) {
          return false;
        }
        return true;
      }
    );
  }

  get externalLinks() {
    return externalLinksData.filter(
      link => {
        return (link.requiresAuth && this.$store.getters['auth/isAuthorized']) || (link.hideOnAuth && !this.$store.getters['auth/isAuthorized'])
      }
    ).filter(
      link => {
        if (link.requiresAdmin && !this.$store.getters['auth/isAdmin']) {
          return false;
        }
        return true;
      }
    );
  }

  toggleDark() {
    this.$q.dark.toggle();
    this.$q.localStorage.set('dark', this.$q.dark.isActive);
  }

  connectDiscord() {
    let win: null | Window;
    let checkConnect: number;
    const oAuthURL = process.env.API_PLAIN + '/login/discord';

    win = window.open(oAuthURL, 'SomeAuthentication', 'width=972,height=660,modal=yes,alwaysRaised=yes');

    checkConnect = window.setInterval(() => {
      if (!win || !win.closed) return;
      clearInterval(checkConnect);

      this.$q.loading.show();
      void this.$axios.get('/user').then(
        response => {
          this.$store.commit('auth/setUser', response.data);
          this.$q.notify({
            type: 'positive',
            message: 'Discord connected. Thank you!'
          });
        },
        error => {
          console.error(error);
        }
      ).finally(
        () => {
          this.$q.loading.hide();
        }
      )

    }, 100);
  }
}
</script>

<style lang="scss">
.streamlink {
  text-decoration: none;
  color: white;
  transition: text-shadow .2s;

  &:hover {
    text-shadow: 0 0 5px #f3eff5;
  }
}

img.bg {
  /* Set rules to fill background */
  min-height: 100%;
  min-width: 1024px;

  /* Set up proportionate scaling */
  width: 100%;
  height: auto;

  /* Set up positioning */
  position: fixed;
  top: 0;
  left: 0;
}

@media screen and (max-width: 1024px) { /* Specific to this particular image */
  img.bg {
    left: 50%;
    margin-left: -512px; /* 50% */
  }
}
</style>
