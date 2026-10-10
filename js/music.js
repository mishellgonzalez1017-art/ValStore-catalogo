const playlist = ['musica/cancion2.mp3', 'musica/cancion3.mp3'];
let musicLifecycleRegistered = false;
let userPausedManually = false;

function shuffleArray(items) {
  const clone = [...items];
  for (let index = clone.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [clone[index], clone[randomIndex]] = [clone[randomIndex], clone[index]];
  }
  return clone;
}

function syncMusicControl(audioElement) {
  const musicControl = document.getElementById('music-control');
  if (!musicControl) return;
  const playing = !audioElement.paused;
  musicControl.style.opacity = playing ? '1' : '.68';
  musicControl.setAttribute('aria-pressed', String(playing));
  musicControl.setAttribute('aria-label', playing ? 'Pausar música' : 'Activar música');
}

function pauseWhenLeaving(audioElement) {
  if (document.hidden || !document.hasFocus()) {
    audioElement.pause();
    syncMusicControl(audioElement);
  }
}

export function initMusic() {
  const audioElement = document.getElementById('bg-music');
  if (!audioElement) return;

  if (!musicLifecycleRegistered) {
    document.addEventListener('visibilitychange', () => pauseWhenLeaving(audioElement));
    window.addEventListener('pagehide', () => { audioElement.pause(); syncMusicControl(audioElement); });
    window.addEventListener('blur', () => { audioElement.pause(); syncMusicControl(audioElement); });
    musicLifecycleRegistered = true;
  }

  let availableTracks = shuffleArray(playlist);
  let currentTrackIndex = 0;
  const setTrack = (index) => {
    currentTrackIndex = index;
    audioElement.src = availableTracks[currentTrackIndex];
  };
  const advanceTrack = () => {
    currentTrackIndex += 1;
    if (currentTrackIndex >= availableTracks.length) {
      availableTracks = shuffleArray(playlist);
      currentTrackIndex = 0;
    }
    setTrack(currentTrackIndex);
    if (!userPausedManually && !document.hidden && document.hasFocus()) audioElement.play().then(() => syncMusicControl(audioElement)).catch(() => {});
  };
  audioElement.addEventListener('ended', advanceTrack);
  setTrack(0);
  syncMusicControl(audioElement);
  return { audioElement, toggleMusic };
}

export function toggleMusic() {
  const audioElement = document.getElementById('bg-music');
  if (!audioElement) return;
  if (audioElement.paused) {
    userPausedManually = false;
    audioElement.play().then(() => syncMusicControl(audioElement)).catch(() => syncMusicControl(audioElement));
  } else {
    userPausedManually = true;
    audioElement.pause();
    syncMusicControl(audioElement);
  }
}
