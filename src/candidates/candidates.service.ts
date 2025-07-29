import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { CreateCandidateDto } from './dto/create-candidate.dto';

@Injectable()
export class CandidatesService {
    async parseExcel(buffer: Buffer): Promise<CreateCandidateDto[]> {
        const wb = XLSX.read(buffer, { type: 'buffer' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const raw: any[] = XLSX.utils.sheet_to_json(ws, { defval: null });

        const dtos: CreateCandidateDto[] = [];
        for (const row of raw) {
            const dto = plainToInstance(CreateCandidateDto, {
                name: row['Name'],
                surname: row['Surname'],
                seniority: row['Seniority'],
                years: Number(row['Years']),
                availability: Boolean(row['Availability']),
            });
            await validateOrReject(dto);
            dtos.push(dto);
        }
        return dtos;
    }
}
