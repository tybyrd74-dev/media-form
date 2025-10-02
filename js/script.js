// Small script: handle form submit, play/pause audio, draw on canvas
document.addEventListener('DOMContentLoaded',()=>{
  const form = document.getElementById('mediaForm');
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    for(const [k,v] of data.entries()){
      if(obj[k]){
        if(Array.isArray(obj[k])) obj[k].push(v); else obj[k]=[obj[k],v];
      } else obj[k]=v;
    }
    alert('Form submitted:\n'+JSON.stringify(obj,null,2));
  });

  // Generate small WAV clip and attach to audio player
  (function attachClip(){
    const player = document.getElementById('clipPlayer');
    if(!player) return;
    const sampleRate = 44100;
    const duration = 1.2; // seconds
    const frameCount = Math.floor(sampleRate * duration);
    const buffer = new Float32Array(frameCount);
    const freq = 440; // A4
    for(let i=0;i<frameCount;i++){
      const t = i/sampleRate;
      // simple envelope
      const env = Math.min(1, t*6) * Math.exp(-3*t);
      buffer[i] = Math.sin(2*Math.PI*freq*t) * 0.6 * env;
    }

    // convert float samples to 16-bit WAV
    function floatTo16BitPCM(output, offset, input){
      for (let i = 0; i < input.length; i++, offset += 2) {
        let s = Math.max(-1, Math.min(1, input[i]));
        s = s < 0 ? s * 0x8000 : s * 0x7fff;
        output.setInt16(offset, s, true);
      }
    }

    function writeString(view, offset, string){
      for (let i = 0; i < string.length; i++){
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    }

    const bufferLength = 44 + frameCount * 2;
    const arrayBuffer = new ArrayBuffer(bufferLength);
    const view = new DataView(arrayBuffer);

    /* RIFF identifier */ writeString(view, 0, 'RIFF');
    /* file length */ view.setUint32(4, 36 + frameCount * 2, true);
    /* RIFF type */ writeString(view, 8, 'WAVE');
    /* format chunk identifier */ writeString(view, 12, 'fmt ');
    /* format chunk length */ view.setUint32(16, 16, true);
    /* sample format (raw) */ view.setUint16(20, 1, true);
    /* channel count */ view.setUint16(22, 1, true);
    /* sample rate */ view.setUint32(24, sampleRate, true);
    /* byte rate (sample rate * block align) */ view.setUint32(28, sampleRate * 2, true);
    /* block align (channel count * bytes per sample) */ view.setUint16(32, 2, true);
    /* bits per sample */ view.setUint16(34, 16, true);
    /* data chunk identifier */ writeString(view, 36, 'data');
    /* data chunk length */ view.setUint32(40, frameCount * 2, true);

    floatTo16BitPCM(view, 44, buffer);

    const blob = new Blob([view], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    player.src = url;
  })();
});
