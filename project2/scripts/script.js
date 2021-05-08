 ///////////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////////////////////
        //declaring a constant we need to preserve what the user last entered
        const searchField = document.querySelector("#search");
        //creating something to hold our search term
        const prefix = "mjr4427-";
        const searchKey = prefix + "name";
        //getting what is stored at launch
        const storedSearch = localStorage.getItem(searchKey);
        // if we find a previously set name value, display it
        if (storedSearch){
	        searchField.value = storedSearch;
        }else{
	        searchField.value = "Turbo"; 
        }
        //adding the event listener
        searchField.onchange = e=>{ localStorage.setItem(searchKey, e.target.value); };
        ///////////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////////////////////
        
        ////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////
        //making sure we habe a global variable to work with our next and previous functions and keeping it in local storage
        localStorage.setItem('pageIndexer', 0);
        //array to hold our favorites
        favroites = JSON.parse(localStorage.getItem('favorites'));

        let APIKEY = "Ec2rZZrwkk9itstC9FfoTRGIjhp0YFEM";
        //adding an event listener for our project

        document.addEventListener("DOMContentLoaded",init);
        //grabbing html referance where the images will belong

        let out = document.querySelector('.out');
        //grabbing referance we need to our one header
        let favoritesHeader = document.querySelector('#dynamicID');
        //function that is called on domcontent loaded
        let innerHTMLOfRating = document.querySelector('.dropbtn');
        let currentSelectedRating = "R";

        //grabbing our loader
        let loader = document.querySelector('.loader');

        function init(ev)
        {
            loadR();
            document.getElementById("loadFavorites").addEventListener("click",ReCreateFavorites);
            /////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////
            /////////////////////////////////////////////////////////////////

            /////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////
            /////////////////////////////////////////////////////////////////
            //using arrow notation so when our button is clicked it called out magic function
            document.getElementById("btnSearch").addEventListener("click", search);
            ev.preventDefault();
        }
                
        function ReCreateFavorites(ev)
        {
                //hiding some buttons
                document.getElementById("Previous").style.display = "none";
                document.getElementById("Next").style.display = "none";
                favoritesHeader.innerHTML = "Favorite Images";
                //stopping the page from reloading
                ev.preventDefault();
                //removing the iomages currently on the screen
                out.innerHTML = "";
                numberOfFavorites = JSON.parse(localStorage.getItem('favorites')).length;
                //redisplaying the correct images
                for(let i = 0;i<numberOfFavorites;i++)
                    {
                        //creating the html we need to store what we got
                        let fig = document.createElement('figure');
                        let img = document.createElement('img');
                        
                        
                        //setting our images source to the correct data
                        reCreatedFavorites = JSON.parse(localStorage.getItem('favorites'));
                        img.src = reCreatedFavorites[i];
                        img.width = 300;
                        img.height = 300;
                        //adding our img data to our figure
                        fig.appendChild(img);                      
                        out.appendChild(fig);
                        fig.appendChild(document.createElement('br'));


                        let removeFromFavorites = document.createElement('button');


                        removeFromFavorites.innerHTML = "Remove";
                        removeFromFavorites.addEventListener("click",e=>{
                            const index = favroites.indexOf(e);
                            favroites.splice(index,);
                            localStorage.setItem('favorites',JSON.stringify(favroites)); 
                            removeFromFavorites.style.backgroundColor = "red";
                        });
                        fig.appendChild(removeFromFavorites);
                    } 
                    //adding a button to the end of our favorites that will allow for removal
                    let acceptButton = document.createElement('button');
                    acceptButton.innerHTML = "Reload";
                    out.appendChild(acceptButton);
                    acceptButton.addEventListener("click",ev=>{
                        ReCreateFavorites(ev);
                    });

        }
        
        function search(ev)
        {
                favroites = JSON.parse(localStorage.getItem('favorites'));
                //hiding some buttons
                document.getElementById("Previous").style.display = "inline";
                document.getElementById("Next").style.display = "inline";
                //resetting favorites if neccessary
                favoritesHeader.innerHTML = "";
                //stopping the page from reloading
                //ev.preventDefault();
                //grabbing our url minus the search term
                let url = `https://api.giphy.com/v1/gifs/search?api_key=${APIKEY}&limit=10&offset=${parseInt(localStorage.pageIndexer)*10}&rating=${currentSelectedRating}&q=`;
                //now getting the term we searched for so we can add it to the end of our url
                let str = document.getElementById("search").value.trim();
                //doing string addition so that our search term is now part of our line
                url = url.concat(str);
                console.log(url);
                out.innerHTML = "";
                //requesting a resource
                fetch(url)
                //getting the response from the json
                .then(response =>response.json())
                //getting the data we actually want from the response
                .then(content=>{
                    //outputting our info to console for testing
                    console.log(content.data);
                    //for loop to grab all the results 
                    for(let i = 0;i<content.data.length;i++)
                    {
                        //creating the html we need to store what we got
                        let fig = document.createElement('figure');
                        let img = document.createElement('img');
                        //setting our images source to the correct data
                        img.src = content.data[i].images.downsized.url;
                        img.width = 308;
                        img.height = 308;

                        //adding our img data to our figure
                        fig.appendChild(img);                      
                        out.insertAdjacentElement("afterbegin",fig);

                        //making sure we break for our buttons
                        fig.appendChild(document.createElement('br'));
                        //adding a button to our figure to add to favorites
                        let favroiteButton = document.createElement('button');
                        favroiteButton.innerHTML = "Add to Favorites";
                        fig.appendChild(favroiteButton);
                        favroiteButton.disabled = false;
                        //parsing through all of our images and if they are already favorited keep the button red to let the user know
                        for(let j =0;j<favroites.length;j++)
                        {
                            //if the source of this favorites exists anywhere in our localstorage 
                            if(favroites[j]==img.src)
                            {
                                favroiteButton.style.backgroundColor = "red";
                                favroiteButton.disabled = true;
                            }
                        }

                        //adding event listener to actively change the color of any favorited images on the screen
                        favroiteButton.addEventListener("click",ev=>{
                        favroiteButton.disabled = true;
                        favroiteButton.style.backgroundColor = "red";
                        //stopping the page from reloading
                        ev.preventDefault();
                        //when the button is click it will be added to our favorites list
                        favroites.push(img.src);
                        //adding this to our local storage
                        localStorage.setItem('favorites',JSON.stringify(favroites));        
                        });

                        //adding our copy to clipboard function
                        let copyToClipBoardButton = document.createElement('button');
                        copyToClipBoardButton.innerHTML = "Copy to Clipboard";
                        fig.appendChild(copyToClipBoardButton);
                        copyToClipBoardButton.addEventListener("click",ev=>{
                            let copyText = img.src.toString();
                            console.log(copyText);
                            navigator.clipboard.writeText(copyText);
                        });
                        
                    }               
                    
                })
                //in the small event that the server throws issues
                .catch(err=>{
                    console.error(err);
                });
        }
        function loadPrevious(ev)
        {
                //resetting favorites if neccessary
                favoritesHeader.innerHTML = "";
                //getting local data in an int
                let pageIndexer = parseInt(localStorage.getItem('pageIndexer'));
                if(pageIndexer >=1)
                {
                    //incrementing
                    pageIndexer--;
                    //resetting the value in storage
                    localStorage.setItem('pageIndexer',pageIndexer);
                }
                
                search(ev);
        }
        function loadNext(ev)
        {
                //resetting favorites if neccessary
                favoritesHeader.innerHTML = "";
                //stopping the page from reloading
                //ev.preventDefault();
                //getting local data in an int
                let pageIndexer = parseInt(localStorage.getItem('pageIndexer'));
                //incrementing
                pageIndexer++;
                //resetting the value in storage
                localStorage.setItem('pageIndexer',pageIndexer);
                console.log(localStorage.pageIndexer);

                search(ev);

        }
        function loadG(ev)
        {
                innerHTMLOfRating.innerHTML = "Max Rating:G";
                currentSelectedRating = "g";
        }
        function loadPG(ev)
        {
            innerHTMLOfRating.innerHTML = "Max Rating:PG";
            currentSelectedRating = "pg";
        }
        function loadPG13(ev)
        {
            innerHTMLOfRating.innerHTML = "Max Rating:PG-13";
            currentSelectedRating = "pg-13";
        }
        function loadR(ev)
        {
            innerHTMLOfRating.innerHTML = "Max Rating:R";
            currentSelectedRating = "r";
        }
        function loadALL(ev)
        {
            innerHTMLOfRating.innerHTML = "Max Rating:ALL";
            currentSelectedRating = "";
        }