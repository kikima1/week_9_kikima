 import React, { useState, useEffect } from 'react';
import {
    Container,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    InputGroup,
    InputLeftElement,
    Input,
    Button,
    Text,
    Select,
    SimpleGrid,
    GridItem,
    IconButton,
    Divider,
    Link,
    VStack,
    Stack,
    useBreakpointValue,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
    useAuthUser,
    withAuthUser,
    withAuthUserTokenSSR,
    AuthAction,
} from 'next-firebase-auth';
import firebase from 'firebase/app';
import 'firebase/firestore';
import Header from '../components/Header';

const Contact = () => {
  
  const AuthUser = useAuthUser();
  const [inputFirstName, setInputFirstName] = useState('');
  const [inputLastName, setInputLastName] = useState('');
  const [inputStreetAddress, setInputStreetAddress] = useState('');
  const [inputCity, setInputCity] = useState('');
  const [inputState, setInputState] = useState('');
  const [inputCountry, setInputCountry] = useState('');
  const [inputPostCode, setInputPostCode] = useState('');
  const [inputPhone, setInputPhone] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  

  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    AuthUser.id &&
      firebase
        .firestore()
        .collection("contacts")
        .where( 'user', '==', AuthUser.id )
        .onSnapshot(
          snapshot => {
            setContacts(
              snapshot.docs.map(
                doc => {
                  return {
                    contactID: doc.id,
                    contactFirstName: doc.data().firstname,
                    contactLastName: doc.data().lastname,
                    contactStreetAddress: doc.data().streetaddress,
                    contactCity: doc.data().city,
                    contactState:doc.data().state,
                    contactCountry:doc.data().country,
                    contactPostCode:doc.data().postcode,
                    contactPhone:doc.data().phone,
                    contactEmail:doc.data().email,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()                    


                  }
                }
              )
            );
          }
        )
  })

  const sendData = () => {
    try {
      // try to update doc
      firebase
        .firestore()
        .collection("contacts") // all users will share one collection
        .add({
          firstname: inputFirstName,
          lastname: inputLastName,
          streetaddress: inputStreetAddress,
          city: inputCity,
          state: inputState,
          country: inputCountry,
          postcode: inputPostCode,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          email: inputEmail,
          phone: inputPhone,
          user: AuthUser.id
        })
        .then(console.log('Data was successfully sent to cloud firestore!'));
      // flush out the user-entered values in the input elements onscreen
      setInputFirstName('');
      setInputLastName('');
      setInputStreetAddress('');
      setInputCity('');
      setInputState('');
      setInputCountry('');
      setInputPostCode('');
      setInputPhone('');
      setInputEmail('');

    } catch (error) {
      console.log(error);
    }
  }

  const deleteContact = (t) => {
    try {
      firebase
        .firestore()
        .collection("contacts")
        .doc(t)
        .delete()
        .then(console.log('Data was successfully deleted!'));
    } catch (error) {
      console.log(error);
    }
  };
const colSpan = useBreakpointValue({ base: 2, md: 1 });
  return (
    <>
     <Header 
      
        email={AuthUser.email} 
        signOut={AuthUser.signOut} />
        
     
    
  
       <VStack w="full" h="full" p={10} spacing={10} alignItems="flex-start">
       <Stack direction={'column'}>
      <VStack spacing={3} alignItems="flex-start">
      <Heading size="xl">New Contact</Heading>
      </VStack>
      <SimpleGrid columns={2} columnGap={3} rowGap={6} w="full">
     
      
       {/* <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children=""
          />*/}
          <GridItem colSpan={colSpan}>
          <FormControl>
            <FormLabel>First Name</FormLabel>
            <Input type="text" value={inputFirstName} onChange={(e) => setInputFirstName(e.target.value)} placeholder="Jane/John/Jan" />
          </FormControl></GridItem>
          <GridItem colSpan={colSpan}>
          <FormControl>
            <FormLabel>Last Name</FormLabel>
            <Input type="text" value={inputLastName} onChange={(e) => setInputLastName(e.target.value)} placeholder="Doe/Buck/Deer" />
          </FormControl></GridItem>
          
          <GridItem colSpan={2}>
          <FormControl>
            <FormLabel>Street Address</FormLabel>
            <Input type="text" value={inputStreetAddress} onChange={(e) => setInputStreetAddress(e.target.value)} placeholder="1 Main Street" />
          </FormControl></GridItem>
          <GridItem colSpan={colSpan}>
          <FormControl>
            <FormLabel>City</FormLabel>
            <Input type="text" value={inputCity} onChange={(e) => setInputCity(e.target.value)} placeholder="AnyTown" />
          </FormControl></GridItem>
          <GridItem colSpan={colSpan}>
          <FormControl>
            <FormLabel>State</FormLabel>
            <Input type="text" value={inputState} onChange={(e) => setInputState(e.target.value)} placeholder="AnyState" />
          </FormControl></GridItem>
         
          <GridItem colSpan={2}>
          <FormControl>
            <FormLabel>Country</FormLabel>
            <Input type="text" value={inputCountry} onChange={(e) => setInputCountry(e.target.value)} placeholder="Gondwanaland" />
          </FormControl></GridItem>
          
          <GridItem colSpan={2}>
          <FormControl>
            <FormLabel>Postal Code</FormLabel>
            <Input type="text" value={inputPostCode} onChange={(e) => setInputPostCode(e.target.value)} placeholder="12345" />
          </FormControl></GridItem>
          <GridItem colSpan={2}>
          <FormControl>
            <FormLabel>Phone</FormLabel>
            <Input type="text" value={inputPhone} onChange={(e) => setInputPhone(e.target.value)} placeholder="303-555-1212" />
          </FormControl></GridItem>
          <GridItem colSpan={2}>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input type="text" value={inputEmail} onChange={(e) => setInputEmail(e.target.value)} placeholder="me@myname.com" />
          </FormControl></GridItem>
         
          
          
          <Button
            ml={2}
            onClick={() => sendData()}
          >
            Add
          </Button>
          <Text><br/><br/><br/><br/></Text>
          <Heading size="md">Tap on a name below to view and edit contact</Heading>
        {/*</InputGroup>*/}
        
        </SimpleGrid>
        
        </Stack>
     </VStack>
     
     
     
     
     

        {contacts.map((item, i) => {
          return (
            
            <React.Fragment key={i}>
              {i > 0 && <Divider />}
              
              <Flex
              
                w="100%"
                p={2}
                my={4}
                ml={20} 
                justifyContent="space-evenly"
                >
    
                <Flex w="20%">
                
                  <Text fontSize="xl" mr={4}>{i + 1}.</Text>
                  <Text align="left">
                    <Link href={'/contacts/' + item.contactID}>
                    {item.contactFirstName + " " + item.contactLastName}
                    </Link>
                    </Text>
                    </Flex>
                   <Flex w="80%"
                
                 justifyContent="space-evenly"> 
                    <Text> {item.contactStreetAddress +" " + item.contactCity +" " + item.contactState +" " + item.contactPostCode}</Text>
                   <Text> {" " + item.contactPhone }</Text>
                  
                 <Flex alignSelf = "flex-start"> 
                  <IconButton onClick={() => deleteContact(item.contactID)} icon={<DeleteIcon />} />
                </Flex>
                </Flex>
              </Flex>
            </React.Fragment>
          )
            
          
        }
        )}
        
        </>
      
    
  )
}

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser, req }) => {
  return {
    props: {
    }
  }
})

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  whenUnauthedBeforeInit: AuthAction.REDIRECT_TO_LOGIN,
})(Contact)