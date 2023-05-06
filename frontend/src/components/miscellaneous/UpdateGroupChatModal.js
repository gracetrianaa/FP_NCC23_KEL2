import React, { useState } from "react";
import {
    Modal, 
    useDisclosure,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    IconButton,
    Button,
    useToast,
    Box,
    FormControl,
    Input,
    Spinner,
  } from '@chakra-ui/react'
import { ViewIcon } from "@chakra-ui/icons";
import { ChatState } from "../../context/ChatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
    
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);

    const toast = useToast();

    const { selectedChat, setSelectedChat, user } = ChatState();

    const handleRemove = async (user1) => {
        if(selectedChat.groupAdmin._id !== user._id && user._id !== user1._id){
            toast({
                title: "Only Admins are allowed to Remove User!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            // API for remove user
            const { data } = await axios.put('/chats/groupremove', {
                chatId: selectedChat._id,
                userId: user1._id,
            }, config);

            user1._id === user._id ? setSelectedChat() : setSelectedChat(data); // if the user loggend remove himself/left, selectedchat set to empty
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);

        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
    };

    const handleAddUser = async (user1) => {
        if(selectedChat.users.find((u) => u._id === user1._id)) {
            toast({
                title: "User is already in group!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        if(selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: "Only Admins are allowed to add User",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            // API for added user
            const { data } = await axios.put('/chats/groupadd', {
                chatId: selectedChat._id,
                userId: user1._id,
            }, config);

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);

        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
    };

    const handleRename = async () => {
        if(!groupChatName) return;

        try {
            setRenameLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            // API for renaming the group
            const { data } = await axios.put("/chats/rename", {
                chatId: selectedChat._id,
                chatName: groupChatName,
            }, config);

            setSelectedChat(data);
            setFetchAgain(!fetchAgain); // the list of chat get updated
            setRenameLoading(false);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setRenameLoading(false);
        }
        setGroupChatName("");
    };

    const handleSearch = async (query) => {
        setSearch(query);
        if(!query) return;

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            // API for search user
            const { data } = await axios.get(`/user?search=${search}`,  config);
            console.log(data);
            
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Result",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
            setLoading(false);
        }
    };

    return (
        <>
            <IconButton 
                display={{base: "flex"}}
                icon={<ViewIcon />}
                onClick={onOpen}
                ml="auto"
            />
            
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader
                    fontSize="35px"
                    fontFamily="Work sans"
                    display="flex"
                    justifyContent="center"
                >
                    {selectedChat.chatName}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
                        {selectedChat.users.map((u) => (
                            <UserBadgeItem
                            key={user._id} 
                            user={u}
                            handleFunction={() => handleRemove(u)}
                            />
                        ))}
                    </Box>
                    <FormControl display="flex">
                        <Input
                            placeholder="Group Chat Name"
                            mb={3}
                            value={groupChatName}
                            onChange={(e) => setGroupChatName(e.target.value)}
                        />
                        <Button
                            variant="solid"
                            colorScheme="teal"
                            ml={1}
                            isLoading={renameLoading}
                            onClick={handleRename}
                        >
                            Update
                        </Button>
                    </FormControl>
                    <FormControl>
                        <Input
                            placeholder="Add User to Group"
                            mb={1}
                            onChange={(e) => handleSearch(e.target.value)}
                        >
                        </Input>
                    </FormControl>
                    {loading ? (
                        <Spinner size="lg" />
                    ) : (
                        searchResult?.map((user) => (
                            <UserListItem 
                                key={user._id}
                                user={user}
                                handleFunction={() => handleAddUser(user)}
                            />
                        ))
                    )}
                </ModalBody>
    
                <ModalFooter>
                    <Button colorScheme='red' onClick={() => handleRemove(user)}>
                        Leave Group
                    </Button>
                </ModalFooter>
            </ModalContent>
          </Modal>
        </>
    )
};

export default UpdateGroupChatModal;