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
        apiKey: "AIzaSyDzcNgBfMZPtKvcsvT233oy5aF7W5ZKldY",
        authDomain: "web-project-64-31.firebaseapp.com",
        projectId: "web-project-64-31",
        storageBucket: "web-project-64-31.appspot.com",
        messagingSenderId: "36041056853",
        appId: "1:36041056853:web:71916a2d990cafea9eaadc"
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
            //check if the user already exists in the database
            let data = await this.getDataFromNodeByUid("users");
            if (!data) {
                //if not create a new document in the users node
                await this.updateOrCreateDocument("users", {
                    pseudo: user.displayName,
                    lastConnection: firestore.serverTimestamp(),
                },undefined, true);
            }else{
                data.lastConnection = firestore.serverTimestamp();
                data.pseudo = user.displayName;
                await this.updateOrCreateDocument("users", data,undefined, false);
            }

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


    async saveCurrentLevel(levelName, currentPlayerState) {
        if (!this.isUserSignedIn()) {
            this.debug && console.log('user not signed in');
            return null;
        }
        this.debug && console.log("saving level",levelName,currentPlayerState);
        await this.updateOrCreateDocument("currentLevel", "name", levelName);

        //get old current level stats and archive them into the allTimeStats node
        let oldCurrentPlayerState = await this.getCurrentPlayerState();
        if (oldCurrentPlayerState) {
            console.log(oldCurrentPlayerState.currentPlayerState);
            await this.updateAllTimeStats(oldCurrentPlayerState.currentPlayerState);
        }
        
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
            if(data.score < currentPlayerStats.score) {
                data = currentPlayerStats;
                updateTime = true;
            }
        } else {
            data = currentPlayerStats;
            updateTime = true;
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
            this.debug && console.log("update time");
            data["time"] = firestore.serverTimestamp();
        }
        
        data["uid"] = this.auth.currentUser.uid;
    
        if (doc) {
            this.debug && console.log(`Document with the same UID already exists, updating...`);
            await firestore.updateDoc(doc.ref, data);
        } else {
            this.debug && console.log(`Document does not exist, creating...`);
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

    getCurrentUserName() {
        if (!this.isUserSignedIn()) {
            return null;
        }
        return this.auth.currentUser.displayName;
    }

    async getUserInfo() {
        if (!this.isUserSignedIn()) {
            return null;
        }
        //get the user document and return it
        let userData = await this.getDataFromNodeByUid("users");
        
        return userData;
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

    async getNodeFromDatabase(node, orderBy = null,orderByASC = true, limit = null) {
        if (!this.isUserSignedIn()) {
            return null;
        }

        let nodeCollectionRef = firestore.collection(this.db, node);

        if (orderBy) {
            nodeCollectionRef = firestore.query(nodeCollectionRef, firestore.orderBy(orderBy, orderByASC ? "asc" : "desc"));
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

    async getDataFromNodeByUid(node,uid = null) {
        if (!this.isUserSignedIn()) {
            return null;
        }
        const nodeCollection = firestore.collection(this.db, node);
        if(uid == null){
            uid = this.auth.currentUser.uid;
        }
        const query = firestore.query(nodeCollection, firestore.where("uid", "==", uid));
        const querySnapshot = await firestore.getDocs(query);
    
        if (querySnapshot.empty) {
            this.debug && console.log("No matching documents.");
            return null;
        } else {
            let data = querySnapshot.docs[0].data();
            delete data.time;
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

    async resetAllTimeStats() {
        if (!this.isUserSignedIn()) {
            return null;
        }
        const doc = await this.getDocFromDatabase("allTimeStats");
        if (doc) {
            await firestore.deleteDoc(doc.ref);
            this.debug && console.log("Document of the allTimeStats node "+doc.ref+" deleted");
        }
    }

    async resetHighestStats() {
        if (!this.isUserSignedIn()) {
            return null;
        }
        const doc = await this.getDocFromDatabase("highestStats");
        if (doc) {
            await firestore.deleteDoc(doc.ref);
            this.debug && console.log("Document of the highestStats node "+doc.ref+" deleted");
        }
    }

    async getCurrentPlayerState() {
        return await this.getDataFromNodeByUid("currentPlayerState");
    }

    async getCurrentLevel() {
        return await this.getDataFromNodeByUid("currentLevel");
    }

    async updateLocation(location) {
        if (!this.isUserSignedIn()) {
            return null;
        }
        // create an object with the latitude, longitude and accuracy
        let localisation = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            altitude: location.coords.altitude,
            accuracy: location.coords.accuracy
        };
        // get the user document and update the localisation
        let userData = await this.getDocFromDatabase("users");
        let userDoc = userData.data();
        userDoc.localisation = localisation;
        await this.updateOrCreateDocument("users", userDoc,undefined, false);
    }

    async updatePlayerSkinPath(skinPath) {
        if (!this.isUserSignedIn()) {
            return null;
        }
        // get the user document and update the localisation
        let userData = await this.getDocFromDatabase("users");
        let userDoc = userData.data();
        userDoc.skinPath = skinPath;
        await this.updateOrCreateDocument("users", userDoc,undefined, true);
    }

    async getPlayerSkinPath() {
        if (!this.isUserSignedIn()) {
            return null;
        }
        // get the user document and update the localisation
        let userData = await this.getDocFromDatabase("users");
        let userDoc = userData.data();
        return userDoc.skinPath;
    }

    async updateSkinColor(skinColor) {
        if (!this.isUserSignedIn()) {
            return null;
        }
        // get the user document and update the localisation
        let userData = await this.getDocFromDatabase("users");
        let userDoc = userData.data();
        userDoc.skinColor = skinColor;
        await this.updateOrCreateDocument("users", userDoc,undefined, true);
    }
    
    async getCurrentScore() {
        const data = await this.getDataFromNodeByUid("currentPlayerState");
        return data ? data.currentPlayerState.score : 0;
    }
    
    async getHighestStats() {
        return await this.getDataFromNodeByUid("highestStats");
    }

    async getLeaderboard() {
        let data = await this.getNodeFromDatabase("highestStats", "score", false,18);
        let usernames = [];
        data = data.filter((player) => {
            return player.score > 0;
        });

        for (let i = 0; i < data.length; i++) {
            let userData = await this.getDataFromNodeByUid("users",data[i].uid);
            usernames.push(userData.pseudo);
        }
        return [data,usernames];
    }
}

let firebase = new Firebase();
firebase.init();

export default firebase;
