const handleSuccess = stream => {
  const text = document.getElementById('js-text');
  const audioContext = new AudioContext();
  const analyser = audioContext.createAnalyser();
  const microphone = audioContext.createMediaStreamSource(stream);
  const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

  analyser.smoothingTimeConstant = 0.3;
  analyser.fftSize = 1024;

  microphone.connect(analyser);
  analyser.connect(javascriptNode);
  javascriptNode.connect(audioContext.destination);

  javascriptNode.onaudioprocess = () => {
    const array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);
    let values = 0;
    const length = array.length;

    array.forEach(item => (values += item));

    const average = values / length;

    text.style.fontVariationSettings = `'ital' ${average}`;
  };
};

const enableAudio = () => {
  navigator.mediaDevices
    .getUserMedia({ audio: true, video: false })
    .then(handleSuccess);
};

document.addEventListener('DOMContentLoaded', enableAudio);
