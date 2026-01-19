import { useState } from 'react';
import WavesurferPlayer from '@wavesurfer/react'
import cx from 'classnames';
import { IconPlayerPlay, IconPlayerPause } from '@tabler/icons-react';

export const Audio = ({ className }: { className?: string }) => {

  const [wavesurfer, setWavesurfer] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const onReady = (ws: any) => {
    setWavesurfer(ws)
    setIsPlaying(false)
  }

  const onPlayPause = () => {
    wavesurfer && (wavesurfer as any).playPause()
  }

  return (
    <div className={cx('backdrop-blur-sm border-t border-gray-700/50 px-4 py-3 bg-op', className)}>
      <div className="flex items-center gap-3 max-w-4xl mx-auto">
        <button 
          onClick={onPlayPause}
          className="btn btn-sm btn-primary shrink-0 hover:scale-105 transition-transform"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <IconPlayerPause size={20} /> : <IconPlayerPlay size={20} />}
        </button>
        <div className="flex-1 min-w-0">
          <WavesurferPlayer
            waveColor="#a855f7"
            progressColor="#ec4899"
            cursorColor="#ffffff"
            url="/blueIsForBabyRedIsForRadical.wav"
            onReady={onReady}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
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