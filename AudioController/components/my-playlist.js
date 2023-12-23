export class MyPlaylist extends HTMLElement {

  getAudioPlayer() {
    return document.querySelector('my-audio-player');
  }

  getVisualizer() {
    return document.querySelector('my-visualizer');
  }

  constructor() {
    super();
    
    this.trackNameDisplay = document.createElement('div');
    this.trackNameDisplay.className = 'track-name-display';
    this.appendChild(this.trackNameDisplay);

    this.playlistWrapper = document.createElement('div');
    this.playlistWrapper.className = 'playlist-wrapper';
    this.appendChild(this.playlistWrapper);

    this.playlistContainer = document.createElement('div');
    this.playlistContainer.className = 'playlist-container';
    this.playlistWrapper.appendChild(this.playlistContainer);

    this.playlistQueue = document.createElement('div');
    this.playlistQueue.className = 'queue-container';
    this.playlistWrapper.appendChild(this.playlistQueue);

    this.playlist = [];
    this.queue = [];
    this.currentTrackIndex = 0;
  }

  connectedCallback() {
    this.MyAudioPlayer = this.getAudioPlayer();
    
    if(this.MyAudioPlayer)
      this.MyAudioPlayer.loadTrack();
  }

  updatePlaylistDisplay() {
    this.MyAudioPlayer = this.getAudioPlayer();

    this.playlistContainer.innerHTML = '';
    this.playlist.forEach((trackURL, index) => {
      const listItem = document.createElement('div');
      listItem.className = 'playlist-item';
      console.log(index, this.currentTrackIndex);
      if (index === this.currentTrackIndex) {
        listItem.classList.add('playing');
      }
      
      listItem.innerHTML = `
      <span class="track-name">${this.getTrackName(trackURL)}</span>
      <button class="add-to-queue">+</button>
    `;

    const addToQueueButton = listItem.querySelector('.add-to-queue');
    addToQueueButton.addEventListener('click', (event) => {
    event.stopPropagation(); // Empêche la propagation du clic à l'élément parent (le listItem)
    this.queue.push(trackURL);
    this.updateQueueDisplay();
    });

      listItem.addEventListener('click', () => {
        this.MyAudioPlayer.audioCtx.resume();
        
        if (this.currentTrackIndex !== index) {
          this.currentTrackIndex = index;
          this.MyAudioPlayer.loadTrack();
          this.updatePlaylistDisplay();
        } else {
          if (this.MyAudioPlayer.audio.paused) {
            this.MyAudioPlayer.audio.play();
          }
        }
      });
      
      this.playlistContainer.appendChild(listItem);
    });
  }

  updateQueueDisplay() {
    this.playlistQueue.innerHTML = ''; // Efface le contenu actuel de la file d'attente
  
    this.queue.forEach((trackURL, index) => {
      const queueItem = document.createElement('div');
      queueItem.className = 'queue-item';
      queueItem.innerHTML = `
        <span class="track-name">${this.getTrackName(trackURL)}</span>
        <button class="remove-from-queue" data-index="${index}">-</button>
      `;
  
      // Ajoute un écouteur d'événements pour le bouton de suppression de la file d'attente
      const removeFromQueueButton = queueItem.querySelector('.remove-from-queue');
      removeFromQueueButton.addEventListener('click', (event) => {
        event.stopPropagation(); // Empêche la propagation du clic à l'élément parent (queueItem)
        const indexToRemove = parseInt(event.target.dataset.index, 10);
        this.queue.splice(indexToRemove, 1);
        this.updateQueueDisplay();
      });
  
      this.playlistQueue.appendChild(queueItem);
    });
  }
  
  static get observedAttributes() {
    return ['src', 'playlist'];
  }

  getTrackName(trackURL) {
    const parts = trackURL.split('/');
    const filename = parts[parts.length - 1];
    const nameWithoutExtension = filename.split('.').slice(0, -1).join('.');
    return nameWithoutExtension;
  }

  getQueue() {
    return this.queue;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.MyAudioPlayer = this.getAudioPlayer();
    
    if (name === 'playlist') {
      this.playlist = newValue.split(',').map(url => url.trim());
      this.currentTrackIndex = 0;
      this.MyAudioPlayer.loadTrack();
    }
  }
}

customElements.define('my-playlist', MyPlaylist);