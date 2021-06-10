import firebase from 'firebase'

// import 'firebase/firestore'
// import 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyDeKcyHA_5L3MB_rCJ1I-8gSV9hFBHgXV0",
    authDomain: "activerecallapp.firebaseapp.com",
    projectId: "activerecallapp",
    storageBucket: "activerecallapp.appspot.com",
    messagingSenderId: "276942806108",
    appId: "1:276942806108:web:6ffd9fa1b52340c48b9a99",
    measurementId: "G-K95VWWN3GB"
}

if (!firebase.apps.length){
    const firebaseApp = firebase.initializeApp(firebaseConfig)
    console.log('Firebase was successfully init.')
}

const mapUserFromFirebaseAuth = (user) => {
    console.log(user)
    console.log('cliente')

    if(user){
        const {displayName, email, photoURL} = user

        return {
            username: displayName,
            email: email,
            avatar: photoURL
        }
    }

    return null
}

export const onAuthStateChanged = (onChange) => {
    return firebase.auth().onAuthStateChanged(user =>{
        const normalizedUser = mapUserFromFirebaseAuth(user)
        onChange(normalizedUser)
    })
}

export const loginWithGmail = () => {
    const gmailProvider = new firebase.auth.GoogleAuthProvider() 
    return firebase.auth().signInWithPopup(gmailProvider)
}

const auth = firebase.auth()

export { auth }
