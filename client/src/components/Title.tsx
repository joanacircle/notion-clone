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
  console.log({ editor })

  return (
    <Slate editor={editor} initialValue={initialTitle}>
      <Editable
        className='text-4xl font-bold outline-none w-full placeholder-gray-400 placeholder-opacity-60 text-black'
        placeholder='New page'
      />
    </Slate>
  )
}

export default Title
