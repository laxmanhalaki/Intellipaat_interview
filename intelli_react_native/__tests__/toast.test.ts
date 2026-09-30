import Toast from 'react-native-toast-message';
import { showToast } from '../src/utils/toast';

describe('Toast Utility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('triggers error toast with title and message', () => {
    showToast.error('Invalid Email Format', 'Please enter a valid email address');
    expect(Toast.show).toHaveBeenCalledWith({
      type: 'error',
      text1: 'Invalid Email Format',
      text2: 'Please enter a valid email address',
      position: 'top',
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 50,
    });
  });

  it('triggers success toast with title and message', () => {
    showToast.success('Login Successful', 'Welcome back!');
    expect(Toast.show).toHaveBeenCalledWith({
      type: 'success',
      text1: 'Login Successful',
      text2: 'Welcome back!',
      position: 'top',
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 50,
    });
  });

  it('triggers info toast with title and message', () => {
    showToast.info('Offline Mode', 'Showing cached data');
    expect(Toast.show).toHaveBeenCalledWith({
      type: 'info',
      text1: 'Offline Mode',
      text2: 'Showing cached data',
      position: 'top',
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 50,
    });
  });
});
