import React from 'react'
import {
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'
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
    <div>
      <Header email={AuthUser.email} signOut={AuthUser.signOut} />
      <div style={styles.content}>
        <div style={styles.infoTextContainer}>
          <h1 style={{ fontSize: "40px"}}>Welcome to My First App</h1>
          <p>
            Make yourself at home exploring a place for storing your contacts, todos and events.
          </p>
          <p>
            Try out the navigational elements and see if they make sense.
          </p>
          <a href="/todo" style={{ fontSize: "40px", textDecoration: 'underline' }}>Add a todo!</a>
          <p>OR</p>
          <a href="/event" style={{ fontSize: "40px", textDecoration: 'underline' }}>Add an event!</a>
          <p>OR</p>
          <a href="/contact" style={{ fontSize: "40px", textDecoration: 'underline' }}>Add a contact!</a>
        </div>
        {/*<DemoPageLinks />)*/}
      </div>
    </div>
  )
}

export const getServerSideProps = withAuthUserTokenSSR()()

export default withAuthUser()(Demo)


