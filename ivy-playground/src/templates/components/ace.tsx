// external imports
import React from "react"
import AceEditor from "react-ace"
import { connect } from "react-redux"

import * as Brace from "brace"
import "brace/theme/monokai"

// internal imports
import { setSource } from "../actions"

const mapStateToProps = undefined
const mapDispatchToProps = dispatch => {
  return {
    handleChange: value => {
      // dispatch(setSource(value))
    }
  }
}

const Ace = ({ source, handleChange }) => {
  return (
    <div className="panel-body">
      <AceEditor
        mode="ivy"
        theme="monokai"
        onChange={handleChange}
        name="aceEditor"
        minLines={15}
        maxLines={25}
        width="100%"
        tabSize={2}
        value={source}
        readOnly={true}
        editorProps={{ $blockScrolling: Infinity }}
        setOptions={{
          useSoftTabs: true,
          showPrintMargin: false,
          fontFamily: "Menlo, Monaco, Consolas, Courier New, monospace",
          fontSize: 16,
          highlightActiveLine: false
        }}
      />
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Ace)
