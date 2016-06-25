import React from 'react';
import ReactDOM from 'react-dom';
import ContactFormWrapper from './ContactFormWrapper.jsx';

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
  <ContactFormWrapper apiUrl="http://labapi-imscrapingninja.rhcloud.com/leads"
                      name="name" email="email" message="message">
    <ContactForm />
  </ContactFormWrapper>,
  document.getElementById('app')
)
