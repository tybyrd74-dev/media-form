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

  // Note: audio and canvas removed per request; script now handles only the form
});
