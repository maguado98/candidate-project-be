import { Test, TestingModule } from '@nestjs/testing';
import { CandidatesController } from './candidates.controller';
import { CandidatesService } from './candidates.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';

describe('CandidatesController', () => {
  let controller: CandidatesController;
  let service: CandidatesService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CandidatesController],
      providers: [
        {
          provide: CandidatesService,
          useValue: {
            parseExcel: jest.fn().mockReturnValue([
              { seniority: 'senior', years: 5, availability: false }
            ])
          },
        },
      ],
    }).compile();

    controller = module.get<CandidatesController>(CandidatesController);
    service = module.get<CandidatesService>(CandidatesService);
  });

  it('should merge name/surname and return CreateCandidateDto[]', async () => {
    const mockFile = { buffer: Buffer.from('') } as any;
    const result = await controller.upload(mockFile, 'Alice', 'Smith');
    expect(service.parseExcel).toHaveBeenCalled();
    expect(result).toEqual<CreateCandidateDto[]>([
      { name: 'Alice', surname: 'Smith', seniority: 'senior', years: 5, availability: false }
    ]);
  });
});
