import { adaptor } from './core/adaptor'
import { DefaultsOptionType } from './request-option'

export const defaultsOption: DefaultsOptionType = {
  method: 'GET',
  header: {},
  timeout: 0,
  adaptor: adaptor()
}
