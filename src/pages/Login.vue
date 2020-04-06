<template>
  <q-page class="q-pa-md">
    <div class="row q-mb-md">
      <q-img
        src="../assets/OwesLogo.png"
        style="height: 150px; max-width: 150px; margin: 0 auto;"
      />
    </div>
  	<q-card class="full-width">
        <q-tabs
          v-model="tab"
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="login" label="Login" />
          <q-tab name="register" label="Register" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="login">
            <login-register :tab="tab" />
          </q-tab-panel>

          <q-tab-panel name="register">
            <login-register :tab="tab" />
          </q-tab-panel>

        </q-tab-panels>
      </q-card>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      tab: 'login'
    }
  },
  components: {
  	'login-register': require('components/LoginRegister.vue').default
  }
}
</script>
