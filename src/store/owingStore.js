import { firebaseAuth, firebaseDb } from 'boot/firebase'

const state ={
	owingData: {
		payments: []
	}
}

const mutations = {
	setOwingData(state, payload) {
		state.owingData = payload
	},
	setNewPayment(state, payload) {
		state.owingData.payments.push(payload)
	},
	setNewOwingStatus(state, payload) {
		state.owingData.status = payload
	},
	setNewPaymentsList(state, payload) {
		const item = state.owingData.payments.find(el => el.id === payload)
		const index = state.owingData.payments.indexOf(item)
		state.owingData.payments.splice(index, 1)
	}
}

const actions = {
	getOwingData({ commit }, payload) {
		let owing = {}
		let payments = []
		let el = {}
		firebaseDb.ref(`users/${payload.userId}/owesMe/${payload.owingId}`).once('value', snapshot => {
			owing = snapshot.val()
			for (let pymnt in snapshot.val().payments) {
				el = snapshot.val().payments[pymnt]
				el.id = pymnt
				payments.push(el)
			}
			owing.payments = payments
			commit('setOwingData', owing)
		})
	},
	addNewPayment({ commit }, payload) {
		firebaseDb.ref(`users/${payload.userId}/owesMe/${payload.owingId}/payments`).push({
			amount: payload.amount,
			date: payload.date
		})
		commit('setNewPayment', { amount: payload.amount, date: payload.date })
		let totalPayment = actions.calculateTotalPayed()
		if (totalPayment >= state.owingData.amount) {
			actions.editOwingStatus({
				userId: payload.userId,
				owingId: payload.owingId,
				status: 'closed'

			})
			commit('setNewOwingStatus', 'closed')
		}
	},
	editOwingStatus(payload) {
		firebaseDb.ref(`users/${payload.userId}/owesMe/${payload.owingId}`).update({
			status: payload.status
		})
	},
	deleteExistingOwing({}, payload) {
		firebaseDb.ref(`users/${payload.userId}/owesMe/${payload.owingId}`).remove()
		this.$router.replace('/')
	},
	deleteExistingPayment({ commit }, payload) {
		firebaseDb.ref(`users/${payload.userId}/owesMe/${payload.owingId}/payments/${payload.paymentId}`).remove()
		commit('setNewPaymentsList', payload.paymentId)
		let totalPayment = actions.calculateTotalPayed()
		if (totalPayment < state.owingData.amount) {
			actions.editOwingStatus({
				userId: payload.userId,
				owingId: payload.owingId,
				status: 'open'

			})
			commit('setNewOwingStatus', 'open')
		}
	},
	calculateTotalPayed() {
		let totalPayment = 0
		for (let payment of state.owingData.payments) {
			totalPayment += parseFloat(payment.amount)
		}
		totalPayment = totalPayment.toFixed(2)
		return totalPayment
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
