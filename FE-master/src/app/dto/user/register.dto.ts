import {
    IsString, 
    IsNotEmpty, 
    IsEmail,
    IsDate,
    IsOptional,
    IsUrl
} from 'class-validator';

export class RegisterDTO {
    @IsString()
    @IsNotEmpty()
    userName: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @IsString()
    @IsNotEmpty()
    address: string;

    @IsString()
    @IsNotEmpty()
    fullName: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    dateOfBirth: string;

    @IsUrl()
    @IsOptional()
    avatar?: string;

    constructor(data: any) {
        this.userName = data.userName;
        this.email = data.email;
        this.address = data.address;
        this.fullName = data.fullName;
        this.password = data.password;
        this.dateOfBirth = data.dateOfBirth;
        this.avatar = data.avatar;
    }
}