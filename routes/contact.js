const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// Submit contact form
router.post('/api/contact', async (req, res) => {
    try {
        console.log('Received contact form data:', req.body); // Debug log
        const { name, email, subject, message } = req.body;
        
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create new contact submission
        const contact = new Contact({
            name,
            email,
            subject,
            message,
            createdAt: new Date()
        });

        // Save to database
        const savedContact = await contact.save();
        console.log('Contact saved successfully:', savedContact); // Debug log

        res.status(201).json({ 
            message: 'Message sent successfully',
            contact: savedContact 
        });
    } catch (error) {
        console.error('Error saving contact form:', error);
        res.status(500).json({ 
            message: 'Error sending message',
            error: error.message 
        });
    }
});

// Get all contacts (for testing)
router.get('/api/contacts', async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json(contacts);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ message: 'Error fetching contacts' });
    }
});

module.exports = router;
