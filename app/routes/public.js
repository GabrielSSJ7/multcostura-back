import institutional from '../controller/institutional'
import news from '../controller/news'
import gallery from '../controller/gallery'
import tools from '../controller/tools'
import email from '../controller/email'
import settings from '../controller/settings'

module.exports = gl => {
  const { user, banner, categories, manufacturer, reseller, machine } = gl.app.controller

  gl.route('/user').post(user.store)
  gl.route('/user/auth').post(user.show)
  gl.route('/banner/:id').get(banner.index)
  gl.route('/institutional/:type').get(institutional.index)
  gl.route('/news').get(news.index)
  gl.route('/news/:id').get(news.show)
  gl.route('/gallery/:id').get(gallery.show)
  gl.route('/tools').get(tools.index)
  gl.route('/tools/:id').get(tools.show).put(tools.update)
  gl.route('/manufacturer').get(manufacturer.index)
  gl.route('/manufacturer/:id').get(manufacturer.index)
  gl.route('/categories').get(categories.index)
  gl.route('/categories/:id').get(categories.show)
  gl.route('/reseller').get(reseller.index)
  gl.route('/machine').get(machine.index)
  gl.route('/machine/:id').get(machine.show)
  gl.route('/email').post(email.store)
  gl.route('/settings').get(settings.index)
}
