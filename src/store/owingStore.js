import { firebaseAuth, firebaseDb } from 'boot/firebase'

const state = {
	allOwings: [],
	owingData: {
		payments: []
	}
}

const mutations = {
	setAllOwings(state, payload) {
		state.allOwings = payload
	},
	setOwingData(state, payload) {
		state.owingData = payload
	},
	setNewOwing(state, payload) {
		state.allOwings.push(payload)
	},
	setNewOwingStatus(state, payload) {
		state.owingData.status = payload
	}
}

const actions = {
	getAllOwings({ commit }) {
		let allOwings = []
		let owing = {}
		firebaseDb.ref(`owings/${firebaseAuth.currentUser.uid}`).once('value', snapshot => {
			for (let owe in snapshot.val()) {
				owing = snapshot.val()[owe]
				owing.id = owe
				allOwings.push(owing)
			}
			commit('setAllOwings', allOwings)
		})
	},
	getOwingData({ commit }, payload) {
		let owing = {}
		let payments = []
		let el = {}
		firebaseDb.ref(`owings/${firebaseAuth.currentUser.uid}/${payload}`).once('value', snapshot => {
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
	createNewOwing({ commit }, payload) {
		let owing = {
			name: payload.name,
			amount: payload.amount,
			description: payload.description,
			status: 'open'
		}
		firebaseDb.ref(`owings/${firebaseAuth.currentUser.uid}`).push(owing)
		commit('setNewOwing', owing)
	},
	editOwingStatus({ commit }, payload) {
		firebaseDb.ref(`owings/${firebaseAuth.currentUser.uid}/${payload.owingId}`).update({
			status: payload.status
		})
		commit('setNewOwingStatus', payload.status)
	},
	deleteExistingOwing({}, payload) {
		firebaseDb.ref(`owings/${firebaseAuth.currentUser.uid}/${payload}`).remove()
		this.$router.replace('/')
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
