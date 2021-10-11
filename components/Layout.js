import Head from 'next/head';
import Link from 'next/link';
//import {eventID} from '../pages/event'

export default function Layout({ children, home }) {
  return (
    <div>
      <Head>
        <title>BasicNext.js App
</title>
      </Head>
      <main>{children}</main>
      {
        !home && (
         // <Link href="../event/${item.eventID}">
          //  <a className="btn btn-primary mt-3">Back to Events</a>
          //</Link>
          <Link href="/">
            <a className="btn btn-primary mt-3">Home</a>
          </Link>
        )
      }
    </div>
  );

}
//<Link key= {item.eventID} href={`events/${item.eventID}`}><a className="list-group-item list-group-item-action">{item.eventName}</a></Link>
//import Layout from '../components/layout';