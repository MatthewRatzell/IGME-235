// 1
window.onload = (e) => {document.querySelector("#search").onclick = searchButtonClicked};
	
// 2
let displayTerm = "";

// 3
function searchButtonClicked(){
    console.log("searchButtonClicked() called");
    
}

function searchButtonClicked()
{ 
console.log("searchButtonClicked() called"); 

//1
const GIPHY_URL = "https://api.giphy.com/v1/gifs/search?";

//2
let GIPHY_KEY = "dc6zaTOxFJmzC";

//3 build up our URL string
let url = GIPHY_URL;
url += "api_key=" + GIPHY_KEY;

//4 parse the user entered term we wish to search
let term = document.querySelector("#searchterm").value;
displayTerm = term;

//get rid of any leading and trailing spaces
term = term.trim();

//encode spaces and special characters
term = encodeURIComponent(term);

//if no term bail our of the function
if(term.length <1) return;

//append the search term to the url
url += "&q=" + term;

//grab the user chosen search limit from select and append it to the url
let limit = document.querySelector("#limit").value;
url += "&limit=" + limit;

//updating ui
document.querySelector("#status").innerHTML = "<b>Searching for '" + displayTerm + "'</b>";

//see what url looks like
console.log(url);

//12 
getData(url);
} 
function getData(url)
{
    //1 creating a new xhr object
    let xhr = new XMLHttpRequest();

    //setting onload handler
    xhr.onload = dataLoaded;

    //setting onerror handler
    xhr.onerror = dataError;

    //opening connection and sending request
    xhr.open("GET",url);
    xhr.send();
}
//callback functions
function dataLoaded(e){
    //e.target is xhr object
    let xhr = e.target;

    //xhr.responseText is the JSON file that was just downloaded
    console.log(xhr.responseText);

    //7 turn the text into a parsable JavaScript object 
    let obj = JSON.parse(xhr.responseText);

    //if there are no results, print a message and return
    if(!obj.data || obj.data.length == 0){
        document.querySelector("#status").innerHTML = "<b>No results found for '" + displayTerm + "'</b>";
        return;
    }
    //9 start building an html string we will display to the user
    let results = obj.data;
    console.log("results.length= "+ results.length);
    let bigString = "";

    //10 looping through array or results
    for(let i = 0; i<results.length;i++){
        let result = results[i];

        //get the url to the gif
        let smallURL = result.images.fixed_width_downsampled.url;
        if(!smallURL) smallURL = "images/no-image-found.png";
        //12
        let url = result.url;

        //13 build a div to hold each result 
        let line = `<div class = 'result'><img src ='${smallURL}' title = '${result.id}' />` ;
            line += `<span><a target ='_blank' href = '${url}'>View on Giphy</a>`;
             line += `<p>Rating: ${result.rating.toUpperCase()}</span>`
            line+= `</div>`;
        //add string to and div and loop
        bigString += line;

    }
    document.querySelector("#content").innerHTML = bigString;

    document.querySelector("#status").innerHTML = "<b>Success!</b><p><i>Here are " + results.length + " results for '" + displayTerm + "'</i></p>";

}
function dataError(e){
    console.log("An error occured");
}