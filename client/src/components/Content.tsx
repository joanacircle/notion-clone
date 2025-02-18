import React, { useCallback, useState } from 'react'
import { Node, createEditor, Descendant, BaseEditor, Transforms } from 'slate'
import {
  Slate,
  Editable,
  withReact,
  RenderElementProps,
  ReactEditor
} from 'slate-react'
import * as Tooltip from '@radix-ui/react-tooltip'
import PlusIcon from '../icons/PlusIcon'
import Bars from '../icons/Bars'

type CustomElement = { type: 'paragraph' | 'heading'; children: Descendant[] }

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
  }
}

const initialValue: CustomElement[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }]
  }
]

const Content: React.FC = () => {
  const [editor] = useState(() => withReact(createEditor()))
  const [value, setValue] = useState<Descendant[]>(initialValue)

  const renderElement = useCallback((props: RenderElementProps) => {
    const { attributes, children, element } = props

    return (
      <div className='relative group'>
        <span className='absolute left-[-50px] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex'>
          <Tooltip.Provider>
            <Tooltip.Root delayDuration={100}>
              <Tooltip.Trigger>
                <div className='p-1 rounded-md hover:bg-slate-200 cursor-grab'>
                  <PlusIcon className='text-slate-500 size-4 cursor-grab' />
                </div>
              </Tooltip.Trigger>

              <Tooltip.Portal>
                <Tooltip.Content className='px-2 py-1 my-1 text-xs font-extrabold bg-black rounded-md shadow-md text-slate-300'>
                  <span className='text-white'>Click </span>to add below <br />{' '}
                  <span className='text-white'>Option-click </span>
                  to add above
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>

            <Tooltip.Root delayDuration={100}>
              <Tooltip.Trigger>
                <div className='p-1 rounded-md hover:bg-slate-200 cursor-grab'>
                  <Bars className='text-slate-500 size-4' />
                </div>
              </Tooltip.Trigger>

              <Tooltip.Portal>
                <Tooltip.Content className='px-2 py-1 my-1 text-xs font-extrabold bg-black rounded-md shadow-md text-slate-300'>
                  <span className='text-white'>Drag </span>to move <br />{' '}
                  <span className='text-white'>Click </span>
                  to open menu
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </span>

        {element.type === 'heading' ? (
          <h2 {...attributes} className='text-xl font-bold'>
            {children}
          </h2>
        ) : (
          <p {...attributes} className='mb-2'>
            {children}
          </p>
        )}
      </div>
    )
  }, [])

  // Function to check if the last black is empty
  const isLastBlockEmpty = () => {
    const lastNode = Node.last(editor, [editor.children.length - 1])
    const lastBlock = lastNode?.[0] as CustomElement | undefined

    if (lastBlock) {
      const text = Node.string(lastBlock)
      return text.trim() === ''
    }
    return false
  }

  // Handle click on whitespace to add a new block
  const handleEditorClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Check if the click is outside any existing text
    const target = event.target as HTMLElement
    const isInsideEditor = target.closest('[data-slate-editor]')

    if (!isInsideEditor) {
      if (!isLastBlockEmpty()) {
        ReactEditor.focus(editor)

        // Insert a new paragraph block
        Transforms.insertNodes(editor, {
          type: 'paragraph',
          children: [{ text: '' }]
        })
      }
    }
  }

  return (
    <div className='mt-4 min-h-[500px]' onClick={handleEditorClick}>
      <Slate editor={editor} initialValue={value} onValueChange={setValue}>
        <Editable
          renderElement={renderElement}
          className='w-full outline-none'
        />
      </Slate>
    </div>
  )
}

export default Content
