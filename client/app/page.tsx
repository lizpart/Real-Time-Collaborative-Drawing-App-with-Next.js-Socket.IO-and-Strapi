'use client'
import { FC, useEffect, useState } from 'react'
import { useDraw } from '../hooks/useDraw'
import { ChromePicker } from 'react-color'
import { io, Socket } from 'socket.io-client'
import { drawLine } from '../utils/drawLine'
import axios, { AxiosInstance } from 'axios'
import strapiApiClient from './api'

const socket: Socket = io('http://localhost:3001')

interface PageProps {}

type DrawLineProps = {
  prevPoint: Point | null
  currentPoint: Point
  color: string
}

type Point = {
  x: number
  y: number
}

type Draw = {
  prevPoint: Point | null
  currentPoint: Point
  ctx: CanvasRenderingContext2D
}

interface CanvasImageData {
  id: number;
  attributes: {
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    image?: {
      data: {
        id: number;
        attributes: {
          url: string;
        };
      };
    };
  };
}

const apiClient: AxiosInstance = axios.create({
  baseURL: 'http://localhost:1337/api',
})

const Page: FC<PageProps> = ({}) => {
  const [color, setColor] = useState<string>('#000')
  const { canvasRef, onMouseDown, clear } = useDraw(createLine)
  const [canvasImage, setCanvasImage] = useState<string | null>(null)

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    socket.emit('client-ready')

    socket.on('get-canvas-state', () => {
      if (!canvasRef.current?.toDataURL()) return
      console.log('sending canvas state')
      socket.emit('canvas-state', canvasRef.current.toDataURL())
    })

    socket.on('canvas-state-from-server', (state: string) => {
      console.log('I received the state')
      const img = new Image()
      img.src = state
      img.onload = () => {
        ctx?.drawImage(img, 0, 0)
      }
    })

    socket.on('draw-line', ({ prevPoint, currentPoint, color }: DrawLineProps) => {
      if (!ctx) return console.log('no ctx here')
      drawLine({ prevPoint, currentPoint, ctx, color })
    })

    socket.on('clear', clear)

    return () => {
      socket.off('draw-line')
      socket.off('get-canvas-state')
      socket.off('canvas-state-from-server')
      socket.off('clear')
    }
  }, [canvasRef])

  function createLine({ prevPoint, currentPoint, ctx }: Draw) {
    socket.emit('draw-line', { prevPoint, currentPoint, color })
    drawLine({ prevPoint, currentPoint, ctx, color })
  }

  const saveCanvasImage = async () => {
    try {
      const canvasDataURL = canvasRef.current?.toDataURL('image/png')
      if (canvasDataURL) {
        const blobData = await fetch(canvasDataURL).then(res => res.blob())
        const formData = new FormData()
        formData.append('files', blobData, 'canvas.png')

        // Upload the image to Strapi
        const uploadResponse = await strapiApiClient.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        console.log('Upload response:', uploadResponse.data)

        // Save the canvas image data to Strapi
        const imageId = uploadResponse.data[0].id
        await strapiApiClient.post('/canvas', { data: { image: imageId } })

        console.log('Canvas image saved successfully')
      }
    } catch (error) {
      console.error('Error saving canvas image:', error)
    }
  }

  return (
    <div className='w-screen h-screen bg-white flex justify-center items-center'>
      <div className='flex flex-col gap-10 pr-10'>
        <ChromePicker color={color} onChange={e => setColor(e.hex)} />
        <button
          type='button'
          className='p-2 rounded-md border border-black'
          onClick={() => socket.emit('clear')}
        >
          Clear canvas
        </button>
        <button
          type='button'
          className='p-2 rounded-md border border-black'
          onClick={saveCanvasImage}
        >
          Save Canvas Image
        </button>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={onMouseDown}
        width={750}
        height={750}
        className='border border-black rounded-md'
      />
    </div>
  )
}

export default Page