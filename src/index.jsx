import React from 'react';
import ReactDOM from 'react-dom';
require('es6-promise').polyfill();
import fetch from 'isomorphic-fetch';


class ContactFormWrapper extends React.Component {
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
      message: message.value
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

  onSubmit(e) {
    e.preventDefault();
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
        body: JSON.stringify(fields)
      }
    ).then(response => {
        if (response.status >= 400) {
            throw new Error("Bad response from server");
        }
        return response.json();
    }).then(response => {
        console.log(response);
    }).catch(error => {
      if (this.props.onSubmitFailed) {
        this.prosp.onSubmitFailed(error);
      }
    });

    console.log(fields);
    console.log(valid);
  }

  render() {
    const children = React.Children.map(this.props.children,
     (child) => React.cloneElement(child, {
       onSubmit: this.onSubmit.bind(this)
     })
    );

    return (
      <div>
        {children}
      </div>
    );
  }
}

ContactFormWrapper.propTypes = {
  apiUrl: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  email: React.PropTypes.string.isRequired,
  message: React.PropTypes.string.isRequired,
  onValidationFailed: React.PropTypes.func,
  onSubmitFailed: React.PropTypes.func,
  onSubmitSuccess: React.PropTypes.func
}

class ContactForm extends React.Component {
  render() {
    return (
      <form onSubmit={this.props.onSubmit}>
        <input id="name" type="text" /> <br />
        <input id="email" type="email" /> <br />
        <textarea id="message" /> <br />
        <button type="submit">Submit</button>
      </form>
    );
  }
}

ReactDOM.render(
  <ContactFormWrapper apiUrl="//someurl.com/leads"
                      name="name" email="email" message="message">
    <ContactForm />
  </ContactFormWrapper>,
  document.getElementById('app')
)
