export type AppTabProps = {
    id: string;
    name: string;
    color?: string;
    createNew?: boolean;
}
export type AppState = {
    tabs: AppTabProps[]
}