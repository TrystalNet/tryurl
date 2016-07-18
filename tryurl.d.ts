declare module "@trystal/tryurl" {

  export enum Views { edit = 1, published = 2 }

  export function Parse(url: string) : TryUrl

  export class TryUrl {
    uid:string 
    filename:string 
    view: Views 
    lineId: string | null 
    isRO: boolean
    url:string
    isValid:boolean

    constructor(
      uid:string, 
      filename:string, 
      view?:Views, 
      lineId?: string, 
      isRO?:boolean);

    static simple(owner: string, filename: string, perm: string):TryUrl
  }
}
