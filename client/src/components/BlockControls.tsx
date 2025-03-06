import { useState } from 'react'
import * as Tooltip from '@radix-ui/react-tooltip'
import PlusIcon from '../icons/PlusIcon'
import Bars from '../icons/Bars'
import Dialog from './Dialog'

const BlockControls: React.FC<{
  position: number
  path: number[]
  addBlock: (e: React.MouseEvent, path: number[]) => void
  handleDragStart: (
    e: React.DragEvent<HTMLDivElement>,
    position: number
  ) => void
  handleDragEnd: (e: React.DragEvent<HTMLDivElement>) => void
}> = ({ position, path, addBlock, handleDragStart, handleDragEnd }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const toggleMenu = () => setIsMenuOpen((prev) => !prev)

  return (
    <>
      <span
        className={`${
          isMenuOpen ? 'opacity-100' : 'opacity-0'
        } absolute left-[-50px] top-1/2 -translate-y-1/2 group-hover:opacity-100 transition-opacity flex z-10`}
      >
        <Tooltip.Provider>
          <Tooltip.Root delayDuration={100}>
            <Tooltip.Trigger>
              <div
                className='p-1 rounded-md cursor-pointer hover:bg-slate-200'
                onClick={(e) => addBlock(e, path)}
              >
                <PlusIcon className='text-slate-500 size-4' />
              </div>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content className='px-2 py-1 my-1 text-xs font-extrabold bg-black rounded-md shadow-md text-slate-300'>
                <span className='text-white'>Click </span>to add below
                <br /> <span className='text-white'>Option-click </span>to add
                above
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>

          <Tooltip.Root delayDuration={100}>
            <Tooltip.Trigger asChild>
              <div
                className='relative p-1 rounded-md hover:bg-slate-200 cursor-grab'
                draggable
                onDragStart={(e) => handleDragStart(e, position)}
                onDragEnd={handleDragEnd}
                onClick={toggleMenu}
              >
                <Bars className='text-slate-500 size-4' />
                <Dialog
                  className={`absolute top-0 ${
                    isMenuOpen ? 'block' : 'hidden'
                  } left-full`}
                />
              </div>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content className='px-2 py-1 my-1 text-xs font-extrabold bg-black rounded-md shadow-md text-slate-300'>
                <span className='text-white'>Drag </span>to move <br />{' '}
                <span className='text-white'>Click </span>to open menu
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      </span>
    </>
  )
}

export default BlockControls
