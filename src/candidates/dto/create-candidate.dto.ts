import { IsBoolean, IsIn, IsNumber, IsString } from 'class-validator';

export class CreateCandidateDto {
  @IsString()   name: string;
  @IsString()   surname: string;
  @IsIn(['junior','senior']) seniority: 'junior'|'senior';
  @IsNumber()   years: number;
  @IsBoolean()  availability: boolean;
}
