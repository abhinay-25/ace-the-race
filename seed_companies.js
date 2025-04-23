const mongoose = require('mongoose');
const Question = require('./models/Question');
const fs = require('fs');
const csv = require('csv-parser');

const companies = [
    "Amazon", "Google", "Microsoft", "Facebook", "Apple", "Netflix", "Uber", "Airbnb",
    "Twitter", "LinkedIn", "Oracle", "IBM", "Intel", "Adobe", "Salesforce", "VMware",
    "Cisco", "Qualcomm", "NVIDIA", "AMD", "PayPal", "Stripe", "Square", "Shopify",
    "Dropbox", "Slack", "Zoom", "TikTok", "ByteDance", "Tencent", "Alibaba", "Baidu",
    "Samsung", "Sony", "Huawei", "Tesla", "SpaceX", "Palantir", "Databricks", "Snowflake",
    "MongoDB", "Elastic", "Atlassian", "GitHub", "GitLab", "Docker", "Kubernetes", "Red Hat",
    "SAP", "ServiceNow"
];

// Helper function to shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

async function readCSVFile(filePath) {
    const questions = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                // Calculate frequency based on difficulty and company focus areas
                let baseFrequency;
                switch (row.Difficulty) {
                    case 'Hard':
                        baseFrequency = Math.floor(Math.random() * 30) + 40; // 40-70%
                        break;
                    case 'Medium':
                        baseFrequency = Math.floor(Math.random() * 30) + 50; // 50-80%
                        break;
                    case 'Easy':
                        baseFrequency = Math.floor(Math.random() * 30) + 60; // 60-90%
                        break;
                    default:
                        baseFrequency = 50;
                }

                questions.push({
                    difficulty: row.Difficulty,
                    title: row.Question,
                    description: row.Description || '',
                    frequency: baseFrequency,
                    acceptanceRate: parseFloat(row.Acceptance_rate) || Math.floor(Math.random() * 40) + 40, // 40-80%
                    leetcodeLink: row.Question_Link,
                    tags: row.Topic_tags ? JSON.parse(row.Topic_tags.replace(/'/g, '"')) : []
                });
            })
            .on('end', () => resolve(questions))
            .on('error', reject);
    });
}

// Helper function to get random questions
const getRandomQuestions = (pool, count, company) => {
    // If we need more questions than available in the pool, duplicate some randomly
    let result = [];
    while (result.length < count) {
        const shuffled = shuffleArray([...pool]);
        const needed = count - result.length;
        const batch = shuffled.slice(0, Math.min(needed, shuffled.length));
        result = result.concat(batch);
    }
    
    return result.map(q => ({
        ...q,
        company: company,
        frequency: Math.floor(Math.random() * 100)
    }));
};

async function seedCompanies() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ace-the-race', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Connected to MongoDB');
        
        // Read questions from CSV
        const baseQuestions = await readCSVFile('./Leetcode_Questions_updated (2024-11-02).csv');
        console.log(`Loaded ${baseQuestions.length} base questions`);

        // Clear existing questions
        await Question.deleteMany({});
        console.log('Cleared existing questions');

        // For each company, create a set of questions
        for (const company of companies) {
            // Calculate number of questions for each difficulty level
            const totalQuestions = Math.floor(Math.random() * (150 - 100 + 1)) + 100; // Random between 100-150
            const easyCount = Math.floor(totalQuestions * 0.4); // 40% Easy
            const mediumCount = Math.floor(totalQuestions * 0.4); // 40% Medium
            const hardCount = totalQuestions - easyCount - mediumCount; // Remaining Hard

            // Get random questions for each difficulty
            const easyQuestions = getRandomQuestions(
                baseQuestions.filter(q => q.difficulty === 'Easy'),
                easyCount,
                company
            );
            const mediumQuestions = getRandomQuestions(
                baseQuestions.filter(q => q.difficulty === 'Medium'),
                mediumCount,
                company
            );
            const hardQuestions = getRandomQuestions(
                baseQuestions.filter(q => q.difficulty === 'Hard'),
                hardCount,
                company
            );

            // Combine all questions
            const companyQuestions = [...easyQuestions, ...mediumQuestions, ...hardQuestions];

            // Save questions to database
            await Question.insertMany(companyQuestions);
            console.log(`Added ${companyQuestions.length} questions for ${company} (${easyCount} Easy, ${mediumCount} Medium, ${hardCount} Hard)`);
        }

        console.log('Database seeding completed');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedCompanies();
