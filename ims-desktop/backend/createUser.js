    // createUser.js
    import mongoose from 'mongoose';
    import dotenv from 'dotenv';
    import bcrypt from 'bcrypt';
    import User from './models/user.js'; 
    import process from 'process';

    dotenv.config();

    // Connect to MongoDB
    mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('✅ Connected to MongoDB');

        const hashedPassword = await bcrypt.hash('admin123', 10); // set default password
        const newUser = new User({
        username: 'admin',
        password: hashedPassword
        });

        await newUser.save();
        console.log('✅ Default user created!');
        mongoose.disconnect();
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err);
    });
