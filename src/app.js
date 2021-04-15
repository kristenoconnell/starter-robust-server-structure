const express = require("express");
const app = express();
const flips = require("./data/flips-data");
const counts = require("./data/counts-data");
const flipsRouter = require("./flips/flips.router");
app.use(express.json());

//middleware function to validate request body



//Return one count
app.use("/counts/:countId", (req, res, next) => {
  const { countId } = req.params;
  const foundCount = counts[countId];

  if (foundCount === undefined) {
    next({
      status: 404, 
      message: `Count id not found: ${countId}`
    });
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
    next({
      status: 404,
      message: `Flip id not found: ${flipId}`
    });
  }
})

//Use API - switched to flips.controller
/*app.get("/flips", (req, res) => {
  res.json({ data: flips });
});*/
app.use("/flips", flipsRouter);

function hasResultProperty(req, res, next) {
  const { data: { result } = {} } = req.body;
  if (result) {
    return next();
  } else {
    next({
      status: 400,
      message: "A 'result' property is required."
    });
  }
  
}

//Add flips to the DB
let lastFlipId = flips.reduce((maxId, flip) => Math.max(maxId, flip.id), 0);

app.post("/flips", hasResultProperty, (req, res, next) => {
  const { data: { result } = {} } = req.body;
  const newFlip = {
    id: ++lastFlipId,
    result,
  };
  flips.push(newFlip);
  counts[result] = counts[result] + 1;
  res.status(201).json({ data: newFlip });
})

// Not found handler
app.use((request, response, next) => {
  next(`Not found: ${request.originalUrl}`);
});

// Error handler
app.use((error, request, response, next) => {
  console.error(error);
  const { status = 500, message = "Something went wrong!"} = error;
  response.status(status).json({error: message});
});

module.exports = app;
