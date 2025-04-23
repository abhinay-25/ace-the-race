const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    difficulty: {
        type: String,
        required: true,
        enum: ['Easy', 'Medium', 'Hard']
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: false,
        trim: true
    },
    frequency: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    acceptanceRate: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    leetcodeLink: {
        type: String,
        required: true
    },
    tags: [{
        type: String
    }],
    company: {
        type: String,
        required: true,
        enum: [
            "Amazon", "Google", "Microsoft", "Facebook", "Apple", "Netflix", "Uber", "Airbnb",
            "Twitter", "LinkedIn", "Oracle", "IBM", "Intel", "Adobe", "Salesforce", "VMware",
            "Cisco", "Qualcomm", "NVIDIA", "AMD", "PayPal", "Stripe", "Square", "Shopify",
            "Dropbox", "Slack", "Zoom", "TikTok", "ByteDance", "Tencent", "Alibaba", "Baidu",
            "Samsung", "Sony", "Huawei", "Tesla", "SpaceX", "Palantir", "Databricks", "Snowflake",
            "MongoDB", "Elastic", "Atlassian", "GitHub", "GitLab", "Docker", "Kubernetes", "Red Hat",
            "SAP", "ServiceNow"
        ]
    }
});

// Add indexes for faster queries
questionSchema.index({ difficulty: 1 });
questionSchema.index({ tags: 1 });
questionSchema.index({ company: 1 });

module.exports = mongoose.model('Question', questionSchema); 