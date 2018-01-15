import * as React from 'react';
import { Row, Col, Glyphicon, FormControl, InputGroup, Button } from 'react-bootstrap';
import { clipboard } from 'electron'

export default class Entry extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            show: false
        };
    }

    onChange(accountEvent, userIdEvent, passwordEvent) {
        this.props.onChange(
            accountEvent ? accountEvent.target.value : this.props.account,
            userIdEvent ? userIdEvent.target.value : this.props.userId,
            passwordEvent ? passwordEvent.target.value : this.props.password
        );
    }

    copyToClipboard() {
        clipboard.writeText(this.props.password);
        setTimeout(clipboard.clear, 5000);
    }

    render() {
        return (
            <tr>
                <td>
                    <InputGroup>
                        <InputGroup.Button>
                            <Button onClick={() => this.props.remove()}><Glyphicon glyph="remove" /></Button>
                        </InputGroup.Button>
                        <FormControl type="text" value={this.props.account}
                            onChange={e => this.onChange(e)} />
                    </InputGroup>
                </td>
                <td>
                    <FormControl type="text" value={this.props.userId}
                        onChange={e => this.onChange(null, e)} />
                </td>
                <td>
                    <InputGroup>
                        <FormControl
                            type={this.state.show ? "text" : "password"}
                            value={this.props.password}
                            onChange={e => this.onChange(null, null, e)} />
                        <InputGroup.Button>
                            <Button
                                style={{ width: 61 }}
                                onClick={() => this.setState({ show: !this.state.show })}>
                                {this.state.show ? "Hide" : "Show"}
                            </Button>
                        </InputGroup.Button>
                        <InputGroup.Button>
                            <Button onClick={() => this.copyToClipboard()}>
                                <Glyphicon glyph="copy" />
                            </Button>
                        </InputGroup.Button>
                    </InputGroup>
                </td>
            </tr>
        );
    }

};