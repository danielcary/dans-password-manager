/*
 * Dan's Password Manager
 * PasswordModal.jsx
 * Copyright 2018 Daniel Cary
 * Licensed under MIT (https://github.com/danielcary/dans-password-manager/blob/master/LICENSE)
*/
import * as React from 'react';
import * as  ReactDOM from 'react-dom';
import { Grid, Row, Col, Button, FormControl, ControlLabel, Modal, Radio, FormGroup } from 'react-bootstrap';

export default class PasswordModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            password: "",
            strength: "medium",
            disable: false
        };
    }

    submit() {
        this.setState({ disable: true }, () => this.props.onSubmit(this.state.password, this.state.strength)); 
    }

    render() {
        return (
            <Modal show onHide={() => this.props.onClose()}>
                <Modal.Header closeButton>Enter Password</Modal.Header>
                <Modal.Body>
                    <form onSubmit={() => this.submit()}>
                        <FormGroup>
                            <ControlLabel>Password</ControlLabel>
                            <FormControl
                                autoFocus
                                type="password"
                                value={this.state.password}
                                onChange={e => this.setState({ password: e.target.value })}
                                onSubmit={() => this.submit()} />
                        </FormGroup>
                        {this.props.strength &&
                            <FormGroup>
                                <ControlLabel>Key Strength</ControlLabel>
                                <br />
                                <Radio
                                    inline
                                    name="strength"
                                    value="low"
                                    onChange={e => this.setState({ strength: e.target.value })}
                                    checked={this.state.strength == "low"}>
                                    Low
                            </Radio>
                                <Radio
                                    inline
                                    name="strength"
                                    value="medium"
                                    onChange={e => this.setState({ strength: e.target.value })}
                                    checked={this.state.strength == "medium"}>
                                    Medium
                            </Radio>
                                <Radio
                                    inline
                                    name="strength"
                                    value="high"
                                    onChange={e => this.setState({ strength: e.target.value })}
                                    checked={this.state.strength == "high"}>
                                    High
                            </Radio>
                            </FormGroup>
                        }
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        disabled={this.state.password.length == 0 || this.state.disable}
                        onClick={() => this.submit()} >
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

};
