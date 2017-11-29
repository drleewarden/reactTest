import React from 'react';
import axios from 'axios';

class TestDemo extends React.Component {

  state = {
    films: [],
    loading: true,
    error: null
  }

  componentDidMount() {
    // Cors needs to be turned on to make this work cross domains
    axios.get(`http://alintacodingtest.azurewebsites.net/api/Movies`)
      .then(res => {
        const films = res.data;

        this.setState({
          films,
          loading: false,
          error: null
        });
      })
      .catch(err => {
        this.setState({
          loading: false,
          error: err
        });
      });
  }

  renderLoading() {
    return <div>Loading...</div>;
  }

  renderError() {
    return (
      <div>
        Something went wrong: {this.state.error.message}
      </div>
    );
  }
  actors(post) {
    return (post.roles.map((info) =>
            <span className="info">
              <em className="actor"> {info.name}:  </em>
               {info.actor},
            </span>
        )
    )}
  movies() {
    const { films } = this.state;
    const sortList = films.sort();
    return (sortList.map((post) =>

            <li>
              <span className="score">{post.name}</span>
              <p>{this.actors(post)}</p>
            </li>)

    )}

  renderfilms() {
    const { error } = this.state;
    if(error) {
      return this.renderError();
    }

    return (
      <ul>
        <h1>Test</h1>
        {this.movies()}
      </ul>
    );
  }

  render() {
    const { loading } = this.state;
    return (
      <div>
        {loading ? this.renderLoading() : this.renderfilms()}
      </div>
    );
  }
}


export default TestDemo;
