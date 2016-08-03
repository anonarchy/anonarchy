import React from 'react'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'

Yavanna.provide('Login', () => {

  return React.createClass({
//            floatingLabelFixed={true}
    // getInitialState: function() {
    //   return {open: this.props.open}
    // },


    render() {
      const actions = [
        <FlatButton
          label="Cancel"
          primary={true}
          onTouchTap={this.props.handleClose}
        />,
        <FlatButton
          label="Submit"
          primary={true}
          onTouchTap={this.props.handleClose}
        />,
      ];

      return (
        <div>
          <Dialog
            open={this.props.open}
            modal={true}
            actions={actions}
          >
            <TextField
              hintText="Username"
              floatingLabelText="Username"
              // fullWidth={true}
              // onChange={this.updateText}
             />
            <br />
            <TextField
              hintText="Password"
              floatingLabelText="Password"
              type="password"
            />
            <br />
          </Dialog>
        </div>
      )
    }

  })
})
