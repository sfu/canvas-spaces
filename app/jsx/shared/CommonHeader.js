import React from 'react'
import createReactClass from 'create-react-class'
import { Link } from 'react-router-dom'

const CommonHeader = createReactClass({
  render() {
    return (
      <div className="header-bar row-fluid">
        <div className="span8">
          <h1>Canvas Spaces</h1>
          <p>
            Are you looking for a space to collaborate with your SFU club, research group, committee, or other group?
            With Canvas Spaces, you can use Canvas features such as file sharing, discussions, and wiki pages, to bring
            greater communication and collaboration to your group.
          </p>
          <p>
            Canvas Spaces is currently restricted to users with an @sfu.ca email address.
          </p>
        </div>
        <div className="span4 align-right">
          <Link to="/create" className="icon-plus Button Button--primary">
            {' '}Create New Space
          </Link>
        </div>
      </div>
    )
  }
})

export default CommonHeader
