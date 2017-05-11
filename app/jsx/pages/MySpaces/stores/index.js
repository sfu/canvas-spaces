'use strict'

import alt from '../alt'
import makeHot from 'alt-utils/lib/makeHot'
import SpaceActions from '../actions'
import DefaultAvatars from '../../../shared/DefaultAvatars'

let defaultAvatars = new DefaultAvatars()

const errors = {
  default: 'An unknown error occured while trying to save your changes. Please try again later.',
  unauthorized: 'You are not authoized to modify this Space. Only the Space Leader can make changes.'
}

class SpaceStore {
  constructor() {
    this.spaces = []
    this.links = []
    this.loading = false
    this.error = null

    this.bindListeners({
      handleUpdateSpaces: SpaceActions.UPDATE_SPACES,
      handleUpdateSpace: SpaceActions.UPDATE_SPACE,
      handleDeleteSpace: SpaceActions.DELETE_SPACE,
      handleFetchSpaces: SpaceActions.FETCH_SPACES,
      handleSpacesFailed: SpaceActions.SPACES_FAILED
    })
  }

  handleUpdateSpaces(payload) {
    this.loading = false
    payload.spaces.forEach(space => {
      if (!space.avatar_url) {
        space.avatar_url = defaultAvatars.next()
      }
    })
    this.spaces = this.spaces.concat(payload.spaces)
    this.links = payload.links
  }

  handleUpdateSpace(payload) {
    // find the space in this.spaces, and replace it?
    const index = this.spaces.findIndex(function(e) {
      return e.id === payload.id
    })
    if (!payload.avatar_url) {
      payload.avatar_url = defaultAvatars.next()
    }
    this.spaces[index] = payload
  }

  handleFetchSpaces() {
    this.loading = true
  }

  handleDeleteSpace(id) {
    // find the space in this.spaces and nuke it from orbit
    // it's the only way to be sure
    const index = this.spaces.findIndex(function(e) {
      return e.id === id
    })
    this.spaces.splice(index, 1)
  }

  handleSpacesFailed(error) {
    const errorKey = error.status
    this.error = errors.hasOwnProperty(errorKey)
      ? errors[errorKey]
      : errors.default
    window.setTimeout(() => {
      this.setState({ error: null })
    }, 5000)
  }
}

export default makeHot(alt, SpaceStore, 'SpaceStore')
