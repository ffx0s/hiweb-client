export const state = () => ({
  showDrawer: false,
})

export const mutations = {
  showDrawer(state, value) {
    state.showDrawer = value
  },
}
