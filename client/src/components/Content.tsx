import React, { useCallback, useState } from 'react'
import { createEditor, Descendant, BaseEditor } from 'slate'
import { Slate, Editable, withReact, RenderElementProps } from 'slate-react'
import { ReactEditor } from 'slate-react'

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

  return (
    <div className='mt-4'>
      <Slate editor={editor} initialValue={value} onValueChange={setValue}>
        <Editable renderElement={renderElement} className='outline-none' />
      </Slate>
    </div>
  )
}

export default Content
