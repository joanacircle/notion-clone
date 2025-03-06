import React, { useCallback, useState, useRef } from 'react'
import {
  Node,
  createEditor,
  Descendant,
  BaseEditor,
  Transforms,
  Path
} from 'slate'
import {
  Slate,
  Editable,
  withReact,
  RenderElementProps,
  ReactEditor
} from 'slate-react'
import BlockControls from './BlockControls'

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
  const dragItem = useRef<number | null>(null)
  const dragOverItem = useRef<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dropIndicator, setDropIndicator] = useState<{
    index: number
    isAbove: boolean
  } | null>(null) // Track where the indicator should appear

  const addBlock = (event: React.MouseEvent, path: number[]) => {
    event.preventDefault()
    const isOptionPressed = event.altKey

    const newBlock: CustomElement = {
      type: 'paragraph',
      children: [{ text: '' }]
    }

    Transforms.insertNodes(editor, newBlock, {
      at: isOptionPressed ? path : Path.next(path) // Insert above (before) or below (after)
    })
  }

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    position: number
  ) => {
    e.stopPropagation()
    dragItem.current = position
    setIsDragging(true)
    setDraggedIndex(position)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragEnter = (
    e: React.DragEvent<HTMLDivElement>,
    position: number
  ) => {
    e.preventDefault()
    e.stopPropagation()
    dragOverItem.current = position
  }

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    position: number
  ) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'move'

    // Calculate if the drop should be above or below based on cursor position
    const rect = e.currentTarget.getBoundingClientRect()
    const offsetY = e.clientY - rect.top
    const isAbove = offsetY < rect.height / 2

    setDropIndicator({ index: position, isAbove })
    dragOverItem.current = position
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation()
    setDropIndicator(null) // Clear indicator when leaving
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const dragIndex = dragItem.current
    const dropIndex = dragOverItem.current

    if (dragIndex === null || dropIndex === null || !dropIndicator) return

    // Adjust the drop position based on whether it's above or below
    const targetIndex =
      dropIndicator.isAbove && dropIndex > dragIndex ? dropIndex - 1 : dropIndex

    Transforms.moveNodes(editor, {
      at: [dragIndex],
      to: [targetIndex]
    })

    // Reset all states
    dragItem.current = null
    dragOverItem.current = null
    setIsDragging(false)
    setDraggedIndex(null)
    setDropIndicator(null)
  }

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation()
    setIsDragging(false)
    setDraggedIndex(null)
    setDropIndicator(null)
    dragItem.current = null
    dragOverItem.current = null
  }

  const renderElement = useCallback(
    (props: RenderElementProps) => {
      const { attributes, children, element } = props
      const path = ReactEditor.findPath(editor, element)
      const position = path[0]
      const isBeingDragged = draggedIndex === position

      //#region Determine if the drop indicator should appear above or below this block
      const showIndicatorAbove =
        dropIndicator?.index === position &&
        dropIndicator?.isAbove &&
        !isBeingDragged
      const showIndicatorBelow =
        dropIndicator?.index === position &&
        !dropIndicator?.isAbove &&
        !isBeingDragged
      // #endregion

      return (
        <div
          className={`relative group transition-all ${
            isBeingDragged ? 'opacity-50 bg-gray-100' : ''
          }`}
          onDragEnter={(e) => handleDragEnter(e, position)}
          onDragOver={(e) => handleDragOver(e, position)}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          {...attributes}
        >
          {/* Drop indicator above the block */}
          {showIndicatorAbove && (
            <div className='absolute left-0 right-0 z-10 h-1 bg-blue-200 -top-1' />
          )}

          <BlockControls
            position={position}
            path={path}
            addBlock={addBlock}
            handleDragStart={handleDragStart}
            handleDragEnd={handleDragEnd}
          />

          {element.type === 'heading' ? (
            <h2 className='text-xl font-bold'>{children}</h2>
          ) : (
            <p className='mb-2'>{children}</p>
          )}

          {/* Drop indicator below the block */}
          {showIndicatorBelow && (
            <div className='absolute left-0 right-0 z-10 h-1 bg-blue-200 -bottom-1' />
          )}
        </div>
      )
    },
    [editor, isDragging, draggedIndex, dropIndicator]
  )

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
