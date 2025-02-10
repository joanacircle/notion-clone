import TextEditor from './components/TextEditor'

const App = () => {
  return (
    <div>
      <div className='bg-slate-200 w-screen h-44'></div>
      <div className='pt-10 px-[30vh] py-[30vh]'>
        <TextEditor />
      </div>
    </div>
  )
}

export default App
