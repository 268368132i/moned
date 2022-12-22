/**
 * Connection type for SavedConnections Components
 */
export type Connection = {
  name: string,
  uri: string,
  color: string,
  connected?: boolean,
  edit?: boolean
}