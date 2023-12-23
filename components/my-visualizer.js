import '../js/lib/butterchurn/lib/butterchurn.js';
import '../js/lib/butterchurn-presets/lib/butterchurnPresets.min.js';

export class MyVisualizer extends HTMLElement {
    constructor() {
        super();
        this.visualizer = null;
        this.presets = null;
        this.presetKeys = null;
        this.presetIndex = 0;
        this.presetDisplay = null;
        this.paused = true;
        this.canvas = null;
    }
    
    getAudioPlayer() {
        return document.querySelector('my-audio-player');
    }
    
    connectedCallback() 
    {
        const butt = butterchurn.default;
        this.presets = butterchurnPresets.getPresets();
        this.presetKeys = Object.keys(this.presets);
        this.presetIndex = Math.floor(Math.random() * this.presetKeys.length);
        
        let divPresets = document.createElement('div');
        divPresets.className = 'presets';
        document.body.appendChild(divPresets);
        
        let selectedPreset = null; // Track the currently selected preset
        
        for (const presetKey of this.presetKeys) {
            let p = document.createElement('p');
            p.className = 'presets'; // Use 'preset' as the class name
            p.innerText = presetKey;
            
            p.addEventListener('dblclick', () => {
                if (selectedPreset !== null)
                    selectedPreset.classList.remove('selected');

                p.classList.add('selected');
                selectedPreset = p;
                this.switchToPreset(presetKey)
            });
            
            divPresets.appendChild(p);
        }        
        
        let audioPlayer = this.getAudioPlayer();
        let audioContext = audioPlayer.audioContext;
        let gainNode = audioPlayer.gain;
        
        this.canvas = document.createElement('canvas');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvas.style.objectFit = "contain";
        document.body.appendChild(this.canvas);
        
        this.presetDisplay = document.createElement('p');
        this.presetDisplay.style.position = 'absolute';
        this.presetDisplay.style.bottom = '0';
        this.presetDisplay.style.right = '0';
        this.presetDisplay.style.margin = '20px';
        this.presetDisplay.style.color = 'white';
        this.presetDisplay.style.fontSize = '12px';
        this.presetDisplay.style.zIndex = '1000';
        document.body.appendChild(this.presetDisplay);
        
        this.visualizer = butt.createVisualizer(audioContext, this.canvas, {
            width: this.canvas.width,
            height: this.canvas.height,
            pixelRatio: window.devicePixelRatio || 1,
            textureRatio: 1
        });
        
        this.visualizer.connectAudio(gainNode);
        this.loadNextPreset(0);
        
        this.addRandomThemeButton();
        this.startPresetCycle();
        this.startRendering();
    }
    
    loadNextPreset(transitionTime) {
        this.presetDisplay.textContent = 'Current visual : ' + this.presetKeys[this.presetIndex]; // Update the preset display
        this.visualizer.loadPreset(this.presets[this.presetKeys[this.presetIndex]], transitionTime);
        this.presetIndex = (this.presetIndex + 1) % this.presetKeys.length;
    }
    
    addRandomThemeButton() {
        const button = document.createElement('button');
        button.className = 'changeTheme';
        button.textContent = 'Thème aléatoire';
        button.addEventListener('click', () => {
            this.presetIndex = Math.floor(Math.random() * this.presetKeys.length); // Choisissez un index aléatoire
            this.loadNextPreset(2.7); // Chargez le thème aléatoire avec un temps de transition
        });
        
        document.body.appendChild(button);
    }
    
    startPresetCycle() {
        setInterval(() => {
            this.loadNextPreset(2.7);
        }, 10000);
    }
    
    startRendering() {
        const renderLoop = () => {
            if (!this.paused) { // Only render if not paused
                this.visualizer.render();
                this.animationFrameId = requestAnimationFrame(renderLoop);
            }

            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        };
        this.animationFrameId = requestAnimationFrame(renderLoop);
    }
    
    pauseRendering() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId); // Cancel the animation frame request
            this.paused = true;
        }
    }
    
    resumeRendering() {
        if (this.paused) {
            this.paused = false;
            this.startRendering(); // Resume the rendering loop
        }
    }

    switchToPreset(presetKey) {
        const index = this.presetKeys.indexOf(presetKey);
        if (index !== -1) {
            this.presetIndex = index;
            this.loadNextPreset(2.7);
        }
    }
}

customElements.define('my-visualizer', MyVisualizer);
