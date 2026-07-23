const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware Setup
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'mcq_exam_secret_key_123',
    resave: false,
    saveUninitialized: true
}));

// Dummy Question Bank (১০টি বাংলা MCQ)
const questions = [
    { id: 1, question: "১. বাংলাদেশের জাতীয় ফল কোনটি?", options: ["আম", "কাঠাল", "লিচু", "কলা"], answer: 1 },
    { id: 2, question: "২. বাংলা ভাষায় স্বরবর্ণ কয়টি?", options: ["৯টি", "১০টি", "১১টি", "১২টি"], answer: 2 },
    { id: 3, question: "৩. বাংলাদেশের রাজধানী কোথায়?", options: ["চট্টগ্রাম", "সিলেট", "ঢাকা", "খুলনা"], answer: 2 },
    { id: 4, question: "৪. 'পরশু' শব্দটির বিপরীত অর্থ প্রকাশ করে কোনটি?", options: ["আগামীকাল", "গতকাল", "আজ", "তরশু"], answer: 1 },
    { id: 5, question: "৫. সূর্য উদয় হয় কোন দিকে?", options: ["পশ্চিম", "উত্তর", "পূর্ব", "দক্ষিণ"], answer: 2 },
    { id: 6, question: "৬. কোনটি জাতীয় পাখি?", options: ["দোয়েল", "ময়না", "কাক", "কোয়েল"], answer: 0 },
    { id: 7, question: "৭. কম্পিউটারের মস্তিষ্ক বলা হয় কাকে?", options: ["RAM", "CPU", "Hard Disk", "Monitor"], answer: 1 },
    { id: 8, question: "৮. পানির রাসায়নিক সংকেত কোনটি?", options: ["CO2", "H2O", "O2", "NaCl"], answer: 1 },
    { id: 9, question: "৯. এক দিন কত ঘণ্টায় হয়?", options: ["১২ ঘণ্টা", "১৮ ঘণ্টা", "২৪ ঘণ্টা", "৪৮ ঘণ্টা"], answer: 2 },
    { id: 10, question: "১০. বাংলাদেশের জাতীয় সঙ্গীত কোনটি?", options: ["আমার সোনার বাংলা", "চল চল চল", "ধনধান্য পুষ্প ভরা", "কারার ঐ লৌহ কপাট"], answer: 0 }
];

// In-Memory Data Storage
let examSubmissions = [];

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.post('/login', (req, res) => {
    const { name, phone } = req.body;
    if (name && phone) {
        req.session.student = { name, phone, startTime: Date.now() };
        res.redirect('/exam');
    } else {
        res.redirect('/');
    }
});

app.get('/exam', (req, res) => {
    if (!req.session.student) {
        return res.redirect('/');
    }
    res.render('exam', { student: req.session.student, questions });
});

app.post('/submit-exam', (req, res) => {
    if (!req.session.student) {
        return res.json({ success: false, message: "Session expired" });
    }

    const userAnswers = req.body.answers || {};
    let score = 0;

    questions.forEach((q) => {
        if (parseInt(userAnswers[q.id]) === q.answer) {
            score++;
        }
    });

    const submissionData = {
        name: req.session.student.name,
        phone: req.session.student.phone,
        score: score,
        total: questions.length,
        submittedAt: new Date().toLocaleString('bn-BD')
    };

    examSubmissions.push(submissionData);
    req.session.destroy();

    res.json({ success: true, score, total: questions.length });
});

// Admin Route
app.get('/admin', (req, res) => {
    res.render('admin', { submissions: examSubmissions });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
