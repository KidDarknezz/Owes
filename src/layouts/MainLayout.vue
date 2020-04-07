<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
          v-if="$route.fullPath == '/'"
        />
        <q-btn
          flat
          dense
          round
          icon="arrow_back"
          @click="$router.go(-1)"
          v-if="$route.fullPath.includes('/owing')"
        />

        <q-toolbar-title class="absolute-center">
          {{ title }}
        </q-toolbar-title>

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8" >
          Menu
        </q-item-label>
        <q-item>
          <q-item-section avatar>
            <q-avatar  color="primary" text-color="white">
              <!-- {{ userDetails.name[0].toUpperCase() }} -->
              P
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1">
              <span v-if="userDetails.name">Hello, {{ userDetails.name.split(" ")[0] }}!</span>
              <!-- Hello, Pepe! -->
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-separator class="q-mb-md" inset="item" />
        <EssentialLink
          v-for="link in menuLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapState } from 'vuex'
import EssentialLink from 'components/EssentialLink'

export default {
  computed: {
    ...mapState('store', ['userDetails']),
    title() {
      let currentPath = this.$route.fullPath
      if (currentPath == '/login') return 'Login'
      else return 'Owes'
    }
  },
  components: {
    EssentialLink
  },

  data () {
    return {
      leftDrawerOpen: false,
      menuLinks: [
        {
          title: 'Logout',
          caption: 'Logout from your account',
          icon: 'logout',
        }
      ]
    }
  }
}
</script>
