import MeetupDetail from "../../components/meetups/MeetupDetail"
import { MongoClient, ObjectId } from "mongodb"

const MeetupDetailPage = (props) => {

  return (
    <MeetupDetail 
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}  
    />
  )
}


export async function getStaticPaths() {
  const client = await MongoClient.connect('mongodb+srv://iamamitshrma:iamamitshrma@cluster0.lvqlm.mongodb.net/arachnomesh?retryWrites=true&w=majority')
  const db = client.db();
  const meetupsCollection = db.collection('meetups');

  const meetups = await meetupsCollection.find({}, {_id: 1}).toArray();

  client.close();

  return {
    fallback: false,
    paths: meetups.map(meetup => ({ params: { meetupId: meetup._id.toString()}})) 
  }
}


export async function getStaticProps(context) {
  //fetch data for a single meetup
  const meetupId = context.params.meetupId;

  const client = await MongoClient.connect('mongodb+srv://iamamitshrma:iamamitshrma@cluster0.lvqlm.mongodb.net/arachnomesh?retryWrites=true&w=majority')
  const db = client.db();
  const meetupsCollection = db.collection('meetups');

  const selectedMeetup = await meetupsCollection.findOne({_id: ObjectId(meetupId)});

  client.close();


  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        image: selectedMeetup.image,
        description: selectedMeetup.description
      }
    }
  }
}



export default MeetupDetailPage