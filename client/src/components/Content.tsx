import React, { useCallback, useState } from 'react'
import { Node, createEditor, Descendant, BaseEditor, Transforms } from 'slate'
import {
  Slate,
  Editable,
  withReact,
  RenderElementProps,
  ReactEditor
} from 'slate-react'

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

    switch (element.type) {
      case 'heading':
        return (
          <h2 {...attributes} className='text-xl font-bold'>
            {children}
          </h2>
        )
      case 'paragraph':
      default:
        return (
          <p {...attributes} className='mb-2'>
            {children}
          </p>
        )
    }
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
          className='outline-none w-full'
        />
      </Slate>
    </div>
  )
}

export default Content
