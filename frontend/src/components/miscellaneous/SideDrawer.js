import React, { useState } from "react";
import { Box, Text } from "@chakra-ui/layout";
import { Tooltip } from "@chakra-ui/tooltip";
import { Button } from "@chakra-ui/button";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useHistory } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/hooks";
import { ChatState } from "../../context/ChatProvider";
import ChatLoading  from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
    Input,
    useToast,
  } from '@chakra-ui/react';

import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
  } from '@chakra-ui/react';
import ProfileModal from "./ProfileModal";
import axios from "axios";
import { Spinner } from "@chakra-ui/spinner";



function SideDrawer () {

    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState();

    const { user, setSelectedChat, chats, setChats } = ChatState();
    const history = useHistory();
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();


    const logoutHandler = () => {
        setLoading(true);
        localStorage.removeItem("userInfo");
        setLoading(false); 
        history.push("/");
        window.location.reload();
        
    };

    const handleSearch = async () => {
        if(!search) {
            toast({
                title: "Search can not be Empty",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            });
            return;
        }

        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization:`Bearer ${user.token}`
                },
            };

            const { data } = await axios.get(`/user?search=${search}`, config)
        
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
        }
    };

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization:`Bearer ${user.token}`,
                },
            };

            //return the chat created
            const { data } = await axios.post('/chats', {userId}, config);

            // if it's already in the list, it's just going to update the list

            if(!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

            setSelectedChat(data);
            setLoadingChat(false);
            onClose();

        } catch (error) {
            toast({
                title: "Error fetching the chat!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };

    return (
        <>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bg="#B0C7DD"
                w="100%"
                p="5px 10px 5px 10px"
                borderWidth="5px"
            >
                <Tooltip 
                label="Search Users to Chat"
                hasArrow
                placement="bottom-end"
                >
                    <Button variant="ghost" onClick={onOpen}>
                    <i className="fas fa-search"></i>
                    <Text d={{base:"none", md:"flex"}} px="4">
                        Search User
                    </Text>
                    </Button>
                </Tooltip>
                <Text fontSize="2xl" fontFamily="Work sans">
                    Let's Talk!
                </Text>
                <div>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            Profile
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                            <MenuItem>My Profile</MenuItem>{" "}
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem fontWeight="bold" color="black" onClick={ logoutHandler }>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>

            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay>
                    <DrawerContent>
                        <DrawerHeader borderBottomWidth="1px">Search a User</DrawerHeader>
                        <DrawerBody>
                            <Box display="flex" pb={2}>
                                <Input
                                    placeholder="Search by Name or Email"
                                    mr={2}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <Button 
                                onClick={handleSearch}
                                >
                                    GO
                                </Button>
                            </Box>
                            {loading ? <ChatLoading /> : (
                                searchResult?.map((user) => (
                                    <UserListItem 
                                        key={user._id}
                                        user={user}
                                        handleFunction={()=>accessChat(user._id)}
                                    />
                                ))
                            )}
                            {loadingChat && <Spinner ml="auto" display="flex" />}
                        </DrawerBody>
                    </DrawerContent>
                </DrawerOverlay>
            </Drawer>
        </>
    )
};

export default SideDrawer;