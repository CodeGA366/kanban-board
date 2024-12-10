import { JwtPayload, jwtDecode } from 'jwt-decode';

class AuthService {
  constructor() {
    this.setupInactivityTimer();
  }

  setupInactivityTimer() {
    let inactivityTimer: number | undefined;
    const inactivityDuration = 5 * 60 * 1000;//5 minutes inactivity

    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      console.log('Inactivity timer reset');

      inactivityTimer = setTimeout(() => {
        console.log('Inactivity timeout');
        this.logout();
      }, inactivityDuration);//5 minutes inactivity

      const remainingTime = inactivityDuration / 1000; //convert to seconds
      console.log(`Inactivity timeout in ${remainingTime} seconds`);
    };
    window.addEventListener('click', resetInactivityTimer);
    window.addEventListener('keydown', resetInactivityTimer);
    resetInactivityTimer();
  }
  getProfile() {
    //return the decoded token
    return jwtDecode(this.getToken());
  }

  loggedIn() {
    //return a value that indicates if the user is logged in
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }
  
  isTokenExpired(token: string) {
    //return a value that indicates if the token is expired
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (decoded?.exp && decoded?.exp < Date.now() / 1000) {
        return true;
      }
    } catch (err)  {
      return false;
    }
  }

  getToken(): string {
    //return the token
    const loggedUser = localStorage.getItem('id_token') || '';
    return loggedUser;
  }

  login(idToken: string) {
    //set the token to localStorage
    localStorage.setItem('id_token', idToken);
    //redirect to the home page
    window.location.assign('/');
  }

  logout() {
    //remove the token from localStorage
    localStorage.removeItem('id_token');
    //redirect to the login page
    window.location.assign('/');
  }
}

export default new AuthService();
