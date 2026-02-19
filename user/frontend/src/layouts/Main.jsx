import React from 'react'
import Grainient from '../components/Gradient'

const Main = ({ children }) => {
  return (
    <main className='w-full h-[100vh]  relative'>

    <div className='absolute w-full left-0 top-0'>
        <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
            <Grainient
                color1="#FF9FFC"
                color2="#5227FF"
                color3="#B19EEF"
                timeSpeed={0.25}
                colorBalance={0}
                warpStrength={1}
                warpFrequency={5}
                warpSpeed={2}
                warpAmplitude={50}
                blendAngle={0}
                blendSoftness={0.05}
                rotationAmount={500}
                noiseScale={2}
                grainAmount={0.1}
                grainScale={2}
                grainAnimated={false}
                contrast={1.5}
                gamma={1}
                saturation={1}
                centerX={0}
                centerY={0}
                zoom={0.9}
            />
        </div>
    </div>
    <div className='w-full h-[100vh]  absolute left-0 top-0 z-[] p-8'>
        <div className='w-full h-full bg-white/80 p-10 rounded-xl'>
            {children}
        </div>

    </div>
    </main>
  )
}

export default Main
