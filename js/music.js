const playlist = ['musica/cancion2.mp3', 'musica/cancion3.mp3'];
let musicLifecycleRegistered = false;
let wasPlayingBeforeHidden = false;
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
  if (!musicControl) {
    return;
  }
  musicControl.style.opacity = audioElement.paused ? '0.5' : '1';
}

function handleBackgroundPause(audioElement) {
  if (!audioElement) {
    return;
  }

  if (document.hidden) {
    if (!audioElement.paused) {
      wasPlayingBeforeHidden = true;
      audioElement.pause();
    } else {
      wasPlayingBeforeHidden = false;
    }
    syncMusicControl(audioElement);
    return;
  }

  if (wasPlayingBeforeHidden && !userPausedManually) {
    audioElement.play().catch(() => {});
  }

  wasPlayingBeforeHidden = false;
  syncMusicControl(audioElement);
}

export function initMusic() {
  const audioElement = document.getElementById('bg-music');
  if (!audioElement) {
    return;
  }

  if (!musicLifecycleRegistered) {
    document.addEventListener('visibilitychange', () => {
      handleBackgroundPause(audioElement);
    });
    window.addEventListener('pagehide', () => {
      handleBackgroundPause(audioElement);
    });
    window.addEventListener('blur', () => {
      handleBackgroundPause(audioElement);
    });
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
    audioElement.play().catch(() => {});
  };

  audioElement.addEventListener('ended', advanceTrack);

  setTrack(0);
  syncMusicControl(audioElement);

  return {
    audioElement,
    toggleMusic: () => {
      if (audioElement.paused) {
        userPausedManually = false;
        audioElement.play().catch(() => {});
      } else {
        userPausedManually = true;
        audioElement.pause();
      }
      syncMusicControl(audioElement);
    }
  };
}

export function toggleMusic() {
  const audioElement = document.getElementById('bg-music');
  if (!audioElement) {
    return;
  }

  if (audioElement.paused) {
    userPausedManually = false;
    audioElement.play().catch(() => {});
  } else {
    userPausedManually = true;
    audioElement.pause();
  }

  syncMusicControl(audioElement);
}
