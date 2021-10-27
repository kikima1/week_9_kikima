import React from 'react'
import {
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'
import {
  Stack,
  Flex,
  Button,
  Text,
  VStack,
  useBreakpointValue,
} from '@chakra-ui/react';
import Header from '../components/Header'
import DemoPageLinks from '../components/DemoPageLinks'
import Link from 'next/link'

const styles = {
  content: {
    padding: 32,
  },
  infoTextContainer: {
    marginBottom: 32,
  },
}

const Demo = () => {
  const AuthUser = useAuthUser()
  return (
    <>
      <Header email={AuthUser.email} signOut={AuthUser.signOut} />
      
     <Flex
      w={'full'}
      h={'100vh'}
      backgroundImage={
        'url(https://images.unsplash.com/photo-1600267175161-cfaa711b4a81?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)'
      }
      backgroundSize={'cover'}
      backgroundPosition={'center center'}>
      <VStack
        w={'full'}
        justify={'left'}
        py={useBreakpointValue({ base: 8, md: 4 })}
        px={useBreakpointValue({ base: 4, md: 8 })}
        bgGradient={'linear(to-r, blackAlpha.600, transparent)'}>
        <Stack maxW={'3xl'} align={'flex-start'} spacing={6}>
          <Text
            color={'white'}
            fontWeight={700}
            lineHeight={1.2}
            fontSize={useBreakpointValue({ base: '3xl', md: '4xl' })}>
            Welcome to my first app!</Text>
            
             <Text
            color={'white'}
            fontWeight={400}
            lineHeight={1}
            fontSize={useBreakpointValue({ base: '3xl', md: '4xl' })}>Make yourself at home exploring a place for storing your contacts, todos and events.
          
          <br/><br/>
            Try out the navigational elements and see if they make sense.
          
          </Text>
          <Stack direction={'column'}>
            <Button
              bg={'blue.400'}
              rounded={'full'}
              color={'white'}
              _hover={{ bg: 'blue.500' }}>
              <a href="/todo" style={{ fontSize: "25px" }}>Create a To Do</a>
            
            </Button>
            <Button
              bg={'blue.300'}
              rounded={'full'}
              color={'white'}
              _hover={{ bg: 'blue.500' }}> <a href="/event" style={{ fontSize: "25px" }}>Create an Event</a>
              
            </Button>
            <Button
              bg={'blue.300'}
              rounded={'full'}
              color={'white'}
              _hover={{ bg: 'blue.500' }}>
              <a href="/contact" style={{ fontSize: "25px"}}>Create a Contact</a>
        
              
            </Button>
          </Stack>
        </Stack>
      </VStack>
    </Flex> 
      
    </> 
  );
}

    
  

export const getServerSideProps = withAuthUserTokenSSR()()

export default withAuthUser()(Demo)






