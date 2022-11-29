import './App.css';
import { Route } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import ChatPage from './Pages/ChatPage';
import { ChatState } from './Context/ChatProvider';

function App() {
  const {user} = ChatState();
  return (
    <div className="App">
        <Route exact path='/' component={HomePage} />
        {user && <Route exact path='/chats' component={ChatPage}/>}
    </div>
  );
}

export default App;
