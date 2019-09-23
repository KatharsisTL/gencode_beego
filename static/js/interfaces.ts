export interface IEntity {
    id: number
}

export interface IProject extends IEntity{
    name: string
    short_title: string
    title: string
    gen_path: string
}