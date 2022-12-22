"use strict"

// variáveis importantes
var client_id = '1ce0c9d9d4904c8cb43743480c62a476'
var client_secret = '30ca2166e8dc4ee4b75950b0512ae1dc'
var redirect_uri = 'http://127.0.0.1:5500/index2.html'
var user_id = ''

// outras variavéis 
var currentSong = ''
const h1 = document.querySelector('.text')
var code = window.location.href.split("=")[1]
const html = document.querySelector('html')

// currentSong.addEventListener('change', () => {
//     fetch(`https://api.spotify.com/v1/me/player/currently-playing`, {
//             method: 'GET',
//             headers: {
//                 "Authorization": `Bearer ${localStorage.getItem('token')}`,
//                 'Content-Type': 'application/json',
//             }
//         }).then(reponse => reponse.json().then(data => {
//             currentSong = data
//             console.log(data);
//             if (data.item == undefined || data.item == null){
//                 now.innerHTML = "<p>Você não está escutando nada</p>"
//             } else {
//                 now.innerHTML = `
//                     <h1>Última música tocada</h1>
//                     <img src="${data.item.album.images[1].url}" alt="capa da música">
//                     <h2>${data.item.name}</h2>
//                     <p>A música foi lançada dia ${data.item.album.release_date}</p>
//                     <a href="${data.item.external_urls.spotify}" target="_blank"><h3>Escute ela</h3></a>
//                     <h3>Artistas que participaram da música:</h3>
//                     <div class='artists'></div>
//                     <br>
//                     <br>
//                     <h1>Último álbum tocado</h1>
//                     <a href="${data.context.external_urls.spotify}" target="_blank"><h2>Abra ela</h2></a>
//                 `

//                 let artists = document.querySelector('.artists')
//                 for (let i = 0; i < data.item.artists.length; i++) {
//                     const infoArtists = document.createElement('p')
//                     infoArtists.innerHTML = `<a href="${data.item.artists[i].external_urls.spotify}" target="_blank">${data.item.artists[i].name}</a>`
//                     artists.appendChild(infoArtists)
//                 }
//             }
//         }))
// })

// criação de elementos
const info = document.createElement('div')
html.appendChild(info)
info.setAttribute('class', 'infos')

const now = document.createElement('div')
html.appendChild(now)
now.setAttribute('id', 'musicCurrent')
now.setAttribute('class', 'infos')


// variáveis de controle
var clickBtn = 0
var clickPlay = 0
var clickNewPlay = 0

// URL's
var urlUser = new URLSearchParams({
    client_id: client_id,
    response_type: 'code',
    redirect_uri: redirect_uri,
    scope: 'playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public user-read-private user-read-email user-read-currently-playing user-modify-playback-state user-read-playback-state'
})

var tokenUrl = new URLSearchParams({
    code: code,
    redirect_uri: redirect_uri,
    grant_type: 'authorization_code'
})


// criação de funções
function clearStorage() {
    localStorage.clear()
}

function getToken() {
    if (clickBtn == 0) {
        fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + btoa(`${client_id}:${client_secret}`),
            },
            body: tokenUrl
        }).then(response => response.json().then(data => {
            localStorage.setItem('token', data.access_token)
        }))

        document.querySelector('button').textContent = 'Bora'
        clickBtn++
    } else {
        window.location.href = `http://127.0.0.1:5500/index3.html`
    }
}

function logar() {
    window.location.href = `https://accounts.spotify.com/authorize?${urlUser}`
}

function profile() {
    console.log(localStorage.getItem('token'));

    if (info.innerHTML == '') {
        fetch(`https://api.spotify.com/v1/me`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
        }).then(reponse => reponse.json().then(data => {
            user_id = data.id
            info.innerHTML = `
                <img src="${data.images[0].url}" alt="foto de perfil">
                <h2>${data.display_name}</h2>
                <p>Seguidores: ${data.followers['total']}</p>
            `
        }))
    } else {
        info.innerHTML = ''
    }
}

function playlist() {
    if (clickPlay == 0) {
        fetch(`https://api.spotify.com/v1/me/playlists`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
        }).then(reponse => reponse.json().then(data => {
            const newP = document.createElement('div')
            html.appendChild(newP)
            newP.innerHTML = `
                <br>
                <form action="#" class = 'playlist-div'>
                    <label for="nomePlay">Escreva o nome da sua playlist</label>
                    <input type="text" name="nomePlay" id="nomePlay" placeholder="gatinha.txt" required>
                    <br>
                    <label for="discPlay">Escreva uma descrição para a sua playlist</label>
                    <input type="text" name="discPlay" id="discPlay" placeholder="Músicas para um presente">
                </form>
                <button onclick='newPlaylist()' class='playlist-div'>Nova Playlist</button>
            `

            data.items.map((obj) => {
                const play = document.createElement('div')
                html.appendChild(play)
                play.setAttribute('class', 'playlist-div')

                if (obj.images.length == 0){
                    play.innerHTML = `
                        <br><br>
                    `
                } else {
                    play.innerHTML = `
                        <br><br>
                        <img src=${obj.images[0].url} alt='capa da playlist' width ='300px'></img>
                    `
                }

                play.innerHTML += `
                    <h2>${obj.name}</h2>
                    <p>${obj.description}</p>
                    <p>${obj.tracks.total} músicas</p>
                    <button><a href="${obj.external_urls.spotify}" target="_blank">Escute a playlist</a></button>
                    <br><br>
                `
            })
            clickPlay++
        }))
    } else {
        clickPlay = 0
        clickNewPlay = 0
        let playlistDiv = document.querySelectorAll('.playlist-div')
        for (let i = 0; i < playlistDiv.length; i++) {
            playlistDiv[i].remove()
        }
    }
}

function cleaning() {
    document.querySelector('.infos').innerHTML = ''
    document.querySelectorAll('.infos')[1].innerHTML = ''
    document.querySelector('.remote-div').remove()

    for (let y = 0; y < document.querySelectorAll('.playlist-div').length; y++) {
        document.querySelectorAll('.playlist-div')[y].remove()
    }
}

function history() {
    if (now.innerHTML == '') {
        fetch(`https://api.spotify.com/v1/me/player/currently-playing`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            }
        }).then(reponse => reponse.json().then(data => {
            currentSong = data
            if (data.item == undefined || data.item == null){
                now.innerHTML = "<p>Você não está escutando nada</p>"
            } else {
                now.innerHTML = `
                    <h1>Última música tocada</h1>
                    <img src="${data.item.album.images[1].url}" alt="capa da música">
                    <h2>${data.item.name}</h2>
                    <p>A música foi lançada dia ${data.item.album.release_date}</p>
                    <a href="${data.item.external_urls.spotify}" target="_blank"><h3>Escute ela</h3></a>
                    <h3>Artistas que participaram da música:</h3>
                    <div class='artists'></div>
                    <br>
                    <br>
                    <h1>Último álbum tocado</h1>
                    <a href="${data.context.external_urls.spotify}" target="_blank"><h2>Abra ela</h2></a>
                `

                let artists = document.querySelector('.artists')
                for (let i = 0; i < data.item.artists.length; i++) {
                    const infoArtists = document.createElement('p')
                    infoArtists.innerHTML = `<a href="${data.item.artists[i].external_urls.spotify}" target="_blank">${data.item.artists[i].name}</a>`
                    artists.appendChild(infoArtists)
                }
                
            }
        }))
    } else {
        now.innerHTML = ''
    }
}

// function updateDiv(){ 
//     $("#musicCurrent").load(window.location.href + " #musicCurrent" );
// }

function userId(){
    fetch(`https://api.spotify.com/v1/me`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    }).then(reponse => reponse.json().then(data => {
        user_id = data.id
    }))
}

function newPlaylist() {
    // fetch para pegar o user_id
    userId()

    if(document.querySelector('#discPlay').value == ""){
        var descricao = 'Minha nova playlist 🙃'
    } else {
        var descricao = document.querySelector('#discPlay').value
    }

    if(document.querySelector('#nomePlay').value == ''){
        alert('Insira um nome para a sua playlist')
    }

    const novaPlaylit = JSON.stringify({
        "name": `${document.querySelector('#nomePlay').value}`,
        "description": `${descricao}`,
        "public": false
    })

    fetch(`https://api.spotify.com/v1/users/${user_id}/playlists`, {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: novaPlaylit
    }).then(reponse => reponse.json())

    if(clickNewPlay != 0){
        document.getElementsByTagName('form')[0].reset();
    }
    console.log(clickNewPlay);
    clickNewPlay++
}