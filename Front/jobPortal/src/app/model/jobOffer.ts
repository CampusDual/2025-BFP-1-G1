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


     static formatDate(releaseDate: Date): string {
        const day = String(releaseDate.getDate()).padStart(2, '0');
        const month = String(releaseDate.getMonth() + 1).padStart(2, '0');
        const year = releaseDate.getFullYear();
        return `${day}-${month}-${year}`;
    }

    static formatTime(releaseDate: Date): string {
        const hours = String(releaseDate.getHours()).padStart(2, '0');
        const minutes = String(releaseDate.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }
}

