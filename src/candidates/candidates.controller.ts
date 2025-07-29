import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    Body,
    BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

import { CandidatesService, ParsedRow } from './candidates.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';

@Controller('candidates')
export class CandidatesController {
    constructor(private readonly svc: CandidatesService) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async upload(
        @UploadedFile() file: Express.Multer.File,
        @Body('name') name: string,
        @Body('surname') surname: string
    ): Promise<CreateCandidateDto[]> {
        if (!name || !surname) {
            throw new BadRequestException('Name and surname are required');
        }

        const rows: ParsedRow[] = this.svc.parseExcel(file.buffer);

        const dtos = rows.map(row =>
            plainToInstance(CreateCandidateDto, {
                name,
                surname,
                seniority: row.seniority,
                years: row.years,
                availability: row.availability,
            })
        );

        try {
            await Promise.all(dtos.map(dto => validateOrReject(dto)));
        } catch (errs) {
            throw new BadRequestException(errs);
        }

        return dtos;
    }
}
