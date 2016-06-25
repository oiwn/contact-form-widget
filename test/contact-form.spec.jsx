import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import ContactFormWrapper from '../src/ContactFormWrapper';

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

class TestElement extends React.Component {
  render() {
    return (
      <ContactFormWrapper apiUrl={this.props.apiUrl}
                          name={this.props.name}
                          email={this.props.email}
                          message={this.props.message}>
        <ContactForm />
      </ContactFormWrapper>
    );
  }
}

describe("Test contact form wrapper", function() {
  it("props is required", function() {
    const testComponent = (
      <TestElement apiUrl="//dummy.com" name="name"
                   email="email" message="message" />
    );
    expect(shallow(testComponent).prop('apiUrl')).to.be.equal('//dummy.com');
    expect(shallow(testComponent).prop('name')).to.be.equal('name');
    expect(shallow(testComponent).prop('email')).to.be.equal('email');
    expect(shallow(testComponent).prop('message')).to.be.equal('message');
      /* .contains(<div className="foo" />)).to.equal(true);*/
  });

  it("child component", function() {
    const testComponent = (
      <ContactFormWrapper apiUrl="//dummy.com" name="name"
                          email="email" message="message">
        <ContactForm />
      </ContactFormWrapper>
    );
    let child = shallow(testComponent)
      .find(ContactForm).render();
    expect(child.find('#name')).to.have.length(1);
  });

  it("submit form", function() {
    const testComponent = (
      <ContactFormWrapper apiUrl="//dummy.com" name="name"
                          email="email" message="message">
        <ContactForm />
      </ContactFormWrapper>
    );

    let component = mount(testComponent).find(ContactForm).simulate('submit');
    console.log(component);

    /* expect(mount(<TestElement />).find('.foo').length).to.equal(1);*/
  });
});
