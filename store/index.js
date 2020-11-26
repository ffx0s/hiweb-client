export const state = () => ({
  showDrawer: false,
  rightSideData: {}
})

export const mutations = {
  setRightSideData(state, data) {
    state.rightSideData = data
  },
  showDrawer(state, value) {
    state.showDrawer = value
  }
}
