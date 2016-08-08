export enum Views { edit = 1, published = 2 }
export type RORW = 'rw' | 'ro'

export function Parse(url: string) {
  interface Wip {
    url: string
    lineId: string | null
    view: number
    isRO: boolean
  }
  const wip: Wip = {
    url,
    lineId: null,
    view: Views.published,
    isRO: true
  }
  let checkForLineId = (wip: Wip) => {
    const {url} = wip
    const rgx = /#([a-z0-9]+)$/i
    const matches = rgx.exec(url)
    wip.lineId = matches ? matches[1] : null
    if (matches) wip.url = url.replace(rgx, '')
  }

  const checkForRender = (wip: Wip) => {

    function strToView(s: string): Views {
      switch (s.toLowerCase()) {
        case 'edit': return Views.edit
      }
      return Views.published
    }

    const {url} = wip
    const rgx = /\/(published|edit)$/i
    const matches = rgx.exec(url)

    if (matches) {
      wip.view = strToView(matches[1])
      wip.isRO = false
      wip.url = url.replace(rgx, '')
    }
    else {
      wip.view = Views.published
      wip.isRO = true
    }
  }
  checkForLineId(wip)
  checkForRender(wip)

  const re = /^trystal:\/\/([^\/]{2,20})\/([^\/]{3,50})$/i
  const matches = re.exec(wip.url)
  if (!matches) return null
  const userId = matches[1]
  const trystId = matches[2]
  const {view, lineId, isRO} = wip
  return new TryUrl(userId, trystId, view, lineId, isRO)
}

export class TryUrl {
  constructor(
    public userId:string, 
    public filename:string, 
    public view = Views.published, 
    public lineId = <string | null>null, 
    public isRO = true) {  
  }

  get url():string {
    const bits = [this.userId, this.filename]
    if (this.view) bits.push(Views[this.view])
    if (this.lineId) bits.push(`#${this.lineId}`)
    return `trystal://${bits.join('/')}`
  }

  get isValid() {
    if(!this.userId) return false
    if(!this.filename) return false 
    return true
  }

  static simple(userId: string, filename: string, perm: RORW) {
    if (!filename) return null
    return new TryUrl(userId, filename, Views.edit, null, perm !== 'rw')
  }
}

export default TryUrl
