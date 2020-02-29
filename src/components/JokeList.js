import React, { Component } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import Joke from "./Joke";
import Emoji from "../real.png";
import "./JokeList.css";

class JokeList extends Component {
  static defaultProps = { numOfJokes: 10 };
  constructor(props) {
    super(props);

    this.state = {
      jokes: JSON.parse(window.localStorage.getItem("jokes")) || "[]"
    };
  }

  componentDidMount() {
    if (this.state.jokes.length === 0) this.getJokes();
  }
  async getJokes() {
    let jokes = [];
    while (jokes.length < this.props.numOfJokes) {
      let res = await axios.get("https://icanhazdadjoke.com/", {
        headers: { Accept: "application/json" }
      });
      jokes.push({ id: uuidv4(), text: res.data.joke, votes: 0 });
    }

    this.setState({ jokes: jokes });
    window.localStorage.setItem("jokes", JSON.stringify(jokes));
  }
  handleVote(id, delta) {
    this.setState(curState => ({
      jokes: curState.jokes.map(joke =>
        joke.id === id ? { ...joke, votes: joke.votes + delta } : joke
      )
    }));
  }
  render() {
    return (
      <div className='JokeList'>
        <div className='JokeList-sidebar'>
          <h1 className='JokeList-title'>
            <span>Dad</span> Jokes
          </h1>
          <img src={Emoji} alt={"Laughing emoji"} />
          <button className='JokeList-getmore'>More Jokes</button>
        </div>
        <div className='JokeList-jokes'>
          {this.state.jokes.map(joke => (
            <Joke
              key={joke.id}
              votes={joke.votes}
              text={joke.text}
              upvote={() => this.handleVote(joke.id, 1)}
              downvote={() => this.handleVote(joke.id, -1)}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default JokeList;
