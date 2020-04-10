<template>
	<q-page class="flex">
		<q-list class="full-width" v-if="userDetails.userId">
			<q-scroll-area style="height: 100%;" class="full-width">
				<q-item-label header>Open</q-item-label>
				<q-item
		      		v-for="owe in openOwe"
		      		class="q-my-sm"
		      		clickable
		      		v-ripple
		      		:to="{ path: `owing/${owe.id}` }"
		      		v-if="openOwe.length > 0">
	      			<q-item-section avatar>
		          		<q-avatar color="primary" text-color="white">
		            		{{ owe.name[0].toUpperCase() }}
		          		</q-avatar>
		        	</q-item-section>

		        	<q-item-section>
		          		<q-item-label>
		          			{{ owe.name }} - {{ owe.amount | toCurrency }}
		          		</q-item-label>
		          		<q-item-label caption lines="1">
		          			{{ owe.description }}
		          		</q-item-label>
		        	</q-item-section>

		        	<q-item-section side>
		          		<q-icon name="attach_money" color="green" />
		        	</q-item-section>
		      	</q-item>
		      	<p
		      		v-if="openOwe.length == 0"
		      		class="text-center text-grey-8">
		      		There are no open owings.
		      	</p>		    	

		      <q-separator />

		      <q-item-label header>Closed</q-item-label>

		    	<q-item
		    		v-for="owe in closedOwe"
		      		class="q-mb-sm"
		      		clickable
		      		v-ripple
		      		:to="{ path: `owing/${owe.id}` }"
		      		v-if="closedOwe.length > 0">
		        	<q-item-section avatar>
			        	<q-avatar color="primary" text-color="white">
			        		{{ owe.name[0].toUpperCase() }}
			        	</q-avatar>
		        	</q-item-section>

		        	<q-item-section>
			          	<q-item-label>
			          		{{ owe.name }} - {{ owe.amount | toCurrency }}
			          	</q-item-label>
			          	<q-item-label caption lines="1">
			          		{{ owe.description }}
			          	</q-item-label>
		        	</q-item-section>

			        <q-item-section side>
			        	<q-icon name="money_off" color="grey" />
			        </q-item-section>
		      	</q-item>
		      	<p
		      		v-if="closedOwe.length == 0"
		      		class="text-center text-grey-8">
		      		There are no closed owings.
		      	</p>
		    </q-scroll-area>
	    </q-list>
			

	    <q-dialog
	    	v-model="prompt"
	    	persistent >
	    	<q-card style="min-width: 350px">
        		<q-card-section>
          			<div class="text-h6">New owing</div>
        		</q-card-section>
        		<q-form @submit="createOwing">
	        		<q-card-section class="q-pt-none">
	          			<q-input
				          	v-model="name"
				          	label="Name"
				          	:rules="[val => !!val || 'Field is required']" />
	          			<q-input
					        v-model="amount"
					        mask="#.##"
					        placeholder="100.00"
					        reverse-fill-mask
					        prefix="$ "
					        input-class="text-right"
					        :rules="[val => !!val || 'Field is required', val => val > 0 || 'Amount must be greater than 0']" />
	          			<q-input
				          	v-model="description"
				          	label="Description"
				          	:rules="[val => !!val || 'Field is required']" />
	        		</q-card-section>

	        		<q-card-actions align="right" class="text-primary">
	          			<q-btn flat label="Cancel" @click="closePrompt" />
	          			<q-btn flat label="Create" type="submit"/>
	        		</q-card-actions>
    			</q-form>
	      	</q-card>
	    </q-dialog>
	    <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-btn fab icon="add" color="primary" @click="prompt = true" />
        </q-page-sticky>

	</q-page>
</template>

<script>
	import { mapState, mapActions } from 'vuex'
	import {  firebaseAuth, firebaseDb } from 'boot/firebase'

	export default {
		data () {
		    return {
		    	prompt: false,
      			name: '',
      			amount: '',
      			description: ''
		    }
		  },
		computed: {
			...mapState('store', ['userDetails']),
			...mapState('owingStore', ['allOwings']),
			openOwe() {
				let open = []
				for (let owe of this.allOwings) {
					if (owe.status === 'open') open.push(owe)
				}
			return open
			},
			closedOwe() {
				let closed = []
				for (let owe of this.allOwings)
					if (owe.status === 'closed') closed.push(owe)
			return closed
			}
		},
		methods: {
			...mapActions('owingStore', ['createNewOwing', 'getAllOwings']),
			closePrompt() {
				this.prompt = false
				this.name = ''
				this.amount = ''
				this.description = ''
			},
			createOwing() {
				this.createNewOwing({
					userId: firebaseAuth.currentUser.uid,
					name: this.name,
					amount: this.amount,
					description: this.description
				})
				this.closePrompt()
			}
		},
		beforeMount() {
			this.getAllOwings()
		},
		filters: {
			toCurrency: function (amount) {
				return `$ ${parseFloat(amount).toFixed(2)}`
			}
		}
	}
</script>

<!-- :rules="[val => !!val || 'Field is required', val => val > 0 || 'Amount must be greater than 0']" -->