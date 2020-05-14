import { firebaseAuth, firebaseDb, firebaseStorage } from 'boot/firebase'

const state = {
	payments: []
}

const mutations = {
	setAllPayments(state, payload) {
		state.payments = payload
	},
	setNewPayment(state, payload) {
		state.payments.push(payload)
	},
	removePaymentFromList(state, payload) {
		const payment = state.payments.find(el => el.id === payload)
		const index = state.payments.indexOf(payment)
		state.payments.splice(index, 1)
	}
}

const actions = {
	getPaymentsData({ commit }, payload) {
		let payments = []
		let payment = {}
		firebaseDb.ref(`payments/${firebaseAuth.currentUser.uid}/${payload}`).once('value', snapshot => {
			for (let pymt in snapshot.val()) {
				payment = snapshot.val()[pymt]
				payment.id = pymt
				payments.push(payment)
			}
			commit('setAllPayments', payments)
		})
	},
	addNewPayment({ commit }, payload) {
		firebaseStorage.ref(`proof-of-payments/${firebaseAuth.currentUser.uid}/${payload.owingId}/${payload.proofOfPayment.name}`).put(payload.proofOfPayment).then(snapshot => {
			console.log('File uploaded!');
		});

		firebaseDb.ref(`payments/${firebaseAuth.currentUser.uid}/${payload.owingId}`).push({
			amount: payload.amount,
			date: payload.date,
			pop: payload.proofOfPayment.name
		}).then(response => {
			commit('setNewPayment', {
				amount: payload.amount,
				date: payload.date,
				id: response.key
			})
		})
	},
	deleteExistingPayment({ commit }, payload) {
		firebaseDb.ref(`payments/${firebaseAuth.currentUser.uid}/${payload.owingId}/${payload.paymentId}`).remove()
		commit('removePaymentFromList', payload.paymentId)
	}
}

const getters = {

}

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters
}