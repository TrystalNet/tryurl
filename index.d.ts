export enum Views { edit = 1, published = 2 }

export function Parse(url: string) : TryUrl

export class TryUrl {
  userId:string 
  filename:string 
  view: Views 
  lineId: string | null 
  isRO: boolean
  url:string
  isValid:boolean

  constructor(
    userId:string, 
    filename:string, 
    view?:Views, 
    lineId?: string, 
    isRO?:boolean);

  static simple(userId: string, filename: string, perm: string):TryUrl
}
