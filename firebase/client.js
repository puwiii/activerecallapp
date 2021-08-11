import firebase from "firebase";

import decks from "pages/api/decks";
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

//dev
const firebaseConfig = {
  apiKey: "AIzaSyCJzbWGekUN17pTOGUZHnw3eCp8DSkqduc",
  authDomain: "active-recall-dev.firebaseapp.com",
  projectId: "active-recall-dev",
  storageBucket: "active-recall-dev.appspot.com",
  messagingSenderId: "74295123727",
  appId: "1:74295123727:web:b14bcc6103f5bdafd1e87a",
  measurementId: "G-NGE0F7QT5K",
};

if (!firebase.apps.length) {
  const firebaseApp = firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();

const database = firebase.firestore();

database.settings({
  ignoreUndefinedProperties: true,
  merge: true,
});

// let userRef = null;

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
    email: email,
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
  const user = database.collection("users").doc(auth.currentUser.uid);
  return user
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

export const updateDeckDescription = (deckId, newDescription) => {
  const user = database.collection("users").doc(auth.currentUser.uid);
  return user
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

export const createCard = (deckId, front, back) => {
  let user = database.collection("users").doc(auth.currentUser.uid);

  return database
    .collection("cards")
    .add({
      front: front,
      back: back,
      createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
      author: user,
    })
    .then((cardRef) => {
      console.log(cardRef);
      //setting the deckToAdd to their parent deck
      database
        .collection("decks")
        .doc(deckId)
        .update({
          cards: firebase.firestore.FieldValue.arrayUnion(cardRef),
        })
        .then(() => {
          console.log("Document successfully updated!");
        })
        .catch(() => {
          console.log("An error ocurred while updating deck");
        });
    })
    .catch((e) => {
      console.log(e.message);
    });
};

export const createDeck = (id, name, description = "") => {
  let user = database.collection("users").doc(auth.currentUser.uid);

  if (id) {
    let deckToAdd;

    return database
      .collection("decks")
      .add({
        name: name,
        description: description,
        createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
        cards: [],
        decks: [],
        author: user,
      })
      .then((deckObject) => {
        deckToAdd = deckObject;

        //setting the deckToAdd to their parent deck
        database
          .collection("decks")
          .doc(id)
          .update({
            decks: firebase.firestore.FieldValue.arrayUnion(deckToAdd),
          })
          .then(() => {
            console.log("Document successfully updated!");
          })
          .catch(() => {
            console.log("An error ocurred while updating deck");
          });
      })
      .catch((e) => {
        console.log(e.message);
      });
  } else {
    return database
      .collection("decks")
      .add({
        name: name,
        description: description,
        createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
        cards: [],
        decks: [],
        user: user,
        author: user,
      })
      .then(console.info("deck created"))
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
      callback(decks);
    });
};

export const listenForDeck = (id, setActualDecks, setDecks, setCards) => {
  database
    .collection("decks")
    .doc(id)
    .onSnapshot((data) => {
      const deck = data.data();
      setActualDecks(deck);

      if (deck) {
        listenForDecks(deck, setDecks);
        listenForCards(deck, setCards);
      }
    });
};

export const listenForCards = (deck, setCards) => {
  let promise = deck.cards.map((cardItem) => {
    return database
      .collection("cards")
      .doc(cardItem.id)
      .get()
      .then((doc) => {
        const id = doc.id;
        return { ...doc.data(), id };
      });
  });

  Promise.all(promise).then((array) => {
    setCards(array);
  });
};

export const listenForDecks = (deck, callback) => {
  let promise = deck.decks.map((deckItem) => {
    return database
      .collection("decks")
      .doc(deckItem.id)
      .get()
      .then((doc) => {
        const id = doc.id;
        return { ...doc.data(), id };
      });
  });

  Promise.all(promise).then((array) => {
    callback(array);
  });
};

export const clearDeckReference = (deckId, parentDeckId) => {
  console.log(`clearDeckReference >> ${parentDeckId}`);

  console.log(parentDeckId);
  if (parentDeckId === "none") {
    //  console.log("return true")
    return true;
  }

  const parentDeckRef = database.collection("decks").doc(parentDeckId);

  parentDeckRef.get().then((doc) => {
    const parentDeck = doc.data();

    const newDecks = parentDeck.decks.filter((deckItem) => {
      return deckItem.id !== deckId;
    });

    parentDeckRef.update({
      decks: newDecks,
    });
  });
};

export const removeDeck = (deckId) => {
  database
    .collection("decks")
    .doc(deckId)
    .get()
    .then((doc) => {
      const deck = doc.data();

      if (deck?.decks.length > 0) {
        deck.decks.forEach((deckItem) => {
          database
            .collection("decks")
            .doc(deckItem.id)
            .get()
            .then((doc) => {
              removeDeck(doc.id);
            });
        });
      }
      removeDeckFromFirestore(doc.id);
    });
};

const removeDeckFromFirestore = (deckId) => {
  database
    .collection("decks")
    .doc(deckId)
    .delete()
    .then(() => {})
    .catch((error) => {
      console.error(error);
    });
};

export { auth, database };

//////////////////////
// ** V2 client ** ///
//////////////////////

export const createCardV2 = (deckId, front, back) => {
  const user = database.collection("users").doc(auth.currentUser.uid);

  const intervalData = {
    n: 0,
    EF: 2.5,
    I: 0,
    nextTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
  };

  //card States:
  // 0 created
  // 1 studied
  // 2 learned

  return user
    .collection("cards")
    .add({
      front: front,
      back: back,
      createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
      fromDeck: deckId,
      author: user,
      intervalData: intervalData,
      status: 0,
    })
    .then((algo) => {
      return user
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
  const user = database.collection("users").doc(auth.currentUser.uid);
  return user
    .collection("decks")
    .add({
      name: name,
      description: description,
      createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
      parentDeckId: idDeckParent,
      author: user,
      isPublic: publicDeck,
    })
    .then(console.info("deck created v2"))
    .catch((e) => {
      console.log(e.message);
    });
};

export const listenForDeckV2 = (id, callback) => {
  const user = database.collection("users").doc(auth.currentUser.uid);

  return user
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
  const user = database.collection("users").doc(auth.currentUser.uid);

  return (
    user
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
  const user = database.collection("users").doc(auth.currentUser.uid);

  return user
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
  const user = database.collection("users").doc(auth.currentUser.uid);
  removeDeckV2(id);
  removeCardsV2(id);

  return user
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
  const user = database.collection("users").doc(auth.currentUser.uid);

  return user
    .collection("decks")
    .doc(id)
    .delete()
    .then(() => {})
    .catch((error) => {
      console.error(error);
    });
};

const removeCardsV2 = (deckId) => {
  const user = database.collection("users").doc(auth.currentUser.uid);

  user
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
  const user = database.collection("users").doc(auth.currentUser.uid);

  user
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
  const user = database.collection("users").doc(auth.currentUser.uid);

  // user
  //   .collection("cards")
  //   .where("fromDeck", "==", id)
  //   .get()
  //   .then((docs) => {
  //     docs.docs.map((doc) => {
  //       let cardId = doc.id;
  //       cards.push({ ...doc.data(), cardId });
  //     });
  //   });

  return user
    .collection("cards")
    .where("fromDeck", "==", id)
    .get()
    .then((docs) => {
      var cards = [];

      docs.docs.map((doc) => {
        const docId = doc.id;
        cards.push({ id: docId, ...doc.data() });
      });

      return user
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

          // if (docs.docs.length > 0) {
          //   docs.docs.map((doc) => {
          //     console.log("hago recursion");
          //     return getCardsForStudyV2(doc.id, cards);
          //   });
          // }

          // return cards;
        });
    });
};

export async function getCardsForStudy(id, toPrint = false) {
  const user = database.collection("users").doc(auth.currentUser.uid);

  let cards = [];

  const cardsFromDeck = await getCardsFromDeck(id);

  const cardsFromSubDecks = await user
    .collection("decks")
    .where("parentDeckId", "==", id)
    .get()
    .then((subDecks) => {
      var subCards = [];
      if (subDecks.docs.length > 0) {
        subDecks.docs.map((subDeck) => {
          getCardsForStudy(subDeck.id).then((result) => {
            if (result.length !== 0) subCards.push(...result);
          });
        });
      }

      return subCards;
    });

  if (toPrint) {
    console.log(cardsFromSubDecks);
    console.log(JSON.stringify(cardsFromSubDecks));
    console.log(cardsFromDeck);
  }

  cards.push(...cardsFromSubDecks);
  cards.push(...cardsFromDeck);

  return cards;
}

export async function getAllCardsFromDeck(id, callback) {
  callback(await getCardsForStudy(id, true));
}

const getCardsFromDeck = async (deckId) => {
  const user = database.collection("users").doc(auth.currentUser.uid);

  const cards = await user
    .collection("cards")
    .where("fromDeck", "==", deckId)
    .get()
    .then((docs) => {
      let array = [];
      docs.docs.map((doc) => {
        const docId = doc.id;
        array.push({ id: docId, ...doc.data() });
      });
      return array;
    });

  return cards;
};
