// external imports
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";
// internal imports
import Reset from "./reset";
const mapStateToProps = state => {
    const location = state.routing.location;
    if (!location) {
        return { path: "lock" };
    }
    const pathname = location.pathname.split("/");
    if (pathname[1] === "ivy") {
        pathname.shift();
    }
    return { path: pathname[1] };
};
const Navbar = (props) => {
    return (React.createElement("nav", { className: "navbar navbar-inverse navbar-static-top" },
        React.createElement("div", { className: "container fixedcontainer" },
            React.createElement("div", { className: "navbar-header" },
                React.createElement(Link, { to: "/create", className: "navbar-brand" })),
            React.createElement(ReactTooltip, { id: "seedButtonTooltip", place: "bottom", type: "error", effect: "solid" }),
            React.createElement("ul", { className: "nav navbar-nav navbar-right" },
                React.createElement("li", null,
                    React.createElement(Link, { to: "/create" }, "Create Contract")),
                React.createElement("li", null,
                    React.createElement(Link, { to: "/unlock" }, "Unlock Contract")),
                React.createElement(Reset, null)))));
};
export default connect(mapStateToProps)(Navbar);
