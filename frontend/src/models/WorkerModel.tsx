export interface DataGridWorkerProps {
    id: number;
    firstName: string;
    lastName: string;
    city?: string;
    age: number|string;
    gender: string;
    experience?: number | string;
    description?: string;
    education?: string;
    prefered_salary?: number | string;
    prefered_style_of_work?: string;
    specialization?: string;
    favorite_id?: number;
}

export interface Worker {
    id: number,
    gender: string,
    age: number,
    description: string,
    experience: number,
    education: string,
    prefered_salary: number,
    prefered_style_of_work: string,
    account_visibility: boolean,
    field_visibility: string,
    user: User,
    city?: City,
    specialization?: Specialization
    programming_languages?: ProgrammingLanguage[]
}

export interface FavouriteWorker {
    id: number,
    worker: Worker,
    recruiter: number
}

export interface User {
    first_name: string,
    last_name: string,
    email: string
}

export interface City {
    id: number;
    name: string;
}

export interface Specialization {
    id: number;
    name: string;
}

export interface ProgrammingLanguage {
    advanced: string;
    programming_languages: string;
}
