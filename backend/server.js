import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const port = 3000;

// Middleware
app.use(cors({ origin: 'http://localhost:5174' }));
app.use(express.json());

// Connect to MongoDB
const db = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/aashubirthday');
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log('MongoDB connection error', error);
    }
};

db();

// ── Schema ────────────────────────────────────────────────────────────────────
const formResponseSchema = new mongoose.Schema({

    // Q1 - Gift category (single choice)
    giftCategory: {
        type: String,
        enum: [
            'Jewelry',
            'Clothes',
            'Skincare / Makeup',
            'Something handmade',
            "I like everything if it's from the right person 🥰",
        ],
    },

    // Q2 - Secret gifts (short text)
    secretGifts: {
        type: String,
        trim: true,
    },

    // Q3 - Gift preference (single choice)
    giftPreference: {
        type: String,
        enum: [
            'One expensive gift',
            'Multiple small cute gifts',
            'Something emotional and handmade',
            'A mix of everything',
        ],
    },

    // Q4 - Daily accessory (single choice)
    dailyAccessory: {
        type: String,
        enum: [
            'Necklace',
            'Bracelet',
            'Ring',
            'Earrings',
            "I don't wear accessories much",
        ],
    },

    // Q5 - Favorite colors (multi-select / checkboxes)
    favoriteColors: {
        type: [String],
        enum: ['Black', 'White', 'Pink', 'Red', 'Blue', 'Pastels', 'Gold tones', 'Silver tones'],
        default: [],
    },

    // Q6 - Style preference (single choice)
    stylePreference: {
        type: String,
        enum: [
            'Minimal & classy',
            'Cute & soft',
            'Bold & statement',
            'Trendy',
            'Depends on mood',
        ],
    },

    // Q7 - Emotional gesture (single choice)
    emotionalGesture: {
        type: String,
        enum: [
            'A handwritten letter',
            'A surprise midnight delivery',
            'A memory scrapbook',
            'A planned surprise day',
        ],
    },

    // Q8 - Wanted but not bought (short text)
    wantedItem: {
        type: String,
        trim: true,
    },

    // Q9 - Gifting wish (paragraph)
    giftingWish: {
        type: String,
        trim: true,
    },

    // Metadata
    submittedAt: {
        type: Date,
        default: Date.now,
    },
});

const FormResponse = mongoose.model('FormResponse', formResponseSchema);

// ── Routes ────────────────────────────────────────────────────────────────────

// POST /api/submit  — save a form response
app.post('/api/submit', async (req, res) => {
    try {
        const response = new FormResponse(req.body);
        await response.save();
        res.status(201).json({ success: true });
    } catch (error) {
        console.error('Save error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/responses — view all responses (for you to check answers)
app.get('/api/responses', async (req, res) => {
    try {
        const responses = await FormResponse.find().sort({ submittedAt: -1 });
        res.json({ success: true, data: responses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
