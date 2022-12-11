const models = require("../../db/models")

async function listCategories(req, res) {
  res.send(await models.Category.findAll())
}

async function listSites(req, res) {
  res.send(await models.Site.findAll())
}

async function listCategorySites(req, res) {
  let category = await models.Category.findByPk(req.params.id, { include: { model: models.Site, as: 'sites'  } })
  if (category)
    res.send(category.sites)
  else
    res.sendStatus(404)
}

async function addNewSite(req, res) {
  let result;
  if(req.body.id != null && await models.Site.findByPk(req.body.id)){
    // Necesitábamos un método para actualizar Sites. Siento Editar la BBDD :P
    result = await models.Site.findByPk(req.body.id);
    result.update(req.body);
  } else {
    result = await models.Site.build(req.body)
    result.categoryId = req.params.id
    await result.save();
  }
  res.send(result)
}

async function addNewCategory(req, res) {
  let result = await models.Category.build(req.body)
  await result.save()
  res.send(result)
}

async function delSite(req, res) {
  let site = await models.Site.findByPk(req.params.id)
  if (!site)
    res.sendStatus(404)

  await site.destroy()
  res.sendStatus(200)
}

async function delCategory(req, res) {
  let category = await models.Category.findByPk(req.params.id)

  if (!category)
    res.sendStatus(404)

  await category.destroy()
  res.sendStatus(200)
}

function init(app) {
  app.get('/categories/:id', listCategorySites)
  app.get('/categories',listCategories)
  app.get('/sites',listSites)

  app.post('/categories/:id', addNewSite)
  app.post('/categories', addNewCategory)

  app.delete('/sites/:id',delSite)
  app.delete('/categories/:id',delCategory)
}

module.exports = {
  init
}