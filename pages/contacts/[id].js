import React, { useState, useEffect } from 'react';
import {
    FormControl,
    FormLabel,
    Flex,
    Heading,
    VStack,
    InputGroup,
    InputLeftElement,
    Input,
    Text,
    IconButton,
    Divider,
    Link,
    SimpleGrid,
  GridItem,
  Select,
  Checkbox,
  Button,
  useBreakpointValue
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useAuthUser, withAuthUser, withAuthUserTokenSSR, AuthAction } from 'next-firebase-auth';
import { getFirebaseAdmin } from 'next-firebase-auth';
import firebase from 'firebase/app';
import 'firebase/firestore';
import Header from '../../components/Header';
import Layout from '../../components/Layout';


const SingleContact = ({itemData}) => {
  const colSpan = useBreakpointValue({ base: 2, md: 1 });

  const AuthUser = useAuthUser();
  const [inputFirstName, setInputFirstName] = useState(itemData.firstname);
  const [inputLastName, setInputLastName] = useState(itemData.lastname);
  const [inputStreetAddress, setInputStreetAddress] = useState(itemData.streetaddress);
  const [inputCity, setInputCity] = useState(itemData.city);
  const [inputState, setInputState] = useState(itemData.state);
  const [inputPostCode, setInputPostCode] = useState(itemData.postcode);
  const [inputPhone, setInputPhone] = useState(itemData.phone);
  const [inputEmail, setInputEmail] = useState(itemData.email);

  const [statusMsg, setStatusMsg] = useState('');
  
  const sendData = async () => {
    try {
      console.log("sending!");
      // try to update doc
      const docref = await firebase.firestore().collection("contacts").doc(itemData.id);
      const doc = docref.get();

      if (!doc.empty) {
        docref.update(
          {
          firstname: inputFirstName,
          lastname: inputLastName,
          streetaddress: inputStreetAddress,
          city: inputCity,
          state: inputState,
          postcode: inputPostCode,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          email: inputEmail,
          phone: inputPhone,
          }
        );
        setStatusMsg("Updated!");
      }

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Header 
        email={AuthUser.email} 
        signOut={AuthUser.signOut} />
      <Flex flexDir="column" maxW={800} align="center" justify="start" minH="100vh" m="auto" px={4} py={3}>
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            
          />
          <ul>
          <li><Input type="text" value={inputFirstName} onChange={(e) => setInputFirstName(e.target.value)} placeholder="First Name" />
          <br/></li>
          <li><Input type="text" value={inputLastName} onChange={(e) => setInputLastName(e.target.value)} placeholder="Last Name" />
          </li><br/>
          <li><Input type="text" value={inputStreetAddress} onChange={(e) => setInputStreetAddress(e.target.value)} placeholder="Street Address" />
         </li> <br/>
          <li><Input type="text" value={inputCity} onChange={(e) => setInputCity(e.target.value)} placeholder="City" />
          </li><br/>
          <li><Input type="text" value={inputState} onChange={(e) => setInputState(e.target.value)} placeholder="State" />
          </li><br/>
          <li><Input type="text" value={inputPostCode} onChange={(e) => setInputPostCode(e.target.value)} placeholder="Postal Code" />
          </li><br/>
          <li><Input type="text" value={inputPhone} onChange={(e) => setInputPhone(e.target.value)} placeholder="City" />
          </li><br/>
          <li><Input type="text" value={inputEmail} onChange={(e) => setInputEmail(e.target.value)} placeholder="Email" /></li>
          <br/>
          </ul>
          <Button
            ml={2}
            onClick={() => sendData()}
          >
            Update
          </Button>
        </InputGroup>
        <Text>
          {statusMsg}
        </Text>
        <Button>
          <Link href={`../contact`}>

            <a className="btn btn-primary mt-3">Back to List</a>
          </Link>
        </Button>

      </Flex>
    </>
  );
};

export const getServerSideProps = withAuthUserTokenSSR(
  {
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN
  }
)(
  async ({ AuthUser, params }) => {
    // take the id parameter from the url and construct a db query with it
    const db = getFirebaseAdmin().firestore();
    const doc = await db.collection("contacts").doc(params.id).get();
    let itemData;
    if (!doc.empty) {
      // document was found
      let docData = doc.data();
      itemData = {
                    id: doc.id,
                    firstname: docData.firstname,
                    lastname: docData.lastname,
                    streetaddress: docData.streetaddress,
                    city: docData.city,
                    state:docData.state,
                    postcode:docData.postcode,
                    phone:docData.phone,
                    email:docData.email
                   // timestamp: firebase.firestore.FieldValue.serverTimestamp()
      };
    } else {
      // no document found
      itemData = null;
    }
    // return the data
    return {
      props: {
        itemData
      }
    }
  }
)

export default withAuthUser(
  {
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
    whenUnauthedBeforeInit: AuthAction.REDIRECT_TO_LOGIN
  }
)(SingleContact)

          