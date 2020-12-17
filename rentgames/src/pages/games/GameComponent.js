import {React} from 'react'
import { Component } from 'react';
import MaterialTable from 'material-table'
import './styles/gamecomponentStyle.css'

const cors = require('cors')

export class Game extends Component {

    constructor(props) {
        super(props);
        this.state = {
            token: '',
            games: [],
            columns: [
                {title: 'Title', field: 'title'},
                {title: 'Genre List', field: 'genreList'},
                {title: 'Release Date', field: 'releaseDate'},
                {title: 'Platform List', field: 'platformList'},
                {title: 'Quantity', field: 'quantity', type: 'numeric'},
            ],
        };
    }

    componentDidMount(){

        let token = localStorage.getItem('token')
        if(token){

            this.setState({
                token:token
            })
            
            fetch("http://localhost:8080/games",cors(),{method: 'GET',  headers: {
                'Authorization': 'Bearer ' + token
             },})
            .then(response => response.json())   
            .then(responseData => {
                this.setState({
                    games: responseData
                })
            }).catch(err => console.error(err));
        }else{
            window.location.href = "/"
        }

    }

    sendDeleteRequest(id){
        fetch("http://localhost:8080/games/delete/"+id,{method: 'DELETE', headers: {
            'Authorization': 'Bearer ' + this.state.token
         }})
        .then(response => {
            if(response.status === 202){
                this.setState(prevState => {
                    return{
                    games: prevState.games.filter(game => game.id !== id)
                }})

                alert("Successfully deleted game from database!")
            }else{
                throw new Error("Error while deleting data from database.")
            }
        }) 
        .catch(err => alert(err.message));
    }

    sendNewGame(event){
        event.preventDefault()
        let newGame = {}
        const formData = new FormData(document.querySelector('form'))
        
        for (var newGameData of formData.entries()) {
            newGame[newGameData[0]] = newGameData[1]
        }

        fetch("http://localhost:8080/addGame",{method: 'POST',body:JSON.stringify(newGame),headers: {
            'Content-type': 'application/json;charset=UTF-8',
            'Authorization': 'Bearer ' + this.state.token

        }})
        .then(response => response.json())
        .then(responseData => {
                newGame['id'] = responseData
                let newGameList = [newGame,...this.state.games]
                this.setState({
                    games: newGameList
                })
                alert("Successfully added new game to database!")   
        }) 
        .catch(err => alert("Something went wrong"));
    }


    updateGameData(selectedGame,newPlatformList){
        let game = selectedGame
        
        if(!game['platformList']){
            game['platformList'] = newPlatformList
        }else{
            game['platformList'] += newPlatformList
        }

        let newGameState = []

        for(let gameFromState in this.state.games){
            if(this.state.games[gameFromState].id === game.id){
                newGameState.push(game)
            }else{
                newGameState.push(this.state.games[gameFromState])
            }
        }

        let headers = {
            'Content-type': 'application/json',
            'Authorization': 'Bearer ' + this.state.token
        }
        
        fetch("http://localhost:8080/updateGame",{method: 'PUT',body:JSON.stringify(game),headers: headers})
        .then(response => {
                this.setState({
                    games: newGameState
                })
                alert("Successfully modified the platform of the game!")   
        }) 
        .catch(err => {alert("Something went wrong"); console.log(err)});
    }

    handleLogout(){
        window.location.href = "/"
        localStorage.removeItem('token')
    }

    componentWillUnmount(){
        localStorage.removeItem('token')
    }

    render() {
        return (
            <div>
                <button onClick={this.handleLogout}>Log out</button>
                <div id="newGameFormContainer">
                    <form id="newGameForm" onSubmit={this.sendNewGame.bind(this)}>
                        <label for="title">Title:</label>
                        <input name="title" id="title" type="text" placeholder="Title of the game" required/><br/>
                        <label for="genreList">Genre List:</label>
                        <input name="genreList" id="genreList" type="text" placeholder="Genres of the game" /><br/>
                        <label for="releaseDate">Release Date:</label>
                        <input name="releaseDate" id="releaseDate" type="date" placeholder="Release date of the game"/><br/>
                        <label for="platformList">Platform List:</label>
                        <input name="platformList" id="platformList" type="text" placeholder="Platforms of the game"/><br/>
                        <label for="quantity">Quantity:</label>
                        <input name="quantity" id="quantity" type="number" placeholder="Quantity of the game" required/><br/>
                        <input id="submitNewGameButton" type="submit" value="Add"/>
                        <button id="emptyForm" onClick={this.emptyForm}>Cancel</button>
                    </form>
                </div>
                <div id="content">
                    <MaterialTable
                            columns={this.state.columns}
                            title="Games"
                            data={this.state.games}
                            actions={[{
                                icon: 'delete',
                                tooltip: 'Delete game from database',
                                onClick: (event, rowData) => {
                                    this.sendDeleteRequest(rowData.id)
                                }
                            },
                            {
                                icon:'create',
                                tooltip:'Update game data',
                                onClick: (event,rowData) => {
                                    let newplatformList = rowData['platformList'].length > 0 ? "," + prompt("Give the me the new platforms: ") : prompt("Give the me the new platforms: ")
                                    this.updateGameData(rowData,newplatformList)
                                }
                            }]}
                    />
                </div>
            </div>
        )
      }
}