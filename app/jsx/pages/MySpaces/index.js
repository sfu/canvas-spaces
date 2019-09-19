import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import CommonHeader from '../../shared/CommonHeader';
import SpaceTile from '../../shared/SpaceTile';
import LoadMoreDingus from '../../shared/LoadMoreDingus';
import ErrorBox from '../../shared/ErrorBox';
import DefaultAvatars from '../../shared/DefaultAvatars';

class MySpaces extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      loading: true,
      spaces: [],
      links: [],
    };
    this.loadMore = this.loadMore.bind(this);
    this.updateSpace = this.updateSpace.bind(this);
    this.deleteSpace = this.deleteSpace.bind(this);
  }

  componentDidMount() {
    api.get_spaces_for_user('self', (spaces, links) => {
      this.updateSpaces(spaces, links);
    });
  }

  loadMore() {
    const { next } = this.state.links;
    this.setState({ loading: true }, () => {
      api.load_url(next, (spaces, links) => {
        this.updateSpaces(spaces, links);
      });
    });
  }

  updateSpaces(spaces, links) {
    const defaultAvatars = new DefaultAvatars();
    const currentSpaces = this.state.spaces;
    const newSpaces = currentSpaces.concat(
      spaces.map(s => ({
        ...s,
        avatar_url: s.avatar_url || defaultAvatars.next(),
      }))
    );
    this.setState({
      loading: false,
      links,
      spaces: newSpaces,
    });
  }

  updateSpace(space, cb = () => {}) {
    // call the API to update the space
    // if successful, patch the state space list with the new space
    api.update_space(space, (err, newspace) => {
      if (err) {
        this.handleFailure(err);
      } else {
        // update the space list
        const newSpaces = this.state.spaces.map(s => {
          if (s.id === newspace.id) {
            if (!newspace.avatar_url) {
              newspace.avatar_url = s.avatar_url;
            }
            return newspace;
          } else {
            return s;
          }
        });
        this.setState({ spaces: newSpaces }, cb);
      }
    });
  }

  deleteSpace(space, cb = () => {}) {
    // call the API to remove the space
    // if successful, remove the space from state
    api.delete_space(space, err => {
      if (err) {
        this.handleFailure(err);
      } else {
        const newSpaces = this.state.spaces.filter(s => s.id !== space.id);
        this.setState({ spaces: newSpaces }, cb);
      }
    });
  }

  handleFailure(error) {
    const errors = {
      default:
        'An unknown error occured while trying to save your changes. Please try again later.',
      unauthorized:
        'You are not authoized to modify this Space. Only the Space Leader can make changes.',
    };
    const errorKey = error.status;
    this.setState({
      error: errors.hasOwnProperty(errorKey)
        ? errors[errorKey]
        : errors.default,
    });
  }

  render() {
    const serverConfig = window.ENV.CANVAS_SPACES_CONFIG || {};
    const load_more_dingus = () => {
      const dingus = (
        <div className="content-box">
          <div className="grid-row center-md">
            <div className="col-xs-12 col-md-1">
              <LoadMoreDingus
                onClick={this.loadMore}
                disabled={this.state.loading}
                loading={this.state.loading}
              />
            </div>
          </div>
        </div>
      );
      if (
        this.state.loading ||
        (this.state.links && this.state.links.hasOwnProperty('next'))
      ) {
        return dingus;
      } else {
        return null;
      }
    };

    const spaceTiles = () => {
      if (this.state.spaces.length === 0 && !this.state.loading) {
        return (
          <div className="content-box">
            <div className="grid-row center-md">
              <div className="col-xs-12 col-md-8">
                <img
                  style={{ width: '25%', margin: 'auto' }}
                  src="/images/sadpanda.svg"
                  alt="The panda is sad because it couldn't find the page you wanted"
                />
                <p style={{ marginTop: '2em' }}>
                  You don't appear to be a member of any Canvas Spaces.
                </p>
                <p>
                  Why not <Link to="/create">create a new space</Link> now?
                </p>
              </div>
            </div>
          </div>
        );
      }
      const tiles = this.state.spaces.map(space => {
        return (
          <SpaceTile
            key={`space_${space.id}`}
            space={space}
            avatar={space.avatar_url}
            context="mine"
            serverConfig={serverConfig}
            updateSpace={this.updateSpace}
            deleteSpace={this.deleteSpace}
          />
        );
      });
      return <div className="SpaceList">{tiles}</div>;
    };

    return (
      <div>
        <CommonHeader />
        <h2>My Canvas Spaces</h2>
        <ErrorBox error={this.state.error} />
        {spaceTiles()}
        {load_more_dingus()}
      </div>
    );
  }
}

export default MySpaces;
