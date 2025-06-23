import { Timestamp } from "rxjs";
import { User } from "./user";
import { formatDate } from "@angular/common";

export class JobOffer{
    id? : number;
    email!: string;
    user!: User;
    title!: string;
    description!: string;
    releaseDate!: Date;
}

