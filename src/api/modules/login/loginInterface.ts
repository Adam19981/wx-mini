import { request } from '@/request'
import {
  LoginInReq,
  LoginInResp,
  UserRolesResp,
  UserInfoResp
} from './proto/api'

export function loginIn(req: LoginInReq): Promise<LoginInResp> {
  return request({
    url: '/libong/manager/api/login/in',
    method: 'POST',
    data: req,
    headers: {}
  })
}

export function userRoles(): Promise<UserRolesResp> {
  return request({
    url: '/libong/manager/api/login/user/roles',
    method: 'GET',
    headers: {}
  })
}

export function userInfo(): Promise<UserInfoResp> {
  return request({
    url: '/libong/manager/api/login/user/info',
    method: 'GET',
    headers: {}
  })
}
