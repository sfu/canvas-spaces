'use strict';

import alt from '../alt';
import api from 'utils/api';

class SpaceActions {
  updateSpaces(spaces, links) {
    return {spaces, links};
  }

  fetchSpaces(next_link) {
    return (dispatch) => {
      dispatch();

      if (!next_link) {
        // initial load
        api.get_spaces_for_user('self', (spaces, links) => {
          this.updateSpaces(spaces, links);
        });
      } else {
        // load next pages
        api.load_url(next_link, (spaces, links) => {
          this.updateSpaces(spaces, links);
        });
      }
    };
  }

  updateSpace(space, cb) {
    return (dispatch) => {
      api.update_space(space, (err, newspace) => {
        if (err) {
          this.spacesFailed(err);
        } else {
          dispatch(newspace);
        }
        if (cb) {
          cb();
        }
      });
    };
  }

  spacesFailed(error) {
    return error;
  }
}

export default alt.createActions(SpaceActions);
