const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const con = await mongoose.connect("mongodb+srv://gracetriana:mypassword@cluster0.ptmxoa8.mongodb.net/?retryWrites=true&w=majority", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

    console.log(`MongoDB Connected: ${con.connection.host}`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit();
    }
};

module.exports = connectDB;