import Wefetch from './core/Wefetch'
import { defaultsOption } from './defaultOptions'
import { DefaultsOptionType } from './request-option'
import { extendsObj } from './utils'

function createInstance(option: DefaultsOptionType) {
  const context = new Wefetch(option)
  // extendsObj(context, Wefetch.prototype)
  return context
}

const wf = createInstance(defaultsOption)

export default wf
