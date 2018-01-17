/*
 * Dan's Password Manager
 * App.jsx
 * Copyright 2017 Daniel Cary
 * Licensed under MIT (https://github.com/danielcary/dans-password-manager/blob/master/LICENSE)
*/
import * as React from 'react';
import * as  ReactDOM from 'react-dom';
import { remote, ipcRenderer } from 'electron';
import * as fs from 'fs';
import { Grid, Row, Col, Button, Glyphicon, Table } from 'react-bootstrap';

import PasswordModal from './PasswordModal';
import Entry from './Entry';
import * as File from './file';

const fileDialogOptions = { filters: [{ name: "Password List", extensions: ['dpwm'] }] };

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            entries: [{
                account: "",
                userId: "",
                password: ""
            }],
            /* file info */
            filepath: null,
            hashedPassword: null,
            hashStrength: null,
            /* modal settings */
            showPasswordModal: false,
            showHashStrength: false,
            onPasswordSubmit: null
        }

        ipcRenderer.on('cmd-open', () => this.openFile());
        ipcRenderer.on('cmd-save', () => this.saveFile());
        ipcRenderer.on('cmd-save-as', () => this.saveFileAs());
    }

    entryChanged(i, account, userId, password) {
        // show that the file has been modified
        if (this.state.filepath) {
            remote.getCurrentWindow().setTitle(`${this.state.filepath} - encrypted pw *`);
        }

        let entries = this.state.entries;
        entries[i] = {
            account: account,
            userId: userId,
            password: password
        };
        this.setState({ entries: entries })
    }

    addEntry() {
        let entries = this.state.entries;
        entries.push({
            account: "",
            userId: "",
            password: ""
        });
        this.setState({ entries: entries })
    }

    remove(i) {
        if (confirm("Are you sure you want to delete this account's info?")) {
            let entries = this.state.entries;
            entries.splice(i, 1);
            this.setState({ entries: entries })
        }
    }

    openFile() {
        remote.dialog.showOpenDialog(null, fileDialogOptions, files => {
            if (files && files.length == 1) {
                // get the hash strength used for the password from the file
                let file = File.openFile(files[0]);

                // callback function for when the modal returns with the entered password
                let onPasswordSubmit = (password) => {
                    File.hashPassword(password, file.strength, file.salt).then(hashedPassword => {
                        File.decryptFile(file, hashedPassword)
                            .then(entries => this.setState({
                                entries: entries,
                                filepath: files[0],
                                hashedPassword: hashedPassword,
                                hashStrength: file.strength,
                                showPasswordModal: false
                            }))
                            .then(() => remote.getCurrentWindow().setTitle(`${files[0]} - encrypted pw`))
                            .catch(err => remote.dialog.showErrorBox("Error opening file", `Bad password! (${err})`));
                    });
                };

                // set the state to display the password dialog
                this.setState({
                    onPasswordSubmit: onPasswordSubmit,
                    showPasswordModal: true,
                    showHashStrength: false
                });
            }
        });
    }

    saveFile() {
        if (this.state.filepath) {
            File.saveFile(this.state.filepath, this.state.hashedPassword, this.state.entries, this.state.hashStrength);
            remote.getCurrentWindow().setTitle(`${this.state.filepath} - encrypted pw`);
        } else {
            this.saveFileAs();
        }
    }

    saveFileAs() {
        remote.dialog.showSaveDialog(null, fileDialogOptions, file => {
            if (file) {
                // callback function for when the password modal has finished
                let onPasswordSubmit = (password, strength) => {
                    File.hashPassword(password, strength).then(hashedPassword => {
                        File.saveFile(file, hashedPassword, this.state.entries, strength);
                        // set our state with the file info
                        remote.getCurrentWindow().setTitle(`${file} - encrypted pw`)
                        this.setState({
                            filepath: file,
                            hashedPassword: hashedPassword,
                            hashStrength: strength,
                            showPasswordModal: false
                        });
                    });
                };

                // set state to get a password for the new file
                this.setState({
                    onPasswordSubmit: onPasswordSubmit,
                    showPasswordModal: true,
                    showHashStrength: true
                });
            }
        });
    }

    render() {
        return (
            <Grid fluid>
                {this.state.showPasswordModal &&
                    <PasswordModal
                        strength={this.state.showHashStrength}
                        onClose={() => this.setState({ showPasswordModal: false })}
                        onSubmit={this.state.onPasswordSubmit} />}
                <Table hover>
                    <thead>
                        <tr>
                            <th>Account</th>
                            <th>User Id</th>
                            <th>Password</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.entries.map((entry, i) =>
                            <Entry
                                key={i}
                                account={entry.account}
                                userId={entry.userId}
                                password={entry.password}
                                onChange={(a, u, p) => this.entryChanged(i, a, u, p)}
                                remove={() => this.remove(i)} />
                        )}
                        <tr>
                            <td></td>
                            <td></td>
                            <td>
                                <div style={{ textAlign: "right" }}>
                                    <Button onClick={() => this.addEntry()}>
                                        <Glyphicon glyph="plus" />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Grid >
        );
    }
}

ReactDOM.render(<App />, document.getElementById("app"));