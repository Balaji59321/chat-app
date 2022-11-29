import { createContext, useContext, useEffect, useState} from "react";
import { useHistory } from "react-router-dom";

const ChatContext = createContext();

const ContextProvider = ({children}) => {
    const [user,setUser] = useState();
    const [selectedChat,setSelectedChat] = useState();
    const [chat,setChats] = useState([]);
    const history = useHistory();

    useEffect(() => {
        const call = async () => {
            const userValue = await JSON.parse(localStorage.getItem("user"));
            if(!userValue){
                history.push("/");
            }
            await setUser(userValue);
        }
        call();
    },[history])

    return <ChatContext.Provider value={{user,setUser,selectedChat,setSelectedChat,chat,setChats}}>
        {children}
    </ChatContext.Provider>
}

export const ChatState = () => {
    return useContext(ChatContext);
}

export default ContextProvider;