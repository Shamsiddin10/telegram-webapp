const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB-ga ulanish (O'zingizning URL-ingizni qo'ying)
mongoose.connect('mongodb://localhost:27017/zamon_academy');

// --- SCHEMAS (Ma'lumotlar tuzilmasi) ---
const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'student' },
    testsCompleted: { type: Number, default: 0 }
});

const User = mongoose.model('User', UserSchema);

// --- API ROUTES ---

// 1. Registratsiya
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.status(201).send({ message: "Ro'yxatdan o'tdingiz!" });
    } catch (e) {
        res.status(400).send({ error: "Foydalanuvchi nomi band bo'lishi mumkin" });
    }
});

// 2. Login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user._id, role: user.role }, 'MAXFIY_KALIT', { expiresIn: '1d' });
        res.json({ token, user: { username: user.username, role: user.role, tests: user.testsCompleted } });
    } else {
        res.status(401).send({ error: "Login yoki parol xato!" });
    }
});

// 3. Test natijasini yangilash
app.post('/api/update-test', async (req, res) => {
    const { username } = req.body;
    await User.findOneAndUpdate({ username }, { $inc: { testsCompleted: 1 } });
    res.send({ success: true });
});
async function takeTest() {
    let ok = confirm("Testni boshlaysizmi?");
    if(ok) {
        // Backendga yuborish
        await fetch('http://localhost:3000/api/update-test', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: currentUser.username })
        });
        
        currentUser.tests++;
        document.getElementById('statTests').innerText = `Yechilgan testlar: ${currentUser.tests} ta`;
        alert("Natija saqlandi!");
    }
}
app.listen(3000, () => console.log('Server running on port 3000'));
async function takeTest() {
    let ok = confirm("Testni boshlaysizmi?");
    if(ok) {
        // Backendga yuborish
        await fetch('http://localhost:3000/api/update-test', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: currentUser.username })
        });
        
        currentUser.tests++;
        document.getElementById('statTests').innerText = `Yechilgan testlar: ${currentUser.tests} ta`;
        alert("Natija saqlandi!");
    }
}