/* eslint-env jest */
require('react-native-safe-area-context/jest/mock');

jest.mock('@react-native-community/netinfo', () =>
  require('@react-native-community/netinfo/jest/netinfo-mock')
);

jest.mock('@op-engineering/op-sqlite', () => ({
  open: jest.fn(() => ({
    execute: jest.fn().mockResolvedValue({ rows: [] }),
    executeSync: jest.fn().mockReturnValue({ rows: [] }),
    transaction: jest.fn(async (cb) => {
      await cb({
        execute: jest.fn().mockResolvedValue({ rows: [] }),
        commit: jest.fn(),
        rollback: jest.fn(),
      });
    }),
  })),
}));

jest.mock('react-native-screens', () => ({
  enableScreens: jest.fn(),
}));

jest.mock('react-native-toast-message', () => {
  const React = require('react');
  const View = require('react-native').View;
  const MockToast = (props) => React.createElement(View, props);
  MockToast.show = jest.fn();
  MockToast.hide = jest.fn();
  return MockToast;
});
