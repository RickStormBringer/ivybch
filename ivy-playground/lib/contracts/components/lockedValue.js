// external imports
import React from "react";
import DocumentTitle from "react-document-title";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
// ivy imports
import Section from "../../app/components/section";
// internal imports
import { getContract, getContractIds, getSpentContractIds } from "../selectors";
function amountFromSatoshis(amountInSatoshis) {
    const amount = amountInSatoshis / 100000000;
    return amount;
}
const LockedValueDisplay = (props) => {
    return (React.createElement(DocumentTitle, { title: "Unlock Contract" },
        React.createElement("div", null,
            React.createElement(LockedValue, { contractIds: props.contractIds }),
            React.createElement(History, { spentContractIds: props.spentContractIds }))));
};
export default connect(state => ({
    contractIds: getContractIds(state),
    spentContractIds: getSpentContractIds(state)
}))(LockedValueDisplay);
const UnlockButton = (props) => {
    return (React.createElement(Link, { to: "/unlock/" + props.contractId },
        React.createElement("button", { className: "btn btn-primary" }, "Unlock")));
};
function LockedValue(props) {
    let content = React.createElement("div", { className: "table-placeholder" }, "No Contracts");
    if (props.contractIds.length > 0) {
        content = (React.createElement("table", { className: "table contracts-table" },
            React.createElement("thead", null,
                React.createElement("tr", null,
                    React.createElement("th", null, "Contract Template"),
                    React.createElement("th", null, "Amount"),
                    React.createElement("th", null))),
            React.createElement("tbody", null, props.contractIds.map(id => (React.createElement(LockedValueRow, { key: id, contractId: id }))))));
    }
    return React.createElement(Section, { name: "Unspent Contracts" }, content);
}
const LockedValueRowUnconnected = (props) => {
    const contract = props.contract;
    return (React.createElement("tr", null,
        React.createElement("td", null, contract.instantiated.template.name),
        React.createElement("td", null, amountFromSatoshis(contract.instantiated.amount)),
        React.createElement("td", { className: "td-button" },
            React.createElement(UnlockButton, { contractId: contract.id }))));
};
const LockedValueRow = connect((state, ownProps) => {
    // mapStateToProps
    const contract = getContract(state, ownProps.contractId);
    return {
        contract
    };
})(LockedValueRowUnconnected);
const History = (props) => {
    let content = React.createElement("div", { className: "table-placeholder" }, "No History");
    if (props.spentContractIds.length > 0) {
        content = (React.createElement("div", { className: "table-responsive" },
            React.createElement("table", { className: "table contracts-table" },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", null, "Contract Template"),
                        React.createElement("th", null, "Amount"))),
                React.createElement("tbody", null, props.spentContractIds.map(id => (React.createElement(HistoryRow, { key: id, contractId: id })))))));
    }
    return React.createElement(Section, { name: "History" }, content);
};
const HistoryRowUnconnected = (props) => {
    const contract = props.contract;
    return (React.createElement("tr", null,
        React.createElement("td", null, contract.instantiated.template.name),
        React.createElement("td", null, amountFromSatoshis(contract.instantiated.amount)),
        React.createElement("td", null)));
};
const HistoryRow = connect((state, ownProps) => {
    const contract = getContract(state, ownProps.contractId);
    return {
        contract
    };
})(HistoryRowUnconnected);
