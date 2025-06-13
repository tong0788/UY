function preload() {
  // Load magnet properties from JSON
  magnetsData = loadJSON('assets/magnets.json');
}

let magnets = [];
let video;
let handpose;
let predictions = [];

function setup() {
  createCanvas(400, 400);
  video = createCapture(VIDEO);
  video.size(400, 400);
  video.hide();

  handpose = ml5.handpose(video, modelReady);
  handpose.on('predict', results => {
    predictions = results;
  });

  // Initialize magnets based on loaded data
  for (let i = 0; i < magnetsData.length; i++) {
    magnets.push(new Magnet(magnetsData[i]));
  }
}

function modelReady() {
  console.log('Model Loaded!');
}

function draw() {
  background(220);
  image(video, 0, 0);

  // Draw magnets
  for (let magnet of magnets) {
    magnet.display();
  }

  // Check for hand gestures
  gotHands();
}

function gotHands() {
  if (predictions.length > 0) {
    let hand = predictions[0].landmarks;
    for (let magnet of magnets) {
      magnet.touch(hand);
    }
  }
}