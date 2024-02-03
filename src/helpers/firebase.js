import firebase from "firebase/compat/app";
import "firebase/compat/auth";

export default function firebaseConfig() {
    const config = {
        apiKey: "AIzaSyDBWS8iBqtPYNyo-zT1TNcConnl6NAoFCg",
        authDomain: "lib-school.firebaseapp.com",
    };

    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }

    const provider = {
        googleAuth: new firebase.auth.GoogleAuthProvider(),
        githubAuth: new firebase.auth.GithubAuthProvider(),
    };
    return provider;
}
