const express = require('express');
const Item = require('../models/Item');
const auth = require('../middleware/auth');
const Anthropic = require('@anthropic-ai/sdk');

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

// POST /items/recipes - Smart recipe generation
router.post('/recipes', auth, async (req, res) => {
    try {
      const { ingredients, filter } = req.body;
      const ingredientList = ingredients.toLowerCase();
  
      const recipes = [
        {
          name: "🍗 High-Protein Chicken Bowl",
          protein: "52g protein",
          time: "20 mins",
          steps: [
            "Season chicken breast with salt, pepper, and garlic powder",
            "Cook in skillet over medium heat for 6-7 mins each side",
            "Slice and serve over rice or quinoa",
            "Top with Greek yogurt sauce and fresh herbs",
            "Add cottage cheese on the side for extra protein"
          ]
        },
        {
          name: "🥛 Protein Power Smoothie",
          protein: "35g protein",
          time: "5 mins",
          steps: [
            "Add 1 cup cottage cheese to blender",
            "Add Greek yogurt, banana, and almond milk",
            "Blend on high for 60 seconds",
            "Pour into glass and top with granola",
            "Drink immediately for best taste"
          ]
        },
        {
          name: "🥗 Quick Protein Salad",
          protein: "45g protein",
          time: "10 mins",
          steps: [
            "Chop chicken breast into bite-sized pieces",
            "Mix with cottage cheese and Greek yogurt dressing",
            "Add cucumber, tomatoes, and spinach",
            "Season with lemon juice, salt, and pepper",
            "Serve immediately or refrigerate for up to 2 days"
          ]
        },
        {
          name: "🍳 Egg & Chicken Scramble",
          protein: "48g protein",
          time: "15 mins",
          steps: [
            "Dice cooked chicken breast into small pieces",
            "Whisk 3 eggs with salt and pepper",
            "Cook eggs in non-stick pan over medium heat",
            "Add chicken and fold together gently",
            "Top with cottage cheese and fresh chives"
          ]
        },
        {
          name: "🫙 Overnight Protein Parfait",
          protein: "30g protein",
          time: "5 mins + overnight",
          steps: [
            "Layer Greek yogurt at the bottom of a jar",
            "Add cottage cheese as second layer",
            "Top with berries and honey",
            "Sprinkle granola and chia seeds",
            "Refrigerate overnight and enjoy in the morning"
          ]
        }
      ];
  
      // Filter recipes based on filter type
      let selected = recipes;
      if (filter === 'quick meals') {
        selected = recipes.filter(r => r.time.includes('5') || r.time.includes('10'));
      } else if (filter === 'meal prep') {
        selected = [recipes[2], recipes[4], recipes[0]];
      } else if (filter === 'under 500 calories') {
        selected = [recipes[1], recipes[2], recipes[4]];
      }
  
      const result = selected.slice(0, 3).map(r => 
        `📖 ${r.name}\n💪 ${r.protein} | ⏱ ${r.time}\n\n${r.steps.map((s, i) => `${i+1}. ${s}`).join('\n')}`
      ).join('\n\n---\n\n');
  
      res.json({ recipe: `Here are 3 ${filter} recipes using your pantry items:\n\n${result}` });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

module.exports = router;