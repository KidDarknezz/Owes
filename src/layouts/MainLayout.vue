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
          class="text-grey-8"
        >
          Menu
        </q-item-label>
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
import EssentialLink from 'components/EssentialLink'

export default {
  computed: {
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
