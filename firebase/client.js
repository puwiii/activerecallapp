import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";
import "firebase/analytics";
// import 'firebase/firestore'
// import 'firebase/storage'

//prod
// const firebaseConfig = {
//   apiKey: "AIzaSyDeKcyHA_5L3MB_rCJ1I-8gSV9hFBHgXV0",
//   authDomain: "activerecallapp.firebaseapp.com",
//   projectId: "activerecallapp",
//   storageBucket: "activerecallapp.appspot.com",
//   messagingSenderId: "276942806108",
//   appId: "1:276942806108:web:6ffd9fa1b52340c48b9a99",
//   measurementId: "G-K95VWWN3GB",
// };

// //dev
// const firebaseConfig = {
//   apiKey: "AIzaSyCJzbWGekUN17pTOGUZHnw3eCp8DSkqduc",
//   authDomain: "active-recall-dev.firebaseapp.com",
//   projectId: "active-recall-dev",
//   storageBucket: "active-recall-dev.appspot.com",
//   messagingSenderId: "74295123727",
//   appId: "1:74295123727:web:b14bcc6103f5bdafd1e87a",
//   measurementId: "G-NGE0F7QT5K",
// };

//dev dev
const firebaseConfig = {
  apiKey: "AIzaSyCJzbWGekUN17pTOGUZHnw3eCp8DSkqduc",
  authDomain: "active-recall-dev.firebaseapp.com",
  projectId: "active-recall-dev",
  storageBucket: "active-recall-dev.appspot.com",
  messagingSenderId: "74295123727",
  appId: "1:74295123727:web:bcd2379d22fa0095d1e87a",
  measurementId: "G-TSZ2L0T7G4",
};

if (!firebase.apps.length) {
  const firebaseApp = firebase.initializeApp(firebaseConfig);
}

export const firebaseTimeStampFromDate = (date) => {
  return firebase.firestore.Timestamp.fromDate(date);
};

const analytics = firebase.analytics();

const auth = firebase.auth();

const database = firebase.firestore();

database.settings({
  ignoreUndefinedProperties: true,
  merge: true,
});

let userRef = null;

// USER FUNCTIONS - START

const mapUserFromFirebaseAuth = (user) => {
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
  return firebase.auth().onAuthStateChanged(
    (user) => {
      const normalizedUser = user ? mapUserFromFirebaseAuth(user) : null;
      // normalizedUser
      //   ? (userRef = null)
      //   : (userRef = database.collection("users").doc(auth.currentUser.uid));

      user &&
        (userRef = database.collection("users").doc(auth.currentUser.uid));
      onChange(normalizedUser);
    },
    (error) => {
      console.log(error.message);
    }
  );
};

export const loginWithGmail = () => {
  const gmailProvider = new firebase.auth.GoogleAuthProvider();
  return firebase.auth().signInWithPopup(gmailProvider);
};

export const saveUserInFirestore = (user) => {
  const { uid, displayName, email } = user;

  const photoURL =
    "https://firebasestorage.googleapis.com/v0/b/activerecallapp.appspot.com/o/avatars%2Fdefault%2F2983183.png?alt=media&token=2411ee04-2c60-423e-b7f4-b93081ac3fb0";

  const usernameLC = displayName.toLowerCase();

  return database.collection("users").doc(uid).set({
    uid: uid,
    username: displayName,
    usernameLC: usernameLC,
    avatar: photoURL,
    email: email.toLowerCase(),
  });
};

export const isUsernameAvalaible = (username) => {
  return database
    .collection("users")
    .where(`usernameLC`, "==", username.toLowerCase())
    .limit(1)
    .get()
    .then((doc) => {
      return !(doc.docs.length > 0);
    });
};

export const updateUsernameFromFirebase = (username) => {
  auth.currentUser.updateProfile({
    displayName: username,
  });

  return database
    .collection("users")
    .doc(auth.currentUser.uid)
    .update({
      username: username,
      usernameLC: username.toLowerCase(),
    })
    .then(console.log("updated succesfully"))
    .catch(console.log("update unsuccesfully"));
};

export const updateUserAvatar = (imageURL) => {
  auth.currentUser
    .updateProfile({
      photoURL: imageURL,
    })
    .then(() => console.log("auth succesfully updated"))
    .catch((e) => console.log(e));

  return database
    .collection("users")
    .doc(auth.currentUser.uid)
    .update({
      avatar: imageURL,
    })
    .then(console.log("updated succesfully"))
    .catch(console.log("update unsuccesfully"));
};

export const uploadAvatarImage = (file) => {
  const ref = firebase.storage().ref(`/avatars/${auth.currentUser.uid}`);
  const task = ref.put(file);
  return task;
};

export const uploadAvatarImageTemp = (file) => {
  const ref = firebase.storage().ref(`/avatars/${auth.currentUser.uid}temp`);
  const task = ref.put(file);
  return task;
};

//USER FUNCTIONS - END

export const updateDeckName = (deckId, newName) => {
  return userRef
    .collection("decks")
    .doc(deckId)
    .update({
      name: newName,
    })
    .then(() => {
      console.log("Document successfully updated!");
    })
    .catch(() => {
      console.log("An error ocurred while updating deck");
    });
};

export const getUserByEmail = (email) => {
  return database
    .collection("users")
    .where("email", "==", email.toLowerCase())
    .get()
    .then((docs) => {
      if (docs.docs.length > 0) {
        return docs.docs[0].data();
      } else {
        return null;
      }
    })
    .catch((error) => {
      return error;
    });
};

export const updateDeckDescription = (deckId, newDescription) => {
  return userRef
    .collection("decks")
    .doc(deckId)
    .update({
      description: newDescription,
    })
    .then(() => {
      console.log("Document successfully updated!");
    })
    .catch(() => {
      console.log("An error ocurred while updating deck");
    });
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
      callback(decks);
    });
};

export { auth, database };

//////////////////////
// ** V2 client ** ///
//////////////////////

export const createCardV2 = (deckId, front, back) => {
  const intervalData = {
    n: 0,
    EF: 2.5,
    I: 0,
    nextTimestamp: firebase.firestore.Timestamp.now(),
  };

  //card States:
  // 0 created
  // 1 studied
  // 2 learned

  return userRef
    .collection("cards")
    .add({
      front: front,
      back: back,
      createdAt: firebase.firestore.Timestamp.now(),
      fromDeck: deckId,
      author: userRef,
      intervalData: intervalData,
      status: 0,
      timestamp: firebase.firestore.Timestamp.now(),
    })
    .then((algo) => {
      return userRef
        .collection("cards")
        .doc(algo.id)
        .get()
        .then((doc) => {
          const docId = doc.id;
          return { docId, ...doc.data() };
        });
    })
    .catch((error) => {
      console.log("error");
      console.log(error);
    });
};

export const createDeckV2 = (
  idDeckParent = null,
  name,
  description = "",
  publicDeck
) => {
  return userRef
    .collection("decks")
    .add({
      name: name,
      description: description,
      createdAt: firebase.firestore.Timestamp.now(),
      parentDeckId: idDeckParent,
      author: userRef,
      isPublic: publicDeck,
    })
    .then(console.info("deck created v2"))
    .catch((e) => {
      console.log(e.message);
    });
};

export const listenForDeckV2 = (id, callback) => {
  return userRef
    .collection("decks")
    .doc(id)
    .onSnapshot(
      (doc) => {
        if (doc.data()) {
          const id = doc.id;
          callback({ ...doc.data(), id });
        } else {
          callback(null);
        }
      },
      (error) => {
        console.log(error);
      }
    );
};

export const listenForDecksV2 = (parentDeckId = null, callback) => {
  return (
    userRef
      .collection("decks")
      .where("parentDeckId", "==", parentDeckId)
      //.orderBy("name", "asc")
      .onSnapshot(
        (doc) => {
          var decks = [];
          doc.docs.forEach((doc) => {
            const id = doc.id;
            decks.push({ ...doc.data(), id });
          });
          callback(decks);
        },
        (error) => {
          console.log(error);
          console.log(error.message);
          callback(error.message);
        }
      )
  );
};

export const listenForCardsV2 = (deckId, callback) => {
  return userRef
    .collection("cards")
    .where("fromDeck", "==", deckId)
    .onSnapshot((doc) => {
      var cards = [];
      doc.docs.forEach((doc) => {
        const id = doc.id;
        cards.push({ ...doc.data(), id });
      });
      callback(cards);
    });
};

export const removeDecksV2 = (id) => {
  removeDeckV2(id);
  removeCardsV2(id);

  return userRef
    .collection("decks")
    .where("parentDeckId", "==", id)
    .get()
    .then((doc) => {
      doc.docs.forEach((doc) => {
        removeDecksV2(doc.id);
      });
    });
};

export const removeDeckV2 = (id) => {
  return userRef
    .collection("decks")
    .doc(id)
    .delete()
    .then(() => {})
    .catch((error) => {
      console.error(error);
    });
};

const removeCardsV2 = (deckId) => {
  userRef
    .collection("cards")
    .where("fromDeck", "==", deckId)
    .get()
    .then((doc) => {
      doc.docs.forEach((doc) => {
        removeCardV2(doc.id);
      });
    });
};

const removeCardV2 = (id) => {
  userRef
    .collection("cards")
    .doc(id)
    .delete()
    .then(() => {
      console.log("card deleted");
    })
    .catch((error) => {
      console.error(error);
    });
};

export const getCardsForStudyV2 = (id) => {
  return userRef
    .collection("cards")
    .where("fromDeck", "==", id)
    .get()
    .then((docs) => {
      var cards = [];

      docs.docs.map((doc) => {
        const docId = doc.id;
        cards.push({ id: docId, ...doc.data() });
      });

      return userRef
        .collection("decks")
        .where("parentDeckId", "==", id)
        .get()
        .then((docs) => {
          if (docs.docs.length === 0) {
            return cards;
          } else {
            let promises = docs.docs.map((doc) => {
              return getCardsForStudyV2(doc.id);
            });

            return Promise.all(promises).then((resolved) => {
              var resolvedDestructured = [];
              resolved.map((item) => {
                item.map((subitem) => {
                  resolvedDestructured.push(subitem);
                });
              });

              return [...cards, ...resolvedDestructured];
            });
          }
        });
    });
};

export const UpdateIntervalDataCard = (
  cardID,
  n,
  EF,
  I,
  nextIntervalDate,
  status
) => {
  const intervalData = {
    n: n,
    EF: EF,
    I: I,
    nextTimestamp: firebase.firestore.Timestamp.fromDate(nextIntervalDate),
  };

  return userRef
    .collection("cards")
    .doc(cardID)
    .update({
      intervalData: intervalData,
      status: status,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
      return true;
    })
    .catch((error) => {
      return error;
    });
};
