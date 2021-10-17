import React, { useState, useEffect } from 'react'
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
} from "@chakra-ui/react"
import { AddIcon, DeleteIcon, StarIcon } from "@chakra-ui/icons"
import DarkModeSwitch from '../components/DarkModeSwitch'
import {
    useAuthUser,
    withAuthUser,
    withAuthUserTokenSSR,
    AuthAction,
} from 'next-firebase-auth'
import getAbsoluteURL from '../utils/getAbsoluteURL'
import firebase from 'firebase/app'
import 'firebase/firestore'
import Link from 'next/link'



//Event holds state hook and effect hook. State - useState, Effect - useEffect
const Todo = () => {
  const AuthUser = useAuthUser()
  //set hook properties? variable? to empty to start
  const [inputTodo, setInputTodo] = useState('')
  //const [inputTime, setTime]= useState('')
  const [todos, setTodos] = useState([])
//Effect hook
  useEffect(() => {
    AuthUser.id &&
      firebase
        .firestore()
        .collection("todos")
        .where( 'user', '==', AuthUser.id )
        //.orderBy('timestamp', 'desc')//may need to take out
        .onSnapshot(
          snapshot => {
            setTodos(
              snapshot.docs.map(
                doc => {
                  return {
                    todoID: doc.id,
                    todo: doc.data().todo
                    //timestamp: doc.data().date.toDate().toDateString(),
                    
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
          todo: todo,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          user: AuthUser.id
        })
        .then(console.log('Data was successfully sent to cloud firestore!'));
      // reset onscreen user fields to prompts
      setInputTodo('');
      

    } catch (error) {
      console.log(error)
    }
  }

  const deleteTodo = (t) => {
    try {
      firebase
        .firestore()
        .collection("todos")
        .doc(t)
        .delete()
        .then(console.log('Data was successfully deleted!'))
    } catch (error) {
      console.log(error)
    }
  }
//React component - display of changing data
    return (
      <Flex flexDir="column" maxW={800} align="center" justify="center" minH="100vh" m="auto" px={4}>
        <Flex justify="space-between" w="100%" align="center">
          <Heading mb={4}>Welcome, {AuthUser.email}!</Heading>
          <Flex>
            <DarkModeSwitch />
            <IconButton ml={2} onClick={AuthUser.signOut} icon={<StarIcon />} />
          </Flex>
        </Flex>

        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={<AddIcon color="gray.300" />}
          />
         
          <Input type="text" value={inputTodo} onChange={(e) => setInputTodo(e.target.value)} placeholder="Todo" />
          

          <Button
            ml={2}
            onClick={() => sendData()}
          >
            Add Todo
          </Button>
        </InputGroup>
      
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
                  <Text><Link key= {t.todoID} href={`todos/${t.todoID}`}><a className="list-group-item list-group-item-action">{t.todo}</a></Link></Text>
                  </Flex>
                <IconButton onClick={() => deleteTodo(t.todoID)} icon={<DeleteIcon />} />
              </Flex>
            </React.Fragment>
          )
        })}
      </Flex>
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

/* <div className="list-group">
          {allData ?
            allData.map(({ id, name }) => (
            <Link key={id} href={`/${id}`}>
              <a className="list-group-item list-group-item-action">{name}</a>
            </Link>
          ))
          :null}
          
          
         <Text><Link key= {id} href={`/${id}`}><a className="list-group-item list-group-item-action">{item.eventName}</a></Link></Text> 
          
          
          <Text>{t.todo}</Text></Flex>
          */


          


