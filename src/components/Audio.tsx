import { useReducer } from 'react';
import WavesurferPlayer from '@wavesurfer/react'
import cx from 'classnames';
import { IconPlayerPlay, IconPlayerPause, IconArrowRight, IconArrowLeft } from '@tabler/icons-react';

type State = {
  wavesurfer: any,
  isPlaying: boolean,
  currentTrack: number,
}

type SetPlayerAction = {
  type: 'set-player',
  wavesurfer: any,
}

type SetIsPlayingAction = {
  type: 'set-is-playing',
  isPlaying: boolean,
}

type SetCurrentTrackAction = {
  type: 'set-current-track',
  currentTrack: number,
}

type Action = SetPlayerAction | SetIsPlayingAction | SetCurrentTrackAction

const initialState: State = {
  wavesurfer: null,
  isPlaying: false,
  currentTrack: 0,
}

const tracks = [
  { name: 'Blue Is For Baby, Red Is For Radical', url: '/blueIsForBabyRedIsForRadical.wav' },
  { name: 'How You Like Me Now', url: '/how_you_like_me_now.wav' },
  { name: 'She Said Hey', url: '/shesaidhey.wav' },
]

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'set-player':
      return { ...state, wavesurfer: action.wavesurfer }
    case 'set-is-playing':
      return { ...state, isPlaying: action.isPlaying }
    case 'set-current-track':
      return { ...state, currentTrack: action.currentTrack }
    default:
      return state
  }
}

export const Audio = ({ className }: { className?: string }) => {

  // const [wavesurfer, setWavesurfer] = useState(null)
  // const [isPlaying, setIsPlaying] = useState(false)

  const [state, dispatch] = useReducer(reducer, initialState)

  const onReady = (ws: any) => {
    dispatch({ type: 'set-player', wavesurfer: ws })
    dispatch({ type: 'set-is-playing', isPlaying: false })
  }

  const onPlayPause = () => {
    state.wavesurfer && (state.wavesurfer as any).playPause()
  }

  function nextTrack() {
    if (state.currentTrack < tracks.length - 1) {
      dispatch({ type: 'set-current-track', currentTrack: state.currentTrack + 1 })
    } else {
      dispatch({ type: 'set-current-track', currentTrack: 0 })
    }
  }

  function previousTrack() {
    if (state.currentTrack > 0) {
      dispatch({ type: 'set-current-track', currentTrack: state.currentTrack - 1 })
    } else {
      dispatch({ type: 'set-current-track', currentTrack: tracks.length - 1 })
    }
  }

  return (
    <div className={cx('backdrop-blur-sm border-t border-gray-700/50 px-4 py-3 bg-op', className)}>
      <div className="flex items-center gap-3 max-w-4xl mx-auto">
        <button
          onClick={previousTrack}
          className="btn btn-sm btn-primary shrink-0 rounded-full w-10 h-10 p-0 hover:scale-110 hover:shadow-lg hover:shadow-primary/50 transition-all duration-200 active:scale-95"
          aria-label="Previous Track"
          title="Previous Track"
          disabled={state.currentTrack === 0}
        >
          <IconArrowLeft size={18} />
        </button>
        <button
          onClick={onPlayPause}
          className="btn btn-primary shrink-0 rounded-full w-12 h-12 p-0 hover:scale-110 hover:shadow-xl hover:shadow-primary/60 transition-all duration-200 active:scale-95 font-semibold"
          aria-label={state.isPlaying ? 'Pause' : 'Play'}
          title={state.isPlaying ? 'Pause' : 'Play'}
        >
          {state.isPlaying ? <IconPlayerPause size={24} /> : <IconPlayerPlay size={24} />}
        </button>
        <button
          onClick={nextTrack}
          className="btn btn-sm btn-primary shrink-0 rounded-full w-10 h-10 p-0 hover:scale-110 hover:shadow-lg hover:shadow-primary/50 transition-all duration-200 active:scale-95"
          aria-label="Next Track"
          title="Next Track"
          disabled={state.currentTrack === tracks.length - 1}
        >
          <IconArrowRight size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <WavesurferPlayer
            waveColor="#a855f7"
            progressColor="#ec4899"
            cursorColor="#ffffff"
            url={tracks[state.currentTrack].url}
            onReady={onReady}
            onPlay={() => dispatch({ type: 'set-is-playing', isPlaying: true })}
            onPause={() => dispatch({ type: 'set-is-playing', isPlaying: false })}
            height={60}
            barWidth={2}
            barGap={1}
            normalize={true}
          />
        </div>
      </div>
    </div>
  )
}