import {
    IsString, 
    IsNotEmpty, 
} from 'class-validator';

export class LoginDTO {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    constructor(data: any) {
        this.username = data.username;
        this.password = data.password;
    }
}