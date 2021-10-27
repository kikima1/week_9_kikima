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
  const colSpan = useBreakpointValue({ base: 2, md: 1 });
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

  return (
    <>
     <Header 
      
        email={AuthUser.email} 
        signOut={AuthUser.signOut} />
        
     
    <Container>
    <Flex flexDir="column" maxW={1200} align="left" justify="start" minH="50vh" m="auto" px={5} py={50}>
       <VStack w="full" h="full" p={5} spacing={5} alignItems="flex-start">
      
      <SimpleGrid columns={1} columnGap={5} rowGap={5} w="full">
     
      
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children=""
          />
          <GridItem colSpan={5}>
          <FormControl>
            <FormLabel>First Name</FormLabel>
            <Input type="text" value={inputFirstName} onChange={(e) => setInputFirstName(e.target.value)} placeholder="Jane/John/Jan" />
          </FormControl></GridItem>
          <GridItem colSpan={2}>
          <FormControl>
            <FormLabel>Last Name</FormLabel>
            <Input type="text" value={inputLastName} onChange={(e) => setInputLastName(e.target.value)} placeholder="Doe/Buck/Deer" />
          </FormControl></GridItem>
          <GridItem colSpan={2}>
          <FormControl>
            <FormLabel>Street Address</FormLabel>
            <Input type="text" value={inputStreetAddress} onChange={(e) => setInputStreetAddress(e.target.value)} placeholder="1 Main Street" />
          </FormControl></GridItem>
          <GridItem colSpan={2}>
          <FormControl>
            <FormLabel>City</FormLabel>
            <Input type="text" value={inputCity} onChange={(e) => setInputCity(e.target.value)} placeholder="AnyTown" />
          </FormControl></GridItem>
          <GridItem colSpan={2}>
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
            <Input type="text" value={inputFirstName} onChange={(e) => setInputFirstName(e.target.value)} placeholder="me@myname.com" />
          </FormControl></GridItem>
         
          
          
          <Button
            ml={2}
            onClick={() => sendData()}
          >
            Add
          </Button>
        </InputGroup>
        
        </SimpleGrid>
     </VStack>
     </Flex>
     </Container>

        {contacts.map((item, i) => {
          return (
            <React.Fragment key={i}>
              {i > 0 && <Divider />}
              <Flex
                w="100%"
                p={5}
                my={2}
                align="center"
                borderRadius={5}
                justifyContent="space-between"
              >
                <Flex align="left">
                
                  <Text fontSize="xl" mr={4}>{i + 1}.</Text>
                  <Text>
                    <Link href={'/contacts/' + item.contactID}>
                    {item.contactFirstName}
                    </Link>
                    </Text>
                    <br/>
                    <Text>
                    <Link href={'/contacts/' + item.contactID}>
                     {item.contactLastName}
                    </Link>
                  </Text>
                  <br/>
                  <Text> {item.contactStreetAddress}</Text>
                  <br/>
                  
                  <Text> {item.contactCity}</Text>
                  
                  <br/>   
                  
                  <Text> {item.contactState}</Text>
                  <br/>

                  
                  <Text> {item.contactPostCode}</Text>
                  
                  <br/>
                  
                  <Text> {item.contactPhone}</Text>
                  <br/>

                  
                  <Text> {item.contactEmail}</Text>
                  <br/>
                  

                </Flex>
                <IconButton onClick={() => deleteContact(item.contactID)} icon={<DeleteIcon />} />
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