import './App.css';
import { Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import ChatPage from './Pages/ChatPage';
import { ChatState } from './Context/ChatProvider';

function App() {
  const {user} = ChatState();
  return (
    <div className="App">
      <Routes>
        <Route exact path='/' element={<HomePage />} />
        <Route path='/chats' element={<ChatPage />}/>
      </Routes>
    </div>
  );
}

export default App;
