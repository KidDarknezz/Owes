<template>
	<q-form @submit="submitForm">
		<q-input
		v-if="tab == 'register'"
		outlined
		v-model="formData.name"
		class="q-mb-md"
		label="Full name"
		:rules="[val => !!val || 'Field is required']" />
		<q-input
		outlined
		type="email"
		v-model="formData.email"
		class="q-mb-md"
		label="Email"
		:rules ="[value => validateEmail(value) || 'Field must be a valid email']" />
		<q-input
		outlined
		type="password"
		v-model="formData.password"
		label="Password"
		:rules ="[value => value.length >= 8 || 'Field must contain at least 8 characters']" />
		<q-banner
		class="text-white bg-red q-mb-md"
		v-if="errMsg">
			{{ errMsgContent }}
	    </q-banner>
		<div class="row">
			<q-space />
			<q-btn
			color="primary"
			type="submit"
			:label="tab" />
		</div>
	</q-form>
</template>

<script>
	import { mapActions } from 'vuex'

	export default {
		props:['tab'],
		data() {
			return {
				formData: {
					name: '',
					email: 'test2@test.com',
					password: '123456789'
				},
				errMsg: true,
				errMsgContent: 'You have lost connection to the internet. This app is offline.'
			}
		},
		methods: {
			...mapActions('store', ['registerUser', 'loginUser']),
			submitForm() {
				if (this.tab == 'login') {
					this.loginUser(this.formData)
				}
				else {
					this.registerUser(this.formData)
				}
			},
			validateEmail(email) {
				var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    			return regex.test(String(email).toLowerCase());
			}
		}
	}
</script>