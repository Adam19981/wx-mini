import { request } from '@/request'
import {
  SearchShoesPageReq,
  SearchShoesPageResp,
  ShoeByIdReq,
  ShoeByIdResp,
  ChangeShoeFavourReq
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
