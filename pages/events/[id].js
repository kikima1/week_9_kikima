import { Flex, Heading, Text } from "@chakra-ui/react";
import { useAuthUser, withAuthUser, withAuthUserTokenSSR, AuthAction } from 'next-firebase-auth';
import { getFirebaseAdmin } from 'next-firebase-auth';
import firebase from 'firebase/app';
import 'firebase/firestore';
import Layout from '../../components/Layout';

//This code creates the output of a single event from a document in FireStore database and displays it in react component
const SingleEvent = ({itemData}) => {
  // const AuthUser = useAuthUser();
  return (
    <Layout>
      <Flex>
        <Heading>{itemData.name}</Heading>
      </Flex>
      <Flex>
        <Text>{itemData.date}</Text>
      </Flex>
      <Flex>
        <Text>{itemData.dessert}</Text>
      </Flex>
    </Layout>
  );
};

//this creates get serverside props which will hold the single event information to be used by other components for path-guided information gathering and display
export const getServerSideProps = withAuthUserTokenSSR(
  {
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN
  }
)(//query the database using params.id
  async ({ AuthUser, params }) => {
    const db = getFirebaseAdmin().firestore();
    const doc = await db.collection("events").doc(params.id).get();
    let itemData;
    if (!doc.empty) {
      // data exists
      let docData = doc.data();
      itemData = {
        id: doc.id,
        dessert:docData.dessert,
        name: docData.name,
        date: docData.date.toDate().toDateString()
      };
    } else {
      // no data exists
      itemData = null;
    }
    
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
)(SingleEvent)




          /* {itemData ?
      itemData.best.map(
        ({id, name})=>(
          <Link key={id} href={`/${id}`}>
          <a className= "list-group-item list-group-item-action">{name}</a>
          </Link>
        )
      )
      :null
          }*/