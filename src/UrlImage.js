import React, { Component } from "react";
import PropTypes from "prop-types";
import { Input, Row, Col, Button } from "antd";
import styles from "./style/urlImage.scss";
import CSSModules from "react-css-modules";

@CSSModules(styles)
export default class UrlImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: ""
    };
    this.onChange = this.onChange.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  static propTypes = {
    onChange: PropTypes.func.isRequired
  };

  onChange(e) {
    this.setState({
      url: e.target.value
    });
  }

  onClick() {
    const { url } = this.state;
    this.props.onChange([url]);
    this.setState({
      url: ""
    });
  }

  render() {
    const { url } = this.state;
    return (
      <Row>
        <Col>
          <span>Enter your image URL</span>
          <Input onChange={this.onChange} placeholder="image url" />
          <Button
            styleName="enter-button"
            type="primary"
            onClick={this.onClick}
          >
            Confirm
          </Button>
          <div
            style={{
              backgroundImage: `url(${url})`,
              width: "100%",
              height: "300px",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat"
            }}
          />
        </Col>
      </Row>
    );
  }
}