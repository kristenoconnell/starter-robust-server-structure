const express = require("express");
const app = express();
const flips = require("./data/flips-data");
const counts = require("./data/counts-data");
app.use(express.json());

//Return one count
app.use("/counts/:countId", (req, res, next) => {
  const { countId } = req.params;
  const foundCount = counts[countId];

  if (foundCount === undefined) {
    next(`Count id not found: ${countId}`);
  } else {
    res.json({ data: foundCount });
  }
})

//Return all counts
app.use("/counts", (req, res) => {
  res.json({ data: counts });
})

//API for a specific flip 
app.use("/flips/:flipId", (req, res, next) => {
  const { flipId } = req.params;
  const foundFlip = flips.find((flip) => flip.id === Number(flipId));

  if (foundFlip) {
    res.json({ data: foundFlip });
  } else {
    next(`Flip id not found: ${flipId}`);
  }
})

//Use API
app.get("/flips", (req, res) => {
  res.json({ data: flips });
});

// Not found handler
app.use((request, response, next) => {
  next(`Not found: ${request.originalUrl}`);
});

// Error handler
app.use((error, request, response, next) => {
  console.error(error);
  response.send(error);
});

module.exports = app;
