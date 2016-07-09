/* eslint-disable max-len, indent */

import path from 'path'

export default function getExpected() {
  const targetDir = path.resolve(__dirname, path.join('..', 'fixtures'))
  return (
`import React, { PropTypes } from 'react';

// original css file: ${targetDir}/foo.css
const css = {
  btn: '_caps_pw0m0_17 _m1_pw0m0_89 _border_pw0m0_74'
};


export default function Button(props) {
  const { color = 'red', size = 12, children, onClick } = props;
  let styles = {
    color,
    fontSize: size
  };

  return <button className={css.btn} onClick={(...args) => onClick(...args)} style={styles}>{children}</button>;
}

Button.propTypes = {
  children: PropTypes.string.isRequired,
  color: PropTypes.string,
  size: PropTypes.oneOf([10, 11, 12, 13, 14]),
  onClick: PropTypes.func.isRequired
};

Button.defaultProps = {
  children: 'button',
  color: 'black',
  size: 12,
  onClick: () => {}
};`) }
