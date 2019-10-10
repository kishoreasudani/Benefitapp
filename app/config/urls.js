import { Config } from './appConfig';

const WEB_BASE_URL = Config.Production ? Config.WebURlProduction : Config.WebURlLocal;
const ImageURLProduction = Config.ImageURLProduction;
const API_BASE_URL = Config.Production ? Config.APIsURLProduction : Config.APIsURLLocal;
const API_URL = {
  /**
   * Set all the URLs here in the below provided format
   * key: { url: '', endPoint: '' },
   */
  // Users URLs

  login: { url: 'login', endPoint: 'auth' },
  register: { url: 'register', endPoint: 'auth' },
  sendOtp: { url: 'sendotp', endPoint: 'user' },
  verifyOtp: { url: 'verifyotp', endPoint: 'user' },
  changePassword: { url: 'changepassword', endPoint: 'user' },
  resetPassword: { url: 'resetpassword', endPoint: 'user' },
  updateProfile: { url: 'updateprofile', endPoint: 'user' },
  updateImage: { url: 'updateimage', endPoint: 'user' },
  getFaqList: { url: 'list', endPoint: 'faqs' },
  getCoinsList: { url: 'list', endPoint: 'coins' },
  getUserOrderList: { url: 'list', endPoint: 'userorder' },
  UserOrderBuy: { url: 'buy', endPoint: 'userorder' },
  voucherID: { url: ':id', endPoint: 'voucher' },
  getVoucherList: { url: 'list', endPoint: 'voucher' },
  getPrivacyPolicy: { url: 'PrivacyPolicy', endPoint: 'content' },
  getAboutUs: { url: 'AboutUs', endPoint: 'content' },
  getTermsConditions: { url: 'TermsConditions', endPoint: 'content' },
  getNotification: { url: ':id', endPoint: 'notification' },
  notification: { url: '', endPoint: 'notification' },
  earnCoin: { url: 'earnCoin', endPoint: 'coins' },
  getSetting: { url: 'getSetting', endPoint: 'user' },
  getUserProfile: { url: 'getUserProfile', endPoint: 'user' },
  countNotification: { url: 'countNotification', endPoint: 'notification' },
  getTodayList: { url: 'getTodayList', endPoint: 'coins' },
  updateNotificationStatus: { url: 'updateNotificationStatus', endPoint: 'user' }
};
export { ImageURLProduction, WEB_BASE_URL, API_BASE_URL, API_URL }