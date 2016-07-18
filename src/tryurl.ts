export enum Views { edit = 1, published = 2 }

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
  const uid = matches[1]
  const filename = matches[2]
  const {view, lineId, isRO} = wip
  return new TryUrl(uid, filename, view, lineId, isRO)
}

export class TryUrl {
  constructor(
    public uid:string, 
    public filename:string, 
    public view = Views.published, 
    public lineId = <string | null>null, 
    public isRO = true) {  
  }

  get url():string {
    const bits = [this.uid, this.filename]
    if (this.view) bits.push(Views[this.view])
    if (this.lineId) bits.push(`#${this.lineId}`)
    return `trystal://${bits.join('/')}`
  }

  get isValid() {
    if(!this.uid) return false
    if(!this.filename) return false 
    return true
  }

  static simple(owner: string, filename: string, perm: string) {
    if (!filename) return null
    return new TryUrl(owner, filename, Views.edit, null, perm !== 'rw')
  }
}

export default TryUrl
