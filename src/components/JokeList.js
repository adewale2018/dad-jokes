import React, { Component } from "react";
import axios from "axios";
import Emoji from "../real.png";
import "./JokeList.css";

class JokeList extends Component {
  static defaultProps = { numOfJokes: 10 };
  constructor(props) {
    super(props);

    this.state = { jokes: [] };
  }

  async componentDidMount() {
    let jokes = [];
    while (jokes.length < this.props.numOfJokes) {
      let res = await axios.get("https://icanhazdadjoke.com/", {
        headers: { Accept: "application/json" }
      });
      jokes.push(res.data.joke);
    }

    this.setState({ jokes: jokes });
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
            <div>{joke}</div>
          ))}
        </div>
      </div>
    );
  }
}

export default JokeList;
