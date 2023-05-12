// import React from 'react';
// import { render } from '@testing-library/react';
// import { Provider } from 'react-redux';
// import { store } from './redux/store';
// import App from './App';

// test('renders learn react link', () => {
//   const { getByText } = render(
//     <Provider store={store}>
//       <App />
//     </Provider>
//   );

//   expect(getByText(/learn/i)).toBeInTheDocument();
// });

function add(a, b) {
  if (typeof a === 'string') {
    window.alert('a is string');
  }
  return a + b;
}

describe('add module', () => {
  test('adds 1 + 2 to equal 3', () => {
    expect(add(1, 2)).toBe(3);
  });
  test('adds 4 + -2 to equal 2', () => {
    expect(add(4, -2)).toBe(2);
  });
  it('should alert if a is a string', () => {
    // 模擬 window.alert
    window.alert = jest.fn();

    // 呼叫函式
    add('a');

    // 確認 window.alert 已被呼叫
    expect(window.alert).toHaveBeenCalledTimes(1);
    expect(window.alert).toHaveBeenCalledWith('a is string');
  });
});
