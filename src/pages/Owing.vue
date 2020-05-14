<template>
	<q-page>
		<!-- OWING INFO -->
		<q-card class="q-ma-md">
      		<q-card-section class="bg-primary text-white text-center">
        		<div class="text-h6">Total amount: {{ owingData.amount | toCurrency }}</div>
      		</q-card-section>
      		<q-card-section>
      			<div class="text-subtitle1 text-center"><strong>{{ owingData.name }}</strong></div>
      			<q-chip :color="owingData.status === 'open' ? 'teal' : 'deep-orange'" text-color="white" :icon="owingData.status === 'open' ? 'attach_money' : 'money_off'">
        			{{ owingData.status }}
      			</q-chip>
      			{{ owingData.description }}
      		</q-card-section>
    	</q-card>
    	<!-- END OWING INFO -->

    	<!-- AMOUNT PAYED -->
    	<q-card class="q-ma-md">
      		<q-card-section class="bg-teal text-white text-center">
        		<div class="text-h6">Amount payed: {{ totalPayed | toCurrency }}</div>
      		</q-card-section>
    	</q-card>
    	<!-- END AMOUNT PAYED -->

    	<!--STILL OWING -->
    	<q-card class="q-ma-md">
      		<q-card-section class="bg-deep-orange text-white text-center">
        		<div class="text-h6">Still owing: {{ owingData.amount - totalPayed | toCurrency }}</div>
      		</q-card-section>
    	</q-card>
    	<!-- END STILL OWING -->

    	<q-separator />

		<q-item-label header>Payments</q-item-label>

		<!-- PAYMENTS LIST -->
    	<q-list
    		bordered
    		separator
    		class="q-ml-md q-mr-md q-mb-md"
    		v-if="payments.length > 0">
	      	<q-item
	      		clickable
	      		v-ripple
	      		active="active"
	      		v-for="payment in payments"
				@click="paymentMenu = true; deletePaymentId = payment.id">
	        	<q-item-section class="text-black">
	        		{{ payment.amount | toCurrency }}
	        	</q-item-section>
	        	<q-item-section side>{{ payment.date }}</q-item-section>
	      	</q-item>
    	</q-list>
    	<!-- END PAYMENTS LIST -->

    	<!-- EMPTY PAYMENTS LIST PLACEHOLDER -->
    	<p
    		class="text-center text-grey-8 q-mt-md"
    		v-else>
    		There are no payments registered
    	</p>
    	<!-- END EMPTY PAYMENTS LIST PLACEHOLDER -->

    	<!-- FLOATING BUTTON -->
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
	        <q-fab-action v-if="owingData.status === 'open'" label-class="bg-grey-3 text-grey-8" external-label color="primary" icon="add" label="Add payment" label-position="left" @click="prompt = true" />
	        <q-fab-action label-class="bg-grey-3 text-grey-8" external-label color="deep-orange" icon="delete" label="Delete owing" label-position="left" @click="confirmOwingDelete = true" />
      		</q-fab>
        </q-page-sticky>
        <!-- END FLOATING BUTTON -->

        <!-- ADD NEW PAYMENT DIALOG -->
        <q-dialog
	    	v-model="prompt"
	    	persistent>
			<q-card style="min-width: 350px">
				<q-card-section>
					<div class="text-h6">Add payment</div>
				</q-card-section>
				<q-form @submit="createPayment">
					<q-card-section class="q-pt-none">
						<q-input
					        v-model="amount"
					        mask="#.##"
					        placeholder="100.00"
					        reverse-fill-mask
					        prefix="$ "
					        input-class="text-right"
					        :rules="[val => !!val || 'Add payment amount', val => val > 0 || 'Amount must be greater than 0']" />
						<q-file
							outlined
							v-model="proofOfPayment"
							label="Proof of payment">
							<template v-slot:prepend>
								<q-icon name="attach_file" />
							</template>
						</q-file>
						<q-date v-model="date" class="full-width q-mt-md" />
					</q-card-section>
					<q-card-actions align="right" class="text-primary">
						<q-btn flat label="Cancel" @click="closePrompt" />
						<q-btn flat label="Create" type="submit"/>
					</q-card-actions>
				</q-form>
			</q-card>
		</q-dialog>
	    <!-- END ADD NEW PAYMENT DIALOG -->

	    <!-- CONFIRM PAYMENT DELETE -->
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
	    <!-- END CONFIRM PAYMENT DELETE -->

	    <!-- CONFIRM OWING DELETE -->
	    <q-dialog v-model="confirmOwingDelete" persistent>
	    	<q-card>
	        	<q-card-section class="row items-center">
	          		<span class="q-ml-sm">Are you sure you want to delete this owing?</span>
	        	</q-card-section>
	        	<q-card-actions align="right">
	         		<q-btn flat label="Cancel" color="primary" v-close-popup />
	          		<q-btn flat label="Delete" color="primary" @click="deleteOwe"/>
	        	</q-card-actions>
	      	</q-card>
	    </q-dialog>
	    <!-- END CONFIRM OWING DELETE -->

	    <!-- PAYMENT MENU DIALOG -->
	    <q-dialog v-model="paymentMenu" position="bottom">
			<q-card style="width: 350px">
				<q-card-section class="row items-center q-pa-none">
					<q-btn-group class="full-width" style="height: 60px;" spread>
						<q-btn color="teal" label="Proof of Payment" icon="visibility" />
						<q-btn color="deep-orange" label="Delete" icon="delete" @click="paymentMenu = false; confirmPaymentDelete = true"/>
					</q-btn-group>
				</q-card-section>
			</q-card>
		</q-dialog>
	    <!-- END PAYMENT MENU DIALOG -->

	    <!-- AUTO CLOSING OWING MESSAGE -->
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
	    <!-- END AUTO CLOSING MESSAGE -->
	</q-page>
</template>

<script>
	import { mapState, mapActions } from 'vuex'
	import {  firebaseAuth } from 'boot/firebase'

	export default {
		data() {
			return {
				amount: '',
				date: this.generateDate(),
				prompt: false,
				confirmPaymentDelete: false,
				confirmOwingDelete: false,
				alert: false,
				paymentMenu: false,
				deletePaymentId: '',
				proofOfPayment: null
			}
		},
		computed: {
			...mapState('owingStore', ['owingData']),
			...mapState('paymentStore', ['payments']),
			totalPayed() {
				let total = 0
				for (let payment of this.payments) {
					total += parseFloat(payment.amount)
				}
				return total
			}
		},
		methods: {
			...mapActions('owingStore', [
					'getOwingData',
					'editOwingStatus',
					'deleteExistingOwing'
				]),
			...mapActions('paymentStore', [
				'getPaymentsData',
				'addNewPayment',
				'deleteExistingPayment'
				]),
			createPayment() {
				this.addNewPayment({
					owingId: this.$route.params.id,
					amount: this.amount,
					date: this.date,
					proofOfPayment: this.proofOfPayment
				})
				if (this.totalPayed + parseFloat(this.amount) >= this.owingData.amount) {
					this.updateStatus('closed')
					this.alert = true
				}
				this.closePrompt()
			},
			deleteOwe() {
				this.deleteExistingOwing(this.$route.params.id)
			},
			deletePayment() {
				this.deleteExistingPayment({
					owingId: this.$route.params.id,
					paymentId: this.deletePaymentId
				})
				if (this.totalPayed < this.owingData.amount) 
					this.updateStatus('open')
				this.confirmPaymentDelete = false
			},
			updateStatus(status) {
				this.editOwingStatus({
					owingId: this.$route.params.id,
					status: status
				})
			},
			closePrompt() {
				this.prompt = false
				this.amount = ''
				this.proofOfPayment = null
			},
			generateDate() {
				let today = new Date()
				let yyyy = today.getFullYear()
				let mm = today.getMonth() + 1
				let dd = today.getDate()
				if (mm < 10) mm = `0${mm}`
				if (dd < 10) dd = `0${dd}`
				return `${yyyy}/${mm}/${dd}`
			}
		},
		beforeMount() {
			this.getOwingData(this.$route.params.id)
			this.getPaymentsData(this.$route.params.id)
		},
		filters: {
			toCurrency: function (amount) {
				return `$ ${parseFloat(amount).toFixed(2)}`
			}
		}
	}
</script>
