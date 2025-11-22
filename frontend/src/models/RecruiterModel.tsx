import {Worker} from "./WorkerModel";

export interface ListOfRecruiterInvitations {
    id: number;
    status: string;
    date: Date;
    worker: Worker;
    recruiter: Recruiter
}
export interface Recruiter {
    id: number;
    company_name: string;
    user: User
}
export interface User {
    id: number;
}

export interface DataGridInvitationsProps {
    id: number;
    first_name?: string;
    last_name?: string;
    company_name: string;
    status: string;
    date: Date|string;
}
