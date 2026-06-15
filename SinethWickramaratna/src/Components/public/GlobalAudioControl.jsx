import { useAmbientSynth } from '../../hooks/useAmbientSynth';
import './GlobalAudioControl.css';

function GlobalAudioControl() {
  const { isPlaying, toggleSound } = useAmbientSynth();

  return (
    <div 
      className={`global-audio-widget ${isPlaying ? 'playing' : 'muted'}`}
      onClick={toggleSound}
      title={isPlaying ? "Mute Background Music" : "Unmute Background Music"}
    >
      <div className="audio-visualizer-bars">
        <span className="bar bar-1"></span>
        <span className="bar bar-2"></span>
        <span className="bar bar-3"></span>
        <span className="bar bar-4"></span>
      </div>
      <div className="audio-status-tag monospace-val">
        {isPlaying ? 'SYS_AUDIO: ACTIVE' : 'SYS_AUDIO: MUTED'}
      </div>
    </div>
  );
}

export default GlobalAudioControl;
