import LoginScreen from '../components/screens/LoginScreen.vue'
import RegisterScreen from '../components/screens/RegisterScreen.vue'

import { BRAND_DATA } from '../config/brand.js';

export const userRoutesGenerator = function(store){
  return [
      {
          path: '/app/login',
          component: LoginScreen,
          props(route){
              return {
                  ...BRAND_DATA
              }
          },
          beforeEnter(to, from, next){
              console.info('beforeEnter /login')
              next()
          }
      },
      {
          path: '/app/register',
          component: RegisterScreen,
          props(route){
              return {
                  ...BRAND_DATA
              }
          },
          beforeEnter(to, from, next){
              console.info('beforeEnter /register')
              next()
          }
      }
      // ,
      // {
      //     path: '/app/logout',
      //     component: LoginScreen,
      //     props(route){
      //         return {
      //             ...BRAND_DATA
      //         }
      //     },
      //     beforeEnter(to, from, next){
      //         console.info('beforeEnter /logout')
      //         next()
      //     }
      // },
      // {
      //     path: '/app/preferences/user_infos',
      //     component: LoginScreen,
      //     props(route){
      //         return {
      //             ...BRAND_DATA
      //         }
      //     },
      //     beforeEnter(to, from, next){
      //         console.info('beforeEnter /preferences/user_infos')
      //         next()
      //     }
      // },
      // {
      //     path: '/app/preferences/user_password',
      //     component: LoginScreen,
      //     props(route){
      //         return {
      //             ...BRAND_DATA
      //         }
      //     },
      //     beforeEnter(to, from, next){
      //         console.info('beforeEnter /preferences/user_password')
      //         next()
      //     }
      // }
  ]
}