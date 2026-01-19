import { useState } from 'react';
import WavesurferPlayer from '@wavesurfer/react'
import cx from 'classnames';

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
    <div className={cx('', className)}>
      <button onClick={onPlayPause}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <WavesurferPlayer
        height={100}
        width={"100%"}
        waveColor="violet"
        url="/blueIsForBabyRedIsForRadical.wav"
        onReady={onReady}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </div>
  )
}