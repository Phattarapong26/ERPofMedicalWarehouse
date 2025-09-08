const productService = require('../services/productService');

async function getProducts(req, res) {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
}

async function getQuantity(req, res) {
  const id = req.body.id;
  try {
    const result = await productService.getQuantity(id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
}

async function inventorySummary(req, res) {
  try {
    const summary = await productService.inventorySummary();
    res.json({ status: 'success', ...summary });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
}

async function checkProductID(req, res) {
  const id = req.body.id;
  try {
    const result = await productService.checkProductID(id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
}

async function addNewProduct(req, res) {
  try {
    await productService.addNewProduct(req.body);
    res.json({ status: 'success', message: 'Insert Successfully' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
}

async function getDetail(req, res) {
  const id = req.body.id;
  try {
    const detail = await productService.getDetail(id);
    res.json(detail);
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
}

async function updateProduct(req, res) {
  try {
    await productService.updateProduct(req.body);
    res.json({ status: 'success', message: 'Update Successfully' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
}

async function removeProduct(req, res) {
  const id = req.body.id;
  try {
    await productService.removeProduct(id);
    res.json({ status: 'success', message: 'Delete Successfully' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
}

module.exports = {
  getProducts,
  getQuantity,
  inventorySummary,
  checkProductID,
  addNewProduct,
  getDetail,
  updateProduct,
  removeProduct,
};
