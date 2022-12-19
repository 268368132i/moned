/**
 * Connection type for SavedConnections Components
 */
export type Connection = {
  name: string,
  uri: string,
  color: string,
  edit?: {
    newName: string,
    newUri:  string,
    newColor:  string
  }
}