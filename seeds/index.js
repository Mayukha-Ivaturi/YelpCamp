require('dotenv').config();
const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("Error, MONGO CONNECTION!!!!")
        console.log(err)
    })

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];



const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20 + 10)
        const camp = new Campground({
            author: '66dc38d30733fb2f104de1b7',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit praesentium placeat nesciunt laudantium! Eius dolor, accusamus assumenda aliquid cum quod officiis dolores aut at quidem tenetur libero modi pariatur commodi.",
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dtlwmnprv/image/upload/v1726813547/YelpCamp/z7snthjz9uhgne8cexxc.jpg',
                    filename: 'YelpCamp/z7snthjz9uhgne8cexxc'
                },
                {
                    url: 'https://res.cloudinary.com/dtlwmnprv/image/upload/v1726813549/YelpCamp/w3yankvxkisjwtzyzbpf.jpg',
                    filename: 'YelpCamp/w3yankvxkisjwtzyzbpf'
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})