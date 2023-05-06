import React from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    IconButton,
  } from '@chakra-ui/react'
import { useDisclosure } from "@chakra-ui/hooks";
import { ViewIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/button";
import { Text } from "@chakra-ui/react";

const ProfileModal = ({ user, children }) => {

    const { isOpen, onOpen, onClose } = useDisclosure();

    return (<>
        {
            children? (
            <span onClick={onOpen}>{ children }</span> 
            ) : (
                <IconButton 
                    d={{ base: "flex"}}
                    icon={<ViewIcon />}
                    onClick={onOpen}
                    ml="auto"
                />
            )}

            <Modal size="lg" isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader
                fontSize="40px"
                fontFamily="Work sans"
                display="flex"
                justifyContent="center"
                >
                    { user.name }
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody
                    display="flex"
                    flexDir="column"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Text
                        fontSize={{ base: "28px", md: "30px" }}
                        fontFamily="Work sans"
                        textAlign="center"
                    >
                        Email: {user.email}
                    </Text>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
            </Modal>
        </>
    );
};

export default ProfileModal;