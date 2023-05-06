import React from 'react';
import { Container, Box, Text } from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import Login from "../components/auth/Login";
import Signup from "../components/auth/Signup";
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';


const Homepage = () => {

    const history = useHistory();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        
        if(!userInfo) {
            history.push('/chats');
        }
    }, [history]);

    return (
    <Container maxW='xl' centerContent>
        <Box
            display='flex'
            justifyContent="center"
            p={3}
            bg={"#dae4eb"}
            w="100%"
            m="40px 0 15px 0"
            borderRadius="lg"
            borderWidth="1px"
        >
            <Text fontSize="3xl" fontFamily="Work sans" color="#434952">
                Let's Talk!
            </Text>
        </Box>
        <Box
            bg={"#DAE4EB"}
            w="100%"
            p={4}
            borderRadius="lg"
            borderWidth="1px"
        >
            <Tabs variant='soft-rounded' colorScheme="green">
                <TabList mb="1em">
                    <Tab width="50%">Login</Tab>
                    <Tab width="50%">Sign Up</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Login />
                    </TabPanel>
                    <TabPanel>
                        <Signup />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    </Container>
    )
};

export default Homepage;