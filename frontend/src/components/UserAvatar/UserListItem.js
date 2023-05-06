import React from "react";
import { ChatState } from "../../context/ChatProvider";
import { Box, Text } from "@chakra-ui/layout";

const UserListItem = ({ user, handleFunction }) => {
    
    return (
        <Box
        onClick={handleFunction}
        cursor="pointer"
        bg="#DBECF4"
        _hover={{
          background: "#B0C7DD",
          color: "white",
        }}
        w="100%"
        display="flex"
        alignItems="center"
        color="black"
        px={3}
        py={2}
        mb={2}
        borderRadius="lg"
      >
        <Box>
          <Text>{user.name}</Text>
          <Text fontSize="xs">
            <b>Email : </b>
            {user.email}
          </Text>
        </Box>
      </Box>
    );
  };
  
    

export default UserListItem;