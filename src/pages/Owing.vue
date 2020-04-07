<template>
	<q-page>
		
		<q-card class="q-ma-md">
      		<q-card-section class="bg-primary text-white text-center">
        		<div class="text-h6">Total amount: {{ owing.amount | toCurrency }}</div>
      		</q-card-section>
      		<q-card-section>
      			<div class="text-subtitle1 text-center"><strong>{{ owing.name }}</strong></div>
      			<q-chip :color="owing.status === 'open' ? 'teal' : 'deep-orange'" text-color="white" :icon="owing.status === 'open' ? 'attach_money' : 'money_off'">
        			{{ owing.status }}
      			</q-chip>
      			{{ owing.description }}
      		</q-card-section>
    	</q-card>

    	<q-card class="q-ma-md">
      		<q-card-section class="bg-teal text-white text-center">
        		<div class="text-h6">Amount payed: {{ totalPayed(owing.payments) | toCurrency }}</div>
      		</q-card-section>
    	</q-card>

    	<q-card class="q-ma-md">
      		<q-card-section class="bg-deep-orange text-white text-center">
        		<div class="text-h6">Still owing: {{ owing.amount - totalPayed(owing.payments) | toCurrency }}</div>
      		</q-card-section>
    	</q-card>

    	<q-separator />

		<q-item-label header>Payments</q-item-label>

    	<q-list
    		bordered
    		separator
    		class="q-ml-md q-mr-md"
    		v-if="owing.payments.length > 0">
	      	<q-item
	      		clickable
	      		v-ripple
	      		active="active"
	      		v-for="payment in owing.payments"
	      		@click="confirmPaymentDelete = true; deletePaymentId = payment.id">
	        	<q-item-section class="text-black">{{ payment.amount | toCurrency }}</q-item-section>
	        	<q-item-section side>{{ payment.date }}</q-item-section>
	      	</q-item>
    	</q-list>
    	<p
    		class="text-center text-grey-8 q-mt-md"
    		v-else>
    		There are no payments registered
    	</p>
  		<q-page-sticky position="bottom-right" :offset="[18, 18]">
      		<q-fab
	        label="Actions"
	        external-label
	        label-class="bg-grey-3 text-purple"
	        vertical-actions-align="left"
	        color="purple"
	        icon="keyboard_arrow_up"
	        direction="up">
	        <!-- <q-fab-action v-if="owing.status === 'open'" label-class="bg-grey-3 text-grey-8" external-label color="teal" icon="done" label="Close owing" label-position="left" @click="editOwingStatus('closed')" /> -->
	        <q-fab-action v-if="owing.status === 'open'" label-class="bg-grey-3 text-grey-8" external-label color="primary" icon="add" label="Add payment" label-position="left" @click="prompt = true" />
	        <q-fab-action label-class="bg-grey-3 text-grey-8" external-label color="deep-orange" icon="delete" label="Delete owing" label-position="left" @click="confirmOwingDelete = true" />
      		</q-fab>
        </q-page-sticky>
        <q-dialog
	    	v-model="prompt"
	    	persistent>
	      <q-card style="min-width: 350px">
	        <q-card-section>
	          <div class="text-h6">Add payment</div>
	        </q-card-section>
	        <q-form @submit="createPayment">
		        <q-card-section class="q-pt-none">
		          <!-- <q-input
		          	v-model="amount"
		          	placeholder="500.00"
		          	type="number"
			        :rules="[val => !!val || 'Field is required', val => val > 0 || 'Amount must be greater than 0']" /> -->
			        <q-input
				        v-model="amount"
				        mask="#.##"
				        placeholder="100.00"
				        reverse-fill-mask
				        prefix="$ "
				        input-class="text-right"
				        :rules="[val => !!val || 'Field is required', val => val > 0 || 'Amount must be greater than 0']" />
			        <q-date v-model="date" class="full-width q-mt-md" />
		        </q-card-section>

		        <q-card-actions align="right" class="text-primary">
		          <q-btn flat label="Cancel" @click="closePrompt" />
		          <q-btn flat label="Create" type="submit"/>
		        </q-card-actions>
	    	</q-form>
	      </q-card>
	    </q-dialog>

		<q-dialog v-model="confirmPaymentDelete" persistent>
	    	<q-card>
	        	<q-card-section class="row items-center">
	          		<span class="q-ml-sm">Are you sure you want to delete this payment?</span>
	        	</q-card-section>
	        	<q-card-actions align="right">
	         		<q-btn flat label="Cancel" color="primary" v-close-popup />
	          		<q-btn flat label="Delete" color="primary" @click="deletePayment"/>
	        	</q-card-actions>
	      	</q-card>
	    </q-dialog>

	    <q-dialog v-model="confirmOwingDelete" persistent>
	    	<q-card>
	        	<q-card-section class="row items-center">
	          		<span class="q-ml-sm">Are you sure you want to delete this owing?</span>
	        	</q-card-section>
	        	<q-card-actions align="right">
	         		<q-btn flat label="Cancel" color="primary" v-close-popup />
	          		<q-btn flat label="Delete" color="primary" @click="deleteOwing"/>
	        	</q-card-actions>
	      	</q-card>
	    </q-dialog>

	    <q-dialog v-model="alert">
	    	<q-card>
	        	<q-card-section>
	          		<div class="text-h6">Owing will be closed</div>
	        	</q-card-section>

	        	<q-card-section class="q-pt-none">
	          		With this new payment the owing amount will be completed.
	          		<br /><br />
	          		The owing will be closed automatically.
	        	</q-card-section>

	        	<q-card-actions align="right">
	          		<q-btn flat label="OK" color="primary" v-close-popup />
	        	</q-card-actions>
	      	</q-card>
	    </q-dialog>
	</q-page>
</template>

<script>
	import {  firebaseAuth, firebaseDb } from 'boot/firebase'

	export default {
		data() {
			return {
				owing: {
					payments: []
				},
				amount: '',
				date: this.generateDate(),
				prompt: false,
				confirmPaymentDelete: false,
				confirmOwingDelete: false,
				alert: false,
				deletePaymentId: ''
			}
		},
		methods: {
			getData() {
				let payments = []
				let el = {}
				firebaseDb.ref('users/' + firebaseAuth.currentUser.uid + '/owesMe/' + this.$route.params.id).once('value', snapshot => {
						this.owing = snapshot.val()
						for (let pymnt in snapshot.val().payments) {
							el = snapshot.val().payments[pymnt]
							el.id = pymnt
							payments.push(el)
						}
						this.owing.payments = payments
						if (this.owing.status === 'closed')
							this.owingShouldBeReOpened()
				})
			},
			createPayment() {
				let postPayment = {
					amount: this.amount,
					date: this.date
				}
				this.closePrompt()
				fetch(`https://owes-c686b.firebaseio.com/users/${firebaseAuth.currentUser.uid}/owesMe/${this.$route.params.id}/payments.json`, {
					method: 'post',
					body: JSON.stringify(postPayment)
				}).then(response => {
					this.getData()
					this.owingShouldBeClosed(postPayment.amount)
					return response.json()
				})
			},
			editOwingStatus(status) {
				firebaseDb.ref('users/' + firebaseAuth.currentUser.uid + '/owesMe/' + this.$route.params.id).update({
					status: status,
				}).then(response => {
					this.getData()
					return response
				})
			},
			deleteOwing() {
				fetch('https://owes-c686b.firebaseio.com/users/' + firebaseAuth.currentUser.uid + '/owesMe/' + this.$route.params.id + '.json', {
					method: 'delete'
				}).then(response => {
					this.$router.replace('/')
					return response.json
				})
			},
			deletePayment() {
				firebaseDb.ref('users/' + firebaseAuth.currentUser.uid + '/owesMe/' + this.$route.params.id + '/payments/' + this.deletePaymentId).remove()
				.then(response => {
					this.getData()
					this.confirmPaymentDelete = false
				})
			},
			owingShouldBeClosed(newPymnt) {
				let totalPayed = this.totalPayed(this.owing.payments) + parseFloat(newPymnt)
				if (totalPayed >= this.owing.amount) {
					this.alert = true
					this.editOwingStatus('closed')
				}
				
			},
			owingShouldBeReOpened() {
				let totalPayed = this.totalPayed(this.owing.payments)
				if (totalPayed < parseFloat(this.owing.amount)) {
					this.editOwingStatus('open')
				} 
			},
			closePrompt() {
				this.prompt = false
				this.amount = ''
			},
			generateDate() {
				let today = new Date()
				let yyyy = today.getFullYear()
				let mm = today.getMonth() + 1
				let dd = today.getDate()
				if (mm < 10) mm = `0${mm}`
				if (dd < 10) dd = `0${dd}`
				return `${yyyy}/${mm}/${dd}`
			},
			totalPayed(payments) {
				let total = 0
				for (let payment in payments) {
					total += parseFloat(payments[payment].amount)
				}
				return total
			}
		},
		beforeMount() {
			this.getData()
		},
		filters: {
			toCurrency: function (amount) {
				return `$ ${parseFloat(amount).toFixed(2)}`
			}
		}
	}
</script>
