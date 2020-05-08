// // common locale data
// import intl from 'react-intl-universal';
// import { setLocale } from 'umi-plugin-react/locale';

// require('intl/locale-data/jsonp/en.js');
// require('intl/locale-data/jsonp/zh.js');

// export const LOCALES = [
//   {
//     name: 'English',
//     value: 'en-US',
//   },
//   {
//     name: '简体中文',
//     value: 'zh-CN',
//   },
// ];
// const locales = {
//   'en-US': require('../int18/en.js'),
//   'zh-CN': require('../int18/zh.js'),
// };

// export const setLanguage = async () => {
//   let currentLocale = undefined;

//   //   intl.determineLocale({
//   //   urlLocaleKey: 'lang',
//   //   cookieLocaleKey: 'lang',
//   // });

//   return await intl.init({
//     currentLocale: currentLocale || 'zh-CN', // TODO: determine locale here
//     locales,
//   });
// };
