const Location = require('../Models/Location');

exports.getLocations = async (req, res) => {
    try {
        const locations = await Location.find({ user: req.user.id }).sort({ date: -1 });
        res.json(locations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.addLocation = async (req, res) => {
    const { name, latitude, longitude } = req.body;
    console.log("Adding location:", name, req.user.id);
    try {
        const newLocation = new Location({
            name,
            latitude,
            longitude,
            user: req.user.id
        });
        const location = await newLocation.save();
        res.json(location);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
