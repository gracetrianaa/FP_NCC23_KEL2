import { createContext, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState();
    
    const history = useHistory();

    useEffect(() => {
        const fetchUserData = async () => {
            const userInfo = await JSON.parse(localStorage.getItem("userInfo"));
            setUser(userInfo);
        
            if(!userInfo) {
                history.push("/");
            }
        };
        if (!user) {
            fetchUserData();
        }
    }, [user, history]);

    return <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats }}>
        { children }
    </ChatContext.Provider>;
};

export const ChatState = () => {
    return useContext(ChatContext);
};

export default ChatProvider;