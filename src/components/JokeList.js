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
      jokes: JSON.parse(window.localStorage.getItem("jokes")) || [],
      loading: false
    };

    this.seenJokes = new Set(this.state.jokes.map(j => j.text));
    console.log(this.seenJokes);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    if (this.state.jokes.length === 0) this.getJokes();
  }
  async getJokes() {
    try {
      let jokes = [];
      while (jokes.length < this.props.numOfJokes) {
        let res = await axios.get("https://icanhazdadjoke.com/", {
          headers: { Accept: "application/json" }
        });
        let newJoke = res.data.joke;
        if (!this.seenJokes.has(newJoke)) {
          jokes.push({ id: uuidv4(), text: newJoke, votes: 0 });
        } else {
          console.log("DUPLICATE JOKES");
          console.log(newJoke);
        }
      }

      this.setState(
        st => ({ loading: false, jokes: [...st.jokes, ...jokes] }),
        () =>
          window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
      );
    } catch (err) {
      alert(err);
      this.setState({ loading: false });
    }
  }
  handleVote(id, delta) {
    this.setState(
      curState => ({
        jokes: curState.jokes.map(joke =>
          joke.id === id ? { ...joke, votes: joke.votes + delta } : joke
        )
      }),
      () =>
        window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
    );
  }
  handleClick() {
    this.setState({ loading: true }, this.getJokes);
  }
  render() {
    if (this.state.loading) {
      return (
        <div className='JokeList-spinner'>
          <i className='far fa-8x fa-laugh fa-spin' />
          <h1 className='JokeList-title'>Loading...</h1>
        </div>
      );
    }
    let jokes = this.state.jokes.sort((a, b) => b.votes - a.votes);
    return (
      <div className='JokeList'>
        <div className='JokeList-sidebar'>
          <h1 className='JokeList-title'>
            <span>Dad</span> Jokes
          </h1>
          <img src={Emoji} alt={"Laughing emoji"} />
          <button className='JokeList-getmore' onClick={this.handleClick}>
          Fetch Jokes
          </button>
        </div>
        <div className='JokeList-jokes'>
          {jokes.map(joke => (
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
