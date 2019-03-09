import 'react-native';
import React, {Component} from 'react';
import Component6 from './src/components/Component6';
import Component4 from './src/components/Component4';
import Followers from './src/components/Followers';
import Following from './src/components/Following';
import Login from './src/components/Login';

import renderer from 'react-test-renderer';

describe('Testing ReassignLocationMenu component', () => {
    it('renders as expected', () => {
        const wrapper = shallow(
            <ReassignLocationMenu count={2} />
        );
        expect(wrapper).toMatchSnapshot();
        wrapper.setProps({ count: 1 });
        expect(wrapper).toMatchSnapshot();
    });
});

jest.mock('Text', () => {
    const RealComponent = jest.requireActual('Text');
    const React = require('React');
    class Text extends React.Component {
        render() {
            return React.createElement('Text', this.props, this.props.children);
        }
    }
    Text.propTypes = RealComponent.propTypes;
    return Text;
});

describe('Testing Profile component', () => {
    it('renders as expected', () => {
        const wrapper = shallow(
            <ReassignLocationMenu count={2} />
        );
        expect(wrapper).toMatchSnapshot();
        wrapper.setProps({ count: 1 });
        expect(wrapper).toMatchSnapshot();
    });
});

describe('Testing Login component', () => {
    it('renders as expected', () => {
        const wrapper = shallow(
            <ReassignLocationMenu count={2} />
        );
        expect(wrapper).toMatchSnapshot();
        wrapper.setProps({ count: 1 });
        expect(wrapper).toMatchSnapshot();
    });
});
describe('Testing Repo component', () => {
    it('renders as expected', () => {
        const wrapper = shallow(
            <ReassignLocationMenu count={2} />
        );
        expect(wrapper).toMatchSnapshot();
        wrapper.setProps({ count: 2 });
        expect(wrapper).toMatchSnapshot();
    });
});

describe('Testing Following component', () => {
    it('renders as expected', () => {
        const wrapper = shallow(
            <ReassignLocationMenu count={2} />
        );
        expect(wrapper).toMatchSnapshot();
        wrapper.setProps({ count: 2 });
        expect(wrapper).toMatchSnapshot();
    });
});

describe('Testing Followers component', () => {
    it('renders as expected', () => {
        const wrapper = shallow(
            <ReassignLocationMenu count={2} />
        );
        expect(wrapper).toMatchSnapshot();
        wrapper.setProps({ count: 1 });
        expect(wrapper).toMatchSnapshot();
    });
});