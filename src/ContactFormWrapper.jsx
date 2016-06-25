import React from 'react';
import ReactDOM from 'react-dom';
require('es6-promise').polyfill();
import fetch from 'isomorphic-fetch';
import Recaptcha from 'react-gcaptcha';


class ContactFormWrapper extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.setState({
      verified: this.props.verified,
      success: false
    });
  }

  validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  getFields() {
    const name = document.getElementById(this.props.name);
    const email = document.getElementById(this.props.email);
    const message = document.getElementById(this.props.message);
    return {
      name: name.value,
      email: email.value,
      message: message.value,
      source: this.props.source
    };
  }

  validate(fields) {
    let messages = [];

    if (fields.name.length >= 60 && fields.name.length < 3) {
      messages.push("Wrong length for name");
    }
    if (fields.message.length <= 10) {
      messages.push("Message length is too short");
    }
    if (!this.validateEmail(fields.email)) {
      messages.push("Email is invalid");
    }
    return messages;
  }

  transform(fields) {
    return {
      name: fields.name,
      email: fields.email,
      content: fields.message,
      source_url: fields.source
    };
  }

  verifyResponse(response) {
    return true;
  }

  captchaLoaded() {
    console.log("Captcha loaded");
  }

  captchaVerified(key) {
    console.log("Captcha verified", key);
    this.setState({ verified: true });
  }

  onSubmit(e) {
    e.preventDefault();
    // check if captch is verified
    if (!this.state.verified) {
      return;
    }

    const fields = this.getFields.bind(this)();

    // check if data is valid
    const valid = this.validate.bind(this)(fields);
    if (valid.length > 0) {
      if (this.props.onValidationFailed) {
        this.props.onValidationFailed(valid);
        return;
      }
    }

    // submit form
    fetch(
      this.props.apiUrl,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(this.transform(fields))
      }
    ).then(response => {
        if (response.status >= 400) {
            throw new Error("Bad response from server");
        }
        return response.json();
    }).then(response => {
      console.log(response);
      this.setState({ success: true });
      if (this.props.onSubmitSuccess) {
        this.props.onSubmitSuccess(response);
      }
    }).catch(error => {
      if (this.props.onSubmitFailed) {
        this.props.onSubmitFailed(error);
      }
    });

    console.log(fields);
    console.log(valid);
  }

  render() {
    if (this.state.success) {
      return this.props.successComponent;
    }

    const children = React.Children.map(
      this.props.children,
      (child) => {
        return React.cloneElement(child, {
          onSubmit: this.onSubmit.bind(this)
        });
     }
    );

    return (
      <div>
        {children}
        <Recaptcha
            sitekey={this.recaptchaSiteKey.bind(this)}
            onloadCallback={this.captchaLoaded.bind(this)}
            verifyCallback={this.captchaVerified.bind(this)}
        />
      </div>
    );
  }
}

ContactFormWrapper.propTypes = {
  apiUrl: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  email: React.PropTypes.string.isRequired,
  message: React.PropTypes.string.isRequired,
  source: React.PropTypes.string,
  verified: React.PropTypes.bool,
  successComponent: React.PropTypes.element,
  onValidationFailed: React.PropTypes.func,
  onSubmitFailed: React.PropTypes.func,
  onSubmitSuccess: React.PropTypes.func,
  recaptchaSiteKey: React.PropTypes.string
};

ContactFormWrapper.defaultProps = {
  source: 'testclient.com',
  verified: false,
  successComponent: (<div>Done!</div>),
  recaptchaSiteKey: '6Lc4hSMTAAAAAIa7RAx3Zk2aVYdz12C_XIzKBR9A'
};

export default ContactFormWrapper;
