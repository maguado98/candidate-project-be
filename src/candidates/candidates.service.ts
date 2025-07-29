import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';

export interface ParsedRow {
    seniority: 'junior' | 'senior';
    years: number;
    availability: boolean;
}

@Injectable()
export class CandidatesService {
    parseExcel(buffer: Buffer): ParsedRow[] {
        const wb = XLSX.read(buffer, { type: 'buffer' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const raw = XLSX.utils.sheet_to_json<any>(ws, { defval: null });
        return raw.map(row => ({
            seniority: row['Seniority'],
            years: Number(row['Years']),
            availability: Boolean(row['Availability']),
        }));
    }
}
