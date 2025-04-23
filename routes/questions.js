const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

// Get all questions with optional filters
router.get('/', async (req, res) => {
    try {
        const { company, difficulty, page = 1, limit = 50 } = req.query;
        const query = {};
        
        if (company) {
            query.company = company;
        }
        if (difficulty) {
            query.difficulty = difficulty;
        }

        const skip = (page - 1) * limit;
        const total = await Question.countDocuments(query);
        
        const questions = await Question.find(query)
            .skip(skip)
            .limit(parseInt(limit));

        res.json({
            questions,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / parseInt(limit)),
                limit: parseInt(limit)
            }
        });
    } catch (err) {
        res.status(500).json({ 
            error: true,
            message: 'Error fetching questions',
            details: err.message 
        });
    }
});

// Get questions by company
router.get('/company/:company', async (req, res) => {
    try {
        const { difficulty, page = 1, limit = 50 } = req.query;
        const query = { company: req.params.company };
        
        if (difficulty) {
            query.difficulty = difficulty;
        }

        const skip = (page - 1) * limit;
        const total = await Question.countDocuments(query);
        
        const questions = await Question.find(query)
            .skip(skip)
            .limit(parseInt(limit));

        res.json({
            questions,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / parseInt(limit)),
                limit: parseInt(limit)
            }
        });
    } catch (err) {
        res.status(500).json({ 
            error: true,
            message: 'Error fetching company questions',
            details: err.message 
        });
    }
});

// Get questions by difficulty
router.get('/difficulty/:difficulty', async (req, res) => {
    try {
        const questions = await Question.find({ difficulty: req.params.difficulty });
        res.json(questions);
    } catch (err) {
        res.status(500).json({ 
            error: true,
            message: 'Error fetching questions by difficulty',
            details: err.message 
        });
    }
});

// Get all available tags
router.get('/tags', async (req, res) => {
    try {
        const tags = await Question.distinct('topics');
        res.json({ tags });
    } catch (err) {
        res.status(500).json({ 
            error: true,
            message: 'Error fetching tags',
            details: err.message 
        });
    }
});

// Get all companies
router.get('/companies', async (req, res) => {
    try {
        const companies = await Question.distinct('company');
        res.json({ companies });
    } catch (err) {
        res.status(500).json({ 
            error: true,
            message: 'Error fetching companies',
            details: err.message 
        });
    }
});

// Add new question
router.post('/', async (req, res) => {
    try {
        const question = new Question(req.body);
        const newQuestion = await question.save();
        res.status(201).json(newQuestion);
    } catch (err) {
        res.status(400).json({ 
            error: true,
            message: 'Error creating question',
            details: err.message 
        });
    }
});

module.exports = router;