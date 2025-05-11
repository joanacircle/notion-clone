import Trash from '../icons/Trash'
import DocumentDuplicate from '../icons/DocumentDuplicate'
import PencilSquare from '../icons/PencilSquare'

const Dialog: React.FC<{ className?: string }> = ({ className }) => {
  const mainList = [
    { icon: <Trash />, title: 'Delete' },
    { icon: <DocumentDuplicate />, title: 'Duplicate' }
  ]
  const subList = ['Text', 'Heading1', 'Bulleted list', 'Toggle list', 'Code']

  return (
    <div className={className}>
      <ul className='p-4 border border-gray-300 rounded-md w-[15vw] max-w-[180px] shadow-md bg-white z-20'>
        {mainList.map((item) => (
          <li
            key={item.title}
            className='flex items-center gap-2 py-1 pl-1 rounded-md cursor-pointer hover:bg-gray-100'
          >
            {item.icon}
            {item.title}
          </li>
        ))}
        <li className='relative flex items-center gap-2 py-1 pl-1 rounded-md cursor-pointer group/dialog hover:bg-gray-100'>
          <PencilSquare />
          Turn into
          <ul className='mx-4 p-4 bottom--1/2 absolute hidden  w-[15vw] max-w-[180px] border border-gray-300 rounded-md shadow-md left-full group-hover/dialog:block bg-white'>
            {subList.map((item) => (
              <li
                key={item}
                className='flex items-center gap-2 py-1 pl-1 rounded-md cursor-pointer hover:bg-gray-100'
              >
                {item}
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </div>
  )
}

export default Dialog
