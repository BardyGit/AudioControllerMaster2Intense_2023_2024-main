export class MyEqualizer extends HTMLElement {
  getAudioPlayer() {
    return document.querySelector('my-audio-player');
  }
  
  constructor() {
    super();
  }
  
  connectedCallback() {
    this.volumeContainer = document.createElement('div');
    this.appendChild(this.volumeContainer);
    
    this.innerHTML = `
    <div class="equalizer">
    <div class="section">
    <div class="title">HF</div>
    <div class="sliders">
    <div class="range-slider">
    <span class="scope">22</span>
    <webaudio-slider height="60" type="range" direction="vert" min="4700" max="22000" step="100" value="4700" data-filter="highShelf" data-param="frequency"></webaudio-slider>
    <span class="scope scope-min">4.7</span>
    <span class="param">kHz</span>  
    </div>
    <div class="range-slider">
    <span class="scope">50</span>
    <webaudio-slider height="60" type="range" direction="vert" min="-50" max="50" value="50" data-filter="highShelf" data-param="gain"></webaudio-slider>
    <span class="scope scope-min">-50</span>
    <span class="param">dB</span>  
    </div>
    </div>
    </div>
    
    <div class="section">
    <div class="title">LF</div>
    <div class="sliders">
    <div class="range-slider">
    <span class="scope">220</span>
    <webaudio-slider height="60" type="range" direction="vert" min="35" max="220" step="1" value="35" data-filter="lowShelf" data-param="frequency"></webaudio-slider>
    <span class="scope scope-min">35</span>
    <span class="param">Hz</span>  
    </div>
    <div class="range-slider">
    <span class="scope">50</span>
    <webaudio-slider height="60" type="range" direction="vert" min="-50" max="50" value="50" data-filter="lowShelf" data-param="gain"></webaudio-slider>
    <span class="scope scope-min">-50</span>
    <span class="param">dB</span>  
    </div>
    </div>
    </div>
    
    <div class="section">
    <div class="title">HMF</div>
    <div class="sliders">
    <div class="range-slider">
    <span class="scope">5.9</span>
    <webaudio-slider height="60" type="range" direction="vert" min="800" max="5900" step="100" value="800" data-filter="highPass" data-param="frequency"></webaudio-slider>
    <span class="scope scope-min">0.8</span>
    <span class="param">kHz</span>  
    </div>
    <div class="range-slider">
    <span class="scope">12</span>
    <webaudio-slider height="60" type="range" direction="vert" min="0.7" max="12" step="0.1" value="0.7" data-filter="highPass" data-param="Q"></webaudio-slider>
    <span class="scope scope-min">0.7</span>
    <span class="param">Q</span>  
    </div>
    </div>
    </div>  
    
    <div class="section">
    <div class="title">LMF</div>
    <div class="sliders">
    <div class="range-slider">
    <span class="scope">1600</span>
    <webaudio-slider height="60" type="range" direction="vert" min="80" max="1600" step="10" value="880" data-filter="lowPass" data-param="frequency"></webaudio-slider>
    <span class="scope scope-min">80</span>
    <span class="param">Hz</span>  
    </div>
    <div class="range-slider">
    <span class="scope">12</span>
    <webaudio-slider height="60" type="range" direction="vert" min="0.7" max="12" step="0.1" value="0.7" data-filter="lowPass" data-param="Q"></webaudio-slider>
    <span class="scope scope-min">0.7</span>
    <span class="param">Q</span>  
    </div>
    </div>
    </div>
    
    </div>
    `
    
    var context = this.getAudioPlayer().audioCtx;
    var mediaElement = this.getAudioPlayer().audio;
    var source = this.getAudioPlayer().audioSrc;
    var highShelf = context.createBiquadFilter();
    var lowShelf = context.createBiquadFilter();
    var highPass = context.createBiquadFilter();
    var lowPass = context.createBiquadFilter();
    
    source.connect(highShelf);
    highShelf.connect(lowShelf);
    lowShelf.connect(highPass);
    highPass.connect(lowPass);
    lowPass.connect(context.destination);
    
    highShelf.type = "highshelf";
    highShelf.frequency.value = 4700;
    highShelf.gain.value = 50;
    
    lowShelf.type = "lowshelf";
    lowShelf.frequency.value = 35;
    lowShelf.gain.value = 50;
    
    highPass.type = "highpass";
    highPass.frequency.value = 800;
    highPass.Q.value = 0.7;
    
    lowPass.type = "lowpass";
    lowPass.frequency.value = 880;
    lowPass.Q.value = 0.7;
    
    // An object to map the data-filter attribute to the actual filter objects
    const filterMap = {
      highShelf: highShelf,
      lowShelf: lowShelf,
      highPass: highPass,
      lowPass: lowPass
    };

    let ranges = document.querySelectorAll('input[type=range], webaudio-slider');
    console.log(ranges);
    ranges.forEach((range) => {
      range.addEventListener('input', () => {
        const filter = filterMap[range.dataset.filter];
        
        if (filter)
          filter[range.dataset.param].value = range.value;
      });
    });
    
  }
}

customElements.define('my-equalizer', MyEqualizer);
