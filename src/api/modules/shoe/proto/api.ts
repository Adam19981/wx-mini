export interface SearchShoesPageReq {
  shape_code: string
  material: string
  shoe_size: string
  is_hot: number
  is_presale: number
  by_favour: boolean
  page_num: number
  page_size: number
  has_file: boolean
}

export interface FileResp {
  id: string
  name: string
  url: string
}

export interface Shoe {
  shoe_id: string
  shape_code: string
  material: string
  shoe_size: string
  is_hot: number
  is_presale: number
  is_favour: boolean
  pictures: FileResp[]
  videos: FileResp[]
}

export interface SearchShoesPageResp {
  list: Shoe[]
  total: number
}

export interface ShoeByIdReq {
  shoe_id: string
}

export interface ShoeByIdResp {
  shoe_id: string
  shape_code: string
  material: string
  shoe_size: string
  pictures: FileResp[]
  videos: FileResp[]
  is_hot: number
  is_presale: number
  is_favour: boolean
}

export interface ChangeShoeFavourReq {
  shoe_ids: string[]
  is_favour: boolean
}

export interface SearchSelectListReq {
  select_type: number
}

export interface SelectList {
  items: string[]
}

export interface SearchSelectListResp {
  map: Record<string, SelectList>
}
