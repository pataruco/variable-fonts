const blow = stream => {
  const text = document.getElementById('js-text');
  const audioContext = new AudioContext();
  const analyser = audioContext.createAnalyser();
  const microphone = audioContext.createMediaStreamSource(stream);
  const processor = audioContext.createScriptProcessor(256, 1, 1);

  analyser.smoothingTimeConstant = 0.75;
  analyser.fftSize = 1024;

  microphone.connect(analyser);
  analyser.connect(processor);
  processor.connect(audioContext.destination);

  processor.onaudioprocess = () => {
    const array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);
    let values = 0;
    const length = array.length;

    array.forEach(item => (values += item));

    const inclination = (values / length) * 0.01;

    text.style.fontVariationSettings = `'wght' 100, 'ital' ${inclination}`;
  };
};

const enableAudio = () => {
  navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(blow);
};

document.addEventListener('DOMContentLoaded', enableAudio);
