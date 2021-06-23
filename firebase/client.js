import firebase from "firebase";
import { delLocale } from "next/dist/next-server/lib/router/router";
import decks from "pages/api/decks";

// import 'firebase/firestore'
// import 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyDeKcyHA_5L3MB_rCJ1I-8gSV9hFBHgXV0",
  authDomain: "activerecallapp.firebaseapp.com",
  projectId: "activerecallapp",
  storageBucket: "activerecallapp.appspot.com",
  messagingSenderId: "276942806108",
  appId: "1:276942806108:web:6ffd9fa1b52340c48b9a99",
  measurementId: "G-K95VWWN3GB",
};

if (!firebase.apps.length) {
  const firebaseApp = firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();

const database = firebase.firestore();

const mapUserFromFirebaseAuth = (user) => {
  console.log(user)
  const { displayName, email, photoURL, uid, emailVerified } = user;

  return {
    uid: uid,
    username: displayName,
    email: email,
    avatar: photoURL,
    emailVerified: emailVerified,
  };
};

export const onAuthStateChanged = (onChange) => {
  return firebase.auth().onAuthStateChanged((user) => {
    const normalizedUser = user ? mapUserFromFirebaseAuth(user) : null;

    onChange(normalizedUser);
  });
};

export const loginWithGmail = () => {
  const gmailProvider = new firebase.auth.GoogleAuthProvider();
  return firebase.auth().signInWithPopup(gmailProvider);
};

export const saveUserInFirestore = (user) => {
  const { uid, displayName, photoURL, email } = user;

  return database.collection("users").doc(uid).set({
    uid: uid,
    username: displayName,
    photoURL: photoURL,
    email: email,
  });
};

export const createDeck = (id, name, description = "") => {
  let user = database.collection("users").doc(auth.currentUser.uid);

  if(id){
    let deckToAdd
    
    return database
    .collection("decks")
    .add({
      name: name,
      description: description,
      cards: [],
      decks: [],
      author: user,
    })
    .then((deckObject)=>{
      deckToAdd = deckObject

      //setting the deckToAdd to their parent deck
      database
      .collection("decks")
      .doc(id)
      .update({
        decks:  firebase.firestore.FieldValue.arrayUnion(deckToAdd)
      })
      .then(() => {
        console.log("Document successfully updated!");
      })
      .catch(()=>{
        console.log("An error ocurred while updating deck")
      })
    })
    .catch((e) => {
      console.log(e.message);
    });
  }

  else{
    return database
    .collection("decks")
    .add({
      name: name,
      description: description,
      cards: [],
      decks: [],
      user: user,
      author: user,
    })
    .then(console.log("deck created"))
    .catch((e) => {
      console.log(e.message);
    });
  }
  
};

export const listenForUserDecks = (callback) => {
  let userReference = database.collection("users").doc(auth.currentUser.uid);
  return database
    .collection("decks")
    .where("user", "==", userReference)
    .onSnapshot(({ docs }) => {
      const decks = docs.map((doc) => {
        const id = doc.id;
        return { ...doc.data(), id };
      });
      console.log(decks)
      callback(decks);
    });
};


export const listenForDeck = (id, setActualDecks, setDecks) => {
  console.log("listeForDeck")
     database
    .collection("decks")
    .doc(id)
    .onSnapshot((data)=>{
      // console.log(data.data())
      const deck = data.data()
      setActualDecks(deck)

      listenForDecks(deck, setDecks)
    });
};

export const listenForDecks = (deck, callback) =>{
  let promise = deck.decks.map(deckItem=>{
    return database.collection("decks")
    .doc(deckItem.id)
    .get()
    .then((doc)=>{
      const id = doc.id;
      return {...doc.data(), id}
    })
  })
  
  Promise.all(promise).then(array=>{
    console.log(array)
    callback(array)
  })
}

export { auth, database };
