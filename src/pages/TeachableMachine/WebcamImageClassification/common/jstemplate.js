export const js = `<div>Pipcook Webcam Image Classification</div>
<button type="button" onclick="init()">Start</button>
<div id="webcam-container"></div>
<div id="label-container"></div>
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.3.1/dist/tf.min.js"></script>
<script type="text/javascript">
  const URL = "./model/";

  let model,
    webcam,
    labelContainer,
    maxPredictions,
    videoElement = document.createElement("video");
  videoElement.width = 224;
  videoElement.height = 224;

  async function init() {
    const modelURL = URL + "model.json";

    model = await tf.loadLayersModel(modelURL);

    document.getElementById("webcam-container").appendChild(videoElement);
    webcam = await tf.data.webcam(videoElement);

    window.requestAnimationFrame(loop);

    // labelContainer = document.getElementById("label-container");
    // for (let i = 0; i < 2; i++) {
    //   labelContainer.appendChild(document.createElement("div"));
    // }
  }

  async function loop() {
    await predict();
    // window.requestAnimationFrame(loop);
  }

  // run the webcam image through the image model
  async function predict() {
    const img = await webcam.capture();
    const prediction = await model.predict(tf.stack([img])).array();
    console.log(prediction);
    // for (let i = 0; i < maxPredictions; i++) {
    //   const classPrediction =
    //     prediction[i].className + ": " + prediction[i].probability.toFixed(2);
    //   labelContainer.childNodes[i].innerHTML = classPrediction;
    // }
  }
</script>
`;
