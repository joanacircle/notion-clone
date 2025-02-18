import React, { useState } from 'react'
import { createEditor, Descendant } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'

const initialTitle: Descendant[] = [
  {
    type: 'heading',
    children: [{ text: '' }]
  }
]

const Title: React.FC = () => {
  const [editor] = useState(() => withReact(createEditor()))

  return (
    <Slate editor={editor} initialValue={initialTitle}>
      <Editable
        className='w-full text-4xl font-bold text-black placeholder-gray-400 outline-none placeholder-opacity-60'
        placeholder='New page'
      />
    </Slate>
  )
}

export default Title
