import { request } from '@/request'
import {
  SearchShoesPageReq,
  SearchShoesPageResp,
  ShoeByIdReq,
  ShoeByIdResp,
  ChangeShoeFavourReq,
  SearchSelectListResp,
  SearchSelectListReq
} from './proto/api'

export function searchShoesPage(
  req: SearchShoesPageReq
): Promise<SearchShoesPageResp> {
  return request({
    url: '/libong/manager/api/shoe/search/page',
    method: 'GET',
    data: req,
    headers: {}
  })
}

export function shoeById(req: ShoeByIdReq): Promise<ShoeByIdResp> {
  return request({
    url: '/libong/manager/api/shoe/get',
    method: 'GET',
    data: req,
    headers: {}
  })
}

export function changeShoeFavour(
  req: ChangeShoeFavourReq
): Promise<ShoeByIdResp> {
  return request({
    url: '/libong/manager/api/shoe/favour',
    method: 'POST',
    data: req,
    headers: {}
  })
}

export function searchSelectList(
  req: SearchSelectListReq
): Promise<SearchSelectListResp> {
  return request({
    url: '/libong/manager/api/shoe/selectList/search',
    method: 'GET',
    data: req,
    headers: {}
  })
}
