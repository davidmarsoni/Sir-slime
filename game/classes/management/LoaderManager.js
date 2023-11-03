import {Information_list,player_list,objects_list,ennemies_list,startScreen_list} from "./constant.js";

class LoaderManager{
    /**
     * This function loads a level from a JSON file
     * @param {*} jsonFile the relative path to the JSON file
     * @returns a promise that contains the level data into 4 main categories
     */
    static loadLevelFromJSON(jsonFile,debug=false) {
        return new Promise((resolve) => {
            //parse the data into a JSON object
            this.loadFromJson(jsonFile).then((data) =>{
                const level = JSON.parse(data);
                //declare the 4 main categories
                var Information =[];
                var player_info = [];
                var objects = [];
                var ennemies = [];
        
                //get dynamically the data from the JSON file
                for(let i = 0; i < level.length; i++){
                    //get the name of the property
                    const propertyNameFull = Object.keys(level[i])[0];
                    const propertyName = propertyNameFull.replace(/[^a-zA-Z0-9 ]/g, '');
                    //console.log(propertyName);
                    if(Information_list.includes(propertyName)){
                        Information.push(level[i]);  
                    }
                    if(player_list.includes(propertyName)){
                        player_info.push(level[i]);
                    }
                    if(objects_list.includes(propertyName)){
                        objects.push(level[i]);
                    }
                    if(ennemies_list.includes(propertyName)){
                        ennemies.push(level[i]);
                    }
                }
                if(debug){
                    console.log(Information);
                    console.log(player_info);
                    console.log(objects);
                    console.log(ennemies);

                }
                //resolve the promise with the data
                resolve([Information,player_info,objects,ennemies]); 
            })
        }); 
    }

    static loadPlayerFromJSON(jsonFile,debug=false) {
        // Load the level from a JSON file create a promise and return it
        return new Promise((resolve) => {
            //parse the data into a JSON object
            this.loadFromJson(jsonFile).then((data) =>{
                const player_data = JSON.parse(data);
                //declare the 4 main categories
                var player_info = [];
                
                //get dynamically the data from the JSON file
                for(let i = 0; i < player_data.length; i++){
                    //get the name of the property
                    const propertyNameFull = Object.keys(player_data[i])[0];
                    const propertyName = propertyNameFull.replace(/[^a-zA-Z0-9 ]/g, '');
                    //console.log(propertyName);
                    if(player_list.includes(propertyName)){
                        player_info.push(player_data[i]);
                    }
                }
                debug ? console.log(player_info) : null;
                //resolve the promise with the data
                resolve(player_info);
            
            });
        });
    }



    static saveLevelToJSON(levelName, levelAuthor,player,...elements) {
        const jsonData = [];
        jsonData.push({
            name: levelName
        });
        jsonData.push({
            levelAuthor: levelAuthor
        });
        jsonData.push({
            player: player
        });

        for (let i = 0; i < elements[0].length; i++) {
            jsonData.push({
                platform: elements[0][i]
            });
        }
        for(let i = 0; i < elements[1].length; i++){
            jsonData.push({
                patrolman: elements[1][i]
            });
        }
        for(let i = 0; i < elements[2].length; i++){
            jsonData.push({
                colisionBlock: elements[2][i]
            });
        }
        //TODO : add the other objects in this code juste to create a JSON file rapidly
    
        const jsonFile = JSON.stringify(jsonData);
        console.log(jsonFile);
        
        //save by creating a donloaded file
        const file =  new Blob([jsonFile], {type: "application/json"})
        const a = document.createElement("a");
        a.href = URL.createObjectURL(file);
        console.log(a);
        a.download = levelName+".json";
        a.click();
    }

    static loadStartScreenFromJSON(filename,debug = false){
        // Load the level from a JSON file create a promise and return it
        return new Promise((resolve) => {
            //parse the data into a JSON object
            this.loadFromJson(filename).then((data) =>{
                const startScreen_data = JSON.parse(data);
                //declare the 4 main categories
                var startScreen_info = [];
                
                //get dynamically the data from the JSON file
                for(let i = 0; i < startScreen_data.length; i++){
                    //get the name of the property
                    const propertyNameFull = Object.keys(startScreen_data[i])[0];
                    const propertyName = propertyNameFull.replace(/[^a-zA-Z0-9 ]/g, '');
                    //console.log(propertyName);
                    if(startScreen_list.includes(propertyName)){
                        startScreen_info.push(startScreen_data[i]);
                    }
                }
                debug ? console.log(startScreen_info) : null;
                //resolve the promise with the data
                resolve(startScreen_info);
            
            });
        });

    }

    static loadFromJson(jsonFile){

        // TODO : add test if file existe 
        // first keep only the folder path
        // search for the file in the folder
        // if the file doesn't exist return an error
        
        return new Promise((resolve) => {
            //create a new XMLHttpRequest to read the file
            const xhr = new XMLHttpRequest();
            //set the responseType to text
            xhr.open('GET', jsonFile);
            xhr.responseType = 'text';
            //onload check if the status is 200 (susscesfull) get the data and parse it
            xhr.onload = () => {
                if(xhr.status === 200) {
                    resolve(xhr.responseText);
                }
            }
            xhr.onerror = () => {
                //reject the promise with a error
                reject(new Error(`Failed to load JSON file: ${jsonFile}`));
            };

            // send the request
            xhr.send();
        });
    }
}

export default LoaderManager;