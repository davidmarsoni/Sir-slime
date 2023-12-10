import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import * as auth from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { getStorage, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-storage.js";
import * as firestore from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

class Firebase {
    /**
     * https://firebase.google.com/docs/projects/api-keys?hl=fr#general-info
     * Habituellement, vous devez soigneusement protéger les clés API (par exemple, en utilisant un service de coffre-fort 
     * ou en définissant les clés comme variables d'environnement) ; cependant, les clés API pour les services Firebase 
     * peuvent être incluses dans le code ou dans les fichiers de configuration archivés.
     */
    static firebaseConfig = {
        apiKey: "AIzaSyATM5CdhhgVOKRQeCbEAgn9Exgb010aA5Q",
        authDomain: "testfirebase-ed228.firebaseapp.com",
        databaseURL: "https://testfirebase-ed228-default-rtdb.europe-west1.firebasedatabase.app/",
        projectId: "testfirebase-ed228",
        storageBucket: "testfirebase-ed228.appspot.com",
        messagingSenderId: "888520509044",
        appId: "1:888520509044:web:a7dc04859915c12caab321"
    };

    debug = false;
    app;
    auth;
    db;

    init() {
        this.app = initializeApp(Firebase.firebaseConfig);
        this.auth = auth.getAuth(this.app);
        this.db = firestore.getFirestore(this.app);
    }

    async signIn() {
        const googleAuthProvider = new auth.GoogleAuthProvider();
        try {
            const authResult = await auth.signInWithPopup(this.auth, googleAuthProvider);
            const user = authResult.user;
            this.debug && console.log(user);
            await this.updateOrCreateUserDocument(user);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    async signOut() {
        this.auth.signOut().then(() => {
            this.debug && console.log('sign out');
        }).catch((error) => {
            console.error(error);
        });
    }

    async updateOrCreateUserDocument(user) {
        const userDocument = await this.getDocFromDatabase("users");
        const usersCollection = firestore.collection(this.db, "users");

        if (userDocument) {
            this.debug && console.log("Document with the same UID already exists, updating...");
            await this.updateUserDocument(userDocument);
        } else {
            this.debug && console.log("Document does not exist, creating...");
            await this.createDocument(usersCollection, {
                time: firestore.serverTimestamp(),
                uid: this.auth.currentUser.uid,
                pseudo: user.displayName,
            });
        }
    }

    async updateUserDocument(docToUpdate) {
        await firestore.updateDoc(docToUpdate.ref, {
            time: firestore.serverTimestamp(),
            uid: this.auth.currentUser.uid,
            pseudo: this.auth.currentUser.displayName,
        });
    }

    async saveCurrentLevel(levelName, currentPlayerState) {
        if (!this.isUserSignedIn()) {
            this.debug && console.log('user not signed in');
            return null;
        }
        this.debug && console.log("saving level",levelName,currentPlayerState);
        await this.updateOrCreateDocument("currentLevel", "name", levelName);
        await this.updateOrCreateDocument("currentPlayerState", "currentPlayerState", currentPlayerState);
        this.debug && console.log("level saved") ;
    }

    async updateAllTimeStats(currentPlayerStats) {
        if (!this.isUserSignedIn()) {
            this.debug && console.log('user not signed in') ;
            return null;
        }
        //get previous stats and add the new ones

        const doc = await this.getDocFromDatabase("allTimeStats");
        let data = {};
        if (doc) {
            data = doc.data();
            //increment each value of the stats by the new ones dinamically
            for (const [key, value] of Object.entries(currentPlayerStats)) {
                data[key] = data[key] + value;
            }
        }
        else {
            data = currentPlayerStats;
        }

        await this.updateOrCreateDocument("allTimeStats", data);
    }

    async updateHighestStats(currentPlayerStats) {
        if (!this.isUserSignedIn()) {
            console.error('user not signed in');
            return null;
        }
        //get previous stats and get the score if the score is higher than the previous one
        //update the the whole stats

        const doc = await this.getDocFromDatabase("highestStats");
        let data = {};
        let updateTime = false;
        if (doc) {
            data = doc.data();
            console.log(data.score, currentPlayerStats.score, data.score < currentPlayerStats.score);
            if(data.score < currentPlayerStats.score) {
                data = currentPlayerStats;
                updateTime = true;
            }
        }
        else {
            data = currentPlayerStats;
        }

        await this.updateOrCreateDocument("highestStats", data,undefined, updateTime);
    }

    async updateOrCreateDocument(collection, field, value,updateTime = true) {
        const doc = await this.fileExistInCollection(collection);
        let data = {};
    
        if (typeof field === 'object') {
            data = { ...field };
        } else if (value !== undefined) {
            data[field] = value;
        }
    
        if (updateTime){
            console.log("update time");
            data["time"] = firestore.serverTimestamp();
        }
        
        data["uid"] = this.auth.currentUser.uid;
    
        if (doc) {
            console.log(`Document with the same UID already exists, updating...`);
            await firestore.updateDoc(doc.ref, data);
        } else {
            console.log(`Document does not exist, creating...`);
            const collectionRef = firestore.collection(this.db, collection);
            await this.createDocument(collectionRef, data);
        }
    }

    isUserSignedIn() {
        if(this.auth.currentUser != null){
            this.debug && console.log('user signed in');
            return true;
        }
        this.debug && console.log('user not signed in');
        return false;
    }

    getUserInfo() {
        if (!this.isUserSignedIn()) {
            return null;
        }
        return this.auth.currentUser.displayName;
    }

    async getDocFromDatabase(node) {
        if (!this.isUserSignedIn()) {
            return null;
        }

        const nodeCollection = firestore.collection(this.db, node);
        const query = firestore.query(nodeCollection, firestore.where("uid", "==", this.auth.currentUser.uid));
        const querySnapshot = await firestore.getDocs(query);

        if (querySnapshot.empty) {
            this.debug && console.log("No matching documents.");
            return null;
        } else {
            this.debug && console.log("Document id:", querySnapshot.docs[0].id);
            return querySnapshot.docs[0];
        }
    }

    async fileExistInCollection(collection) {
        if (!this.isUserSignedIn()) {
            return null;
        }

        const collectionRef = firestore.collection(this.db, collection);
        const query = firestore.query(collectionRef, firestore.where("uid", "==", this.auth.currentUser.uid));
        const querySnapshot = await firestore.getDocs(query);

        if (querySnapshot.empty) {
            this.debug && console.log("No matching documents.");
            return null;
        } else {
            this.debug && console.log("Document id:", querySnapshot.docs[0].id);
            return querySnapshot.docs[0];
        }
    }

    async createDocument(collectionRef, data) {
        this.debug && console.log(data);
        if (typeof data !== 'object' || data === null) {
            console.error("Invalid data: ", data);
            return;
        }
    
        try {
            const docRef = await firestore.addDoc(collectionRef, data);
            this.debug && console.log("Document written with ID: ", docRef.id);
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    }

    async getNodeFromDatabase(node, orderBy = null, limit = null) {
        if (!this.isUserSignedIn()) {
            return null;
        }

        let nodeCollectionRef = firestore.collection(this.db, node);

        if (orderBy) {
            nodeCollectionRef = firestore.query(nodeCollectionRef, firestore.orderBy(orderBy));
        }
        if (limit) {
            nodeCollectionRef = firestore.query(nodeCollectionRef, firestore.limit(limit));
        }

        const querySnapshot = await firestore.getDocs(nodeCollectionRef);

        let data = [];
        querySnapshot.forEach((doc) => {
            data.push(doc.data());
        });
        return data;
    }

    async getDataFromNodeByUid(node) {
        if (!this.isUserSignedIn()) {
            return null;
        }
    
        const nodeCollection = firestore.collection(this.db, node);
        const query = firestore.query(nodeCollection, firestore.where("uid", "==", this.auth.currentUser.uid));
        const querySnapshot = await firestore.getDocs(query);
    
        if (querySnapshot.empty) {
            this.debug && console.log("No matching documents.");
            return null;
        } else {
            let data = querySnapshot.docs[0].data();
            delete data.time;
            delete data.uid;
            return data;
        }
    }
    
    async getAllDataFromNode(node) {
        if (!this.isUserSignedIn()) {
            return null;
        }
    
        const nodeCollection = firestore.collection(this.db, node);
        const querySnapshot = await firestore.getDocs(nodeCollection);
        console.log(querySnapshot);
       
        let data = [];
        querySnapshot.forEach((doc) => {
            let docData = doc.data();
            delete docData.time;
            delete docData.uid;
            data.push(docData);
        });
        return data;
    }

    async resetCurrentState() {
        if (!this.isUserSignedIn()) {
            return null;
        }

        const doc = await this.getDocFromDatabase("currentPlayerState");
        if (doc) {
         
            await firestore.deleteDoc(doc.ref);
            this.debug && console.log("Document of the currentPlayerState node"+doc.ref+" deleted");
        }
        const doc2 = await this.getDocFromDatabase("currentLevel");
        if (doc2) {
            await firestore.deleteDoc(doc2.ref);
            this.debug && console.log("Document of the currentLevel node "+doc2.ref+" deleted");
        }

    }

    async getCurrentPlayerState() {
        return await this.getDataFromNodeByUid("currentPlayerState");
    }

    async getCurrentLevel() {
        return await this.getDataFromNodeByUid("currentLevel");
    }
}

let firebase = new Firebase();
firebase.init();

export default firebase;
