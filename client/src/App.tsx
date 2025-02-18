import TextEditor from './components/TextEditor'

const App = () => {
  return (
    <div>
      <div className='w-screen bg-slate-200 h-44'></div>
      <div className='pt-10 px-[50vh] py-[30vh]'>
        <TextEditor />
      </div>
    </div>
  )
}

export default App
