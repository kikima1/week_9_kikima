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
import Layout from '../components/Layout';

const Todo = () => {
  const AuthUser = useAuthUser();
  const [inputTodo, setInputTodo] = useState('');
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    AuthUser.id &&
      firebase
        .firestore()
        .collection("todos")
        .where( 'user', '==', AuthUser.id )
        .onSnapshot(
          snapshot => {
            setTodos(
              snapshot.docs.map(
                doc => {
                  return {
                    todoID: doc.id,
                    todo: doc.data().todo
                    //timestamp: doc.data().date.toDate().toDateString()
                    


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
        .collection("todos") // all users will share one collection
        .add({
          todo: inputTodo,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          user: AuthUser.id
        })
        .then(console.log('Data was successfully sent to cloud firestore!'));
      // flush out the user-entered values in the input elements onscreen
      setInputTodo('');
      

    } catch (error) {
      console.log(error);
    }
  }

  const deleteTodo = (t) => {
    try {
      firebase
        .firestore()
        .collection("todos")
        .doc(t)
        .delete()
        .then(console.log('Data was successfully deleted!'));
    } catch (error) {
      console.log(error);
    }
  };

 return (
    <Layout>
      <Header 
        email={AuthUser.email} 
        signOut={AuthUser.signOut} />
      <Flex flexDir="column" maxW={800} align="left" justify="start" minH="100vh" m="auto" px={4} py={10}>
      <Heading size="lg">New To Do</Heading>
      {/*<Flex flexDir="column" maxW={800} align="left" justify="start" minH="100vh" m="auto" px={4} py={6}>*/}
  
       {/*} <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children=""
          />*/}
          
          <Input type="text" value={inputTodo} onChange={(e) => setInputTodo(e.target.value)} placeholder="What would you like to do today?" />
         
          <Button
            ml={2}
            onClick={() => sendData()}
          >
            Add To Do
          </Button>
        {/*</InputGroup>*/}

        {todos.map((t, i) => {
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
                    <Link href={'/todos/' + t.todoID}>
                    {t.todo}
                    </Link>
                  </Text>
                  

                </Flex>
                <IconButton onClick={() => deleteTodo(t.todoID)} icon={<DeleteIcon />} />
              </Flex>
            </React.Fragment>
          )
        })}
      {/*</Flex>  */}
      </Flex>
    </Layout>
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
})(Todo)