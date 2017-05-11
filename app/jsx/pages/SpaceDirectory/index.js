'use strict';

import React from 'react';
import Router from 'react-router';
import CommonHeader from 'Shared/CommonHeader';
import SpaceStore from './stores';
import SpaceActions from './actions';
import SpaceTile from 'Shared/SpaceTile';
import LoadMoreDingus from 'Shared/LoadMoreDingus';
import ErrorBox from 'Shared/ErrorBox';

const {Link} = Router;

const MySpaces = React.createClass({

  getInitialState() {
    return SpaceStore.getState();
  },

  componentDidMount() {
    SpaceStore.listen(this.onChange);
    SpaceActions.fetchSpaces();
  },

  componentWillUnmount() {
    SpaceStore.unlisten(this.onChange);
  },

  onChange(state) {
    this.setState(state);
  },

  loadMore() {
    SpaceActions.fetchSpaces(this.state.links.next);
  },

  render() {
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
      if (this.state.loading || (this.state.links && this.state.links.hasOwnProperty('next'))) {
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
                <img style={{width: '25%', margin: 'auto'}} src="/images/sadpanda.svg" alt="The panda is sad because it couldn't find the page you wanted" />
                <p style={{marginTop: '2em'}}>There do not appear to be any public Canvas Spaces.</p><p>Why not <Link to="create">create a new space</Link> now?</p>
              </div>
            </div>
          </div>

        );
      }
      const tiles = this.state.spaces.map((space) => {
        return (
          <SpaceTile
            key={`space_${space.id}`}
            space={space}
            avatar={space.avatar_url}
            context="public"
          />
        );
      });
      return (
        <div className="SpaceList">
          {tiles}
        </div>
      );

    };

    return (
      <div>
        <CommonHeader />
        <h2>Public Spaces</h2>
        <ErrorBox error={this.state.error} />
        {spaceTiles()}
        {load_more_dingus()}
      </div>
    );
  }

});

export default MySpaces;
