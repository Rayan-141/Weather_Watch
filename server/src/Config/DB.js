const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Replace with your MongoDB URI
        const dbURI = process.env.MONGO_URI || 'mongodb://localhost:27017/weatherwatch';

        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
