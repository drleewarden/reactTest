import React from 'react';
import ReactDOM from 'react-dom';
import FetchDemo from './TestDemo';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json'
import axios from 'axios';

it('renders the loading state', () => {
  const wrapper = shallow(
    <FetchDemo />
  );
  expect(toJson(wrapper)).toMatchSnapshot();
});

it('renders the error state', () => {
  const wrapper = shallow(<FetchDemo subreddit='reactjs'/>);
  wrapper.setState({
    loading: false,
    error: {message: 'oops'}
  });
  expect(toJson(wrapper)).toMatchSnapshot();
});

describe('fetching data', () => {
  const response = {
    data: { data: { children: [
      {data: {id: 1, title: "foo"}},
      {data: {id: 2, title: "bar"}}
    ]}}
  };

  it('fetches the data', () => {
    axios.get = jest.fn(() => Promise.resolve(response));

    // Must use "mount" instead of "shallow", otherwise componentDidMount()
    // won't be called.
    mount(<FetchDemo test='reactjs'/>);

    // Check that axios.get was called correctly
    expect(axios.get).toBeCalledWith('http://alintacodingtest.azurewebsites.net/api/Movies');
  });

  // Pass the "done" param to this test because it
  // is testing async functionality
  it('re-renders with the data', (done) => {
    // Resolve the call with data
    axios.get = jest.fn(() => Promise.resolve(response));

    let wrapper = mount(<FetchDemo test='reactjs'/>);

    // First time should say "Loading..."
    expect(toJson(wrapper)).toMatchSnapshot();

    try {
      setTimeout(() => {
        // After a timeout the promise will be resolved,
        // and the component's state will be updated
        expect(toJson(wrapper)).toMatchSnapshot();

        // Must call done() to stop the test
        done();
      }, 0);
    } catch(e) {
      done.fail(e);
    }
  });
});

