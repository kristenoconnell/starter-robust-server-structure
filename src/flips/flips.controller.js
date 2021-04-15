const flips = require("../data/flips-data");

function list(req, res) {
    res.json({ data: flips });
}

module.exports = { list };