console.log("Let's get this party started!");
// apt_key: '3EnHmzCFlrafQKf1eSjURN0YngCGnB6H'

const form = document.querySelector('#form');

form.addEventListener('submit', async function(e){
    e.preventDefault();

    const input = document.querySelector('#input');
    let searchTerm = input.value;

    const num = Math.floor(Math.random() * 50);

    const res = await axios.get('http://api.giphy.com/v1/gifs/search', 
    {params: {
        q: searchTerm,
        api_key: '3EnHmzCFlrafQKf1eSjURN0YngCGnB6H'
    }});

    const gif = res.data.data[num];

    //Creates img element through JS & appends it to a div in the HTML
    //Allows for multiple gifs on one page
    const div = document.querySelector('#div');
    const img = document.createElement('img');
    img.classList.add('images');
    img.setAttribute('src', gif.images.original.url);
    img.append(gif);
    div.append(img);

    input.value='';
});


const clear = document.querySelector('#clearBTN');
clear.addEventListener('click', function(e){
    e.preventDefault();
    return div.remove('<div>');
})

//Notes
//1. Originally a HTML <img> element was created. The gif was upended to that element. This restricted the gifs to 1 per page. When a new gif was requested by the user, the single gif would be refreshed to the new search.
//2. Creating the img element through JS and appending that to a div element in the HTML allowed for multiple gifs on the page
