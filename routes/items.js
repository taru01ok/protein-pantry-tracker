const express = require('express');
const Item = require('../models/Item');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /items - Add a new item
router.post('/', auth, async (req, res) => {
  try {
    const item = new Item(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /items - Get all items
router.get('/', auth, async (req, res) => {
  try {
    const { category, sortBy } = req.query;
    let query = {};

    if (category) query.category = category;

    let items = Item.find(query);

    if (sortBy === 'expiration') {
      items = items.sort({ expirationDate: 1 });
    } else if (sortBy === 'quantity') {
      items = items.sort({ quantity: 1 });
    }

    const result = await items;
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /items/low-stock - Get items below threshold
router.get('/low-stock', auth, async (req, res) => {
  try {
    const items = await Item.find({
      $expr: { $lte: ['$quantity', '$lowStockThreshold'] }
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /items/expiring-soon - Items expiring within 7 days (above and beyond!)
router.get('/expiring-soon', auth, async (req, res) => {
  try {
    const today = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(today.getDate() + 7);

    const items = await Item.find({
      expirationDate: { $gte: today, $lte: sevenDaysFromNow }
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /items/:id - Get a single item
router.get('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /items/:id - Update item (consume or edit)
router.put('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /items/:id - Delete an item
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;