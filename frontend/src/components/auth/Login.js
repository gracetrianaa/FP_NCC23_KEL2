import React, { useState } from "react";
import { VStack, useToast } from '@chakra-ui/react';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Button } from '@chakra-ui/button';
import axios from "axios";
import { useHistory } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);

    const toast = useToast();
    const history = useHistory();
    const handleClick = () => setShow(!show);

    const submitHandler = async () => {
        setLoading(true);
        if(!email || !password) {
            toast({
                title: "Please Fill out all Fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };

            const { data } = await axios.post(
                "/user/login",
                { email, password },
                config
            );

            toast({
                title: "Login Successful!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });

            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            history.push("/chats");
            window.location.reload();
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

    return <VStack spacing = '5px'>
        <FormControl id='email' isRequired>
            <FormLabel>E-mail</FormLabel>
            <Input 
                placeholder="Please Enter Your Email"
                value={ email }
                onChange={(e)=>setEmail(e.target.value)}
            />
        </FormControl>
        <FormControl id='password' isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
            <Input 
                type={show ? "text" : "password"}
                placeholder="Enter Password"
                value={ password }
                onChange={(e)=>setPassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {show ? "Hide" : "Show"}
                </Button>
            </InputRightElement>
            </InputGroup>
        </FormControl>

        <Button
            colorScheme="green"
            width="100%"
            style={{ marginTop: 30 }}
            onClick = {submitHandler}
            isLoading = {loading}
        >
            Login
        </Button> 
        <Button
            variant="solid"
            colorScheme="teal"
            width="100%"
            onClick={() =>{
                setEmail("guest@example.com");
                setPassword("12345678");
            }}
        >
            Get Guest User Credentials
        </Button>       
    </VStack>;
};

export default Login;