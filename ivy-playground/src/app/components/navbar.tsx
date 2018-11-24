// external imports
import React from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import ReactTooltip from "react-tooltip"

// internal imports
import Reset from "./reset"


const mapStateToProps = state => {
  const location = state.routing.location
  if (!location) {
    return { path: "lock" }
  }

  const pathname = location.pathname.split("/")
  if (pathname[1] === "ivy") {
    pathname.shift()
  }
  return { path: pathname[1] }
}

const Navbar = (props: { path: string }) => {
  return (
    <nav className="navbar navbar-inverse navbar-static-top">
      <div className="container fixedcontainer">
        <div className="navbar-header">
            <Link to="/create" className="navbar-brand">
                <div style={{lineHeight: '30px'}}>
                    Ivy Playground for Bitcoin Cash
                </div>
            </Link>
        </div>
        <ReactTooltip
          id="seedButtonTooltip"
          place="bottom"
          type="error"
          effect="solid"
        />
        <ul className="nav navbar-nav navbar-right">
            <li>
                <a href="https://github.com/copernet/ivybch" target="_blank">GitHub</a>
            </li>
            <li>
                <a href="https://ivy.copernet.io/docs" target="_blank">Docs</a>
            </li>
          <li>
            <Link to="/create">Create Contract</Link>
          </li>
          <li>
            <Link to="/unlock">Unlock Contract</Link>
          </li>
          <Reset />
        </ul>
      </div>
    </nav>
  )
}

export default connect(mapStateToProps)(Navbar)
