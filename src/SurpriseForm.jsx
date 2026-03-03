import { useState } from 'react';
import './SurpriseForm.css';

const QUESTIONS = [
    {
        id: 'q1',
        number: 1,
        type: 'single',
        text: 'If someone gifted you something special, what category would make you happiest?',
        options: [
            'Jewelry',
            'Clothes',
            'Skincare / Makeup',
            'Something handmade',
            "I like everything if it's from the right person 🥰",
        ],
    },
    {
        id: 'q2',
        number: 2,
        type: 'short',
        text: 'What kind of gifts do you secretly love but never ask for?',
    },
    {
        id: 'q3',
        number: 3,
        type: 'single',
        text: 'Which of these would you prefer more?',
        options: [
            'One expensive gift',
            'Multiple small cute gifts',
            'Something emotional and handmade',
            'A mix of everything',
        ],
    },
    {
        id: 'q4',
        number: 4,
        type: 'single',
        text: 'If you had to wear one accessory daily, what would it be?',
        options: [
            'Necklace',
            'Bracelet',
            'Ring',
            'Earrings',
            "I don't wear accessories much",
        ],
    },
    {
        id: 'q5',
        number: 5,
        type: 'multi',
        text: 'What colors do you love the most?',
        options: [
            'Black',
            'White',
            'Pink',
            'Red',
            'Blue',
            'Pastels',
            'Gold tones',
            'Silver tones',
        ],
    },
    {
        id: 'q6',
        number: 6,
        type: 'single',
        text: 'Do you prefer minimal or bold style?',
        options: [
            'Minimal & classy',
            'Cute & soft',
            'Bold & statement',
            'Trendy',
            'Depends on mood',
        ],
    },
    {
        id: 'q7',
        number: 7,
        type: 'single',
        text: 'Which would make you more emotional?',
        options: [
            'A handwritten letter',
            'A surprise midnight delivery',
            'A memory scrapbook',
            'A planned surprise day',
        ],
    },
    {
        id: 'q8',
        number: 8,
        type: 'short',
        text: "What's one thing you've wanted recently but didn't buy?",
    },
    {
        id: 'q9',
        number: 9,
        type: 'paragraph',
        text: "What's something you wish someone would understand about you when gifting you something?",
    },
];

// Map q-keys → MongoDB schema field names
const FIELD_MAP = {
    q1: 'giftCategory',
    q2: 'secretGifts',
    q3: 'giftPreference',
    q4: 'dailyAccessory',
    q5: 'favoriteColors',
    q6: 'stylePreference',
    q7: 'emotionalGesture',
    q8: 'wantedItem',
    q9: 'giftingWish',
};

export default function SurpriseForm({ onBack }) {
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSingle = (qid, value) =>
        setAnswers((prev) => ({ ...prev, [qid]: value }));

    const handleMulti = (qid, value) =>
        setAnswers((prev) => {
            const current = prev[qid] || [];
            return {
                ...prev,
                [qid]: current.includes(value)
                    ? current.filter((v) => v !== value)
                    : [...current, value],
            };
        });

    const handleText = (qid, value) =>
        setAnswers((prev) => ({ ...prev, [qid]: value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Remap q1..q9 → schema field names
        const payload = {};
        for (const [qid, field] of Object.entries(FIELD_MAP)) {
            if (answers[qid] !== undefined) {
                payload[field] = answers[qid];
            }
        }

        try {
            const res = await fetch('http://localhost:3000/api/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (data.success) {
                setSubmitted(true);
            } else {
                setError('Something went wrong. Please try again!');
            }
        } catch (err) {
            setError('Could not reach the server. Please try again!');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="form-page-bg">
                <div className="form-card submitted-card">
                    <div className="submitted-icon">🎀</div>
                    <h2 className="submitted-title">Yay, all done!</h2>
                    <p className="submitted-sub">
                        Your answers have been saved. Something very special is on its way… 💛
                    </p>
                </div>
                <div className="kiss">
                    <div className="kiss-icon">😘</div>
                </div>
            </div>
        );
    }

    return (
        <div className="form-page-bg">
            <div className="sparkle sparkle-1" />
            <div className="sparkle sparkle-2" />
            <div className="sparkle sparkle-3" />
            <div className="sparkle sparkle-4" />

            <div className="form-wrapper">
                <div className="form-header-card">
                    <h1 className="form-main-title">Tell Me Everything 🌸</h1>
                    <p className="form-main-sub">
                        Answer honestly — this is a judgement-free zone bby 🥰
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-section-card">
                        {QUESTIONS.map((q) => (
                            <div key={q.id} className="question-block">
                                <p className="question-text">
                                    <span className="q-number">{q.number}.</span> {q.text}
                                </p>

                                {q.type === 'single' && (
                                    <div className="options-grid">
                                        {q.options.map((opt) => (
                                            <label
                                                key={opt}
                                                className={`option-pill ${answers[q.id] === opt ? 'selected' : ''}`}
                                            >
                                                <input
                                                    type="radio"
                                                    name={q.id}
                                                    value={opt}
                                                    checked={answers[q.id] === opt}
                                                    onChange={() => handleSingle(q.id, opt)}
                                                />
                                                {opt}
                                            </label>
                                        ))}
                                    </div>
                                )}

                                {q.type === 'multi' && (
                                    <div className="options-grid">
                                        {q.options.map((opt) => (
                                            <label
                                                key={opt}
                                                className={`option-pill ${(answers[q.id] || []).includes(opt) ? 'selected' : ''}`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    value={opt}
                                                    checked={(answers[q.id] || []).includes(opt)}
                                                    onChange={() => handleMulti(q.id, opt)}
                                                />
                                                {opt}
                                            </label>
                                        ))}
                                    </div>
                                )}

                                {q.type === 'short' && (
                                    <input
                                        className="text-input"
                                        type="text"
                                        placeholder="Type your answer here..."
                                        value={answers[q.id] || ''}
                                        onChange={(e) => handleText(q.id, e.target.value)}
                                    />
                                )}

                                {q.type === 'paragraph' && (
                                    <textarea
                                        className="text-input textarea"
                                        placeholder="Take your time, write freely..."
                                        value={answers[q.id] || ''}
                                        onChange={(e) => handleText(q.id, e.target.value)}
                                        rows={4}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="form-submit-row">
                        {error && <p className="submit-error">{error}</p>}
                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? 'Sending... 💫' : 'Submit My Answers 💌'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
