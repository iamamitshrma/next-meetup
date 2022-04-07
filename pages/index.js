import MeetupList from '../components/meetups/MeetupList';
import { MongoClient } from 'mongodb';
import Head from 'next/head';

const HomePage = (props) => {
  return (
      <>
      {/* Head tag contain metadata for our website */}
        <Head>
            <title>Next Meetup</title>
            <meta name='description' content='Browse a huge list of highly active Next Meetups'/>
        </Head>
        <MeetupList meetups={props.meetups}/>
      </>
  )
}

//it will run before above component - data render only first in the html 
// this only when build process done, never execute on user machine 
// proof - see page source - it will be good for seo

export async function getStaticProps() {
    //fetch data from an api
    const client = await MongoClient.connect('mongodb+srv://iamamitshrma:iamamitshrma@cluster0.lvqlm.mongodb.net/arachnomesh?retryWrites=true&w=majority');
    const db = client.db();
    const meetupsCollection = db.collection('meetups');

    const meetups = await meetupsCollection.find().toArray();

    client.close();

    return {
        props: {
            meetups: meetups.map(meetup => ({
                title: meetup.title,
                address: meetup.address,
                image: meetup.image,
                id: meetup._id.toString()
            }))
        },
        //regenerate every 10 second
        revalidate: 10
    };
}


//if we want to regenerate code after some action then we will use this instead of getStaticProps()
// this code only run on server 
// it will run automatically when new request comes.

// export async function getServerSideProps(context) {

//     const req = context.req;
//     const res = context.res;
//     return {
//         props: {
//             meetups: DUMMY_MEETUPS
//         }
//     }
// }
 
export default HomePage;