import React, { useState, useEffect } from 'react';
import {
    Flex,
    Heading,
    InputGroup,
    InputLeftElement,
    Input,
    Button,
    Text,
    IconButton,
    Divider,
    Link,
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
      <Flex flexDir="column" maxW={800} align="center" justify="start" minH="100vh" m="auto" px={4} py={3}>
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children=""
          />
          <ul>
          <li><Input type="text" value={inputFirstName} onChange={(e) => setInputFirstName(e.target.value)} placeholder="First Name" /></li>
          <br/>
          <li><Input type="text" value={inputLastName} onChange={(e) => setInputLastName(e.target.value)} placeholder="Last Name" /></li>
         <br/>
          <li><Input type="text" value={inputStreetAddress} onChange={(e) => setInputStreetAddress(e.target.value)} placeholder="Street Address" /></li>
          <br/>
          <li><Input type="text" value={inputCity} onChange={(e) => setInputCity(e.target.value)} placeholder="City" /></li><br/>
          <li><Input type="text" value={inputState} onChange={(e) => setInputState(e.target.value)} placeholder="State" /></li><br/>
          <li><Input type="text" value={inputPostCode} onChange={(e) => setInputPostCode(e.target.value)} placeholder="Postal Code" /></li><br/>
          <li><Input type="text" value={inputPhone} onChange={(e) => setInputPhone(e.target.value)} placeholder="Phone" /></li><br/>
          <li><Input type="text" value={inputEmail} onChange={(e) => setInputEmail(e.target.value)} placeholder="Email" /></li><br/>
          </ul>
          <Button
            ml={2}
            onClick={() => sendData()}
          >
            Add
          </Button>
        </InputGroup>

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
                <Flex align="center">
                
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
        })}
      </Flex>
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