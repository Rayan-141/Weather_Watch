const Alert = require('../Models/Alert');

exports.getAlerts = async (req, res) => {
    try {
        const alerts = await Alert.find({ user: req.user.id });
        res.json(alerts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.addAlert = async (req, res) => {
    const { type, condition, threshold, message } = req.body;
    console.log("Adding alert:", type, req.user.id);
    try {
        const newAlert = new Alert({
            type,
            condition,
            threshold,
            message,
            user: req.user.id
        });

        const alert = await newAlert.save();
        res.json(alert);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
