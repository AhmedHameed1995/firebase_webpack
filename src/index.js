import { initializeApp } from 'firebase/app'
import {
    getFirestore, collection, onSnapshot, 
    addDoc, deleteDoc, doc,
    query, where,
    orderBy, serverTimestamp,
    getDoc, updateDoc
} from 'firebase/firestore'
import { 
    getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged
} from 'firebase/auth' 


const firebaseConfig = {
    apiKey: "AIzaSyCKutpmdAksJRgaxFUHIK4mCOCVQdxja88",
    authDomain: "fir-9-dev.firebaseapp.com",
    projectId: "fir-9-dev",
    storageBucket: "fir-9-dev.appspot.com",
    messagingSenderId: "500382459665",
    appId: "1:500382459665:web:7825fb1b824ad841304eb0"
};

// init firebase app
initializeApp(firebaseConfig)

// init services
const db = getFirestore()
const auth = getAuth()

// collection ref
const colRef = collection(db, 'books')

// queries 
// const q = query(colRef)
// const q = query(colRef, where("author", "==", "Jemmy"))
// const q = query(colRef, where("author", "==", "Jemmy"), orderBy('title', 'desc'))
const q = query(colRef, orderBy('createdAt', 'asc'))

// get collection data

// getDocs(colRef)
// .then((snapshot) => {
//     let books = []
//     // console.log(snapshot.docs)
//     snapshot.docs.forEach((doc) => {
//         // console.log(doc);
//         books.push({ ...doc.data(), id: doc.id })
//         // console.log(doc.data());
//     })
//     console.log(books)
// })
// .catch(err => {
//     console.log(err.message)
// })

// get Real time collection data 
const unsubCol = onSnapshot(q, (snapshot) => {
    let books = []
    // console.log(snapshot.docs)
    snapshot.docs.forEach((doc) => {
        // console.log(doc);
        books.push({ ...doc.data(), id: doc.id })
        // console.log(doc.data());
    })
    console.log(books)
})

// add documents
const addBookForm = document.querySelector('.add')
addBookForm.addEventListener('submit', (e) => {
    e.preventDefault()
    addDoc(colRef, {
        title: addBookForm.title.value,
        author: addBookForm.author.value,
        createdAt: serverTimestamp()
    }).then(() => {
        addBookForm.reset()
    })
})

// delete documents
const deleteBookForm = document.querySelector('.delete')
deleteBookForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const docRef = doc(db, 'books', deleteBookForm.id.value)

    deleteDoc(docRef)
    .then(() => {
        deleteBookForm.reset()
    })
})

// get a single document
const docRef = doc(db, 'books','aJ6xi7nNMtwBcu4yCncM')

// getDoc(docRef)
//     .then((doc) => {
//         console.log(doc.data(), doc.id)
//     })

const unsubDoc = onSnapshot(docRef, (doc) => {
    console.log(doc.data(), doc.id)
})

// update document
const updateBookForm = document.querySelector('.update')
updateBookForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const docRef = doc(db, 'books', updateBookForm.id.value)
    updateDoc(docRef, {
        title: 'updated title'
    })
    .then(() => {
        updateBookForm.reset();
    })
})

// Sign Up Users
const signupForm = document.querySelector('.signup')
signupForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = signupForm.email.value;
    const password = signupForm.password.value;
    
    createUserWithEmailAndPassword(auth, email, password)
        .then((cred) => {
            console.log('user created : ', cred.user)
            signupForm.reset()
        })
        .catch((err) => {
            console.log(err.message)
        })
})

// Login Users
const loginForm = document.querySelector('.login')
loginForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = loginForm.email.value;
    const password = loginForm.password.value;
    
    signInWithEmailAndPassword(auth, email, password)
        .then((cred) => {
            console.log('user logged in : ', cred.user)
            loginForm.reset()
        })
        .catch((err) => {
            console.log(err.message)
        })
})

// Logout Users
const logoutButton = document.querySelector('.logout')
logoutButton.addEventListener('click', (e) => {
    e.preventDefault()

    signOut(auth)
    .then(() => {
        console.log("The users signed out")
    })
    .catch((err) => {
        console.log(err.message)
    })
})

// Subscribing to auth changes
const unsubAuth = onAuthStateChanged(auth, (user) => {
    console.log('user status changed : ', user)
})

// UnSubscribing from changes (auth&db)
const unsubButton = document.querySelector('.unsub')
unsubButton.addEventListener('click', (e) => {
    e.preventDefault()
    console.log('unsubscribing')
    unsubCol()
    unsubDoc()
    unsubAuth()
})