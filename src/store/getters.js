const getters = {
  language: state => state.app.language,
  username: state => state.user.username,
  avatar: state => state.user.avatar,
  token: state => state.user.token
}
export default getters
