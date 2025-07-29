import { Test, TestingModule } from '@nestjs/testing';
import { CandidatesService, ParsedRow } from './candidates.service';
import * as XLSX from 'xlsx';

describe('CandidatesService', () => {
  let service: CandidatesService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CandidatesService],
    }).compile();

    service = module.get<CandidatesService>(CandidatesService);
  });

  it('should parse a simple Excel buffer into ParsedRow[]', () => {
    const data = [{ Seniority: 'junior', Years: 3, Availability: true }];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    const result: ParsedRow[] = service.parseExcel(buf);
    expect(result).toEqual([
      { seniority: 'junior', years: 3, availability: true },
    ]);
  });
});
