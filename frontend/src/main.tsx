import ReactDOM from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Sender } from './components/Sender/Sender'
import { Receiver } from './components/Receiver/Receiver'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path='/sender' element={<Sender></Sender>}></Route>
      <Route path='/receiver' element={<Receiver></Receiver>}></Route>
    </Routes>
    </BrowserRouter>
)
