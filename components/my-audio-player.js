export class MyAudioPlayer extends HTMLElement {
  getPlaylist() {
    return document.querySelector('my-playlist');
  }
  
  getQueue() {
    return this.getPlaylist().queue;
  }
  
  getEqualizer() {
    return document.querySelector('my-equalizer');
  }
  
  getVisualizer() {
    return document.querySelector('my-visualizer');
  }
  
  get audioContext() {
    return this.audioCtx;
  }
  
  get gain() {
    return this.gainNode;
  }
  
  constructor() {
    super();
    
    this.audioCtx = new AudioContext();
    
    this.audio = document.createElement('audio');
    this.appendChild(this.audio);
    
    this.audioSrc = this.audioCtx.createMediaElementSource(this.audio);
    this.gainNode = this.audioCtx.createGain();
    
    this.audioSrc.connect(this.gainNode);
    this.gainNode.connect(this.audioCtx.destination);
    
    this.volumeContainer = document.createElement('div');
    this.appendChild(this.volumeContainer);
    
    this.volumeIcon = document.createElement('span');
    this.volumeIcon.className = 'volume-icon';
    this.volumeIcon.textContent = '🔊';
    this.volumeIcon.className = 'volume-icon';
    this.volumeContainer.appendChild(this.volumeIcon);
    
    this.volumeControl = document.createElement('input');
    this.volumeControl.type = 'range';
    this.volumeControl.min = '0';
    this.volumeControl.max = '1';
    this.volumeControl.step = '0.1';
    this.volumeControl.value = '1';
    this.volumeContainer.appendChild(this.volumeControl);
    
    this.volumeContainer.className = 'volume-container';
    
    this.btnContainer = document.createElement('div');
    this.btnContainer.className = 'button-container';
    this.appendChild(this.btnContainer)
    
    this.prevTrackBtn = document.createElement('button');
    this.prevTrackBtn.innerHTML = '<svg width="16" height="16" fill="#fff" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g fill-rule="evenodd"> <path d="M1052 92.168 959.701 0-.234 959.935 959.701 1920l92.299-92.43-867.636-867.635L1052 92.168Z"></path> <path d="M1920 92.168 1827.7 0 867.766 959.935 1827.7 1920l92.3-92.43-867.64-867.635L1920 92.168Z"></path> </g> </g></svg>';
    this.btnContainer.appendChild(this.prevTrackBtn);
    
    this.rewindBtn = document.createElement('button');
    this.rewindBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-counterclockwise" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/> <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/></svg>';
    this.btnContainer.appendChild(this.rewindBtn);
    
    this.playButton = document.createElement('button');
    this.playButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#fff" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
    this.btnContainer.appendChild(this.playButton);
    
    this.pauseButton = document.createElement('button');
    this.pauseButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#fff" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
    this.btnContainer.appendChild(this.pauseButton);
    
    this.forwardBtn = document.createElement('button');
    this.forwardBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-clockwise" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/> <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/> </svg>';
    this.btnContainer.appendChild(this.forwardBtn);
    
    this.nextTrackBtn = document.createElement('button');
    this.nextTrackBtn.innerHTML = '<svg width="16" height="16" fill="#fff" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g fill-rule="evenodd"> <path d="M0 92.168 92.299 0l959.931 959.935L92.299 1920 0 1827.57l867.636-867.635L0 92.168Z"></path> <path d="M868 92.168 960.299 0l959.931 959.935L960.299 1920 868 1827.57l867.64-867.635L868 92.168Z"></path> </g> </g></svg>';
    this.btnContainer.appendChild(this.nextTrackBtn);
    
    this.trackNameDisplay = document.createElement('div');
    this.trackNameDisplay.className = 'track-name-display';
    this.appendChild(this.trackNameDisplay);

    this.progressBar = document.createElement('progress');
    this.progressBar.value = '0';
    this.progressBar.max = '100';
    this.appendChild(this.progressBar);
    
    this.durationDisplay = document.createElement('div');
    this.durationDisplay.className = 'duration-display';
    this.appendChild(this.durationDisplay);
  }
  
  connectedCallback() {
    this.playlistInstance = this.getPlaylist();;
    this.loadTrack();
    
    this.volumeControl.addEventListener('input', () => {
      this.audio.volume = this.volumeControl.value;
    });
    
    this.playButton.addEventListener('click', () => {
      this.audioCtx.resume();
      this.audio.play();
      this.getVisualizer().resumeRendering();
    });
    
    this.pauseButton.addEventListener('click', () => {
      this.audio.pause();
      this.getVisualizer().pauseRendering();
    });
    
    this.rewindBtn.addEventListener('click', () => {
      this.audio.currentTime -= 5;
    });
    
    this.forwardBtn.addEventListener('click', () => {
      this.audio.currentTime += 5;
    });
    
    this.prevTrackBtn.addEventListener('click', () => {
      this.audioCtx.resume();
      this.previousTrack();
    });
    
    this.nextTrackBtn.addEventListener('click', () => {
      this.audioCtx.resume();
      this.nextTrack();
    });
    
    this.progressBar.addEventListener('click', (event) => {      
      const progressBarRect = this.progressBar.getBoundingClientRect();
      const clickX = event.clientX - progressBarRect.left;
      const progressBarWidth = progressBarRect.width;
      const percentClicked = (clickX / progressBarWidth) * 100;
      const duration = this.audio.duration;

      if (!isNaN(duration)) {
          const newTime = (percentClicked / 100) * duration;
          this.audio.currentTime = newTime;
      }
    });

    this.audio.addEventListener('timeupdate', () => {
      const currentTime = this.audio.currentTime;
      const duration = this.audio.duration;
      if (isFinite(duration) && !isNaN(duration)) {
        const percent = (currentTime / duration) * 100;
        this.progressBar.value = percent;
        this.updateDurationDisplay(currentTime, duration);
      }
    });
  }
  
  updateDurationDisplay(currentTime, duration) {
    const formatTime = (time) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };
    
    this.durationDisplay.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
  }

  static getFileNameWithoutExtension(filePath) {
    return filePath.split('/').pop().split('.')[0];
  }
  
  loadTrack() {
    if(this.getVisualizer().resumeRendering)
    this.getVisualizer().resumeRendering();
    this.playlistInstance = this.getPlaylist();
    
    if (this.playlistInstance && this.playlistInstance.playlist && this.playlistInstance.playlist.length > 0) {
      this.playlist = this.playlistInstance.playlist;
      this.currentTrackIndex = this.playlistInstance.currentTrackIndex;
      
      this.audio.src = this.playlistInstance.playlist[this.currentTrackIndex];
      this.audio.load();
      this.playlistInstance.updatePlaylistDisplay();

      const fileNameWithoutExtension = MyAudioPlayer.getFileNameWithoutExtension(this.playlistInstance.playlist[this.currentTrackIndex]);
      this.trackNameDisplay.textContent = fileNameWithoutExtension;
    }
  }  
  
  nextTrack() {
    if(this.getVisualizer().resumeRendering)
    this.getVisualizer().resumeRendering();
    this.playlistInstance = this.getPlaylist();
    
    if (this.playlistInstance) {
      const queue = this.getQueue();
      
      if (queue && queue.length > 0) {
        // Si la file d'attente n'est pas vide, utilise le prochain élément de la file d'attente
        const nextTrackUrl = queue.shift();
        this.audio.src = nextTrackUrl;
        this.audio.load();
        this.audio.play();
        this.playlistInstance.updateQueueDisplay();
        this.trackNameDisplay.textContent = MyAudioPlayer.getFileNameWithoutExtension(nextTrackUrl);
      } else{
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlistInstance.playlist.length;
        this.playlistInstance.currentTrackIndex = this.currentTrackIndex;
        this.audio.src = this.playlistInstance.playlist[this.currentTrackIndex];
        this.audio.load();
        this.audio.play();
        this.playlistInstance.updatePlaylistDisplay(); // Appel à la fonction updateDisplay depuis MyPlaylist
        this.trackNameDisplay.textContent = MyAudioPlayer.getFileNameWithoutExtension(this.playlistInstance.playlist[this.currentTrackIndex]);
      }
    }
  }
  
  previousTrack() {
    if(this.getVisualizer().resumeRendering)
    this.getVisualizer().resumeRendering();
    this.playlistInstance = this.getPlaylist();
    
    if (this.playlistInstance) {
      this.currentTrackIndex = (this.currentTrackIndex - 1) % this.playlistInstance.playlist.length;
      
      if(this.currentTrackIndex < 0)
      this.currentTrackIndex = this.playlistInstance.playlist.length - 1;
      
      this.playlistInstance.currentTrackIndex = this.currentTrackIndex;
      this.audio.src = this.playlistInstance.playlist[this.currentTrackIndex];
      this.audio.load();
      this.audio.play();
      this.playlistInstance.updatePlaylistDisplay(); // Appel à la fonction updateDisplay depuis MyPlaylist
      this.trackNameDisplay.textContent = MyAudioPlayer.getFileNameWithoutExtension(this.playlistInstance.playlist[this.currentTrackIndex]); 
    }
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'src') {
      this.playlist = [newValue];
      this.currentTrackIndex = 0;
      this.loadTrack();
    } else if (name === 'playlist') {
      this.playlist = newValue.split(',').map(url => url.trim());
      this.currentTrackIndex = 0;
      this.loadTrack();
    }
  }
}

customElements.define('my-audio-player', MyAudioPlayer);