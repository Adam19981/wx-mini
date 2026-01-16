export interface LoginInReq {
  login_in_type: number
  account: string
  phone: string
  password: string
  verify_code: string
  email: string
  code: string
}

export interface LoginInResp {
  account_id: string
  access_token: string
  refresh_token: string
}

export interface Meta {
  id: string
  name: string
}

export interface UserRolesResp {
  roles: Meta[]
}

export interface UserInfoResp {
  roles: Meta[]
  account: string
  sex: number
  avatar: string
  departments: Meta[]
  has_password: boolean
  encrypt_phone: string
}
