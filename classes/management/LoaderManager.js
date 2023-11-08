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
                const level = data;
                //declare the 4 main categories
                var information = level.information;
                var player_info = level.player_info;
                var objects = level.objects;
                var enemies = level.enemies;

                if(debug){
                    console.log(information);
                    console.log(player_info);
                    console.log(objects);
                    console.log(enemies);
                }
                //resolve the promise with the data
                resolve([information,player_info,objects,enemies]); 
            });
        }); 
    }

    static loadPlayerFromJSON(jsonFile,debug=false) {
        // Load the level from a JSON file create a promise and return it
        return new Promise((resolve) => {
            //parse the data into a JSON object
            this.loadFromJson(jsonFile).then((data) =>{
                const player_data = data;
                //declare the 4 main categories
                var player_info = [];
                
                player_info = data.player_info;

                debug ? console.log(player_info) : null;
                //resolve the promise with the data
                resolve(player_info);
            
            });
        });
    }

    /**
     * 
     * @deprecated need to be updated to the new JSON format and the new level format
     */
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
                const startScreen_data = data;
                //declare the 4 main categories
                let information = data.information;
                let objects = data.objects;
                //get dynamically the data from the JSON file
                
                debug ? console.log(information) : null;
                debug ? console.log(objects) : null;
                //resolve the promise with the data
                resolve([information,objects]);
            });
           
        });

    }

    static loadFromJson(jsonFile){
        return new Promise((resolve) => {
            fetch(jsonFile)
            .then((response) => response.json())
            .then((json) => {
                resolve(json);
            });
        });
    }
}

export default LoaderManager;