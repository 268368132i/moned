import React from 'react'
import { getReducer } from '../lib/reducer'

const PathContext = React.createContext([])

export default PathContext

export const reducer = getReducer()

export const PathProvider = PathContext.Provider